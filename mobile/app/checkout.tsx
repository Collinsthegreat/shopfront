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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Truck, ArrowRight, LogIn, CheckCircle } from 'lucide-react-native';
import { colors, formatNaira, HAULAGE_FEE_KOBO, radius, spacing } from '../lib/theme';
import { createOrder } from '../lib/api/client';
import { useCart } from '../lib/cart/CartContext';
import { useAuth } from '../lib/auth/AuthContext';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { user, signInWithGoogle } = useAuth();
  const { items, subtotalKobo, clear } = useCart();

  const [customerName, setCustomerName] = useState(
    user?.user_metadata?.full_name || ''
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState<'Lagos' | 'Abuja'>('Lagos');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalOrderKobo = subtotalKobo + HAULAGE_FEE_KOBO;

  if (!user) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <LogIn color={theme.accent} size={40} />
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Authentication Required</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Please sign in with Google to confirm your order and synchronize dispatch status.
        </Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
          onPress={signInWithGoogle}
        >
          <Text style={styles.primaryBtnText}>SIGN IN WITH GOOGLE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Your Cart is Empty</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Add items to your cart before proceeding to checkout.
        </Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/marketplace')}
        >
          <Text style={styles.primaryBtnText}>BROWSE CATALOG</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim() || customerName.trim().length < 3) {
      newErrors.customerName = 'Please enter your full name (at least 3 characters)';
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number (at least 10 digits)';
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      newErrors.deliveryAddress = 'Please enter a complete site delivery address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const idempotencyKey = generateUUID();

      const orderPayload = {
        customer_name: customerName.trim(),
        phone_number: phoneNumber.trim(),
        delivery_address: deliveryAddress.trim(),
        delivery_city: deliveryCity,
        notes: notes.trim() || undefined,
        idempotency_key: idempotencyKey,
        items: items.map((i) => ({
          productId: i.product_id,
          quantity: i.quantity,
        })),
      };

      const order = await createOrder(orderPayload);
      await clear();

      router.replace({
        pathname: '/order/[id]',
        params: { id: order.id },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit order. Please try again.';
      Alert.alert('Order Placement Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. DELIVERY ADDRESS FORM */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          SITE DELIVERY ADDRESS
        </Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Site Contact / Name *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bg, borderColor: errors.customerName ? theme.danger : theme.border, color: theme.textPrimary },
            ]}
            placeholder="Engr. Babatunde Adeleke"
            placeholderTextColor={theme.textTertiary}
            value={customerName}
            onChangeText={setCustomerName}
          />
          {errors.customerName && (
            <Text style={[styles.errorText, { color: theme.danger }]}>{errors.customerName}</Text>
          )}
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Phone Number *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bg, borderColor: errors.phoneNumber ? theme.danger : theme.border, color: theme.textPrimary },
            ]}
            placeholder="0803 123 4567"
            placeholderTextColor={theme.textTertiary}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {errors.phoneNumber && (
            <Text style={[styles.errorText, { color: theme.danger }]}>{errors.phoneNumber}</Text>
          )}
        </View>

        {/* Delivery City (Lagos or Abuja) */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Delivery Metro *</Text>
          <View style={styles.cityToggleRow}>
            {(['Lagos', 'Abuja'] as const).map((city) => {
              const isSelected = deliveryCity === city;
              return (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.cityBtn,
                    isSelected
                      ? { backgroundColor: theme.accent, borderColor: theme.accent }
                      : { backgroundColor: theme.bg, borderColor: theme.border },
                  ]}
                  onPress={() => setDeliveryCity(city)}
                >
                  <Text
                    style={[
                      styles.cityBtnText,
                      { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                    ]}
                  >
                    {city} Metropolis
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Site Address */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Site Delivery Address *</Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: theme.bg, borderColor: errors.deliveryAddress ? theme.danger : theme.border, color: theme.textPrimary },
            ]}
            placeholder="Plot 14, Commercial Boulevard, Off Lekki-Epe Expressway, Lagos"
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={3}
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
          {errors.deliveryAddress && (
            <Text style={[styles.errorText, { color: theme.danger }]}>
              {errors.deliveryAddress}
            </Text>
          )}
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Site Offloading Instructions (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bg, borderColor: theme.border, color: theme.textPrimary },
            ]}
            placeholder="E.g. Crane available on site, gate opens at 7 AM"
            placeholderTextColor={theme.textTertiary}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </View>

      {/* 2. PAYMENT METHOD (Pay on Delivery) */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>PAYMENT METHOD</Text>

        <View
          style={[
            styles.paymentOption,
            { backgroundColor: `${theme.accent}15`, borderColor: theme.accent },
          ]}
        >
          <View style={styles.paymentLeft}>
            <CheckCircle color={theme.accent} size={20} />
            <View>
              <Text style={[styles.paymentTitle, { color: theme.textPrimary }]}>
                Pay on Delivery (Simulated POD)
              </Text>
              <Text style={[styles.paymentDesc, { color: theme.textSecondary }]}>
                Inspect materials on site before payment confirmation.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. ORDER SUMMARY */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>ORDER SUMMARY</Text>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Materials ({items.reduce((s, i) => s + i.quantity, 0)} units)
          </Text>
          <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
            {formatNaira(subtotalKobo)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Flat-Rate Haulage Delivery
          </Text>
          <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
            {formatNaira(HAULAGE_FEE_KOBO)}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Payable</Text>
          <Text style={[styles.totalValue, { color: theme.accent }]}>
            {formatNaira(totalOrderKobo)}
          </Text>
        </View>
      </View>

      {/* 4. SUBMIT BUTTON */}
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: theme.accent }]}
        onPress={handlePlaceOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Text style={styles.submitBtnText}>CONFIRM & PLACE ORDER</Text>
            <ArrowRight color="#FFFFFF" size={18} />
          </>
        )}
      </TouchableOpacity>

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
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
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
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    height: 44,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.sm,
    height: 80,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  cityToggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  cityBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 11,
    fontWeight: '600',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1.5,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  paymentDesc: {
    fontSize: 11,
    marginTop: 2,
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.full,
    gap: 8,
    marginTop: spacing.sm,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
