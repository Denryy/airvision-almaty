import mockData from '@/data/mockAirData.json';
import type { CityData, District, Notification } from '@/lib/types';
import { generateHourlyData, predictAQI } from '@/lib/ai/predict';

export function getCityData(): CityData {
  return mockData.currentCity as CityData;
}

export function getDistricts(): District[] {
  return mockData.districts as District[];
}

export function getHourlyTrend() {
  return generateHourlyData(mockData.currentCity.aqi);
}

export function getForecast() {
  return predictAQI(mockData.currentCity.aqi);
}

export function getNotifications(): Notification[] {
  return [
    {
      id: '1',
      title: 'High AQI Alert',
      message: 'AQI in Turksib district has reached 168 — Unhealthy level. Avoid outdoor activities.',
      type: 'danger',
      timestamp: '2026-03-20T14:00:00Z',
      read: false,
    },
    {
      id: '2',
      title: 'Moderate Air Quality Warning',
      message: 'City Center AQI is 101. Sensitive groups should limit outdoor exposure.',
      type: 'warning',
      timestamp: '2026-03-20T12:30:00Z',
      read: false,
    },
    {
      id: '3',
      title: 'PM2.5 Elevated',
      message: 'PM2.5 levels in Nauryzbay district exceeded 70 µg/m³. Consider wearing a mask.',
      type: 'warning',
      timestamp: '2026-03-20T10:00:00Z',
      read: true,
    },
    {
      id: '4',
      title: 'Air Quality Improved',
      message: 'Medeu district reports Good air quality (AQI 38). Great for outdoor activities!',
      type: 'info',
      timestamp: '2026-03-20T08:00:00Z',
      read: true,
    },
  ];
}

export function getEcoScore(): number {
  const avgAqi = mockData.districts.reduce((s, d) => s + d.aqi, 0) / mockData.districts.length;
  return Math.max(0, Math.min(100, Math.round(100 - avgAqi * 0.4)));
}
