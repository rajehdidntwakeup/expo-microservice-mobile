import {MeasurementDto, MeasurementResponseDto, Sensor, Measurement} from '../types';
import {storage} from '../utils/storage';
import {API_BASE_URL} from '../utils/api';

export async function getMeasurements(sensors: Sensor[]): Promise<Measurement[]> {
    const token = await storage.getToken();
    const resp = await fetch(`${API_BASE_URL}/measurements`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!resp.ok) {
        throw new Error('Failed to load measurements');
    }
    if (resp.status === 204) {
        return [];
    }

    const data: MeasurementResponseDto[] = await resp.json();
    const mapped: Measurement[] = (Array.isArray(data) ? data : []).map((d) => {
        const date = new Date(d.timestamp);
        const sensor = sensors.find((s) => s.id === d.sensorId);
        const hasTemperature = typeof d.temperature === 'number';
        const hasHumidity = typeof d.humidity === 'number';
        const temperature = hasTemperature ? d.temperature : 0;
        const humidity = hasHumidity ? d.humidity : 0;

        return {
            id: d.id,
            sensorId: d.sensorId,
            sensorName: sensor?.name ?? `Sensor ${d.sensorId}`,
            sensorType: sensor?.type ?? 'outdoor',
            temperature: temperature,
            humidity: humidity,
            timestamp: isNaN(date.getTime()) ? String(d.timestamp) : date.toLocaleString(),
            date: isNaN(date.getTime()) ? new Date() : date,
        };
    });

    return mapped;
}

export async function createMeasurement(payload: MeasurementDto): Promise<any> {
  const token = await storage.getToken();
  console.log(payload);
  const resp = await fetch(`${API_BASE_URL}/measurements`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    let txt = '';
    try {
      txt = await resp.text();
    } catch {}
    throw new Error(`Failed to add measurement (${resp.status}) ${txt}`);
  }

    return await resp.json();
}

export async function deleteMeasurement(id: number): Promise<boolean> {
    const token = await storage.getToken();
    const resp = await fetch(`${API_BASE_URL}/measurements/${encodeURIComponent(String(id))}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!resp.ok) {
        let txt = '';
        try {
            txt = await resp.text();
        } catch {
        }
        throw new Error(`Failed to delete measurement (${resp.status}) ${txt}`);
    }

    return true;
}
