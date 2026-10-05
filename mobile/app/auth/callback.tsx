import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase/client';
import { colors } from '../../lib/theme';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  useEffect(() => {
    async function handleExchange() {
      if (params.code) {
        try {
          await supabase.auth.exchangeCodeForSession(params.code);
        } catch (e) {
          console.error('Callback error:', e);
        }
      }
      router.replace('/(tabs)/account');
    }

    handleExchange();
  }, [params.code, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ActivityIndicator color={theme.accent} size="large" />
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Completing Google sign in...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
