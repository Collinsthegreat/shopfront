# BuildMart Mobile Application

[![Android APK Download](https://img.shields.io/badge/Android%20APK-Download%20BuildMart-10b981?style=for-the-badge&logo=android)](https://expo.dev/artifacts/eas/VYWxmTjv3NRWLwYrT0EtEKtEeINQa6divQ2NxpMgwME.apk)
[![EAS Build](https://img.shields.io/badge/EAS%20Build-Finished%20(108MB)-success?style=for-the-badge&logo=expo)](https://expo.dev/accounts/collinsthegreat/projects/buildmart/builds/248f4e8c-4ced-44b8-90df-564ee7f34686)
[![Framework](https://img.shields.io/badge/Expo-SDK%2057%20%2F%20React%20Native%200.86-000020?style=for-the-badge&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

Production-ready cross-platform mobile application for **BuildMart**, built with **Expo SDK 57**, **React Native 0.86**, **Expo Router**, and **TypeScript** in strict mode (0 `any`, `noUncheckedIndexedAccess: true`).

- **Direct APK Download:** [buildmart.apk (~108 MB)](https://expo.dev/artifacts/eas/VYWxmTjv3NRWLwYrT0EtEKtEeINQa6divQ2NxpMgwME.apk)
- **EAS Build Console:** [Build #248f4e8c-4ced-44b8-90df-564ee7f34686](https://expo.dev/accounts/collinsthegreat/projects/buildmart/builds/248f4e8c-4ced-44b8-90df-564ee7f34686)
- **Live Backend API:** [https://shopfront-green.vercel.app/api](https://shopfront-green.vercel.app/api)
- **Web Storefront:** [https://shopfront-green.vercel.app](https://shopfront-green.vercel.app)

---

## Core Features & Architecture

### 1. Single Account Architecture
- Shares the **exact same Supabase Auth instance** as the web storefront.
- Sign in with Google on either the web platform or the phone to access the exact same account profile, orders, and cart.
- Employs secure **Google OAuth PKCE** flow (`expo-web-browser` and `expo-linking`) with deep link scheme `buildmart://auth/callback`.
- Stores authentication tokens securely using hardware-backed encryption via `expo-secure-store`.

### 2. Live Bi-Directional Cart Sync (< 2 Seconds)
- Any material added, incremented, or removed on the website appears on the physical phone in real time without refreshing, and vice-versa.
- Powered by PostgreSQL `REPLICA IDENTITY FULL` streaming through the `supabase_realtime` publication on `cart_items` with strict Row-Level Security (`auth.uid() = user_id`).
- Resilient client engine incorporates optimistic local updates, automatic re-connection upon network recovery, foreground re-fetching (`AppState`), and 5-second polling fallback.

### 3. Production API Integration
- Connects directly to deployed production Next.js REST endpoints (`https://shopfront-green.vercel.app/api/...`).
- Authoritative unit prices and totals are computed strictly server-side in minor units (kobo). Mobile never handles raw calculations or float math.
- Flat-rate site haulage calculation (simulated ₦35,000 across Lagos & Abuja metropolises).

### 4. Industrial Dual-Theme Design System
- Built to match modern industrial procurement standards:
  - **Dark Theme:** Deep navy-black (`#0B1220`), elevated surfaces (`#131D31`), hairline borders (`#1F2E4A`), high-contrast text (`#F8FAFC`).
  - **Light Theme:** Crisp white (`#FFFFFF`), cool secondary surfaces (`#F8FAFC`), hairline borders (`#E2E8F0`).
  - **Accent Color:** Construction Safety Orange (`#F58A2B` / `#EA580C`) passing WCAG AA standards.

---

## Directory Structure

```
mobile/
├── app/
│   ├── _layout.tsx              # Root provider tree (Theme, TanStack Query, Auth, Toast)
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab navigation bar with icons and badges
│   │   ├── index.tsx            # Home screen (Hero banner, category chips, featured materials)
│   │   ├── marketplace.tsx      # 2-column catalog grid with search and category filtering
│   │   ├── cart.tsx             # Real-time synced cart with bulk steppers & haulage notice
│   │   ├── orders.tsx           # Order history with status badges & unit breakdown
│   │   └── account.tsx          # User profile, Google sign-in/out button, theme switch
│   ├── product/
│   │   └── [slug].tsx           # Product detail (Specs table, image carousel, bulk stepper)
│   ├── checkout.tsx             # Checkout screen (Address validation & Pay-on-Delivery confirmation)
│   ├── order/
│   │   └── [id].tsx             # Itemized order confirmation receipt & email resend
│   └── auth/
│       └── callback.tsx         # Deep link OAuth callback handler
├── components/
│   ├── ui/                      # Button, Input, BottomSheet, Badge, ThemedText, ThemedView
│   ├── product/                 # MobileProductCard, ProductGrid, BulkStepper
│   └── cart/                    # CartItemCard, CartSummaryCard, SyncIndicator
├── hooks/                       # useTheme, useCart, useAuth, useColorTheme
├── lib/
│   ├── api.ts                   # Production API client with Bearer JWT injection
│   ├── supabase.ts              # Supabase client with SecureStore token adapter
│   └── formatters.ts            # Currency (₦ kobo to naira) and unit string formatting
├── constants/
│   ├── Colors.ts                # Dual-theme color palettes & tokens
│   └── config.ts                # API URLs & Supabase configuration
├── app.json                     # Expo configuration & deep linking scheme (buildmart://)
├── eas.json                     # EAS Build profiles (preview, production)
└── package.json
```

---

## Running on Physical Device

### Method A: Standalone APK (Recommended for Android)
The standalone `.apk` runs entirely standalone on physical Android devices — **no terminal, PC connection, or Metro bundler required**:

1. Download [`buildmart.apk`](https://expo.dev/artifacts/eas/VYWxmTjv3NRWLwYrT0EtEKtEeINQa6divQ2NxpMgwME.apk) directly on your Android phone.
2. Tap the downloaded file in your notifications or Downloads folder to install.
3. Open **BuildMart** and begin testing immediately!

### Method B: Expo Go (iOS & Android Development)
When using Expo Go, your phone streams JavaScript bundles from the local Metro server running on your computer.

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android).
2. Start the Metro bundler on your PC:
   ```bash
   cd mobile
   npx expo start
   ```
   > **Note:** The terminal running `npx expo start` must remain active while using Expo Go.
3. **iPhone:** Open your iPhone Camera app and point it at the terminal QR code, then tap the prompt to open in Expo Go.  
   **Android:** Open the Expo Go app and tap "Scan QR Code".
4. To test across different Wi-Fi networks, run in tunnel mode:
   ```bash
   npx expo start --tunnel
   ```

---

## EAS Build Configuration

BuildMart is configured with Expo Application Services (EAS Build).

To trigger a new build from source:
```bash
# Install EAS CLI globally if needed
npm install -g eas-cli

# Log in to Expo
npx eas-cli login

# Build standalone Android APK
npx eas-cli build -p android --profile preview
```

---

## Verification & Typecheck

```bash
# TypeScript strict check (0 errors)
npx tsc --noEmit
```
