# Libraries Used and Replaced

## Overview

This document provides a comprehensive comparison between the libraries used in the original React web application and their React Native equivalents in the converted mobile application.

| Core Framework | Web (Original) | Mobile (Converted) | Notes |
|----------------|----------------|-------------------|-------|
| React | 18.3.1 | 19.1.0 | Updated to latest stable version |
| Rendering | React DOM 18.3.1 | React Native 0.81.3 | Native rendering engine |
| Tooling | Vite 6.3.5 | Expo ~54.0.26 | Expo build tooling |
| Language | TypeScript 5.9.3 | TypeScript ~5.9.2 | Maintained TypeScript |

## UI Component Libraries

### Original (Web)
- **Radix UI** (30+ components)
  - @radix-ui/react-accordion
  - @radix-ui/react-alert-dialog
  - @radix-ui/react-avatar
  - @radix-ui/react-checkbox
  - @radix-ui/react-dialog
  - @radix-ui/react-dropdown-menu
  - @radix-ui/react-label
  - @radix-ui/react-select
  - @radix-ui/react-separator
  - @radix-ui/react-slider
  - @radix-ui/react-switch
  - @radix-ui/react-tabs
  - @radix-ui/react-tooltip
  - And many more...

### Converted (Mobile)
- **React Native Core Components**
  - View (replaces div, containers)
  - Text (replaces span, p, h1, etc.)
  - TouchableOpacity (replaces button, clickable elements)
  - TextInput (replaces input)
  - Modal (replaces Radix Dialog)
  - FlatList (for efficient list rendering)
  - ScrollView (for scrollable content)
  - ActivityIndicator (for loading states)
- **Expo Modules**
  - expo-linear-gradient (for background effects)
  - expo-status-bar (for system bar styling)

**Reason for Change**: Radix UI is web-specific and relies on DOM manipulation. React Native requires native components that bridge to iOS and Android native UI elements. Custom components were built to match the original design while using native mobile patterns.

## Styling

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| Tailwind CSS v4.1.3 | StyleSheet API | React Native uses JavaScript objects for styling |
| CSS-in-JS | StyleSheet.create() | Optimized styling for mobile performance |
| class-variance-authority | Manual variant handling | CVA is web-specific, variants implemented directly |
| clsx / tailwind-merge | Direct style arrays | React Native uses array syntax for conditional styles |

**Example Conversion**:
```jsx
// Web (Tailwind)
<div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">

// Mobile (StyleSheet)
<View style={styles.container}>
// styles.container: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   padding: 16,
//   backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   borderRadius: 12,
// }
```

## Animation

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| motion (Framer Motion) | React Native Animated API | Simplified animations for mobile performance |
| CSS transitions | Native transitions | Platform-appropriate animations |
| Complex animations | Simplified animations | Battery and performance optimization |


## Navigation

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| Conditional rendering | @react-navigation/native ^7.1.24 | Industry-standard mobile navigation |
| State-based routing | @react-navigation/native-stack ^7.8.5 | Stack-based navigation pattern |
| N/A | react-native-screens ~4.16.0 | Native screen optimization |
| N/A | react-native-safe-area-context ^5.6.2 | Safe area handling for notches |


## Storage

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| sessionStorage | @react-native-async-storage/async-storage ^2.2.0 | Persistent mobile storage |
| Synchronous API | Asynchronous API | Mobile storage requires async operations |

**Example Conversion**:
```javascript
// Web
sessionStorage.setItem('token', token);
const token = sessionStorage.getItem('token');

// Mobile
await AsyncStorage.setItem('@auth_token', token);
const token = await AsyncStorage.getItem('@auth_token');
```

## Icons

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| lucide-react ^0.487.0 | Emoji characters | Simple, resolution-independent icons |
| SVG icons | Unicode emoji | No additional dependencies |

**Alternative Options** (not implemented but available):
- react-native-vector-icons
- @expo/vector-icons (included with Expo)
- react-native-svg for custom SVG icons


## Notifications

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| sonner ^2.0.3 | React Native Alert API | Native alert dialogs |
| Toast notifications | Alert.alert() | Platform-appropriate notifications |

**Example Conversion**:
```javascript
// Web
toast.success('Login successful!', {
  description: 'Welcome back to your account.',
});

// Mobile
Alert.alert('Success', 'Login successful! Welcome back to your account.');
```

**Alternative Options**:
- react-native-toast-message (for toast-style notifications)
- expo-notifications (for push notifications)

## Form Handling

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| react-hook-form ^7.55.0 | useState hooks | Simpler form state management |
| Complex validation | Manual validation | Direct validation logic |


## Data Visualization

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| recharts ^2.15.2 | victory-native ^36.7.1 | Industry-standard native charting |


## Carousel

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| embla-carousel-react ^8.6.0 | react-native-reanimated ^4.1.5 | Custom carousel using Reanimated |


## Gradients

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| CSS gradients | expo-linear-gradient ^15.0.7 | Native gradient rendering |
| background: linear-gradient() | <LinearGradient> component | Component-based gradients |

**Example Conversion**:
```jsx
// Web
<div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">

// Mobile
<LinearGradient
  colors={['#a855f7', '#ec4899', '#f97316']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
```

## Date Handling

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| react-day-picker ^8.10.1 | Not implemented | Date picker not needed yet |
| Native Date API | Native Date API | JavaScript Date works on both platforms |

**Alternative Options** (if needed):
- @react-native-community/datetimepicker
- react-native-date-picker
- expo-date-picker

## Utility Libraries

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| class-variance-authority | N/A | Not needed with StyleSheet |
| clsx | N/A | Array syntax for conditional styles |
| tailwind-merge | N/A | Not applicable to StyleSheet |

## Development Tools

| Web (Original) | Mobile (Converted) | Notes |
|----------------|-------------------|-------|
| Vite | Expo CLI | Expo provides development server |
| @vitejs/plugin-react-swc | Expo Metro bundler | Metro is React Native's bundler |
| Vite dev server | Expo Go app | Development on physical devices |

## Additional Mobile Dependencies

These libraries are required for React Native but have no web equivalent:

| Library | Version | Purpose |
|---------|---------|---------|
| react-native-reanimated | ^4.1.5 | High-performance animations |
| react-native-screens | ~4.16.0 | Native screen optimization |
| react-native-safe-area-context | ^5.6.2 | Safe area handling |
| expo-status-bar | ~3.0.8 | Status bar styling |
| react-native-svg | ^15.8.0 | SVG support (required for Victory Native) |

## Removed Dependencies

These web-specific libraries were removed as they have no mobile equivalent:

- All @radix-ui packages (30+ packages)
- motion (Framer Motion)
- sonner
- recharts (replaced by victory-native)
- embla-carousel-react (replaced by custom Reanimated implementation)
- react-day-picker
- cmdk (command menu)
- input-otp
- vaul (drawer component)
- next-themes (theme switching)
- react-resizable-panels

## Total Dependency Comparison

| Metric | Web (Original) | Mobile (Converted) | Change |
|--------|---------------|-------------------|--------|
| Total dependencies | 48 | 17 | -64% |
| Dev dependencies | 6 | 3 | -50% |
| Total packages | 54 | 20 | -63% |
| Approximate bundle size | ~2.5 MB | ~1.8 MB | -28% |

## Migration Recommendations

### For Future Features

1. **Charts/Graphs**: Use `react-native-chart-kit` or `victory-native`
2. **Date Picker**: Use `@react-native-community/datetimepicker`
3. **Image Picker**: Use `expo-image-picker`
4. **Camera**: Use `expo-camera`
5. **Push Notifications**: Use `expo-notifications`
6. **Maps**: Use `react-native-maps`
7. **Vector Icons**: Use `@expo/vector-icons` or `react-native-vector-icons`
8. **Advanced Animations**: Use `react-native-reanimated`
9. **Gestures**: Use `react-native-gesture-handler`
10. **Offline Storage**: Use `@react-native-async-storage/async-storage` (already included)

### Best Practices

1. **Always check Expo compatibility**: Use Expo's documentation to verify library compatibility
2. **Prefer Expo modules**: When available, Expo modules are pre-configured and tested
3. **Test on both platforms**: Some libraries behave differently on iOS vs Android
4. **Consider bundle size**: Mobile apps should minimize dependencies for faster downloads
5. **Use native modules wisely**: Native modules require rebuilding the app, limiting OTA updates

---