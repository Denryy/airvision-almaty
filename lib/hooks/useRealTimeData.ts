'use client';

import { useEffect, useRef, useState } from 'react';
import { simulateTick, calcTrend, generateHourlyData } from '@/lib/ai/predict';
import type { District, CityData, HourlyDataPoint } from '@/lib/types';

const TICK_MS = 7000; // update every 7 s

interface LiveData {
  cityData: CityData;
  districts: District[];
  hourlyData: HourlyDataPoint[];
  trend: number;
  lastUpdated: Date;
}

export function useRealTimeData(
  initialCityData: CityData,
  initialDistricts: District[]
): LiveData {
  const hourlyRef = useRef<HourlyDataPoint[]>(generateHourlyData(initialCityData.aqi));
  const trendRef = useRef<number>(0);

  const [cityData, setCityData] = useState<CityData>(initialCityData);
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [hourlyData, setHourlyData] = useState<HourlyDataPoint[]>(hourlyRef.current);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setCityData((prev) => {
        const trend = trendRef.current;
        const nextAqi = simulateTick(prev.aqi, trend);
        // update trend toward (nextAqi - prev.aqi)
        trendRef.current = trend * 0.8 + (nextAqi - prev.aqi) * 0.2;

        const updated: CityData = {
          ...prev,
          aqi: nextAqi,
          pm25: Math.max(5, Math.round(nextAqi * 0.48 + (Math.random() - 0.5) * 3)),
          co2: Math.max(380, Math.round(410 + nextAqi * 3.2 + (Math.random() - 0.5) * 20)),
          updatedAt: new Date().toISOString(),
        };

        // Append to hourly data (rolling window)
        const now = new Date();
        const newPoint: HourlyDataPoint = {
          time: now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'),
          aqi: nextAqi,
          pm25: updated.pm25,
          co2: updated.co2,
        };
        hourlyRef.current = [...hourlyRef.current.slice(-23), newPoint];
        setHourlyData([...hourlyRef.current]);

        return updated;
      });

      // Nudge each district independently
      setDistricts((prev) =>
        prev.map((d) => {
          const nextAqi = simulateTick(d.aqi, (Math.random() - 0.5) * 2);
          return {
            ...d,
            aqi: nextAqi,
            pm25: Math.max(5, Math.round(nextAqi * 0.48 + (Math.random() - 0.5) * 3)),
            co2: Math.max(380, Math.round(410 + nextAqi * 3.2 + (Math.random() - 0.5) * 15)),
          };
        })
      );

      setLastUpdated(new Date());
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  return { cityData, districts, hourlyData, trend: trendRef.current, lastUpdated };
}
