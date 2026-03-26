"use client";

import { useState, useCallback } from "react";
import { RouteComparison } from "@/lib/routing/cleanRoute";
import RouteControls from "@/components/routing/RouteControls";
import AirQualityMap from "@/components/AirQualityMap";

/**
 * CleanRouteSection
 *
 * Drop this into your page wherever you want the Clean Route feature to appear.
 *
 * Usage in app/page.tsx:
 *   import CleanRouteSection from "@/components/routing/CleanRouteSection";
 *   ...
 *   <CleanRouteSection />
 */
export default function CleanRouteSection() {
  const [startId, setStartId] = useState<string>("alatau");
  const [endId,   setEndId]   = useState<string>("medeu");
  const [routeResult, setRouteResult] = useState<RouteComparison | null>(null);
  const [activeTab, setActiveTab] = useState<"clean" | "normal">("clean");

  const handleRouteComputed = useCallback((result: RouteComparison | null) => {
    setRouteResult(result);
    setActiveTab("clean");
  }, []);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4  w-80 h-80 rounded-full bg-emerald-600/8  blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/8 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
              Геопространственный AI
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            Умная{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              навигация
            </span>
          </h2>
          <p className="mt-4 text-sm text-white/45 max-w-lg mx-auto leading-relaxed">
            Алгоритм Дейкстры прокладывает маршрут через Алматы с минимальным
            воздействием загрязнённого воздуха — в реальном времени.
          </p>
        </div>

        {/* Main layout: controls left, map right */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-stretch">
          {/* ── Controls panel ── */}
          <div
            className="rounded-2xl border border-white/10 p-5 flex flex-col"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <RouteControls
              startId={startId}
              endId={endId}
              onStartChange={setStartId}
              onEndChange={setEndId}
              onRouteComputed={handleRouteComputed}
            />
          </div>

          {/* ── Map panel ── */}
          <div className="min-h-[420px] lg:min-h-0">
            <AirQualityMap
              routeResult={routeResult}
              startId={startId}
              endId={endId}
              activeTab={activeTab}
            />
          </div>
        </div>

        {/* Algorithm explainer strip */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🗂️",
              title: "Граф районов",
              desc: "8 районов Алматы — узлы графа. Рёбра — реальные маршруты между соседними районами.",
            },
            {
              icon: "📐",
              title: "Функция стоимости",
              desc: "cost = расстояние × (1 + AQI / 100). Загрязнённые районы стоят дороже при обходе.",
            },
            {
              icon: "⚡",
              title: "Алгоритм Дейкстры",
              desc: "Находит путь с минимальной взвешенной стоимостью — кратчайший по «загрязнённости».",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/8 px-4 py-3 flex items-start gap-3"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <div className="text-xs font-bold text-white mb-0.5">{item.title}</div>
                <div className="text-[11px] text-white/40 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
