import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <View style={styles.container}>
      {activeTab === 'login' ? (
        <LoginScreen onSwitchToRegister={() => setActiveTab('register')} />
      ) : (
        <RegisterScreen onSwitchToLogin={() => setActiveTab('login')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
