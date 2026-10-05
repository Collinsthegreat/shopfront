import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Plus, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react-native';
import { colors, formatNairaWithUnit, radius, spacing } from '../../lib/theme';
import { fetchProducts, fetchCategories } from '../../lib/api/client';
import { useCart } from '../../lib/cart/CartContext';
import { Product } from '../../lib/api/types';

export default function MarketplaceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; search?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { addItem } = useCart();

  const [search, setSearch] = useState(params.search || '');
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'all');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (params.search !== undefined) setSearch(params.search);
    if (params.category !== undefined) setSelectedCategory(params.category);
  }, [params.search, params.category]);

  // Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Products
  const {
    data: productsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['products', { search, category: selectedCategory, sort }],
    queryFn: () =>
      fetchProducts({
        search: search.trim() || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort,
        limit: 100,
      }),
  });

  const products = productsData?.data || [];

  const handleAddToCart = async (product: Product) => {
    await addItem(product, 1);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const cycleSort = () => {
    if (sort === 'featured') setSort('price-asc');
    else if (sort === 'price-asc') setSort('price-desc');
    else if (sort === 'price-desc') setSort('name-asc');
    else setSort('featured');
  };

  const getSortLabel = () => {
    switch (sort) {
      case 'price-asc':
        return 'Price: Low → High';
      case 'price-desc':
        return 'Price: High → Low';
      case 'name-asc':
        return 'Name: A → Z';
      default:
        return 'Featured';
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isAdded = addedMap[item.id];
    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: '/product/[slug]',
            params: { slug: item.slug },
          })
        }
      >
        <View style={styles.imageTile}>
          <Image
            source={{ uri: item.image_url }}
            style={styles.productImage}
            contentFit="contain"
            transition={200}
          />
          {item.brand_name && (
            <View style={styles.brandPill}>
              <Text style={styles.brandPillText}>{item.brand_name}</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.textPrimary }]} numberOfLines={2}>
            {item.name.toUpperCase()}
          </Text>
          <Text style={[styles.priceText, { color: theme.accent }]}>
            {formatNairaWithUnit(item.price_kobo, item.unit)}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              isAdded ? { backgroundColor: '#10B981' } : { backgroundColor: theme.accent },
            ]}
            onPress={() => handleAddToCart(item)}
          >
            {isAdded ? <Check color="#FFFFFF" size={16} /> : <Plus color="#FFFFFF" size={16} />}
            <Text style={styles.addToCartText}>{isAdded ? 'Added' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* 1. SEARCH & SORT BAR */}
      <View style={[styles.headerControls, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          <Search color={theme.textTertiary} size={18} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search all 48+ materials..."
            placeholderTextColor={theme.textTertiary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X color={theme.textTertiary} size={18} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.sortButton, { borderColor: theme.border, backgroundColor: theme.bg }]}
          onPress={cycleSort}
        >
          <ArrowUpDown color={theme.accent} size={16} />
          <Text style={[styles.sortText, { color: theme.textPrimary }]}>{getSortLabel()}</Text>
        </TouchableOpacity>
      </View>

      {/* 2. CATEGORY PILLS */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChips}
          data={[{ id: 'all', name: 'All Materials', slug: 'all' }, ...categories]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.slug;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  isSelected
                    ? { backgroundColor: theme.accent, borderColor: theme.accent }
                    : { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() => setSelectedCategory(item.slug)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 3. PRODUCT GRID */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.accent} size="large" />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading certified materials...
          </Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No materials found</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Try clearing your search query or choosing another category.
          </Text>
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: theme.accent }]}
            onPress={() => {
              setSearch('');
              setSelectedCategory('all');
            }}
          >
            <Text style={styles.resetBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.productList}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.accent}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerControls: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.sm,
    fontSize: 14,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryChips: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productList: {
    padding: spacing.sm,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  productCard: {
    width: '48.5%',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
