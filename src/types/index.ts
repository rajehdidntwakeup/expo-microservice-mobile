export type SensorType = 'outdoor' | 'indoor' | 'water';

export const SENSOR_TYPES: ReadonlyArray<SensorType> = ['outdoor', 'indoor', 'water'];

export type SensorStatus = 'active' | 'inactive';

export type UserRole = 'viewer' | 'admin';

/**
 * Type guard to check if a value is a valid SensorType.
 */
export function isSensorType(value: unknown): value is SensorType {
  return typeof value === 'string' && (SENSOR_TYPES as readonly string[]).includes(value);
}

export interface Sensor {
  id: number;
  name: string;
  type: SensorType;
  status: SensorStatus;
}

export interface UserData {
  id: number;
  name: string;
  role: UserRole;
}

export interface Measurement {
  id: number;
  sensorId: number;
  sensorName: string;
  sensorType: string;
  temperature?: number;
  humidity?: number;
  timestamp: string;
  date: Date;
}

export interface MeasurementDto {
  sensorId: number;
  timestamp: string;
  temperature?: number | string;
  humidity?: number | string;
}

export interface MeasurementResponseDto {
  id: number;
  sensorId: number;
  timestamp: string;
  temperature?: number;
  humidity?: number;
}

export interface UpdateSensorDto {
  name: string;
  type: string;
  active: boolean;
}

export interface SensorResponseDto {
  id: number;
  name: string;
  type: string;
  active: boolean;
}
