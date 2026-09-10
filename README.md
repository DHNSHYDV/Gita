# 🕉️ Gita – Timeless Wisdom for a Better You

[![Android Version](https://img.shields.io/badge/Android-10%20to%2015%20(API%2023--35)-brightgreen.svg)](https://developer.android.com)
[![Platform](https://img.shields.io/badge/Platform-Capacitor%20%7C%20React%20%7C%20Android-blue.svg)](https://capacitorjs.com)
[![Languages](https://img.shields.io/badge/Languages-Telugu%20%7C%20English%20%7C%20Hindi%20%7C%20Tamil%20%7C%20Kannada-orange.svg)](#multi-language-support)
[![Release](https://img.shields.io/badge/Release-v1.0.0-gold.svg)](https://github.com/dhnshydv/Gita/releases)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A sacred, serene, and beautifully crafted mobile application for **Shreemad Bhagavad Gita**, designed specifically for Google Play Store. Featuring full support for 5 languages (**Telugu, English, Hindi, Tamil, Kannada**), audio chanting recitation, 100% offline verse reading, and a distraction-free spiritual reading experience.

---

## 📱 App Highlights & Features

### 1. 8 Pixel-Perfect Screens
1. **Splash / Welcome:** Full-bleed celestial artwork of Lord Krishna & Arjuna on the golden chariot overlooking Kurukshetra at sunset, with the sacred motto *"धर्मो रक्षति रक्षितः ।"* and *"Begin the Journey →"*.
2. **Home Screen:** Warm glowing **Daily Wisdom Quote card**, **"Continue Reading"** card (resumes exactly where you left off), 2x2 chapter preview grid, and bottom navigation.
3. **Chapter List (All 18 Chapters):** Numbered ivory badge cards with chapter names, English titles, and shloka counts (47 to 78 shlokas).
4. **Shloka Reading Screen:**
   - Shloka carousel stepper (`< శ్లోకం 47 / 72 >`).
   - Sacred Sanskrit shloka rendered in chosen native script (Telugu, Devanagari, Tamil, Kannada, Roman transliteration).
   - **Audio Chanting Player:** Sacred bell chime and clear recitation.
   - **Interactive Action Bar:** Audio Play/Stop, One-tap Bookmarks, Share verse, and Text Size adjustment (Small, Medium, Large).
   - **భావార్థం (Word Translation / Meaning)**.
   - **సారాంశం (Philosophical Essence / Purport)**.
   - Floating Previous & Next navigation buttons.
5. **Language & Display Settings:**
   - One-tap language switcher: **Telugu (తెలుగు), English, Hindi (हिंदी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ)**.
   - Reading font size controls (**A / A / A**).
   - Theme mode (**Light / Dark / System**).
   - Daily Verse notification toggle.
6. **Bookmarks Screen:** Instant access to saved verses (pre-loaded with iconic verses *2.47, 4.7, 12.13, 18.66*).
7. **Daily Verse Story Screen:** Full-bleed celestial painting of Lord Krishna playing the golden murali (flute) amongst glowing clouds, with inspiring daily quote, *"Read in Context →"*, and Share actions.
8. **More / Profile Screen:** Devotional profile card (*"Seek. Learn. Live."*), reading history, about Gita info, and Google Play Store review link.

---

## 🌐 Multi-Language Support (5 Languages)

Every screen, navigation label, chapter title, verse shloka, translation (**భావార్థం**), and philosophical commentary (**సారాంశం**) is translated and available across 5 languages:
- **Telugu (తెలుగు)** (Default)
- **English**
- **Hindi (हिंदी)**
- **Tamil (தமிழ்)**
- **Kannada (ಕನ್ನಡ)**

All translations and verses are packaged locally inside the app and function **100% offline without requiring internet connectivity**.

---

## 🛡️ Android Compatibility & Play Protect Verification

- **Minimum SDK:** API 23 (Android 6.0 Marshmallow) — **Fully supports Android 10, 11, 12, 13, 14, and 15!**
- **Target SDK:** API 34 / 35 (Latest Android)
- **Zero Security Warnings:**
  - Packaged and signed with standard release keystore (RSA 2048-bit).
  - Signed with both **v1 (JAR signature)** and **v2 (APK Signature Scheme)** to pass Android 11+ and Google Play Protect verification seamlessly without "Unrecognized app" warnings.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Mobile Runtime:** Capacitor 7 (`@capacitor/core`, `@capacitor/android`).
- **Typography:** Google Fonts (`Cinzel`, `Cormorant Garamond`, `Noto Sans Telugu`, `Noto Sans Devanagari`, `Noto Sans Tamil`, `Noto Sans Kannada`).
- **Audio Engine:** Web Audio API (Sacred Temple Bell) + Web Speech Synthesis (Shloka chanting).
- **Build System:** Vite 6 + Android Gradle 8.11.1 (Java 17).

---

## 🚀 Development & Build Instructions

### Prerequisites
- Node.js (v18 or v20+)
- Java JDK 17 (Amazon Corretto or OpenJDK)
- Android SDK (API 34+)

### Run Locally (Web Preview)
```bash
# Install dependencies
npm install

# Start local dev preview
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Compile Android APK
```bash
# 1. Build web assets & sync to Android
npm run build
npx cap sync android

# 2. Compile release APK with Gradle
cd android
./gradlew assembleRelease
```
The compiled APK will be output to:
`android/app/build/outputs/apk/release/app-release.apk`

---

## 📦 Google Play Store Submission (AAB)

To generate an **Android App Bundle (.aab)** for Google Play Console:
```bash
cd android
./gradlew bundleRelease
```
The `.aab` file will be generated at:
`android/app/build/outputs/bundle/release/app-release.aab`

---

## 📜 Sacred Quote

> **कर्मण्येवाधिकारस्ते मा फలేషు कदाचन ।**  
> **మా కర్మఫలహేతుర్భూర్మాతే సంగోఽస్త్వకర్మణి ॥ २.४७ ॥**  
> *"You have a right to perform your prescribed duty, but never to the fruits of action."*
