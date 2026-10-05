/**
 * BuildMart Design Tokens & Theme Configuration (Mobile)
 * Strictly matches web design system:
 * - Dark: #0B1220 deep navy-black, #131D31 elevated, #1F2E4A borders, #F8FAFC text
 * - Light: #FFFFFF crisp white, #F8FAFC surfaces, #E2E8F0 borders, #0F172A text
 * - ONE Accent: #F58A2B (dark) / #EA580C (light) Construction Safety Orange
 * - Danger: #EF4444 / #DC2626
 */

export const colors = {
  dark: {
    bg: '#0B1220',
    bgSecondary: '#0F172A',
    surface: '#131D31',
    surfaceElevated: '#1A2742',
    border: '#1F2E4A',
    borderSubtle: '#172338',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    accent: '#F58A2B',
    accentHover: '#FA9C46',
    accentContrast: '#0B1220',
    danger: '#EF4444',
    dangerBg: '#450A0A',
    card: '#131D31',
    tint: '#F58A2B',
    tabIconDefault: '#64748B',
    tabIconSelected: '#F58A2B',
  },
  light: {
    bg: '#FFFFFF',
    bgSecondary: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    border: '#E2E8F0',
    borderSubtle: '#EDF2F7',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    accent: '#EA580C',
    accentHover: '#C2410C',
    accentContrast: '#FFFFFF',
    danger: '#DC2626',
    dangerBg: '#FEF2F2',
    card: '#FFFFFF',
    tint: '#EA580C',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#EA580C',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const HAULAGE_FEE_KOBO = 3500000; // Flat-rate simulated site haulage: ₦35,000

/**
 * Format kobo integer to Nigerian Naira string (₦)
 */
export function formatNaira(kobo: number): string {
  const naira = Math.floor(kobo / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
}

/**
 * Format kobo integer with unit label (e.g. "₦9,500 / bag")
 */
export function formatNairaWithUnit(kobo: number, unit?: string | null): string {
  const base = formatNaira(kobo);
  if (!unit) return base;
  return `${base} / ${unit}`;
}
