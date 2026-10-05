import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  Trash2,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  ShieldAlert,
  ShoppingBag,
  Radio,
  LogIn,
} from 'lucide-react-native';
import { colors, formatNaira, formatNairaWithUnit, HAULAGE_FEE_KOBO, radius, spacing } from '../../lib/theme';
import { useCart } from '../../lib/cart/CartContext';
import { useAuth } from '../../lib/auth/AuthContext';

export default function CartScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { user, signInWithGoogle } = useAuth();
  const {
    items,
    subtotalKobo,
    isLoading,
    isRealtimeConnected,
    updateQuantity,
    removeItem,
    clear,
  } = useCart();

  const totalOrderKobo = subtotalKobo > 0 ? subtotalKobo + HAULAGE_FEE_KOBO : 0;

  const handleCheckoutPress = async () => {
    if (!user) {
      const { success } = await signInWithGoogle();
      if (success) {
        router.push('/checkout');
      }
    } else {
      router.push('/checkout');
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} size="large" />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Syncing cart with server...
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.emptyIconCircle,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <ShoppingBag color={theme.textTertiary} size={40} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Your cart is empty</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
          Explore authentic cement, rebar, roofing, and blocks with guaranteed direct depot pricing.
        </Text>
        <TouchableOpacity
          style={[styles.startShoppingBtn, { backgroundColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/marketplace')}
        >
          <Text style={styles.startShoppingText}>START SHOPPING</Text>
          <ArrowRight color="#FFFFFF" size={16} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* 1. SYNC STATUS INDICATOR BAR */}
      <View
        style={[
          styles.syncStatusBar,
          {
            backgroundColor: isRealtimeConnected ? '#064E3B' : theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.syncStatusLeft}>
          <View
            style={[
              styles.statusPulse,
              { backgroundColor: isRealtimeConnected ? '#10B981' : '#F59E0B' },
            ]}
          />
          <Text
            style={[
              styles.syncStatusText,
              { color: isRealtimeConnected ? '#A7F3D0' : theme.textSecondary },
            ]}
          >
            {isRealtimeConnected
              ? 'LIVE CLOUD SYNC ACTIVE (Instant Web & Phone Mirror)'
              : 'CONNECTING REALTIME CHANNEL...'}
          </Text>
        </View>
        <TouchableOpacity onPress={clear}>
          <Text style={[styles.clearBtnText, { color: theme.danger }]}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CART ITEM ROWS */}
        {items.map((item) => (
          <View
            key={item.id || item.product_id}
            style={[
              styles.cartItemCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            {/* 1:1 Image Thumbnail */}
            <View style={styles.itemImageContainer}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.itemImage}
                contentFit="contain"
              />
            </View>

            {/* Content */}
            <View style={styles.itemDetails}>
              <Text
                style={[styles.itemName, { color: theme.textPrimary }]}
                numberOfLines={2}
              >
                {item.name.toUpperCase()}
              </Text>

              <Text style={[styles.itemUnitPrice, { color: theme.textSecondary }]}>
                {formatNairaWithUnit(item.price_kobo, item.unit)}
              </Text>

              <Text style={[styles.itemLineTotal, { color: theme.accent }]}>
                Total: {formatNaira(item.line_total_kobo || item.price_kobo * item.quantity)}
              </Text>

              {/* Quantity Stepper & Remove */}
              <View style={styles.stepperRow}>
                <View style={[styles.stepper, { borderColor: theme.border, backgroundColor: theme.bg }]}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                  >
                    <Minus color={theme.textPrimary} size={14} />
                  </TouchableOpacity>

                  <Text style={[styles.quantityText, { color: theme.textPrimary }]}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                  >
                    <Plus color={theme.textPrimary} size={14} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.removeBtn, { backgroundColor: `${theme.danger}15` }]}
                  onPress={() => removeItem(item.product_id)}
                >
                  <Trash2 color={theme.danger} size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* 3. LOGISTICS HAULAGE NOTICE */}
        <View
          style={[
            styles.haulageNotice,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
          ]}
        >
          <View style={styles.haulageHeader}>
            <Truck color={theme.accent} size={20} />
            <Text style={[styles.haulageTitle, { color: theme.textPrimary }]}>
              FLAT-RATE SITE HAULAGE
            </Text>
          </View>
          <Text style={[styles.haulageBody, { color: theme.textSecondary }]}>
            All construction materials include transparent flat-rate site haulage of{' '}
            <Text style={{ fontWeight: '700', color: theme.textPrimary }}>
              {formatNaira(HAULAGE_FEE_KOBO)}
            </Text>{' '}
            per order across Lagos & Abuja.
          </Text>
        </View>

        {/* 4. ORDER SUMMARY CARD */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>ORDER SUMMARY</Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Materials Subtotal
            </Text>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
              {formatNaira(subtotalKobo)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Site Haulage Delivery
            </Text>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
              {formatNaira(HAULAGE_FEE_KOBO)}
            </Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Grand Total</Text>
            <Text style={[styles.totalValue, { color: theme.accent }]}>
              {formatNaira(totalOrderKobo)}
            </Text>
          </View>
        </View>

        {/* 5. GUEST LOGIN NOTICE */}
        {!user && (
          <View
            style={[
              styles.guestBanner,
              { backgroundColor: `${theme.accent}15`, borderColor: theme.accent },
            ]}
          >
            <LogIn color={theme.accent} size={18} />
            <Text style={[styles.guestBannerText, { color: theme.textPrimary }]}>
              Sign in with Google to synchronize this cart in real-time with your browser session.
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 6. BOTTOM CHECKOUT ACTION BAR */}
      <View
        style={[
          styles.bottomActionBar,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ]}
      >
        <View>
          <Text style={[styles.barTotalLabel, { color: theme.textSecondary }]}>Total Order</Text>
          <Text style={[styles.barTotalValue, { color: theme.accent }]}>
            {formatNaira(totalOrderKobo)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: theme.accent }]}
          onPress={handleCheckoutPress}
        >
          <Text style={styles.checkoutBtnText}>
            {user ? 'CHECKOUT NOW' : 'SIGN IN & CHECKOUT'}
          </Text>
          <ArrowRight color="#FFFFFF" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 13,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  startShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  syncStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  syncStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statusPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  syncStatusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollList: {
    padding: spacing.md,
    gap: spacing.md,
  },
  cartItemCard: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: spacing.md,
  },
  itemImageContainer: {
    width: 84,
    height: 84,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '85%',
    height: '85%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  itemUnitPrice: {
    fontSize: 11,
    marginTop: 2,
  },
  itemLineTotal: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 30,
  },
  stepBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haulageNotice: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
  },
  haulageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  haulageTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  haulageBody: {
    fontSize: 11,
    lineHeight: 16,
  },
  summaryCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 10,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  guestBannerText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  bottomActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
  },
  barTotalLabel: {
    fontSize: 11,
  },
  barTotalValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
