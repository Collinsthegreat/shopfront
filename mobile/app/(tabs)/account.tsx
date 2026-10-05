import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  LogIn,
  LogOut,
  Shield,
  HelpCircle,
  Smartphone,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react-native';
import { colors, radius, spacing } from '../../lib/theme';
import { useAuth } from '../../lib/auth/AuthContext';
import { useCart } from '../../lib/cart/CartContext';

export default function AccountScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { user, signInWithGoogle, signOut, isLoading } = useAuth();
  const { isRealtimeConnected } = useCart();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of BuildMart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      {/* 1. USER PROFILE CARD */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: `${theme.accent}20`, borderColor: theme.accent },
          ]}
        >
          <User color={theme.accent} size={36} />
        </View>

        {user ? (
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'BuildMart Customer'}
            </Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user.email}</Text>
            <View style={styles.verifiedRow}>
              <CheckCircle2 color="#10B981" size={14} />
              <Text style={styles.verifiedText}>Google Account Authenticated</Text>
            </View>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>Guest User</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              Sign in with Google to synchronize your cart and orders across web and phone.
            </Text>
          </View>
        )}

        <View style={{ marginTop: spacing.md }}>
          {user ? (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: `${theme.danger}15` }]}
              onPress={handleSignOut}
              disabled={isLoading}
            >
              <LogOut color={theme.danger} size={18} />
              <Text style={[styles.actionBtnText, { color: theme.danger }]}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.accent }]}
              onPress={signInWithGoogle}
              disabled={isLoading}
            >
              <LogIn color="#FFFFFF" size={18} />
              <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>
                Sign In with Google
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. REALTIME & BACKEND STATUS */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          PLATFORM & INTEGRATION
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Account Model</Text>
          <Text style={[styles.infoValue, { color: theme.accent }]}>
            Shared Supabase Auth (Single Identity)
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Cloud Realtime</Text>
          <Text
            style={[
              styles.infoValue,
              { color: isRealtimeConnected ? '#10B981' : '#F59E0B' },
            ]}
          >
            {isRealtimeConnected ? 'Connected (Live Pub/Sub)' : 'Fallback Polling (5s)'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Backend Endpoint</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]} numberOfLines={1}>
            shopfront-green.vercel.app/api
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Currency</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            NGN (₦, Integer Kobo)
          </Text>
        </View>
      </View>

      {/* 3. POLICIES & COMPLIANCE */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>LEGAL & SUPPORT</Text>

        <View style={styles.infoRow}>
          <View style={styles.rowLeft}>
            <Shield color={theme.textTertiary} size={16} />
            <Text style={[styles.rowText, { color: theme.textPrimary }]}>Privacy Policy</Text>
          </View>
          <ExternalLink color={theme.textTertiary} size={14} />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.rowLeft}>
            <HelpCircle color={theme.textTertiary} size={16} />
            <Text style={[styles.rowText, { color: theme.textPrimary }]}>Terms of Service</Text>
          </View>
          <ExternalLink color={theme.textTertiary} size={14} />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.rowLeft}>
            <Smartphone color={theme.textTertiary} size={16} />
            <Text style={[styles.rowText, { color: theme.textPrimary }]}>BuildMart Mobile</Text>
          </View>
          <Text style={[styles.infoValue, { color: theme.textTertiary }]}>v1.0.0 (Expo 57)</Text>
        </View>
      </View>
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
    paddingBottom: 40,
  },
  profileCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  userInfo: {
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 12,
    textAlign: 'center',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  actionBtnText: {
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
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
