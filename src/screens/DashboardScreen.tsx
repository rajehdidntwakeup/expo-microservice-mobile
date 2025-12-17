import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Sensor, UserData } from '../types';
import * as SensorService from '../services/sensorService';
import * as UserService from '../services/userService';
import SensorsTab from '../components/SensorsTab';
import MeasurementsTab from '../components/MeasurementsTab';
import UsersTab from '../components/UsersTab';
import Card from '../components/Card';

type MenuItem = 'sensors' | 'measurements' | 'users';

export default function DashboardScreen() {
  const { username, isAdmin, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('sensors');
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [usersData, setUsersData] = useState<UserData[]>([]);

  useEffect(() => {
    loadSensors();
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadSensors = async () => {
    try {
      const data = await SensorService.getSensors();
      setSensors(data);
    } catch (err: any) {
      console.error('Error fetching sensors', err);
      Alert.alert('Error', 'Could not load sensors from server');
    }
  };

  const loadUsers = async () => {
    try {
      const data = await UserService.getUsers();
      setUsersData(data);
    } catch (err: any) {
      console.error('Error fetching users', err);
      Alert.alert('Error', 'Could not load users from server');
    }
  };

  const currentUser = usersData.find((u) => u.name === username);
  const canWrite = useMemo(
    () => isAdmin || currentUser?.role === 'admin',
    [isAdmin, currentUser?.role]
  );

  const menuItems = useMemo(
    () => [
      { id: 'sensors' as MenuItem, label: 'Sensors', icon: '📊' },
      { id: 'measurements' as MenuItem, label: 'Measurements', icon: '📈' },
      ...(canWrite ? [{ id: 'users' as MenuItem, label: 'Users', icon: '👥' }] : []),
    ],
    [canWrite]
  );

  useEffect(() => {
    if (activeMenu === 'users' && !canWrite) {
      setActiveMenu('sensors');
    }
  }, [activeMenu, canWrite]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const renderContent = () => {
    if (activeMenu === 'sensors') {
      return (
        <SensorsTab
          sensors={sensors}
          onSensorsChange={setSensors}
          canWrite={canWrite}
        />
      );
    }

    if (activeMenu === 'measurements') {
      return <MeasurementsTab sensors={sensors} canWrite={canWrite} />;
    }

    if (activeMenu === 'users') {
      return <UsersTab usersData={usersData} setUsersData={setUsersData} />;
    }

    return null;
  };

  return (
    <LinearGradient
      colors={['#a855f7', '#ec4899', '#f97316']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome, {username}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.tab, activeMenu === item.id && styles.tabActive]}
                onPress={() => setActiveMenu(item.id)}
              >
                <Text style={styles.tabIcon}>{item.icon}</Text>
                <Text
                  style={[styles.tabText, activeMenu === item.id && styles.tabTextActive]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        {/* Avoid nesting VirtualizedLists (FlatList/SectionList) inside a vertical ScrollView */}
        <View style={[styles.content, styles.contentContainer]}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  tabIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
});
