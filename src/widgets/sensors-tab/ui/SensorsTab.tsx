import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Card, Button } from '@/shared/ui';
import { Sensor, SENSOR_TYPES, createSensor, updateSensor, deleteSensor } from '@/entities/sensor';

interface SensorsTabProps {
  sensors: Sensor[];
  onSensorsChange: (sensors: Sensor[]) => void;
  canWrite: boolean;
}

export default function SensorsTab({ sensors, onSensorsChange, canWrite }: SensorsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'outdoor', active: true });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Sensor name is required');
      return;
    }

    setLoading(true);
    try {
      const newSensor = await createSensor(formData);
      onSensorsChange([...sensors, newSensor]);
      setShowAddModal(false);
      setFormData({ name: '', type: 'outdoor', active: true });
      Alert.alert('Success', 'Sensor created successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingSensor || !formData.name.trim()) {
      Alert.alert('Error', 'Sensor name is required');
      return;
    }

    setLoading(true);
    try {
      const updated = await updateSensor(editingSensor.id, formData);
      onSensorsChange(sensors.map((s) => (s.id === updated.id ? updated : s)));
      setEditingSensor(null);
      setFormData({ name: '', type: 'outdoor', active: true });
      Alert.alert('Success', 'Sensor updated successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update sensor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (sensor: Sensor) => {
    Alert.alert('Delete Sensor', `Are you sure you want to delete "${sensor.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSensor(sensor.id);
            onSensorsChange(sensors.filter((s) => s.id !== sensor.id));
            Alert.alert('Success', 'Sensor deleted successfully');
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete sensor');
          }
        },
      },
    ]);
  };

  const openEditModal = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setFormData({
      name: sensor.name,
      type: sensor.type,
      active: sensor.status === 'active',
    });
  };

  const renderSensor = ({ item }: { item: Sensor }) => (
    <Card style={styles.sensorCard}>
      <View style={styles.sensorHeader}>
        <View style={styles.sensorInfo}>
          <Text style={styles.sensorName}>{item.name}</Text>
          <Text style={styles.sensorType}>{item.type}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'active' ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      {canWrite && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(item)}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      {canWrite && (
        <Button onPress={() => setShowAddModal(true)} style={styles.addButton}>
          + Add Sensor
        </Button>
      )}

      <FlatList
        data={sensors}
        renderItem={renderSensor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No sensors available</Text>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal || editingSensor !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowAddModal(false);
          setEditingSensor(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingSensor ? 'Edit Sensor' : 'Add Sensor'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Sensor Name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <Text style={styles.label}>Type:</Text>
            <View style={styles.typeButtons}>
              {SENSOR_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Active:</Text>
              <TouchableOpacity
                style={[styles.switch, formData.active && styles.switchActive]}
                onPress={() => setFormData({ ...formData, active: !formData.active })}
              >
                <View style={[styles.switchThumb, formData.active && styles.switchThumbActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <Button
                onPress={() => {
                  setShowAddModal(false);
                  setEditingSensor(null);
                  setFormData({ name: '', type: 'outdoor', active: true });
                }}
                variant="secondary"
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                onPress={editingSensor ? handleUpdate : handleAdd}
                loading={loading}
                style={styles.modalButton}
              >
                {editingSensor ? 'Update' : 'Create'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  sensorCard: {
    marginBottom: 12,
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sensorType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  statusText: {
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
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(139, 92, 246, 0.95)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  typeButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.4)',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
