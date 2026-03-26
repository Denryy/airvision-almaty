"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  DISTRICTS,
  EDGES,
  RouteComparison,
  pathToSvgPoints,
  aqiColor,
  aqiLabel,
  DistrictNode,
} from "@/lib/routing/cleanRoute";

// ─── Map viewport & projection constants ─────────────────────────────────────

const SVG_W = 780;
const SVG_H = 480;
const PAD   = 56;

const BOUNDS = {
  minLat: 43.17,
  maxLat: 43.40,
  minLng: 76.80,
  maxLng: 77.12,
};

function project(lat: number, lng: number): { x: number; y: number } {
  const latRange = BOUNDS.maxLat - BOUNDS.minLat;
  const lngRange = BOUNDS.maxLng - BOUNDS.minLng;
  return {
    x: PAD + ((lng - BOUNDS.minLng) / lngRange) * (SVG_W - PAD * 2),
    y: PAD + ((BOUNDS.maxLat - lat) / latRange) * (SVG_H - PAD * 2),
  };
}

// ─── Animated polyline (draws itself on mount / prop change) ──────────────────

interface AnimatedPolylineProps {
  points: Array<{ x: number; y: number }>;
  stroke: string;
  strokeWidth: number;
  dashed?: boolean;
  animationDuration?: number; // ms
}

function AnimatedPolyline({
  points,
  stroke,
  strokeWidth,
  dashed = false,
  animationDuration = 900,
}: AnimatedPolylineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const [drawn, setDrawn] = useState(false);

  const d = useMemo(() => {
    if (points.length < 2) return "";
    const [first, ...rest] = points;
    return [`M ${first.x} ${first.y}`, ...rest.map((p) => `L ${p.x} ${p.y}`)].join(" ");
  }, [points]);

  useEffect(() => {
    setDrawn(false);
    const frame = requestAnimationFrame(() => {
      if (pathRef.current) {
        const l = pathRef.current.getTotalLength();
        setLength(l);
        requestAnimationFrame(() => setDrawn(true));
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [d]);

  if (!d) return null;

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={
        dashed
          ? drawn
            ? `8 5`
            : `0 ${length}`
          : drawn
          ? `${length} 0`
          : `0 ${length}`
      }
      style={{
        transition: drawn
          ? `stroke-dasharray ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)`
          : "none",
      }}
    />
  );
}

// ─── District node (circle + label) ──────────────────────────────────────────

interface DistrictNodeProps {
  node: DistrictNode;
  isOnCleanRoute: boolean;
  isOnNormalRoute: boolean;
  isStart: boolean;
  isEnd: boolean;
  hovered: string | null;
  onHover: (id: string | null) => void;
}

function DistrictNodeMark({
  node,
  isOnCleanRoute,
  isOnNormalRoute,
  isStart,
  isEnd,
  hovered,
  onHover,
}: DistrictNodeProps) {
  const pos = project(node.lat, node.lng);
  const color = aqiColor(node.aqi);
  const isHovered = hovered === node.id;
  const isHighlighted = isOnCleanRoute || isOnNormalRoute || isStart || isEnd;

  const r = isStart || isEnd ? 11 : isHighlighted ? 9 : 7;

  return (
    <g
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      {/* Pulse ring for start/end */}
      {(isStart || isEnd) && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={r + 6}
          fill="none"
          stroke={isStart ? "#818cf8" : "#f59e0b"}
          strokeWidth="1.5"
          opacity="0.5"
          style={{
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
      )}

      {/* AQI halo */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r + 4}
        fill={color}
        opacity={isHighlighted ? 0.15 : 0.07}
      />

      {/* Main circle */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r}
        fill={isStart ? "#818cf8" : isEnd ? "#f59e0b" : color}
        stroke={isStart ? "#c7d2fe" : isEnd ? "#fde68a" : "#0f172a"}
        strokeWidth={isStart || isEnd ? 2.5 : 1.5}
        opacity={isHighlighted ? 1 : 0.55}
        style={{ transition: "r 0.2s, opacity 0.2s" }}
      />

      {/* Start / end icons */}
      {isStart && (
        <text
          x={pos.x}
          y={pos.y + 4}
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
        >
          A
        </text>
      )}
      {isEnd && (
        <text
          x={pos.x}
          y={pos.y + 4}
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
        >
          B
        </text>
      )}

      {/* District name label */}
      <text
        x={pos.x}
        y={pos.y - r - 5}
        textAnchor="middle"
        fontSize={isHighlighted ? "10" : "9"}
        fontWeight={isHighlighted ? "700" : "400"}
        fill={isHighlighted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)"}
        style={{ transition: "font-size 0.2s, fill 0.2s" }}
      >
        {node.nameRu}
      </text>

      {/* Tooltip on hover */}
      {isHovered && (
        <g>
          <rect
            x={pos.x - 52}
            y={pos.y + r + 4}
            width={104}
            height={36}
            rx={6}
            fill="rgba(15,23,42,0.92)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.75"
          />
          <text
            x={pos.x}
            y={pos.y + r + 18}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="white"
          >
            {node.nameRu}
          </text>
          <text
            x={pos.x}
            y={pos.y + r + 32}
            textAnchor="middle"
            fontSize="9"
            fill={color}
          >
            AQI {node.aqi} · {aqiLabel(node.aqi)}
          </text>
        </g>
      )}
    </g>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function MapLegend({ showRoutes }: { showRoutes: boolean }) {
  return (
    <div className="absolute bottom-3 left-3 rounded-xl bg-black/70 backdrop-blur-sm border border-white/10 p-3 flex flex-col gap-2">
      <span className="text-[9px] font-bold tracking-widest uppercase text-white/30">
        Легенда
      </span>

      {/* AQI scale */}
      <div className="flex flex-col gap-1">
        {[
          { label: "Хорошо (0–50)", color: "#22c55e" },
          { label: "Умеренно (51–100)", color: "#f59e0b" },
          { label: "Вредно (101–150)", color: "#f97316" },
          { label: "Опасно (151+)", color: "#ef4444" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            <span className="text-[9px] text-white/50">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Route lines */}
      {showRoutes && (
        <div className="flex flex-col gap-1 border-t border-white/10 pt-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-8 h-0.5 rounded"
              style={{ background: "#22c55e" }}
            />
            <span className="text-[9px] text-white/50">Экологичный</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-8"
              style={{
                height: 2,
                background: "repeating-linear-gradient(90deg,#ef4444 0,#ef4444 5px,transparent 5px,transparent 9px)",
              }}
            />
            <span className="text-[9px] text-white/50">Обычный</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main map component ───────────────────────────────────────────────────────

interface AirQualityMapProps {
  routeResult: RouteComparison | null;
  startId: string;
  endId: string;
  activeTab: "clean" | "normal";
}

export default function AirQualityMap({
  routeResult,
  startId,
  endId,
  activeTab,
}: AirQualityMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const districts = Object.values(DISTRICTS);

  // Precompute route point arrays
  const cleanPoints = useMemo(() => {
    if (!routeResult) return [];
    return pathToSvgPoints(
      routeResult.clean.path,
      { width: SVG_W, height: SVG_H },
      BOUNDS,
      PAD
    );
  }, [routeResult]);

  const normalPoints = useMemo(() => {
    if (!routeResult) return [];
    return pathToSvgPoints(
      routeResult.normal.path,
      { width: SVG_W, height: SVG_H },
      BOUNDS,
      PAD
    );
  }, [routeResult]);

  // District membership sets
  const cleanRouteIds = useMemo(
    () => new Set(routeResult?.clean.path.map((n) => n.id) ?? []),
    [routeResult]
  );
  const normalRouteIds = useMemo(
    () => new Set(routeResult?.normal.path.map((n) => n.id) ?? []),
    [routeResult]
  );

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a1628]">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* CSS for ping animation */}
      <style>{`
        @keyframes ping {
          0%    { transform: scale(1);   opacity: 0.6; }
          70%   { transform: scale(1.6); opacity: 0;   }
          100%  { transform: scale(1.6); opacity: 0;   }
        }
      `}</style>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-full"
        style={{ display: "block" }}
      >
        {/* ── AQI pollution zone overlays ─────────────────────────────────── */}
        {districts.map((node) => {
          const pos = project(node.lat, node.lng);
          const color = aqiColor(node.aqi);
          // Radius proportional to AQI severity
          const r = 28 + (node.aqi / 200) * 32;
          return (
            <circle
              key={`zone-${node.id}`}
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={color}
              opacity={0.08 + (node.aqi / 500) * 0.08}
            />
          );
        })}

        {/* ── Edge network (graph connections) ───────────────────────────── */}
        {EDGES.map((edge, i) => {
          const from = project(DISTRICTS[edge.from].lat, DISTRICTS[edge.from].lng);
          const to   = project(DISTRICTS[edge.to].lat,   DISTRICTS[edge.to].lng);
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(99,102,241,0.18)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          );
        })}

        {/* ── Normal route (red dashed) ───────────────────────────────────── */}
        {routeResult && normalPoints.length > 1 && (
          <>
            {/* Glow layer */}
            <AnimatedPolyline
              key={`normal-glow-${startId}-${endId}`}
              points={normalPoints}
              stroke="rgba(239,68,68,0.25)"
              strokeWidth={8}
              animationDuration={700}
            />
            <AnimatedPolyline
              key={`normal-${startId}-${endId}`}
              points={normalPoints}
              stroke="#ef4444"
              strokeWidth={2.5}
              dashed
              animationDuration={700}
            />
          </>
        )}

        {/* ── Clean route (green solid, drawn on top) ─────────────────────── */}
        {routeResult && cleanPoints.length > 1 && (
          <>
            {/* Glow layer */}
            <AnimatedPolyline
              key={`clean-glow-${startId}-${endId}`}
              points={cleanPoints}
              stroke="rgba(16,185,129,0.3)"
              strokeWidth={10}
              animationDuration={900}
            />
            <AnimatedPolyline
              key={`clean-${startId}-${endId}`}
              points={cleanPoints}
              stroke="#10b981"
              strokeWidth={3.5}
              animationDuration={900}
            />
          </>
        )}

        {/* ── District nodes ──────────────────────────────────────────────── */}
        {districts.map((node) => (
          <DistrictNodeMark
            key={node.id}
            node={node}
            isOnCleanRoute={cleanRouteIds.has(node.id)}
            isOnNormalRoute={normalRouteIds.has(node.id)}
            isStart={node.id === startId}
            isEnd={node.id === endId}
            hovered={hovered}
            onHover={setHovered}
          />
        ))}

        {/* ── Map title watermark ─────────────────────────────────────────── */}
        <text
          x={SVG_W - 12}
          y={16}
          textAnchor="end"
          fontSize="10"
          fill="rgba(255,255,255,0.15)"
          fontFamily="monospace"
        >
          ALMATY AIR QUALITY NETWORK
        </text>
      </svg>

      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <MapLegend showRoutes={!!routeResult} />

      {/* ── Stat overlay when route computed ────────────────────────────────── */}
      {routeResult && (
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="rounded-xl bg-black/70 backdrop-blur-sm border border-emerald-500/25 px-3 py-2">
            <div className="text-[9px] font-bold tracking-widest uppercase text-emerald-400/60 mb-1">
              Снижение воздействия
            </div>
            <div className="text-xl font-black text-emerald-400">
              −{routeResult.exposureReductionPct}%
            </div>
          </div>
          <div className="rounded-xl bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-2">
            <div className="text-[9px] font-bold tracking-widest uppercase text-white/30 mb-1">
              Экологичный AQI
            </div>
            <div
              className="text-xl font-black"
              style={{ color: aqiColor(routeResult.clean.avgAqi) }}
            >
              {routeResult.clean.avgAqi}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
