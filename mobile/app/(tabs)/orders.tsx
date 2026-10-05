import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, ArrowRight, Package, Clock, LogIn } from 'lucide-react-native';
import { colors, formatNaira, radius, spacing } from '../../lib/theme';
import { fetchOrders } from '../../lib/api/client';
import { useAuth } from '../../lib/auth/AuthContext';
import { Order } from '../../lib/api/types';

export default function OrdersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { user, signInWithGoogle } = useAuth();

  const {
    data: orders = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: fetchOrders,
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { bg: '#065F46', text: '#34D399', label: 'CONFIRMED' };
      case 'delivered':
        return { bg: '#1E3A8A', text: '#60A5FA', label: 'DELIVERED' };
      case 'shipped':
        return { bg: '#78350F', text: '#FBBF24', label: 'IN TRANSIT' };
      case 'cancelled':
        return { bg: '#7F1D1D', text: '#F87171', label: 'CANCELLED' };
      default:
        return { bg: '#374151', text: '#E5E7EB', label: 'PENDING' };
    }
  };

  if (!user) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <ClipboardList color={theme.textTertiary} size={40} />
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Track Your Orders</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sign in with Google using the same account you use on web to view live dispatch status
          and itemized receipts.
        </Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
          onPress={signInWithGoogle}
        >
          <LogIn color="#FFFFFF" size={18} />
          <Text style={styles.primaryBtnText}>SIGN IN WITH GOOGLE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} size="large" />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading your construction orders...
        </Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Package color={theme.textTertiary} size={40} />
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>No orders yet</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          When you checkout on the web or mobile app, your orders will appear here automatically.
        </Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/marketplace')}
        >
          <Text style={styles.primaryBtnText}>EXPLORE MATERIALS</Text>
          <ArrowRight color="#FFFFFF" size={16} />
        </TouchableOpacity>
      </View>
    );
  }

  const renderOrderItem = ({ item }: { item: Order }) => {
    const badge = getStatusBadge(item.status);
    const dateFormatted = new Date(item.created_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <TouchableOpacity
        style={[
          styles.orderCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: '/order/[id]',
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.orderNumber, { color: theme.textPrimary }]}>
              {item.order_number}
            </Text>
            <View style={styles.dateRow}>
              <Clock color={theme.textTertiary} size={12} />
              <Text style={[styles.orderDate, { color: theme.textTertiary }]}>{dateFormatted}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        <View style={[styles.cardDivider, { backgroundColor: theme.border }]} />

        <View style={styles.cardBody}>
          <Text style={[styles.addressText, { color: theme.textSecondary }]} numberOfLines={1}>
            Site: {item.delivery_address}, {item.delivery_city}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total Order</Text>
          <View style={styles.footerRight}>
            <Text style={[styles.totalAmount, { color: theme.accent }]}>
              {formatNaira(item.total_kobo)}
            </Text>
            <ArrowRight color={theme.accent} size={16} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.accent}
          />
        }
      />
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
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  loadingText: {
    fontSize: 13,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 40,
  },
  orderCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  orderDate: {
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardDivider: {
    height: 1,
  },
  cardBody: {
    paddingVertical: 2,
  },
  addressText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '900',
  },
});
