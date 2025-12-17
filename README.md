 # Microservice Mobile App - Expo React Native

A fully functional Expo React Native mobile application converted from the React web application. This app provides sensor management, measurements tracking, and user administration with authentication.

## 🚀 Features

- **Authentication**: Login and Register with validation
- **Dashboard**: Multi-tab interface (Sensors, Measurements, Users)
- **Role-based Access Control**: Admin vs Viewer permissions
- **Sensor Management**: Create, update, delete sensors
- **Measurements Tracking**: Add and view sensor measurements
- **User Management**: Admin-only user role management
- **Cross-platform**: Works on iOS, Android, and Web

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: macOS with Xcode
- For Android: Android Studio with Android SDK

## 🛠️ Installation

1. **Clone or extract the project**
   ```bash
   cd expo-microservice-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Edit `src/utils/api.ts` and update the `API_BASE_URL`:
   ```typescript
   export const API_BASE_URL = 'http://your-backend-api.com';
   ```

   For local development:
   - iOS Simulator: `http://localhost:8080`
   - Android Emulator: `http://10.0.2.2:8080`
   - Physical Device: Use your computer's IP address (e.g., `http://192.168.1.100:8080`)

## 🏃 Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

This will open Expo DevTools in your browser. From there, you can:

### Run on iOS Simulator
```bash
npm run ios
```
*Note: Requires macOS with Xcode installed*

### Run on Android Emulator
```bash
npm run android
```
*Note: Requires Android Studio with an emulator set up*

### Run on Physical Device

1. Install **Expo Go** app on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code from the terminal with:
   - iOS: Camera app
   - Android: Expo Go app

### Run on Web Browser
```bash
npm run web
```

## 📱 Project Structure

```
expo-microservice-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── SensorsTab.tsx
│   │   ├── MeasurementsTab.tsx
│   │   └── UsersTab.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── navigation/          # Navigation types
│   │   └── types.ts
│   ├── screens/             # Main screens
│   │   ├── AuthScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── services/            # API services
│   │   ├── authService.ts
│   │   ├── sensorService.ts
│   │   ├── measurementService.ts
│   │   └── userService.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── utils/               # Utility functions
│       ├── api.ts
│       └── storage.ts
├── App.tsx                  # Main app entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Configuration

### Backend API

The app expects the following API endpoints:

**Authentication:**
- `POST /auth/authenticate` - Login
- `POST /auth/register` - Register

**Sensors:**
- `GET /api/sensors` - Get all sensors
- `POST /api/sensors` - Create sensor
- `PUT /api/sensors/:id` - Update sensor
- `DELETE /api/sensors/:id` - Delete sensor

**Measurements:**
- `GET /api/measurements` - Get all measurements
- `POST /api/measurements` - Create measurement
- `DELETE /api/measurements/:id` - Delete measurement

**Users (Admin only):**
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role/:role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Authentication

The app uses token-based authentication:
- Tokens are stored in AsyncStorage
- Tokens are sent in the `Authorization` header as `Bearer <token>`
- Admin status is stored separately in AsyncStorage

## 🎨 Styling

The app uses:
- React Native StyleSheet for component styling
- LinearGradient for background effects
- Custom color scheme matching the original web app:
  - Primary: Purple (#a855f7)
  - Secondary: Pink (#ec4899)
  - Accent: Orange (#f97316)

## 📦 Dependencies

### Core Dependencies
- `expo` - Expo SDK
- `react` - React library
- `react-native` - React Native framework
- `@react-navigation/native` - Navigation library
- `@react-navigation/native-stack` - Stack navigator
- `@react-native-async-storage/async-storage` - Local storage
- `expo-linear-gradient` - Gradient backgrounds
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screen optimization
- `react-native-reanimated` - Animations

## 🔄 Migration from Web to Mobile

### Key Changes

1. **HTML Elements → React Native Components**
   - `<div>` → `<View>`
   - `<span>`, `<p>`, `<h1>` → `<Text>`
   - `<button>` → `<TouchableOpacity>` or `<Pressable>`
   - `<input>` → `<TextInput>`

2. **CSS → StyleSheet**
   - Tailwind CSS classes → StyleSheet.create()
   - Flexbox by default (no need to specify `display: flex`)
   - No CSS units (use numbers for dimensions)

3. **Storage**
   - `sessionStorage` → `AsyncStorage`
   - Asynchronous API (requires `await`)

4. **Navigation**
   - React Router → React Navigation
   - Stack-based navigation for mobile

5. **Animations**
   - Motion library → React Native Animated API
   - Simplified animations for mobile performance

6. **Icons**
   - Lucide React icons → Emoji or React Native Vector Icons
   - Used emojis for simplicity

7. **Notifications**
   - Sonner toasts → React Native Alert API
   - Native alert dialogs

8. **Forms**
   - Radix UI components → Custom React Native components
   - Native input handling

## 🐛 Troubleshooting

### Common Issues

**1. Metro bundler cache issues**
```bash
expo start --clear
```

**2. Cannot connect to backend**
- Check API_BASE_URL in `src/utils/api.ts`
- Ensure backend is running and accessible
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, `localhost` should work
- For physical devices, use your computer's IP address

**3. AsyncStorage errors**
```bash
npm install @react-native-async-storage/async-storage
npx expo install @react-native-async-storage/async-storage
```

**4. Navigation errors**
Make sure all navigation dependencies are installed:
```bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

## 📝 Development Notes

### Adding New Features

1. **New Screen**: Create in `src/screens/`
2. **New Component**: Create in `src/components/`
3. **New Service**: Create in `src/services/`
4. **New Type**: Add to `src/types/index.ts`

### Testing

- Test on both iOS and Android
- Test with different screen sizes
- Test network error handling
- Test authentication flow
- Test role-based access control

## 🚢 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

For more details, see [Expo Build Documentation](https://docs.expo.dev/build/introduction/).

## 📄 License

This project is converted from the original React web application.

## 🤝 Contributing

When contributing, please:
1. Follow the existing code style
2. Test on both iOS and Android
3. Update documentation as needed
4. Ensure TypeScript types are properly defined

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Expo documentation: https://docs.expo.dev/
3. Review React Native documentation: https://reactnative.dev/

---

**Note**: This is a mobile conversion of the original React web application. Some features may behave differently due to platform constraints and mobile UX best practices.
