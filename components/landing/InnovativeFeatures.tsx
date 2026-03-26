"use client";

import { useEffect, useRef, useState } from "react";

// ─── Mini sparkline chart for AI Forecast card ───────────────────────────────
const AQIForecastChart = () => {
  const points = [
    { hour: "Now", aqi: 78, label: "Moderate" },
    { hour: "6h", aqi: 92, label: "Moderate" },
    { hour: "12h", aqi: 115, label: "Unhealthy" },
    { hour: "18h", aqi: 88, label: "Moderate" },
    { hour: "24h", aqi: 62, label: "Good" },
    { hour: "48h", aqi: 45, label: "Good" },
    { hour: "72h", aqi: 38, label: "Good" },
  ];

  const maxAqi = 130;
  const w = 280;
  const h = 80;
  const pad = { x: 0, y: 8 };

  const toX = (i: number) =>
    pad.x + (i / (points.length - 1)) * (w - pad.x * 2);
  const toY = (v: number) =>
    pad.y + (1 - v / maxAqi) * (h - pad.y * 2);

  const polyline = points
    .map((p, i) => `${toX(i)},${toY(p.aqi)}`)
    .join(" ");

  const areaPath = [
    `M ${toX(0)},${h}`,
    ...points.map((p, i) => `L ${toX(i)},${toY(p.aqi)}`),
    `L ${toX(points.length - 1)},${h}`,
    "Z",
  ].join(" ");

  const color = (aqi: number) =>
    aqi < 50 ? "#22c55e" : aqi < 100 ? "#f59e0b" : "#ef4444";

  return (
    <div className="mt-4 rounded-xl bg-black/40 border border-white/10 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">
          72-hr AI Forecast
        </span>
        <span className="text-[10px] text-white/40">AQI Index</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <polyline
          points={polyline}
          fill="none"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={toX(i)}
            cy={toY(p.aqi)}
            r="3"
            fill={color(p.aqi)}
            stroke="#0f172a"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {points.map((p, i) => (
          <span key={i} className="text-[9px] text-white/30">
            {p.hour}
          </span>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        {[
          { label: "Good", color: "bg-emerald-500" },
          { label: "Moderate", color: "bg-amber-400" },
          { label: "Unhealthy", color: "bg-red-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[9px] text-white/40">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Mock map for Smart Routes card ──────────────────────────────────────────
const SmartRouteMap = () => {
  return (
    <div className="mt-4 rounded-xl bg-black/40 border border-white/10 p-3 relative overflow-hidden">
      {/* Grid lines simulating a map */}
      <svg
        viewBox="0 0 280 100"
        className="w-full absolute inset-0 opacity-20"
        style={{ height: "100%" }}
      >
        {[0, 40, 80, 120, 160, 200, 240, 280].map((x) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={x}
            y2={100}
            stroke="#64748b"
            strokeWidth="0.5"
          />
        ))}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={280}
            y2={y}
            stroke="#64748b"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      <svg viewBox="0 0 280 100" className="w-full relative z-10" style={{ height: 100 }}>
        {/* Pollution zone */}
        <ellipse cx="140" cy="50" rx="55" ry="30" fill="#ef444430" />
        <ellipse cx="140" cy="50" rx="55" ry="30" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
        <text x="125" y="54" fontSize="8" fill="#ef4444" fontFamily="monospace">AQI 145</text>

        {/* Dirty route */}
        <path
          d="M 20 70 Q 80 20 140 50 Q 180 70 260 30"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeDasharray="6 3"
          opacity="0.7"
        />

        {/* Clean route */}
        <path
          d="M 20 70 Q 20 90 100 90 Q 180 90 260 30"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Start */}
        <circle cx="20" cy="70" r="5" fill="#6366f1" />
        <text x="26" y="68" fontSize="8" fill="#a5b4fc">Start</text>

        {/* End */}
        <circle cx="260" cy="30" r="5" fill="#6366f1" />
        <text x="236" y="28" fontSize="8" fill="#a5b4fc">End</text>
      </svg>

      <div className="flex gap-4 mt-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-emerald-500 rounded" />
          <span className="text-[10px] text-emerald-400 font-medium">Clean route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-px bg-red-500 rounded border-t border-dashed border-red-500" />
          <span className="text-[10px] text-red-400 font-medium">Polluted route</span>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard for Smart City Integration card ────────────────────────────────
const SmartCityDashboard = () => {
  const stats = [
    { label: "Avg AQI", value: "87", unit: "", delta: "-12%", good: true },
    { label: "Eco Zones", value: "14", unit: "active", delta: "+3", good: true },
    { label: "Vehicles", value: "42k", unit: "/hr", delta: "-8%", good: true },
    { label: "Alerts", value: "2", unit: "critical", delta: "+1", good: false },
  ];

  const zones = [
    { name: "Almaty Center", aqi: 112, pct: 86, color: "#f59e0b" },
    { name: "Alatau District", aqi: 68, pct: 52, color: "#22c55e" },
    { name: "Bostandyk", aqi: 145, pct: 100, color: "#ef4444" },
  ];

  return (
    <div className="mt-4 rounded-xl bg-black/40 border border-white/10 p-3 space-y-3">
      <div className="grid grid-cols-4 gap-1.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-white/5 p-2 text-center">
            <div className="text-sm font-bold text-white leading-none">{s.value}</div>
            <div className="text-[8px] text-white/40 mt-0.5 leading-tight">{s.label}</div>
            <div className={`text-[8px] mt-0.5 font-semibold ${s.good ? "text-emerald-400" : "text-red-400"}`}>
              {s.delta}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {zones.map((z) => (
          <div key={z.name}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[9px] text-white/50">{z.name}</span>
              <span className="text-[9px] font-bold" style={{ color: z.color }}>
                AQI {z.aqi}
              </span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${z.pct}%`, backgroundColor: z.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Feature card wrapper ─────────────────────────────────────────────────────
interface FeatureCardProps {
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  accent: string;
  children: React.ReactNode;
  delay?: number;
}

const FeatureCard = ({
  badge,
  badgeColor,
  icon,
  title,
  subtitle,
  description,
  bullets,
  accent,
  children,
  delay = 0,
}: FeatureCardProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 flex flex-col transition-all duration-500 hover:border-white/20 hover:from-white/[0.10] hover:to-white/[0.04] hover:-translate-y-1"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s, background 0.3s, box-shadow 0.3s`,
        boxShadow: "0 0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px -10px ${accent}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent";
      }}
    >
      {/* Glow accent top-left */}
      <div
        className="absolute -top-px left-8 right-8 h-px rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
        >
          {icon}
        </div>
        <span
          className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
          style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}
        >
          {badge}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
      <p className="text-xs text-white/40 font-medium mt-0.5 mb-2">{subtitle}</p>
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>

      <ul className="mt-3 space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/50">
            <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
            {b}
          </li>
        ))}
      </ul>

      {children}
    </div>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────
export default function InnovativeFeatures() {
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTitleVisible(true);
      },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-600/8 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div
          ref={titleRef}
          className="text-center mb-16"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            Инновационные{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              возможности
            </span>
          </h2>
          <p className="mt-4 text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Three breakthrough technologies that turn raw sensor data into actionable intelligence — for citizens, businesses, and city governments.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            badge="AI-Powered"
            badgeColor="#818cf8"
            icon="🧠"
            title="AI Air Quality Forecast"
            subtitle="Predict · Prepare · Protect"
            description="Our LSTM neural network fuses 3 years of historical AQI data with live weather feeds to generate hour-by-hour forecasts up to 72 hours ahead."
            bullets={[
              "24 / 48 / 72-hour predictions",
              "Weather & traffic data fusion",
              "Confidence intervals per zone",
            ]}
            accent="#818cf8"
            delay={0}
          >
            <AQIForecastChart />
          </FeatureCard>

          <FeatureCard
            badge="Health Navigation"
            badgeColor="#34d399"
            icon="🗺️"
            title="Smart Clean Routes"
            subtitle="Navigate · Breathe · Live"
            description="Real-time routing engine calculates the lowest-pollution path between any two points in Almaty, updating every 5 minutes as sensor data changes."
            bullets={[
              "Avoids high-AQI zones dynamically",
              "Integrates with walking & cycling modes",
              "Personal health profile settings",
            ]}
            accent="#34d399"
            delay={100}
          >
            <SmartRouteMap />
          </FeatureCard>

          <FeatureCard
            badge="B2G Platform"
            badgeColor="#fb923c"
            icon="🏙️"
            title="Smart City Integration"
            subtitle="Govern · Optimize · Sustain"
            description="A B2G analytics dashboard that gives city officials real-time control over eco-zones, traffic restrictions, and air quality alerts — backed by AI recommendations."
            bullets={[
              "AI-driven traffic management triggers",
              "Eco-zone enforcement automation",
              "Government-grade audit trail",
            ]}
            accent="#fb923c"
            delay={200}
          >
            <SmartCityDashboard />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
