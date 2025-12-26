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
