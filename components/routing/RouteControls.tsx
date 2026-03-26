"use client";

import { useState, useCallback } from "react";
import {
  computeRoutes,
  DISTRICTS,
  RouteComparison,
  aqiColor,
  aqiLabel,
} from "@/lib/routing/cleanRoute";

// ─── District selector ────────────────────────────────────────────────────────

interface DistrictSelectProps {
  label: string;
  value: string;
  onChange: (id: string) => void;
  exclude?: string;
}

function DistrictSelect({ label, value, onChange, exclude }: DistrictSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-widest uppercase text-white/40">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl bg-white/8 border border-white/12 text-white text-sm font-medium px-3 py-2.5 pr-8 focus:outline-none focus:border-emerald-500/50 focus:bg-white/12 transition-all cursor-pointer"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {Object.values(DISTRICTS)
            .filter((d) => d.id !== exclude)
            .map((d) => (
              <option key={d.id} value={d.id} style={{ background: "#0f172a" }}>
                {d.nameRu} (AQI {d.aqi})
              </option>
            ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30">
          ▾
        </div>
      </div>
    </div>
  );
}

// ─── AQI badge ────────────────────────────────────────────────────────────────

function AqiBadge({ aqi }: { aqi: number }) {
  const color = aqiColor(aqi);
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      AQI {aqi} · {aqiLabel(aqi)}
    </span>
  );
}

// ─── Route path display (district chips) ─────────────────────────────────────

function RoutePath({
  nodes,
  accentColor,
}: {
  nodes: Array<{ nameRu: string; aqi: number }>;
  accentColor: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 mt-2">
      {nodes.map((n, i) => (
        <div key={i} className="flex items-center gap-1">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
            style={{
              background: `${aqiColor(n.aqi)}20`,
              color: aqiColor(n.aqi),
              border: `1px solid ${aqiColor(n.aqi)}35`,
            }}
          >
            {n.nameRu}
          </span>
          {i < nodes.length - 1 && (
            <span className="text-white/20 text-xs">›</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-0.5"
      style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
    >
      <span className="text-[9px] font-bold tracking-widest uppercase text-white/35">
        {label}
      </span>
      <span className="text-lg font-black text-white leading-none">{value}</span>
      {sub && <span className="text-[10px] text-white/40">{sub}</span>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface RouteControlsProps {
  onRouteComputed: (result: RouteComparison | null) => void;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  startId: string;
  endId: string;
}

export default function RouteControls({
  onRouteComputed,
  onStartChange,
  onEndChange,
  startId,
  endId,
}: RouteControlsProps) {
  const [result, setResult] = useState<RouteComparison | null>(null);
  const [activeTab, setActiveTab] = useState<"clean" | "normal">("clean");
  const [isComputing, setIsComputing] = useState(false);
  const [computed, setComputed] = useState(false);

  const handleCompute = useCallback(() => {
    if (startId === endId) return;
    setIsComputing(true);

    // Micro-delay so the UI renders the loading state before heavy work
    setTimeout(() => {
      const res = computeRoutes(startId, endId);
      setResult(res);
      setComputed(true);
      setIsComputing(false);
      onRouteComputed(res);
    }, 120);
  }, [startId, endId, onRouteComputed]);

  const handleStartChange = useCallback(
    (id: string) => {
      onStartChange(id);
      setResult(null);
      setComputed(false);
      onRouteComputed(null);
    },
    [onStartChange, onRouteComputed]
  );

  const handleEndChange = useCallback(
    (id: string) => {
      onEndChange(id);
      setResult(null);
      setComputed(false);
      onRouteComputed(null);
    },
    [onEndChange, onRouteComputed]
  );

  const activeRoute = result ? result[activeTab] : null;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🌿</span>
          <h2 className="text-sm font-black text-white tracking-tight">
            Чистый маршрут
          </h2>
          <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            AI Routing
          </span>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed">
          Алгоритм Дейкстры выбирает маршрут с минимальным воздействием загрязнения воздуха.
        </p>
      </div>

      {/* District selectors */}
      <div className="grid grid-cols-2 gap-3">
        <DistrictSelect
          label="Откуда"
          value={startId}
          onChange={handleStartChange}
          exclude={endId}
        />
        <DistrictSelect
          label="Куда"
          value={endId}
          onChange={handleEndChange}
          exclude={startId}
        />
      </div>

      {/* Compute button */}
      <button
        onClick={handleCompute}
        disabled={isComputing || startId === endId}
        className="relative w-full py-3 rounded-xl text-sm font-black tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff",
          boxShadow: "0 0 24px -4px rgba(16,185,129,0.4)",
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isComputing ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Вычисление…
            </>
          ) : (
            <>
              <span>🧭</span>
              Найти чистый маршрут
            </>
          )}
        </span>
        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </button>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Route toggle tabs */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/4">
            {(["clean", "normal"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 text-xs font-bold transition-all duration-200 relative"
                style={
                  activeTab === tab
                    ? {
                        background:
                          tab === "clean"
                            ? "rgba(16,185,129,0.2)"
                            : "rgba(239,68,68,0.2)",
                        color: tab === "clean" ? "#34d399" : "#f87171",
                        borderBottom: `2px solid ${tab === "clean" ? "#34d399" : "#f87171"}`,
                      }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {tab === "clean" ? "🌿 Экологичный" : "🔴 Обычный"}
              </button>
            ))}
          </div>

          {/* Stats grid */}
          {activeRoute && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  label="Расстояние"
                  value={`${activeRoute.totalDistanceKm} км`}
                  accent={activeTab === "clean" ? "#10b981" : "#ef4444"}
                />
                <StatCard
                  label="Средний AQI"
                  value={String(activeRoute.avgAqi)}
                  sub={aqiLabel(activeRoute.avgAqi)}
                  accent={activeTab === "clean" ? "#10b981" : "#ef4444"}
                />
              </div>

              {/* Exposure reduction highlight */}
              {activeTab === "clean" && result.exposureReductionPct > 0 && (
                <div className="rounded-xl p-3 border border-emerald-500/30 bg-emerald-500/10">
                  <div className="flex items-start gap-2">
                    <span className="text-lg leading-none mt-0.5">🫁</span>
                    <div>
                      <p className="text-xs font-bold text-emerald-300">
                        Снижение воздействия на{" "}
                        <span className="text-emerald-400 text-sm">
                          {result.exposureReductionPct}%
                        </span>
                      </p>
                      <p className="text-[10px] text-white/45 mt-0.5 leading-relaxed">
                        Экологичный маршрут снижает вдыхание загрязнённого воздуха
                        по сравнению с кратчайшим путём.
                      </p>
                      {result.distanceDeltaPct > 0 && (
                        <p className="text-[10px] text-amber-400/80 mt-1">
                          +{result.distanceDeltaPct}% к расстоянию — ради чистого воздуха.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Route path visualization */}
              <div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-white/30">
                  Маршрут через районы
                </span>
                <RoutePath
                  nodes={activeRoute.path.map((n) => ({
                    nameRu: n.nameRu,
                    aqi: n.aqi,
                  }))}
                  accentColor={activeTab === "clean" ? "#10b981" : "#ef4444"}
                />
              </div>

              {/* AQI breakdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold tracking-widest uppercase text-white/30 mb-1">
                  AQI по районам маршрута
                </span>
                {activeRoute.path.map((node) => (
                  <div key={node.id} className="flex items-center gap-2">
                    <div
                      className="h-1.5 rounded-full flex-shrink-0"
                      style={{
                        width: `${Math.min(100, (node.aqi / 200) * 100)}%`,
                        background: aqiColor(node.aqi),
                        minWidth: 4,
                        maxWidth: "60%",
                      }}
                    />
                    <span className="text-[10px] text-white/50 truncate flex-shrink-0">
                      {node.nameRu}
                    </span>
                    <span
                      className="text-[10px] font-bold ml-auto flex-shrink-0"
                      style={{ color: aqiColor(node.aqi) }}
                    >
                      {node.aqi}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Empty state */}
      {!computed && !isComputing && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-6 opacity-50">
          <span className="text-3xl">🗺️</span>
          <p className="text-xs text-white/40 max-w-[180px]">
            Выберите начальный и конечный районы, затем нажмите кнопку
          </p>
        </div>
      )}
    </div>
  );
}
