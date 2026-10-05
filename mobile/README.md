# BuildMart Mobile Application

Production-ready cross-platform mobile application for **BuildMart**, built with **Expo 57**, **React Native**, **Expo Router**, and **TypeScript** in strict mode.

---

## Features
- **Single Account Architecture:** Connects to the same Supabase Auth instance via Google OAuth (PKCE flow) using `expo-secure-store` for encrypted session token persistence.
- **Bi-Directional Live Cart Sync:** Real-time synchronization between the web platform (`https://shopfront-green.vercel.app`) and mobile devices powered by PostgreSQL pub/sub (`supabase_realtime`) on the `cart_items` table with 5-second polling fallback.
- **Production API Integration:** Connects directly to deployed production Next.js REST endpoints (`https://shopfront-green.vercel.app/api/...`), ensuring 100% authoritative pricing computed in minor units (kobo).
- **Industrial Design System:** Tailored dual themes (`#0B1220` deep navy-black dark theme and `#FFFFFF` crisp white light theme) with high-contrast Safety Orange (`#F58A2B` / `#EA580C`) accent.
- **Full Commerce Lifecycle:** Home, 2-column Marketplace catalog, Product Detail with technical specifications table, Live Cart with bulk stepper and flat-rate site haulage (₦35,000 across Lagos & Abuja), Checkout with address validation, and Order History with itemized receipts.

---

## Tech Stack
- **Framework:** Expo 57 (React Native 0.86, React 19)
- **Routing:** Expo Router (File-based navigation)
- **Data Fetching & Cache:** `@tanstack/react-query`
- **Database & Auth:** `@supabase/supabase-js` with `expo-secure-store`
- **Images:** `expo-image`
- **Icons:** `lucide-react-native`
- **Validation:** `zod`

---

## Getting Started

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Environment Variables
Ensure `.env` contains:
```env
EXPO_PUBLIC_SUPABASE_URL="https://kyrargxececkgbrlzvqs.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="..."
EXPO_PUBLIC_API_URL="https://shopfront-green.vercel.app/api"
EXPO_PUBLIC_SITE_URL="https://shopfront-green.vercel.app"
```

### 3. Run Development Server
```bash
npx expo start
```
Scan the QR code with **Expo Go** on Android or your iPhone Camera app.

### 4. Build Standalone Android APK
```bash
npx eas-cli build -p android --profile preview
```
