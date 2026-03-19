'use client';

import { getCityData, getDistricts } from '@/lib/api/airData';
import { useRealTimeData } from '@/lib/hooks/useRealTimeData';
import StatCard from '@/components/cards/StatCard';
import TrendChart from '@/components/charts/TrendChart';
import Card from '@/components/ui/Card';
import { getAQIBgClass, getAQIColor } from '@/lib/ai/predict';
import { Wind, Thermometer, Droplets, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { cityData, districts, hourlyData } = useRealTimeData(getCityData(), getDistricts());

  return (
    <div className="pb-16 md:pb-0 space-y-4">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>Dashboard</h1>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Real-time air quality metrics · Almaty</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="PM2.5" value={cityData.pm25} unit="µg/m³"
          icon={<Activity className="w-4 h-4" />} color="#FF7E00"
          trend={3.8} description={cityData.pm25 > 35 ? 'Elevated' : 'Normal'}
        />
        <StatCard
          label="CO2" value={cityData.co2} unit="ppm"
          icon={<Wind className="w-4 h-4" />} color="#4FC3F7"
          trend={-1.2} description={cityData.co2 > 600 ? 'High' : 'Normal'}
        />
        <StatCard
          label="Temperature" value={cityData.temperature} unit="°C"
          icon={<Thermometer className="w-4 h-4" />} color="#F97316"
          description="Feels like 3°C"
        />
        <StatCard
          label="Humidity" value={cityData.humidity} unit="%"
          icon={<Droplets className="w-4 h-4" />} color="#7ED957"
          description="Comfortable"
        />
      </div>

      <Card>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-1)' }}>24-Hour Trends</p>
        <div className="space-y-5">
          <TrendChart data={hourlyData} dataKey="aqi"  color="#7ED957" label="AQI" />
          <TrendChart data={hourlyData} dataKey="pm25" color="#FF7E00" label="PM2.5 (µg/m³)" />
          <TrendChart data={hourlyData} dataKey="co2"  color="#4FC3F7" label="CO2 (ppm)" />
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-1)' }}>Districts Overview</p>
        <div className="space-y-0">
          {districts.map((d, i) => (
            <div
              key={d.id}
              className="flex items-center justify-between py-2.5 transition-colors hover:bg-white/[0.02] rounded-lg px-1"
              style={i < districts.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getAQIColor(d.aqi), boxShadow: `0 0 5px ${getAQIColor(d.aqi)}80` }}
                />
                <span className="text-sm" style={{ color: 'var(--text-2)' }}>{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>{d.pm25} µg/m³</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getAQIBgClass(d.aqi)}`}>
                  {d.aqi}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
