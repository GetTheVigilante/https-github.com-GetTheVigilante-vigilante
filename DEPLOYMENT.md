# The Vigilante — Deployment Guide

## www.getvigilante.com

This guide covers deploying The Vigilante to your domain **www.getvigilante.com** and submitting to the **Apple App Store** and **Google Play Store**.

---

## Table of Contents

1. [Deploy to getvigilante.com (Web)](#1-deploy-to-getvigilantecom-web)
2. [Submit to Apple App Store (iOS)](#2-submit-to-apple-app-store-ios)
3. [Submit to Google Play Store (Android)](#3-submit-to-google-play-store-android)
4. [Generate App Icons](#4-generate-app-icons)
5. [Environment Variables](#5-environment-variables)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Deploy to getvigilante.com (Web)

You have **three hosting options**. We recommend **Vercel** for the easiest setup.

### Option A: Vercel (Recommended)

**Step 1: Create a Vercel Account**
1. Go to [vercel.com](https://vercel.com) and sign up (free tier works)
2. Connect your GitHub/GitLab account

**Step 2: Import Your Project**
1. Push this codebase to a GitHub repository
2. In Vercel dashboard, click **"Add New Project"**
3. Select your repository
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Wait for the build to complete (~1-2 minutes)

**Step 3: Connect Your Domain**
1. In your Vercel project, go to **Settings → Domains**
2. Add `getvigilante.com` and `www.getvigilante.com`
3. Vercel will show you DNS records to add
4. Go to your domain registrar (where you bought getvigilante.com)
5. Add these DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

6. Wait for DNS propagation (usually 5-30 minutes, up to 48 hours)
7. Vercel automatically provisions an SSL certificate (HTTPS)

**Step 4: Verify**
- Visit https://www.getvigilante.com — your site should be live!
- Vercel auto-deploys on every push to your main branch

---

### Option B: Netlify

**Step 1: Create a Netlify Account**
1. Go to [netlify.com](https://netlify.com) and sign up
2. Connect your GitHub account

**Step 2: Deploy**
1. Click **"Add new site" → "Import an existing project"**
2. Select your repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **"Deploy site"**

**Step 3: Connect Domain**
1. Go to **Domain settings → Add custom domain**
2. Add `getvigilante.com`
3. Add these DNS records at your registrar:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

---

### Option C: Manual Deploy (Any Static Host)

```bash
# Build the project
npm install
npm run build

# The 'dist' folder contains your production files
# Upload the contents of 'dist' to any static hosting:
# - AWS S3 + CloudFront
# - Google Cloud Storage
# - DigitalOcean Spaces
# - Firebase Hosting
# - Cloudflare Pages
```

---

## 2. Submit to Apple App Store (iOS)

### Prerequisites
- A Mac computer (required for Xcode)
- [Apple Developer Account](https://developer.apple.com) ($99/year)
- Xcode installed from the Mac App Store
- Node.js 18+ installed

### Step 1: Install Capacitor

```bash
# Install dependencies (Capacitor is already in package.json)
npm install

# Add iOS platform
npm run cap:add:ios

# Build the web app and sync to iOS
npm run build:ios
```

### Step 2: Configure in Xcode

The `npm run build:ios` command will open Xcode. In Xcode:

1. **Select your team**: Go to the project settings → Signing & Capabilities
2. **Set your Team** to your Apple Developer account
3. **Bundle Identifier**: Should be `com.getvigilante.app`
4. **Deployment Target**: Set to iOS 16.0 or higher
5. **App Icons**: Add your app icons (see Section 4)

### Step 3: Add App Icons

In Xcode, navigate to `ios/App/App/Assets.xcassets/AppIcon.appiconset/` and add icons in these sizes:
- 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180, 1024x1024

### Step 4: Add Splash Screen

Edit `ios/App/App/Assets.xcassets/Splash.imageset/` with your splash screen image.

### Step 5: Test on Simulator

1. In Xcode, select an iPhone simulator (e.g., iPhone 15 Pro)
2. Click the **Play** button to build and run
3. Test all features thoroughly

### Step 6: Test on Real Device

1. Connect your iPhone via USB
2. Select your device in Xcode
3. Click Play to install and test

### Step 7: Archive and Upload

1. In Xcode, select **Product → Archive**
2. Once archived, click **Distribute App**
3. Select **App Store Connect**
4. Follow the prompts to upload

### Step 8: App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click **My Apps → + → New App**
3. Fill in the details:

```
App Name: The Vigilante
Bundle ID: com.getvigilante.app
SKU: vigilante-app-001
Primary Language: English (U.S.)
```

4. **App Information**:
   - Category: Utilities
   - Subcategory: Security (or Lifestyle → Family)
   - Content Rights: Does not contain third-party content
   - Age Rating: 4+ (no objectionable content)

5. **App Privacy**:
   - Data collected: Email address (for account), Usage data (for analytics)
   - Link to privacy policy: https://www.getvigilante.com/privacy

6. **Screenshots** (required):
   - 6.7" (iPhone 15 Pro Max): 1290 x 2796 px
   - 6.5" (iPhone 14 Plus): 1284 x 2778 px
   - 5.5" (iPhone 8 Plus): 1242 x 2208 px
   - 12.9" iPad Pro: 2048 x 2732 px

7. **Description**:
```
The Vigilante — AI-Powered Scam Protection for Your Entire Family

Protect yourself and your loved ones from scams with cutting-edge AI technology.

FEATURES:
• AI Scam Checker — Paste any suspicious message for instant AI analysis
• Email Guardian — Scan your inbox for phishing and fraud
• SMS Guardian — Forward suspicious texts for real-time threat detection
• Call Guardian — AI-powered call screening and scam blocking
• Child Shield — Protect your children from online predators and scams
• Device Shield — End-to-end encrypted scanning across all messaging apps
• Community Scam Map — See scams reported in your area in real-time
• Scam Quiz — Test and improve your scam detection skills

WHY THE VIGILANTE?
→ Real-time AI protection across email, text, calls, and devices
→ Family-wide protection for seniors AND children
→ Privacy-first: on-device AI preserves your encryption
→ Community-powered scam reporting and alerts
→ Free to use with premium features available

Join 2.8M+ families already protected by The Vigilante.
```

8. **Keywords**: scam protection, AI security, phishing detector, call blocker, email scanner, fraud prevention, family safety, child protection, elder fraud, identity theft

9. **Submit for Review** — Apple typically reviews within 24-48 hours

### Step 9: After Approval

Once approved, update `index.html` to uncomment the Smart App Banner:
```html
<meta name="apple-itunes-app" content="app-id=YOUR_APP_STORE_ID, app-argument=https://www.getvigilante.com" />
```

---

## 3. Submit to Google Play Store (Android)

### Prerequisites
- [Google Play Developer Account](https://play.google.com/console) ($25 one-time fee)
- Android Studio installed
- Java JDK 17+ installed

### Step 1: Add Android Platform

```bash
# Add Android platform
npm run cap:add:android

# Build and open in Android Studio
npm run build:android
```

### Step 2: Configure in Android Studio

1. Open the project in Android Studio
2. Go to **File → Project Structure**
3. Set **Compile SDK** to 34
4. Set **Min SDK** to 24 (Android 7.0)
5. Set **Target SDK** to 34

### Step 3: Update Android Manifest

In `android/app/src/main/AndroidManifest.xml`, ensure permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### Step 4: Add App Icons

Place your icons in:
- `android/app/src/main/res/mipmap-mdpi/` (48x48)
- `android/app/src/main/res/mipmap-hdpi/` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/` (192x192)

### Step 5: Generate Signed APK/AAB

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle (AAB)** (required by Google Play)
3. Create a new keystore or use existing
4. **IMPORTANT**: Save your keystore file and passwords securely!

### Step 6: Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. Click **Create app**
3. Fill in details:

```
App name: The Vigilante
Default language: English (United States)
App or game: App
Free or paid: Free
```

4. Complete the **Dashboard checklist**:
   - App access: All functionality available without restrictions
   - Ads: Does not contain ads
   - Content rating: Complete the questionnaire
   - Target audience: 13+ (general audience)
   - News app: No
   - Data safety: Complete the form

5. **Store listing**:
   - Short description (80 chars): "AI-powered scam protection for your entire family"
   - Full description: (same as App Store description above)
   - Screenshots: Phone (1080x1920), 7" tablet, 10" tablet
   - Feature graphic: 1024x500 px
   - App icon: 512x512 px

6. Upload your AAB file in **Production → Create new release**

7. **Submit for review** — Google typically reviews within 1-3 days

### Step 7: Update Asset Links

After publishing, update `public/.well-known/assetlinks.json` with your actual SHA256 fingerprint:
```bash
# Get your fingerprint from your keystore
keytool -list -v -keystore your-keystore.jks -alias your-alias
```

---

## 4. Generate App Icons

You need icons in multiple sizes. Use one of these tools:

### Option A: Online Generator (Easiest)
1. Go to [icon.kitchen](https://icon.kitchen) or [appicon.co](https://appicon.co)
2. Upload your 1024x1024 source icon
3. Download the generated icon set
4. Place files in the appropriate directories

### Option B: Using the Favicon SVG
The project includes `/public/favicon.svg`. Convert it to PNG at various sizes:

```bash
# Using ImageMagick (if installed)
for size in 72 96 128 144 152 192 384 512 1024; do
  convert -background none -resize ${size}x${size} public/favicon.svg public/icon-${size}x${size}.png
done
```

### Required Icon Sizes
| Size | Purpose |
|------|---------|
| 16x16 | Browser favicon |
| 32x32 | Browser favicon |
| 72x72 | PWA / Android |
| 96x96 | PWA / Android |
| 128x128 | PWA |
| 144x144 | PWA / Android |
| 152x152 | iOS / PWA |
| 180x180 | Apple Touch Icon |
| 192x192 | PWA / Android |
| 384x384 | PWA |
| 512x512 | PWA / Android / Google Play |
| 1024x1024 | Apple App Store |

---

## 5. Environment Variables

For production, set these environment variables in your hosting platform:

| Variable | Description | Where to Set |
|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Vercel/Netlify env vars |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Vercel/Netlify env vars |

Currently, the Supabase credentials are hardcoded in `src/lib/supabase.ts`. For better security in production, update to use environment variables:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dbzyvxnlqjbuygtvhizq.databasepad.com';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
```

---

## 6. Troubleshooting

### Website Issues

**404 on page refresh (Vercel)**
- Ensure `vercel.json` has the rewrite rule (already configured)

**404 on page refresh (Netlify)**
- Ensure `netlify.toml` and `public/_redirects` exist (already configured)

**DNS not propagating**
- Use [dnschecker.org](https://dnschecker.org) to check propagation status
- Clear your browser cache or try incognito mode
- Wait up to 48 hours for full propagation

**SSL certificate not working**
- Vercel/Netlify auto-provision SSL — wait 10-15 minutes after DNS setup
- Ensure your domain points to the correct servers

### iOS Issues

**Build fails in Xcode**
```bash
# Clean and rebuild
cd ios/App
pod install
cd ../..
npm run build:ios
```

**App rejected by Apple**
- Common reasons: missing privacy policy, crash on launch, incomplete features
- Ensure all links work and all features are functional
- Add a privacy policy page to your website

### Android Issues

**Build fails in Android Studio**
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run build:android
```

**App rejected by Google**
- Common reasons: misleading description, policy violations
- Ensure your app description accurately reflects functionality
- Complete all data safety declarations

---

## Quick Start Checklist

### Website Deployment
- [ ] Push code to GitHub
- [ ] Create Vercel account and import project
- [ ] Add domain `getvigilante.com` in Vercel
- [ ] Update DNS records at your registrar
- [ ] Verify site loads at https://www.getvigilante.com
- [ ] Test all features on the live site
- [ ] Submit sitemap to Google Search Console

### iOS App Store
- [ ] Install Xcode on Mac
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Run `npm run build:ios`
- [ ] Configure signing in Xcode
- [ ] Add app icons and splash screen
- [ ] Test on simulator and real device
- [ ] Archive and upload to App Store Connect
- [ ] Fill in App Store listing details
- [ ] Submit for review

### Google Play Store
- [ ] Install Android Studio
- [ ] Create Google Play Developer account ($25)
- [ ] Run `npm run build:android`
- [ ] Generate signed AAB
- [ ] Create app listing in Google Play Console
- [ ] Upload AAB and fill in store listing
- [ ] Complete content rating and data safety
- [ ] Submit for review

---

## Support

If you run into any issues, the key files for deployment are:

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel hosting configuration |
| `netlify.toml` | Netlify hosting configuration |
| `capacitor.config.ts` | iOS/Android native app configuration |
| `public/manifest.json` | PWA manifest for installability |
| `public/sw.js` | Service worker for offline support |
| `public/robots.txt` | Search engine crawling rules |
| `public/sitemap.xml` | Search engine sitemap |
| `index.html` | SEO meta tags and structured data |

Happy deploying! Your app is ready for the world. 🛡️
