import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, ShieldCheck, Truck, Tag, Plus, Check } from 'lucide-react-native';
import { colors, formatNairaWithUnit, radius, spacing } from '../../lib/theme';
import { fetchProducts, fetchCategories } from '../../lib/api/client';
import { useCart } from '../../lib/cart/CartContext';
import { Product } from '../../lib/api/types';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch Featured Products
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchProducts({ limit: 6 }),
  });

  const featuredProducts = productsData?.data || [];

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/(tabs)/marketplace',
        params: { search: searchQuery.trim() },
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addItem(product, 1);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. HERO SECTION */}
      <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.badgeRow}>
          <View style={[styles.statusPill, { backgroundColor: `${theme.accent}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: theme.accent }]} />
            <Text style={[styles.statusText, { color: theme.accent }]}>DIRECT FACTORY DEPOT</Text>
          </View>
        </View>

        <Text style={[styles.heroHeadline, { color: theme.textPrimary }]}>
          CERTIFIED BUILDING MATERIALS, TRANSPARENT PRICING.
        </Text>

        <Text style={[styles.heroSubhead, { color: theme.textSecondary }]}>
          Procure cement, steel rebar, hollow blocks, and roofing directly to your construction site
          across Lagos & Abuja.
        </Text>

        {/* SEARCH BOX */}
        <View style={[styles.searchBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          <Search color={theme.textTertiary} size={20} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search cement, 16mm rebar, granite..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: theme.accent }]}
            onPress={handleSearchSubmit}
          >
            <ArrowRight color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. VALUE PROPS */}
      <View style={styles.trustGrid}>
        <View style={[styles.trustItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ShieldCheck color={theme.accent} size={22} />
          <Text style={[styles.trustTitle, { color: theme.textPrimary }]}>100% Certified</Text>
          <Text style={[styles.trustDesc, { color: theme.textSecondary }]}>Direct from Lafarge, Dangote & BUA</Text>
        </View>
        <View style={[styles.trustItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Truck color={theme.accent} size={22} />
          <Text style={[styles.trustTitle, { color: theme.textPrimary }]}>Flat-Rate Haulage</Text>
          <Text style={[styles.trustDesc, { color: theme.textSecondary }]}>₦35,000 site delivery Lagos & Abuja</Text>
        </View>
      </View>

      {/* 3. CATEGORIES CAROUSEL */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>CATEGORIES</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/marketplace')}
          style={styles.seeAllBtn}
        >
          <Text style={[styles.seeAllText, { color: theme.accent }]}>View all</Text>
          <ArrowRight color={theme.accent} size={14} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/marketplace',
                params: { category: cat.slug },
              })
            }
          >
            <Tag color={theme.accent} size={14} style={{ marginRight: 6 }} />
            <Text style={[styles.categoryText, { color: theme.textPrimary }]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 4. FEATURED PRODUCTS */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>FEATURED MATERIALS</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/marketplace')}
          style={styles.seeAllBtn}
        >
          <Text style={[styles.seeAllText, { color: theme.accent }]}>Full catalog</Text>
          <ArrowRight color={theme.accent} size={14} />
        </TouchableOpacity>
      </View>

      {isProductsLoading ? (
        <ActivityIndicator color={theme.accent} style={{ marginVertical: 30 }} />
      ) : (
        <View style={styles.productGrid}>
          {featuredProducts.map((product) => {
            const isAdded = addedMap[product.id];
            return (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/product/[slug]',
                    params: { slug: product.slug },
                  })
                }
              >
                {/* 1:1 Clean White Rounded Image Tile */}
                <View style={styles.imageTile}>
                  <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                    contentFit="contain"
                    transition={200}
                  />
                  {product.brand_name && (
                    <View style={styles.brandPill}>
                      <Text style={styles.brandPillText}>{product.brand_name}</Text>
                    </View>
                  )}
                </View>

                {/* Details */}
                <View style={styles.productInfo}>
                  <Text
                    style={[styles.productName, { color: theme.textPrimary }]}
                    numberOfLines={2}
                  >
                    {product.name.toUpperCase()}
                  </Text>
                  <Text style={[styles.priceText, { color: theme.accent }]}>
                    {formatNairaWithUnit(product.price_kobo, product.unit)}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.addToCartBtn,
                      isAdded
                        ? { backgroundColor: '#10B981' }
                        : { backgroundColor: theme.accent },
                    ]}
                    onPress={() => handleAddToCart(product)}
                  >
                    {isAdded ? (
                      <Check color="#FFFFFF" size={16} />
                    ) : (
                      <Plus color="#FFFFFF" size={16} />
                    )}
                    <Text style={styles.addToCartText}>{isAdded ? 'Added' : 'Add'}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 5. FOOTER BANNER */}
      <View style={[styles.procurementBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
        <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>LARGE SITE ORDERS?</Text>
        <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
          Direct supply of bulk 40-ton cement trucks and full flatbeds of rebar to construction sites.
        </Text>
        <TouchableOpacity
          style={[styles.bannerBtn, { backgroundColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/marketplace')}
        >
          <Text style={styles.bannerBtnText}>BROWSE CATALOG</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  heroCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  heroSubhead: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.sm,
    fontSize: 14,
  },
  searchButton: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  trustItem: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 2,
  },
  trustDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  productCard: {
    width: '48.5%',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  imageTile: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  brandPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  brandPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  productInfo: {
    marginTop: spacing.sm,
  },
  productName: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    minHeight: 30,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  actionRow: {
    marginTop: spacing.sm,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    borderRadius: radius.sm,
    gap: 4,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  procurementBanner: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: spacing.md,
  },
  bannerBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
