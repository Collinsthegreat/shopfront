import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Mail,
  Truck,
  ArrowRight,
  ClipboardList,
  MapPin,
  Phone,
  User,
} from 'lucide-react-native';
import { colors, formatNaira, radius, spacing } from '../../lib/theme';
import { fetchOrderById, resendOrderEmail } from '../../lib/api/client';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const [isResending, setIsResending] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id as string),
    enabled: !!id,
  });

  const handleResendEmail = async () => {
    if (!id) return;
    try {
      setIsResending(true);
      await resendOrderEmail(id as string);
      Alert.alert('Email Sent', 'Order confirmation receipt resent to your email address.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not resend confirmation email.';
      Alert.alert('Resend Failed', msg);
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} size="large" />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Retrieving order confirmation...
        </Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>Order Not Found</Text>
        <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>
          Unable to locate order reference details.
        </Text>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/orders')}
        >
          <Text style={styles.btnText}>View My Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. SUCCESS HEADER */}
      <View
        style={[
          styles.successCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View style={styles.successIconCircle}>
          <CheckCircle2 color="#10B981" size={48} />
        </View>

        <Text style={[styles.successTitle, { color: theme.textPrimary }]}>
          ORDER CONFIRMED!
        </Text>
        <Text style={[styles.orderNumber, { color: theme.accent }]}>
          {order.order_number}
        </Text>
        <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
          Your construction materials order has been recorded in the database. Our dispatch
          officer will contact site personnel for offloading.
        </Text>

        <TouchableOpacity
          style={[styles.emailResendBtn, { borderColor: theme.border, backgroundColor: theme.bg }]}
          onPress={handleResendEmail}
          disabled={isResending}
        >
          {isResending ? (
            <ActivityIndicator color={theme.accent} size="small" />
          ) : (
            <>
              <Mail color={theme.accent} size={16} />
              <Text style={[styles.emailResendText, { color: theme.textPrimary }]}>
                Resend Confirmation Email
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. SITE DELIVERY DETAILS */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          SITE DELIVERY INFORMATION
        </Text>

        <View style={styles.detailRow}>
          <User color={theme.textTertiary} size={16} />
          <Text style={[styles.detailText, { color: theme.textPrimary }]}>
            {order.customer_name}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Phone color={theme.textTertiary} size={16} />
          <Text style={[styles.detailText, { color: theme.textPrimary }]}>
            {order.phone_number}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MapPin color={theme.textTertiary} size={16} />
          <Text style={[styles.detailText, { color: theme.textPrimary }]}>
            {order.delivery_address}, {order.delivery_city}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Truck color={theme.textTertiary} size={16} />
          <Text style={[styles.detailText, { color: theme.textPrimary }]}>
            Payment: {order.payment_method}
          </Text>
        </View>
      </View>

      {/* 3. ITEMIZED RECEIPT TABLE */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>ITEMIZED RECEIPT</Text>

        {order.items?.map((item) => (
          <View
            key={item.id}
            style={[styles.itemRow, { borderBottomColor: theme.border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, { color: theme.textPrimary }]}>
                {item.product_name.toUpperCase()}
              </Text>
              <Text style={[styles.itemSnapshot, { color: theme.textSecondary }]}>
                {item.unit_snapshot || `${item.quantity} units @ ${formatNaira(item.unit_price_kobo)}`}
              </Text>
            </View>

            <Text style={[styles.itemLineTotal, { color: theme.textPrimary }]}>
              {formatNaira(item.line_total_kobo)}
            </Text>
          </View>
        ))}

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Materials Subtotal
          </Text>
          <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
            {formatNaira(order.subtotal_kobo)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Site Haulage Delivery
          </Text>
          <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
            {formatNaira(order.haulage_fee_kobo)}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Grand Total</Text>
          <Text style={[styles.totalValue, { color: theme.accent }]}>
            {formatNaira(order.total_kobo)}
          </Text>
        </View>
      </View>

      {/* 4. ACTIONS */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/orders')}
        >
          <ClipboardList color={theme.textPrimary} size={16} />
          <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>View All Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.accent, borderColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/marketplace')}
        >
          <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Continue Shopping</Text>
          <ArrowRight color="#FFFFFF" size={16} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  successCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  successIconCircle: {
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  successSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 2,
    marginBottom: 6,
  },
  emailResendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  emailResendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemSnapshot: {
    fontSize: 11,
    marginTop: 2,
  },
  itemLineTotal: {
    fontSize: 13,
    fontWeight: '800',
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
  divider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '900',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
