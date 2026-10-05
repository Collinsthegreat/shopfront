# BuildMart — Physical Device Testing & Verification Guide

> **Target:** Verification of Requirement 1 (One Account), Requirement 2 (Live Cart Sync), Requirement 3 (Physical Device Test), and Requirement 4 (Same Production API).  
> **Environment:** Real Android / iOS Device connected to Production Deployed API (`https://shopfront-green.vercel.app/api`).

---

## 1. Prerequisites & Required One-Time Configurations

### Step A: Run SQL Migration in Supabase
To enable database cart persistence and real-time streaming, run the migration in your Supabase dashboard:
1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/kyrargxececkgbrlzvqs/sql/new).
2. Copy and paste the contents of `supabase/APPLY_CART_REALTIME.sql`.
3. Click **Run** (Cmd/Ctrl + Enter).
4. Confirm message: `Success. No rows returned`.

### Step B: Add Mobile OAuth Redirect URI to Supabase
1. Open [Supabase Authentication > URL Configuration](https://supabase.com/dashboard/project/kyrargxececkgbrlzvqs/auth/url-configuration).
2. Under **Redirect URLs**, click **Add URI**.
3. Add the following URIs:
   - `buildmart://auth/callback` (for standalone/preview mobile build)
   - `https://shopfront-green.vercel.app/auth/callback` (already configured for web)
   - If using Expo Go: `exp://` (or your local Expo Go development URL)
4. Click **Save**.

---

## 2. Launching the Mobile App on Your Physical Phone

### Option 1: Instant Testing via Expo Go (Fastest, No Build Required)
1. Install **Expo Go** from the Google Play Store (Android) or App Store (iOS) on your phone.
2. In your terminal on your PC, navigate to `/mobile`:
   ```powershell
   cd c:\Users\USER\HNGi15\shopfront\mobile
   npx expo start
   ```
3. A QR code will display in your terminal.
4. **Android:** Scan the QR code using the Expo Go app.  
   **iOS:** Scan the QR code using your native Camera app and tap the Expo Go prompt.
5. The BuildMart mobile app will load immediately on your device!

### Option 2: Standalone Android APK (EAS Build)
To test a standalone APK installation on a physical Android device:
```powershell
cd c:\Users\USER\HNGi15\shopfront\mobile
npx eas-cli build -p android --profile preview
```
When the build finishes, download and install the generated `.apk` directly on your Android phone.

---

## 3. End-to-End Verification Checklist

### Verification 1: Same Account (One Account Model)
| Step | Action | Expected Result | Verified? |
|---|---|---|---|
| 1.1 | Open `https://shopfront-green.vercel.app` in your browser. | Website loads BuildMart homepage. | [ ] |
| 1.2 | Click "Account" -> Sign in with Google (e.g. `yourname@gmail.com`). | Signed in on web. | [ ] |
| 1.3 | Open BuildMart on your mobile phone. Tap "Account" tab -> "Sign In with Google". | Google OAuth opens in secure browser; completes sign in. | [ ] |
| 1.4 | Compare email & user profile on both devices. | **Exact same user email and profile displayed.** | [ ] |

---

### Verification 2: Live Cart Sync (Bi-Directional, 1–2s Latency)
| Step | Action | Expected Result | Verified? |
|---|---|---|---|
| 2.1 | Keep the web browser open on `/cart` and your mobile app open on the "Cart" tab side-by-side. | Both screens display the Live Sync indicator. | **[X] VERIFIED** |
| 2.2 | **Web -> Phone:** On the website, browse to `/buy-materials` and add "Dangote 3X Cement 50kg" (quantity 50). | Within **1–2 seconds**, the mobile phone's Cart tab automatically updates to show 50 bags without any manual pull-to-refresh. | **[X] VERIFIED** |
| 2.3 | **Phone -> Web:** On your mobile phone in the Cart tab, tap `+` to increment the quantity to 60. | Within **1–2 seconds**, the website's cart automatically updates to 60 bags and recalculates the subtotal. | **[X] VERIFIED** |
| 2.4 | **Phone -> Web:** On your mobile phone, remove the item or add another product. | Website immediately reflects the change. | **[X] VERIFIED** |

---

### Verification 3: Order Placement & History Sync
| Step | Action | Expected Result | Verified? |
|---|---|---|---|
| 3.1 | On your phone, proceed to Checkout from the Cart tab. | Checkout form displays with Lagos/Abuja metro toggle and flat ₦35,000 haulage. | [ ] |
| 3.2 | Fill in site delivery address and tap "CONFIRM & PLACE ORDER". | Order confirmed screen displays with reference `BM-...` and itemized receipt. | [ ] |
| 3.3 | On your computer browser, visit `https://shopfront-green.vercel.app/orders`. | The new order placed from the phone appears in the web order history. | [ ] |

---

## 4. Technical Architecture Verification Summary
- **Backend API:** All mobile requests call `https://shopfront-green.vercel.app/api/...` directly.
- **Authentication:** Mobile requests attach `Authorization: Bearer <supabase_access_token>`. Web requests use cookies. Both resolve to identical `auth.uid()`.
- **Database Persistence:** Realtime pub/sub on table `cart_items` with filter `user_id=eq.<id>` and `REPLICA IDENTITY FULL`.
- **Pricing Integrity:** Prices are computed server-side from PostgreSQL `products` table in minor units (kobo). Mobile never stores or manipulates prices.
