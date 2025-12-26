import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  IS_ADMIN: '@is_admin',
  USERNAME: '@username',
};

export const storage = {
  // Token management
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // Admin flag management
  async getIsAdmin(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_ADMIN);
      return value === 'true' || value === '1' || value === 'yes';
    } catch (error) {
      console.error('Error getting isAdmin:', error);
      return false;
    }
  },

  async setIsAdmin(isAdmin: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin.toString());
    } catch (error) {
      console.error('Error setting isAdmin:', error);
    }
  },

  async removeIsAdmin(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    } catch (error) {
      console.error('Error removing isAdmin:', error);
    }
  },

  // Username management
  async getUsername(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  },

  async setUsername(username: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
    } catch (error) {
      console.error('Error setting username:', error);
    }
  },

  async removeUsername(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USERNAME);
    } catch (error) {
      console.error('Error removing username:', error);
    }
  },

  // Clear all storage
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.IS_ADMIN,
        STORAGE_KEYS.USERNAME,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
