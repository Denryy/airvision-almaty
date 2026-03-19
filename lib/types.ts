export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  co2: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

export interface CityData {
  aqi: number;
  pm25: number;
  co2: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  updatedAt: string;
}

export interface HourlyDataPoint {
  time: string;
  aqi: number;
  pm25: number;
  co2: number;
}

export interface ForecastPoint {
  time: string;
  aqi: number;
  label: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  timestamp: string;
  read: boolean;
}

export type AQILevel = 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';

export interface HealthRecommendation {
  level: AQILevel;
  message: string;
  icon: string;
  color: string;
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info' | 'success';
}
