'use client';

import { useEffect, useRef } from 'react';
import type { District } from '@/lib/types';
import { getAQIColor, getAQILevel } from '@/lib/ai/predict';

interface AirQualityMapProps {
  districts: District[];
  onDistrictClick?: (district: District) => void;
}

function buildMarkerHtml(district: District): string {
  const color = getAQIColor(district.aqi);
  // Pulse speed: faster for worse AQI
  const speed = district.aqi > 150 ? '1.2s' : district.aqi > 100 ? '1.8s' : '2.8s';
  // Outer ring size scales with AQI severity
  const outerSize = Math.min(64, 40 + Math.floor(district.aqi / 40) * 4);
  return `
    <div style="position:relative;width:${outerSize}px;height:${outerSize}px;display:flex;align-items:center;justify-content:center;">
      <div class="map-pulse" style="
        position:absolute;inset:0;
        border-radius:50%;
        background:${color}22;
        border:1.5px solid ${color}70;
        animation:mapPulse ${speed} ease-in-out infinite;
      "></div>
      <div style="
        position:relative;
        width:30px;height:30px;
        border-radius:50%;
        background:${color};
        display:flex;align-items:center;justify-content:center;
        font-size:9px;font-weight:700;
        color:${district.aqi > 100 ? '#fff' : '#000'};
        box-shadow:0 0 12px ${color}99, 0 2px 6px #00000060;
        border:1.5px solid ${color}dd;
      ">${district.aqi}</div>
    </div>`;
}

export default function AirQualityMap({ districts, onDistrictClick }: AirQualityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const heatLayerRef = useRef<any>(null);

  // Initial map setup
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;

    const init = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      (window as any).L = L; // expose for live updates
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [43.2551, 76.9126],
        zoom: 11,
        zoomControl: false,
        preferCanvas: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Initial markers
      districts.forEach((d) => {
        const icon = (L as any).divIcon({ className: '', html: buildMarkerHtml(d), iconSize: [64, 64], iconAnchor: [32, 32] });
        const marker = L.marker([d.lat, d.lng], { icon });
        marker.bindTooltip(
          `<div style="background:#111827;color:#fff;padding:6px 10px;border-radius:10px;font-size:11px;border:1px solid ${getAQIColor(d.aqi)}50">
            <b>${d.name}</b> · AQI ${d.aqi} <span style="color:${getAQIColor(d.aqi)}">${getAQILevel(d.aqi)}</span>
          </div>`,
          { direction: 'top', offset: [0, -20], className: 'custom-tooltip', opacity: 1 }
        );
        marker.bindPopup(buildPopup(d), { className: 'custom-popup', maxWidth: 220, closeButton: false });
        marker.on('click', () => onDistrictClick?.(d));
        marker.addTo(map);
        markersRef.current.set(d.id, marker);
      });

      // Heatmap layer via canvas circles (no external plugin needed)
      drawHeatmap(L, map, districts);
    };

    init();
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, []);

  // Live update markers when districts prop changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const L_sync = (window as any).L;
    if (!L_sync) return; // Leaflet not yet loaded, skip

    districts.forEach((d) => {
      const marker = markersRef.current.get(d.id);
      if (!marker) return;
      const icon = L_sync.divIcon({ className: '', html: buildMarkerHtml(d), iconSize: [64, 64], iconAnchor: [32, 32] });
      marker.setIcon(icon);
      marker.setTooltipContent(
        `<div style="background:#111827;color:#fff;padding:6px 10px;border-radius:10px;font-size:11px;border:1px solid ${getAQIColor(d.aqi)}50">
          <b>${d.name}</b> · AQI ${d.aqi} <span style="color:${getAQIColor(d.aqi)}">${getAQILevel(d.aqi)}</span>
        </div>`
      );
    });
  }, [districts]);

  return (
    <>
      <style>{`
        @keyframes mapPulse {
          0%,100% { transform:scale(1);   opacity:.75; }
          50%      { transform:scale(1.4); opacity:.3;  }
        }
        .custom-popup .leaflet-popup-content-wrapper,
        .custom-tooltip .leaflet-tooltip {
          background:transparent !important;
          box-shadow:none !important;
          border:none !important;
          padding:0 !important;
        }
        .custom-popup .leaflet-popup-content { margin:0 !important; }
        .custom-popup .leaflet-popup-tip-container,
        .custom-tooltip .leaflet-tooltip-tip { display:none !important; }
        .leaflet-container { background:#0B0F19; }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}

function buildPopup(d: District): string {
  const color = getAQIColor(d.aqi);
  const level = getAQILevel(d.aqi);
  const rows = [
    ['AQI', `<span style="color:${color};font-weight:600">${d.aqi} — ${level}</span>`],
    ['PM2.5', `${d.pm25} µg/m³`],
    ['CO2', `${d.co2} ppm`],
    ['Temp', `${d.temperature}°C`],
    ['Humidity', `${d.humidity}%`],
  ];
  return `<div style="background:#111827;color:white;border-radius:14px;padding:14px 16px;font-family:sans-serif;min-width:170px;border:1px solid ${color}50;box-shadow:0 8px 24px #00000060;">
    <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:white">${d.name}</div>
    ${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:11px;color:#ffffff70;margin-bottom:5px;"><span>${k}</span><span style="color:white">${v}</span></div>`).join('')}
  </div>`;
}

function drawHeatmap(L: any, map: any, districts: District[]) {
  // Use a lightweight canvas-based heatmap via SVG overlay
  const svgLayer = (L as any).svg({ padding: 0.1 }).addTo(map);
  districts.forEach((d) => {
    const point = map.latLngToLayerPoint([d.lat, d.lng]);
    const color = getAQIColor(d.aqi);
    const intensity = Math.min(1, d.aqi / 200);
    const r = 60 + intensity * 40;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(point.x));
    circle.setAttribute('cy', String(point.y));
    circle.setAttribute('r', String(r));
    circle.setAttribute('fill', color);
    circle.setAttribute('opacity', String(0.07 + intensity * 0.10));
    circle.style.filter = `blur(16px)`;
    circle.style.pointerEvents = 'none';
    svgLayer._container.appendChild(circle);
  });
}
