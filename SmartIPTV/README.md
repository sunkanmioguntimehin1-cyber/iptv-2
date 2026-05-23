# SmartIPTV

A Smart TV IPTV streaming application built with Expo SDK 55.

## Prerequisites

- **Node.js** (v18+) and npm or yarn
- **Expo CLI** (`npx expo-cli` or `npm i -g expo-cli`)
- **EAS CLI** (`npm i -g eas-cli`)
- iOS: Xcode and CocoaPods
- Android: Android Studio or command-line tools

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd SmartIPTV

# Install dependencies
npm install
# or
yarn install
```

## Development

### Quick Start

Start the Metro bundler:

```bash
npx expo start
```

Then press:
- `i` - Open iOS simulator
- `a` - Open Android emulator
- `w` - Open web browser
- `s` - open expo go

### Platform-Specific

```bash
# iOS
npx expo start --ios

# Android
npx expo start --android
```

## Local Development Builds

This project uses `expo-dev-client` for testing native modules locally. Generate a development build:

### iOS

```bash
npx expo run:ios
```

### Android

```bash
npx expo run:android
```

## EAS Build Commands

Configure EAS if not already logged in:

```bash
eas login
eas build:configure
```

### Development Build (Internal Testing)

```bash
# iOS Simulator
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

### Preview Build (APK for Android)

```bash
eas build --profile preview --platform android
```

### Production Build

```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

### Submit to App Stores

```bash
eas submit --platform ios
eas submit --platform android
```

## Deep Linking

The app uses the custom URL scheme: `smartiptv://`

## Project Structure

```
SmartIPTV/
├── src/
│   ├── app/              # Expo Router pages (file-based routing)
│   │   ├── (auth)/       # Authentication screens
│   │   └── (main)/       # Main app screens
│   ├── components/       # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service functions
│   ├── store/             # Zustand state stores
│   ├── api/               # API client configuration
│   └── mocks/             # Mock data for development
├── assets/                # Static assets (icons, splash)
├── app.json               # Expo configuration
├── eas.json               # EAS build configuration
└── package.json
```

## Tech Stack

- **Expo SDK 55** with expo-router
- **React Native** 0.83.4
- **NativeWind** (Tailwind CSS) for styling
- **Zustand** for state management
- **TanStack Query** for data fetching
- **React Hook Form** for form handling
- **Axios** for HTTP requests
- **Expo Updates** for over-the-air updates

## Troubleshooting

### Metro Cache Issues

```bash
npx expo start --clear
```

### iOS Pod Installation Issues

```bash
cd ios
pod install
cd ..
```

### Android Build Issues

```bash
npx expo prebuild --platform android
cd android
./gradlew clean
```