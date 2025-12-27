import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Card } from '@/shared/ui';
import { User, updateUserRole, deleteUser } from '@/entities/user';

interface UsersTabProps {
  usersData: User[];
  setUsersData: (users: User[]) => void;
}

export default function UsersTab({ usersData, setUsersData }: UsersTabProps) {
  const handleToggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'viewer' : 'admin';
    const backendRole = newRole === 'admin' ? 'ROLE_WRITE' : 'ROLE_READ';

    Alert.alert(
      'Change Role',
      `Change ${user.name}'s role to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateUserRole(user.id, backendRole);
              setUsersData(
                usersData.map((u) =>
                  u.id === user.id ? { ...u, role: newRole } : u
                )
              );
              Alert.alert('Success', 'User role updated successfully');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to update user role');
            }
          },
        },
      ]
    );
  };

  const handleDelete = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete "${user.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user.id);
              setUsersData(usersData.filter((u) => u.id !== user.id));
              Alert.alert('Success', 'User deleted successfully');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }: { item: User }) => (
    <Card style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userId}>ID: {item.id}</Text>
        </View>
        <View
          style={[
            styles.roleBadge,
            item.role === 'admin' ? styles.roleAdmin : styles.roleViewer,
          ]}
        >
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleRole(item)}
        >
          <Text style={styles.actionText}>
            Change to {item.role === 'admin' ? 'Viewer' : 'Admin'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={usersData}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    gap: 12,
  },
  userCard: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleAdmin: {
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
  },
  roleViewer: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
});
