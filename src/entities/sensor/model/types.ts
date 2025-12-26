export type SensorType = 'outdoor' | 'indoor' | 'water';

export const SENSOR_TYPES: ReadonlyArray<SensorType> = ['outdoor', 'indoor', 'water'];

export type SensorStatus = 'active' | 'inactive';

export interface Sensor {
  id: number;
  name: string;
  type: SensorType;
  status: SensorStatus;
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

/**
 * Type guard to check if a value is a valid SensorType.
 */
export function isSensorType(value: unknown): value is SensorType {
  return typeof value === 'string' && (SENSOR_TYPES as readonly string[]).includes(value);
}
