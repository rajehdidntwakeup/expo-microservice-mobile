import { Sensor, UpdateSensorDto, SensorResponseDto, isSensorType } from '../model/types';
import { storage } from '@/shared/lib/storage';
import { API_BASE_URL } from '@/shared/config/api';

export async function getSensors(): Promise<Sensor[]> {
  const token = await storage.getToken();
  const resp = await fetch(`${API_BASE_URL}/sensors`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!resp.ok && resp.status !== 204) {
    throw new Error(`Failed to load sensors (${resp.status})`);
  }

  if (resp.status === 204) {
    return [];
  }

  const data = await resp.json();
  return data.map((d: any) => ({
    id: d.id,
    name: d.name ?? `Sensor ${d.id}`,
    type: (d.type || 'outdoor').toLowerCase(),
    status: d.active ? 'active' : 'inactive',
  }));
}

export async function createSensor(payload: {
  name: string;
  type: string;
  active: boolean;
}): Promise<Sensor> {
  const token = await storage.getToken();
  console.log(token);
  const resp = await fetch(`${API_BASE_URL}/sensors`, {
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
    throw new Error(`Failed to create sensor (${resp.status}) ${txt}`);
  }

  const body = await resp.json();
  const resolvedType = isSensorType(body.type)
    ? body.type
    : isSensorType(payload.type)
    ? payload.type
    : 'outdoor';

  return {
    id: body.id,
    name: body.name ?? payload.name,
    type: resolvedType,
    status: body.active ? 'active' : 'inactive',
  };
}

export async function updateSensor(id: number, payload: UpdateSensorDto): Promise<Sensor> {
  const token = await storage.getToken();
  const resp = await fetch(`${API_BASE_URL}/sensors/${id}`, {
    method: 'PUT',
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
    throw new Error(`Failed to update sensor (${resp.status}) ${txt}`);
  }

  const body: SensorResponseDto = await resp.json();
  const resolvedType = isSensorType(body.type)
    ? body.type
    : isSensorType(payload.type)
    ? payload.type
    : 'outdoor';

  return {
    id: body.id ?? id,
    name: body.name ?? payload.name,
    type: resolvedType,
    status: body.active ? 'active' : 'inactive',
  };
}

export async function deleteSensor(id: number): Promise<boolean> {
  const token = await storage.getToken();
  const resp = await fetch(`${API_BASE_URL}/sensors/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    let txt = '';
    try {
      txt = await resp.text();
    } catch {}
    throw new Error(`Failed to delete sensor (${resp.status}) ${txt}`);
  }

  return true;
}
