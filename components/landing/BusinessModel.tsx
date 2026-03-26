"use client";

import { useEffect, useRef, useState } from "react";

const plans = [
  {
    tier: "B2G",
    name: "Government",
    icon: "🏛️",
    tagline: "City-scale intelligence",
    price: "Custom",
    unit: "per city / year",
    accent: "#f97316",
    features: [
      "Full sensor network deployment",
      "Real-time city dashboard",
      "AI policy recommendation engine",
      "Traffic & eco-zone automation",
      "24/7 dedicated support SLA",
      "White-label reporting portal",
    ],
    cta: "Request a demo",
    highlight: false,
  },
  {
    tier: "B2B",
    name: "Enterprise API",
    icon: "⚡",
    tagline: "Data as a service",
    price: "from $299",
    unit: "per month",
    accent: "#818cf8",
    features: [
      "REST & WebSocket AQI API",
      "Historical dataset access",
      "AI forecast endpoints",
      "Up to 1M requests / month",
      "99.9% uptime SLA",
      "Sandbox + production keys",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    tier: "B2C",
    name: "Mobile Pro",
    icon: "📱",
    tagline: "Your personal air shield",
    price: "$4.99",
    unit: "per month",
    accent: "#34d399",
    features: [
      "72-hr personal AQI forecast",
      "Smart route navigation",
      "Health impact scoring",
      "Push alerts for your zones",
      "Wear OS / Apple Watch sync",
      "Family sharing (5 profiles)",
    ],
    cta: "Download app",
    highlight: false,
  },
];

export default function BusinessModel() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Subtle separator line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/5 blur-3xl rounded-full" />
      </div>

      <div ref={ref} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
              Revenue Model
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Бизнес{" "}
            <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
              модель
            </span>
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-lg mx-auto">
            Three revenue streams designed to scale from city halls to individual users — sustainable, diverse, and investor-ready.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={plan.tier}
              className="relative rounded-2xl flex flex-col transition-all duration-500 hover:-translate-y-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
                background: plan.highlight
                  ? `linear-gradient(145deg, ${plan.accent}18, ${plan.accent}08)`
                  : "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                border: plan.highlight
                  ? `1px solid ${plan.accent}50`
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: plan.accent, color: "#0f172a" }}
                >
                  Most Popular
                </div>
              )}

              {/* Top accent line */}
              <div
                className="h-px rounded-full mx-6 mt-0 opacity-60"
                style={{ background: plan.highlight ? plan.accent : `${plan.accent}50` }}
              />

              <div className="p-6 flex flex-col flex-1">
                {/* Header row */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: `${plan.accent}20`, border: `1px solid ${plan.accent}30` }}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <div
                      className="text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: plan.accent }}
                    >
                      {plan.tier}
                    </div>
                    <div className="text-sm font-bold text-white">{plan.name}</div>
                  </div>
                </div>

                <p className="text-xs text-white/40 mb-5">{plan.tagline}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-white/30 ml-1.5">{plan.unit}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                      <svg
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <circle cx="7" cy="7" r="6" fill={`${plan.accent}20`} />
                        <path
                          d="M4.5 7l2 2 3-3"
                          stroke={plan.accent}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-100"
                  style={
                    plan.highlight
                      ? {
                          background: plan.accent,
                          color: "#0f172a",
                        }
                      : {
                          background: `${plan.accent}15`,
                          color: plan.accent,
                          border: `1px solid ${plan.accent}30`,
                        }
                  }
                >
                  {plan.cta} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <div
          className="mt-12 rounded-2xl bg-white/[0.03] border border-white/8 p-5 flex flex-wrap items-center justify-center gap-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          {[
            { icon: "🔒", label: "ISO 27001 compliant" },
            { icon: "📊", label: "GDPR ready" },
            { icon: "🌐", label: "99.9% uptime SLA" },
            { icon: "🤝", label: "Dedicated onboarding" },
            { icon: "🚀", label: "Scales to 10M+ users" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-base">{item.icon}</span>
              <span className="text-xs text-white/40 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
