import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { Plus, Minus, Check, ShoppingBag, ShieldCheck, Truck, ArrowLeft } from 'lucide-react-native';
import { colors, formatNaira, formatNairaWithUnit, radius, spacing } from '../../lib/theme';
import { fetchProductBySlug } from '../../lib/api/client';
import { useCart } from '../../lib/cart/CartContext';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug as string),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} size="large" />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading product specifications...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>Material Not Found</Text>
        <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>
          The requested product could not be loaded or may no longer be available.
        </Text>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.accent }]}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#FFFFFF" size={16} />
          <Text style={styles.backBtnText}>Back to Catalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItem(product, quantity);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const lineTotalKobo = product.price_kobo * quantity;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. PRODUCT IMAGE CONTAINER (1:1 Clean White Tile) */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
          {product.brand_name && (
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>{product.brand_name}</Text>
            </View>
          )}
        </View>

        {/* 2. PRODUCT BASICS */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {product.name.toUpperCase()}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.accent }]}>
              {formatNairaWithUnit(product.price_kobo, product.unit)}
            </Text>

            <View style={[styles.stockBadge, { backgroundColor: '#065F46' }]}>
              <Text style={styles.stockBadgeText}>IN STOCK ({product.stock})</Text>
            </View>
          </View>

          {product.description && (
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {product.description}
            </Text>
          )}
        </View>

        {/* 3. BULK QUANTITY SELECTOR */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>ORDER QUANTITY</Text>

          <View style={styles.quantityRow}>
            <View style={[styles.stepper, { borderColor: theme.border, backgroundColor: theme.bg }]}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus color={theme.textPrimary} size={18} />
              </TouchableOpacity>

              <TextInput
                style={[styles.quantityInput, { color: theme.textPrimary }]}
                keyboardType="numeric"
                value={String(quantity)}
                onChangeText={(val) => {
                  const num = parseInt(val, 10);
                  if (!isNaN(num) && num > 0) {
                    setQuantity(Math.min(num, product.stock));
                  } else if (val === '') {
                    setQuantity(1);
                  }
                }}
              />

              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                <Plus color={theme.textPrimary} size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.bulkTotal}>
              <Text style={[styles.bulkTotalLabel, { color: theme.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.bulkTotalValue, { color: theme.accent }]}>
                {formatNaira(lineTotalKobo)}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. SPECIFICATIONS TABLE */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              TECHNICAL SPECIFICATIONS
            </Text>

            <View style={styles.specsTable}>
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <View
                  key={key}
                  style={[
                    styles.specRow,
                    idx % 2 === 1 && { backgroundColor: theme.surfaceElevated },
                  ]}
                >
                  <Text style={[styles.specKey, { color: theme.textSecondary }]}>
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                  <Text style={[styles.specValue, { color: theme.textPrimary }]}>
                    {String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 5. LOGISTICS & AUTHENTICITY */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.trustItem}>
            <Truck color={theme.accent} size={20} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.trustTitle, { color: theme.textPrimary }]}>Site Haulage</Text>
              <Text style={[styles.trustDesc, { color: theme.textSecondary }]}>
                Flat-rate ₦35,000 haulage per order delivered directly to your site.
              </Text>
            </View>
          </View>

          <View style={[styles.trustItem, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 12 }]}>
            <ShieldCheck color={theme.accent} size={20} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.trustTitle, { color: theme.textPrimary }]}>
                Certified Quality Guarantee
              </Text>
              <Text style={[styles.trustDesc, { color: theme.textSecondary }]}>
                Standard NIS/SON certified materials directly from authenticated manufacturers.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 6. BOTTOM ACTION BAR */}
      <View
        style={[
          styles.bottomActionBar,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ]}
      >
        <View>
          <Text style={[styles.barTotalLabel, { color: theme.textSecondary }]}>
            {quantity} {product.unit}{quantity > 1 ? 's' : ''}
          </Text>
          <Text style={[styles.barTotalValue, { color: theme.accent }]}>
            {formatNaira(lineTotalKobo)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addCartBtn,
            justAdded ? { backgroundColor: '#10B981' } : { backgroundColor: theme.accent },
          ]}
          onPress={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : justAdded ? (
            <>
              <Check color="#FFFFFF" size={18} />
              <Text style={styles.addCartText}>ADDED TO CART</Text>
            </>
          ) : (
            <>
              <ShoppingBag color="#FFFFFF" size={18} />
              <Text style={styles.addCartText}>ADD TO CART</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
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
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  errorSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    gap: 6,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  imageCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  brandBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  brandBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 44,
  },
  stepBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  bulkTotal: {
    alignItems: 'flex-end',
  },
  bulkTotalLabel: {
    fontSize: 11,
  },
  bulkTotalValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  specsTable: {
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  specKey: {
    fontSize: 11,
    fontWeight: '600',
  },
  specValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  trustDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
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
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  addCartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
