'use client';

import CleanRouteSection from "@/components/routing/CleanRouteSection";
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { getCityData, getDistricts, getEcoScore } from '@/lib/api/airData';
import { predictAQI, calcTrend, getAQILevel } from '@/lib/ai/predict';
import { useRealTimeData } from '@/lib/hooks/useRealTimeData';
import { useAppStore } from '@/store/appStore';
import type { District } from '@/lib/types';
import AQIGauge from '@/components/cards/AQIGauge';
import ForecastCard from '@/components/cards/ForecastCard';
import HealthCard from '@/components/cards/HealthCard';
import ConditionsCard from '@/components/cards/ConditionsCard';
import EcoScoreCard from '@/components/cards/EcoScoreCard';
import { MapPin, Clock, RefreshCw } from 'lucide-react';

const AirQualityMap = dynamic(() => import('@/components/map/AirQualityMap'), { ssr: false });

const AQI_ALERT_THRESHOLD = 120;

export default function HomePage() {
  const staticCityData = getCityData();
  const staticDistricts = getDistricts();
  const ecoScore = getEcoScore();

  const { cityData, districts, hourlyData, lastUpdated } = useRealTimeData(staticCityData, staticDistricts);
  const { addToast } = useAppStore();

  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const prevAqiRef = useRef(cityData.aqi);

  // Trigger toast when AQI crosses threshold
  useEffect(() => {
    const prev = prevAqiRef.current;
    const curr = cityData.aqi;
    prevAqiRef.current = curr;
    if (prev < AQI_ALERT_THRESHOLD && curr >= AQI_ALERT_THRESHOLD) {
      addToast({
        type: 'danger',
        title: `AQI Alert — ${getAQILevel(curr)}`,
        message: `Air quality reached ${curr}. Wear a mask outdoors.`,
      });
    }
  }, [cityData.aqi]);

  const trend = calcTrend(hourlyData);
  const forecast = predictAQI(cityData.aqi, trend);

  const displayData = selectedDistrict
    ? {
        ...cityData,
        aqi: selectedDistrict.aqi,
        pm25: selectedDistrict.pm25,
        co2: selectedDistrict.co2,
        temperature: selectedDistrict.temperature,
        humidity: selectedDistrict.humidity,
        windSpeed: selectedDistrict.windSpeed,
        windDirection: selectedDistrict.windDirection,
      }
    : cityData;

  const updatedTime =
    lastUpdated.getHours().toString().padStart(2, '0') +
    ':' +
    lastUpdated.getMinutes().toString().padStart(2, '0');

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Map panel */}
      <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[50vh] md:min-h-0">
        <AirQualityMap
          districts={districts}
          onDistrictClick={setSelectedDistrict}
        />

        {/* AQI overlay badge */}
        <div className="absolute top-3 left-3 z-[1001] pointer-events-none">
          <div
            className="backdrop-blur-md rounded-2xl px-4 py-3 transition-all duration-500"
            style={{ background: 'var(--overlay-bg)', border: '1px solid var(--border-md)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#7ED957]" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                {selectedDistrict ? selectedDistrict.name : 'Almaty'}
              </span>
            </div>
            <AQIGauge aqi={displayData.aqi} size={124} />
          </div>
        </div>

        {/* AQI legend */}
        <div className="absolute bottom-3 left-3 z-[1001] pointer-events-none">
          <div
            className="backdrop-blur-md rounded-xl px-3 py-2.5"
            style={{ background: 'var(--overlay-bg)', border: '1px solid var(--border-md)' }}
          >
            <p className="text-[10px] mb-2 font-medium" style={{ color: 'var(--text-3)' }}>AQI Scale</p>
            {[
              { label: 'Good', range: '0–50', color: '#7ED957' },
              { label: 'Moderate', range: '51–100', color: '#F5C400' },
              { label: 'Unhealthy', range: '101–150', color: '#FF7E00' },
              { label: 'Hazardous', range: '200+', color: '#8B00FF' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 mb-1 last:mb-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}80` }}
                />
                <span className="text-[10px]" style={{ color: 'var(--text-2)' }}>
                  {item.label}
                  <span className="ml-1" style={{ color: 'var(--text-4)' }}>({item.range})</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Update ticker */}
        <div className="absolute bottom-3 right-3 z-[1001] pointer-events-none">
          <div
            className="backdrop-blur-md rounded-xl px-2.5 py-1.5 flex items-center gap-1.5"
            style={{ background: 'var(--overlay-bg)', border: '1px solid var(--border-md)' }}
          >
            <RefreshCw className="w-3 h-3 text-[#7ED957]" style={{ animation: 'spin 3s linear infinite' }} />
            <Clock className="w-3 h-3" style={{ color: 'var(--text-3)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
              Live · {updatedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-80 flex flex-col gap-3 overflow-y-auto pb-16 md:pb-0">
        <ForecastCard forecast={forecast} />
        <HealthCard aqi={displayData.aqi} />
        <ConditionsCard data={displayData as typeof cityData} />
        <EcoScoreCard score={ecoScore} />
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
    
  );
}
