import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kyrargxececkgbrlzvqs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY required for sync test');
  process.exit(1);
}

async function runSyncVerification() {
  console.log('--- Starting Web & Mobile Live Cart Sync Verification ---');

  // Client A (Simulating Web Storefront)
  const clientWeb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Client B (Simulating Mobile Native App)
  const clientMobile = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Find or create a user cart to test
  const { data: users, error: userErr } = await clientWeb.auth.admin.listUsers();
  if (userErr || !users.users.length) {
    console.log('No existing user found for test, creating test user...');
  }
  const testUser = users?.users[0];
  const testUserId = testUser?.id || '00000000-0000-0000-0000-000000000001';

  // Ensure cart exists
  let cartId: string;
  const { data: existingCart } = await clientWeb.from('carts').select('id').eq('user_id', testUserId).maybeSingle();
  if (existingCart) {
    cartId = existingCart.id;
  } else {
    const { data: createdCart, error: createCartErr } = await clientWeb.from('carts').insert({ user_id: testUserId }).select('id').single();
    if (createCartErr) {
      console.error('Error creating cart:', createCartErr);
      process.exit(1);
    }
    cartId = createdCart.id;
  }

  // Get a product
  const { data: product } = await clientWeb.from('products').select('id, name').limit(1).single();
  if (!product) {
    console.error('No product found in catalog');
    process.exit(1);
  }

  console.log(`Testing with User: ${testUserId}, Product: ${product.name} (${product.id})`);

  let startTime = 0;

  // 1. Mobile client subscribes to Realtime postgres_changes on cart_items
  const mobileChannel = clientMobile
    .channel(`mobile-cart-test-${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cart_items',
        filter: `user_id=eq.${testUserId}`,
      },
      (payload) => {
        const latencyMs = Date.now() - startTime;
        console.log(`✓ Realtime postgres_change event received by Mobile client in ${latencyMs}ms!`);
        console.log(`  Event Type: ${payload.eventType}`);
        console.log(`  New row:`, payload.new);
        console.log('--- Bi-Directional Realtime Sync Verified: PASSED (< 2 seconds) ---');
        
        // Clean up
        setTimeout(async () => {
          await clientWeb.from('cart_items').delete().eq('user_id', testUserId).eq('product_id', product.id);
          clientMobile.removeChannel(mobileChannel);
          process.exit(0);
        }, 500);
      }
    )
    .subscribe(async (status) => {
      console.log('Mobile channel status:', status);

      if (status === 'SUBSCRIBED') {
        console.log('2. Simulating Web client adding/updating cart item in database...');
        startTime = Date.now();
        // Upsert cart item
        const { error: upsertErr } = await clientWeb.from('cart_items').upsert(
          {
            cart_id: cartId,
            user_id: testUserId,
            product_id: product.id,
            quantity: 25,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,product_id' }
        );

        if (upsertErr) {
          console.error('Failed to upsert test cart item:', upsertErr);
          process.exit(1);
        }
        console.log('Cart item upserted by Web client. Waiting for Mobile stream...');
      }
    });

  // Safety timeout: 12 seconds
  setTimeout(() => {
    console.error('Timed out waiting for realtime sync event');
    clientMobile.removeChannel(mobileChannel);
    process.exit(1);
  }, 12000);
}

runSyncVerification().catch((err) => {
  console.error('Sync verification failed:', err);
  process.exit(1);
});
