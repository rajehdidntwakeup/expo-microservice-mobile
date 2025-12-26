import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from 'victory-native';
import { Card, Button } from '@/shared/ui';
import { Sensor, SENSOR_TYPES, SensorType } from '@/entities/sensor';
import { Measurement, getMeasurements, createMeasurement, deleteMeasurement } from '@/entities/measurement';

interface MeasurementsTabProps {
  sensors: Sensor[];
  canWrite: boolean;
}

export default function MeasurementsTab({ sensors, canWrite }: MeasurementsTabProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sensorId: 0,
    temperature: '',
    humidity: '',
    timestamp: new Date().toISOString(),
  });
  const [filterSensorType, setFilterSensorType] = useState<'all' | SensorType>('all');

  useEffect(() => {
    loadMeasurements();
  }, [sensors]);

  const loadMeasurements = async () => {
    try {
      const data = await getMeasurements(sensors);
      setMeasurements(data);
    } catch (err: any) {
      console.error('Error fetching measurements', err);
      Alert.alert('Error', 'Could not load measurements from server');
    }
  };

  // Chart helpers
  const colors = ['#8b5cf6', '#3ca020', '#f59e0b', '#22c55e', '#ffffff', '#8b591b', '#ef4444', '#b51e0b', '#a51e6b', '#ffff2f'];
  const colorForSensorId = (id: number) => colors[Math.abs(id) % colors.length];

  const filteredSensors: Sensor[] = useMemo(() => {
    if (filterSensorType === 'all') return sensors;
    return sensors.filter((s) => s.type === filterSensorType).slice(0, 10);
  }, [filterSensorType, sensors]);

  type Series = { id: number; name: string; data: { x: Date; y: number }[] };

  const temperatureSeries: Series[] = useMemo(() => {
    if (!measurements.length) return [];
    const bySensor: Record<number, { x: Date; y: number }[]> = {};
    for (const m of measurements) {
      if (m.temperature === undefined || m.temperature === null) continue;
      if (!filteredSensors.find((s) => s.id === m.sensorId)) continue;
      const arr = bySensor[m.sensorId] || (bySensor[m.sensorId] = []);
      const xDate = m.date instanceof Date ? m.date : new Date(m.date as any);
      arr.push({ x: xDate, y: m.temperature });
    }
    return filteredSensors
      .filter((s) => bySensor[s.id]?.length)
      .map((s) => ({
        id: s.id,
        name: s.name,
        data: bySensor[s.id]
          .sort((a, b) => a.x.getTime() - b.x.getTime())
          .filter((p) => Number.isFinite(p.y) && Number.isFinite(p.x?.getTime?.() ?? NaN)),
      }));
  }, [measurements, filteredSensors]);

  const humiditySeries: Series[] = useMemo(() => {
    if (!measurements.length) return [];
    const bySensor: Record<number, { x: Date; y: number }[]> = {};
    for (const m of measurements) {
      if (m.humidity === undefined || m.humidity === null) continue;
      if (!filteredSensors.find((s) => s.id === m.sensorId)) continue;
      const arr = bySensor[m.sensorId] || (bySensor[m.sensorId] = []);
      const xDate = m.date instanceof Date ? m.date : new Date(m.date as any);
      arr.push({ x: xDate, y: m.humidity });
    }
    return filteredSensors
      .filter((s) => bySensor[s.id]?.length)
      .map((s) => ({
        id: s.id,
        name: s.name,
        data: bySensor[s.id]
          .sort((a, b) => a.x.getTime() - b.x.getTime())
          .filter((p) => Number.isFinite(p.y) && Number.isFinite(p.x?.getTime?.() ?? NaN)),
      }));
  }, [measurements, filteredSensors]);

  const handleAdd = async () => {
    if (!formData.sensorId) {
      Alert.alert('Error', 'Please select a sensor');
      return;
    }

    setLoading(true);
    try {
      await createMeasurement({
        sensorId: formData.sensorId,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        humidity: formData.humidity ? parseFloat(formData.humidity) : undefined,
        timestamp: new Date().toISOString(),
      });
      await loadMeasurements();
      setShowAddModal(false);
      setFormData({
        sensorId: 0,
        temperature: '',
        humidity: '',
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Success', 'Measurement added successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add measurement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (measurement: Measurement) => {
    Alert.alert(
      'Delete Measurement',
      `Are you sure you want to delete this measurement?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeasurement(measurement.id);
              setMeasurements(measurements.filter((m) => m.id !== measurement.id));
              Alert.alert('Success', 'Measurement deleted successfully');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete measurement');
            }
          },
        },
      ]
    );
  };

  const renderMeasurement = ({ item }: { item: Measurement }) => (
    <Card style={styles.measurementCard}>
      <View style={styles.measurementHeader}>
        <View style={styles.measurementInfo}>
          <Text style={styles.sensorName}>{item.sensorName}</Text>
          <Text style={styles.sensorType}>{item.sensorType}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <View style={styles.dataRow}>
        {item.temperature !== undefined && item.temperature !== 0 && (
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Temperature</Text>
            <Text style={styles.dataValue}>{item.temperature}°C</Text>
          </View>
        )}
        {item.humidity !== undefined && item.humidity !== 0 && (
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Humidity</Text>
            <Text style={styles.dataValue}>{item.humidity}%</Text>
          </View>
        )}
      </View>

      {canWrite && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      {canWrite && (
        <Button onPress={() => setShowAddModal(true)} style={styles.addButton}>
          + Add Measurement
        </Button>
      )}

      <FlatList
        data={measurements}
        renderItem={renderMeasurement}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.chartsContainer}>
            <View style={styles.filterRow}>
              {(['all', ...SENSOR_TYPES] as const).map((t) => (
                <TouchableOpacity
                  key={String(t)}
                  style={[styles.filterButton, filterSensorType === t && styles.filterButtonActive]}
                  onPress={() => setFilterSensorType(t as 'all' | SensorType)}
                >
                  <Text style={[styles.filterText, filterSensorType === t && styles.filterTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Card style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Time Series Data for the temperature</Text>
              </View>
              <View style={styles.chartBox}>
                {temperatureSeries.length ? (
                  <VictoryChart
                    padding={{ top: 20, right: 20, bottom: 40, left: 50 }}
                    theme={VictoryTheme.material}
                  >
                    <VictoryAxis
                      tickFormat={(t) => {
                        const d = t instanceof Date ? t : new Date(t as any);
                        const ms = d?.getTime?.();
                        if (!Number.isFinite(ms)) return '';
                        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      }}
                      style={{ tickLabels: { fill: 'rgba(255,255,255,0.6)' }, axis: { stroke: 'rgba(255,255,255,0.3)' }, grid: { stroke: 'rgba(255,255,255,0.1)' } }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{ tickLabels: { fill: 'rgba(255,255,255,0.6)' }, axis: { stroke: 'rgba(255,255,255,0.3)' }, grid: { stroke: 'rgba(255,255,255,0.1)' } }}
                    />
                    {temperatureSeries.map((s) =>
                      s.data.length >= 2 ? (
                        <VictoryLine
                          key={s.name}
                          data={s.data}
                          style={{ data: { stroke: colorForSensorId(s.id), strokeWidth: 2 } }}
                        />
                      ) : null
                    )}
                  </VictoryChart>
                ) : (
                  <Text style={styles.emptyText}>No temperature data to display</Text>
                )}
              </View>
              {temperatureSeries.length ? (
                <View style={styles.legendRow}>
                  {temperatureSeries.map((s) => (
                    <View key={`temp-legend-${s.name}`} style={styles.legendItem}>
                      <View style={[styles.legendSwatch, { backgroundColor: colorForSensorId(s.id) }]} />
                      <Text style={styles.legendLabel}>{s.name}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </Card>

            <Card style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Time Series Data for the humidity</Text>
              </View>
              <View style={styles.chartBox}>
                {humiditySeries.length ? (
                  <VictoryChart
                    padding={{ top: 20, right: 20, bottom: 40, left: 50 }}
                    theme={VictoryTheme.material}
                  >
                    <VictoryAxis
                      tickFormat={(t) => {
                        const d = t instanceof Date ? t : new Date(t as any);
                        const ms = d?.getTime?.();
                        if (!Number.isFinite(ms)) return '';
                        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      }}
                      style={{ tickLabels: { fill: 'rgba(255,255,255,0.6)' }, axis: { stroke: 'rgba(255,255,255,0.3)' }, grid: { stroke: 'rgba(255,255,255,0.1)' } }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{ tickLabels: { fill: 'rgba(255,255,255,0.6)' }, axis: { stroke: 'rgba(255,255,255,0.3)' }, grid: { stroke: 'rgba(255,255,255,0.1)' } }}
                    />
                    {humiditySeries.map((s) =>
                      s.data.length >= 2 ? (
                        <VictoryLine
                          key={s.name}
                          data={s.data}
                          style={{ data: { stroke: colorForSensorId(s.id), strokeWidth: 2 } }}
                        />
                      ) : null
                    )}
                  </VictoryChart>
                ) : (
                  <Text style={styles.emptyText}>No humidity data to display</Text>
                )}
              </View>
              {humiditySeries.length ? (
                <View style={styles.legendRow}>
                  {humiditySeries.map((s) => (
                    <View key={`hum-legend-${s.name}`} style={styles.legendItem}>
                      <View style={[styles.legendSwatch, { backgroundColor: colorForSensorId(s.id) }]} />
                      <Text style={styles.legendLabel}>{s.name}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </Card>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No measurements available</Text>
        }
      />

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Measurement</Text>

            <Text style={styles.label}>Select Sensor:</Text>
            <View style={styles.sensorButtons}>
              {sensors.map((sensor) => (
                <TouchableOpacity
                  key={sensor.id}
                  style={[
                    styles.sensorButton,
                    formData.sensorId === sensor.id && styles.sensorButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, sensorId: sensor.id })}
                >
                  <Text
                    style={[
                      styles.sensorButtonText,
                      formData.sensorId === sensor.id && styles.sensorButtonTextActive,
                    ]}
                  >
                    {sensor.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Temperature (°C)"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={formData.temperature}
              onChangeText={(text) => setFormData({ ...formData, temperature: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Humidity (%)"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={formData.humidity}
              onChangeText={(text) => setFormData({ ...formData, humidity: text })}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <Button
                onPress={() => {
                  setShowAddModal(false);
                  setFormData({
                    sensorId: 0,
                    temperature: '',
                    humidity: '',
                    timestamp: new Date().toISOString(),
                  });
                }}
                variant="secondary"
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleAdd}
                loading={loading}
                style={styles.modalButton}
              >
                Add
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addButton: { marginBottom: 16 },
  list: { gap: 12 },
  chartsContainer: { gap: 16, marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  filterButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.08)' },
  filterButtonActive: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.45)' },
  filterText: { color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  measurementCard: { marginBottom: 12 },
  chartCard: { marginBottom: 4 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  chartTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  chartBox: { height: 300, justifyContent: 'center' },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 8 },
  legendSwatch: { width: 10, height: 10, borderRadius: 2, marginRight: 6 },
  legendLabel: { color: '#fff', fontSize: 12, opacity: 0.9 },
  measurementHeader: { marginBottom: 12 },
  measurementInfo: { marginBottom: 8 },
  sensorName: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 4 },
  sensorType: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'capitalize' },
  timestamp: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' },
  dataRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  dataItem: { flex: 1 },
  dataLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 4 },
  dataValue: { fontSize: 20, fontWeight: '600', color: '#fff' },
  deleteButton: { backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  deleteText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', marginTop: 32, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'rgba(139, 92, 246, 0.95)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  label: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: 8 },
  sensorButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  sensorButton: { backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  sensorButtonActive: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderColor: 'rgba(255, 255, 255, 0.4)' },
  sensorButtonText: { color: 'rgba(255, 255, 255, 0.7)', fontWeight: '600' },
  sensorButtonTextActive: { color: '#fff' },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 16, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  modalButton: { flex: 1 },
});
