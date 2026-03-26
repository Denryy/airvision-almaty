"use client";

import { useEffect, useRef, useState } from "react";

const plans = [
  {
    tier: "B2G",
    name: "Государственный сектор",
    icon: "🏛️",
    tagline: "Интеллект для управления городом",
    price: "По запросу",
    unit: "за город / год",
    accent: "#f97316",
    features: [
      "Полное развертывание сети датчиков",
      "Панель мониторинга города в реальном времени",
      "AI-рекомендации для управления экологией",
      "Автоматизация трафика и эко-зон",
      "Круглосуточная поддержка (SLA)",
      "Персонализированный портал отчетности",
    ],
    cta: "Запросить демо",
    highlight: false,
  },
  {
    tier: "B2B",
    name: "API для бизнеса",
    icon: "⚡",
    tagline: "Данные как сервис",
    price: "от $299",
    unit: "в месяц",
    accent: "#818cf8",
    features: [
      "REST и WebSocket API для AQI",
      "Доступ к историческим данным",
      "AI-прогноз качества воздуха",
      "До 1 млн запросов в месяц",
      "99.9% стабильность (SLA)",
      "Тестовая и продакшн среда",
    ],
    cta: "Начать бесплатно",
    highlight: true,
  },
  {
    tier: "B2C",
    name: "Мобильное приложение Pro",
    icon: "📱",
    tagline: "Персональная защита от загрязнения",
    price: "$4.99",
    unit: "в месяц",
    accent: "#34d399",
    features: [
      "Персональный прогноз AQI на 72 часа",
      "Умные маршруты с чистым воздухом",
      "Оценка влияния на здоровье",
      "Push-уведомления по районам",
      "Синхронизация с носимыми устройствами",
      "Семейный доступ (до 5 пользователей)",
    ],
    cta: "Скачать приложение",
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
              Модель монетизации
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Бизнес{" "}
            <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
              модель
            </span>
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-lg mx-auto">
            Три источника дохода, позволяющие масштабировать проект от городских служб до обычных пользователей — устойчиво, эффективно и привлекательно для инвесторов.
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
                  Популярный тариф
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
            { icon: "🔒", label: "Соответствие стандарту ISO 27001" },
            { icon: "📊", label: "Прозрачная система контроля и отчетности" },
            { icon: "🌐", label: "99.9% доступность сервиса" },
            { icon: "🤝", label: "Персональное подключение " },
            { icon: "🚀", label: "Масштабируемость до 10M+ пользователей" },
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
