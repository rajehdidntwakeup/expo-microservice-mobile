# Expo Microservice Mobile

A professional mobile application built with **Expo** and **React Native**, designed with a robust microservice-oriented architecture following the **Feature-Sliced Design (FSD)** methodology. This project is a high-performance mobile conversion of a comprehensive web application, optimized for both iOS and Android platforms.

## 🚀 Key Features

- **Authentication System**: Secure Login and Registration flows with persistent session management.
- **Real-time Dashboard**: Interactive dashboard for monitoring system metrics and status.
- **Sensor Data Management**: Comprehensive tracking and visualization of sensor measurements.
- **User Management**: Tools for managing user profiles and system access.
- **Data Visualization**: High-performance charts and graphs powered by `victory-native`.
- **Cross-Platform**: Fully optimized for iOS and Android using a single codebase.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54) & [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation v7](https://reactnavigation.org/)
- **State Management**: React Context API & Hooks
- **Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **Charts**: [Victory Native](https://formidable.com/open-source/victory-native/)
- **Styling**: React Native StyleSheet & [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 📂 Project Structure

The project follows the **Feature-Sliced Design (FSD)** architectural pattern:

```text
src/
├── app/          # App-wide setup: providers, navigation, global styles
├── pages/        # Composition of features into full screens (Auth, Dashboard)
├── widgets/      # Large independent UI components (UsersTab)
├── features/     # User interactions with business value (Auth logic)
├── entities/     # Business entities (User, Sensor, Measurement) with APIs and types
└── shared/       # Reusable UI components, utilities, and constants
```

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your physical device (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd expo-microservice-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:

```bash
npm start
```

From the Expo CLI menu, you can:
- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Press `w` for Web
- Scan the QR code with **Expo Go** (Android) or **Camera App** (iOS) to run on a physical device.

## 📜 Available Scripts

- `npm start`: Starts the Expo development server.
- `npm run android`: Opens the app on a connected Android device or emulator.
- `npm run ios`: Opens the app on an iOS simulator.
- `npm run web`: Opens the app in a web browser.

## 📘 Documentation

For a detailed comparison of the libraries used and the migration from the original web application, please refer to:
- [LIBRARIES_USED.md](./LIBRARIES_USED.md)

---
Developed with ❤️ for high-performance mobile experiences.
