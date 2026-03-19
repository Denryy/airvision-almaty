import type { AQILevel, ForecastPoint, HealthRecommendation, HourlyDataPoint } from '@/lib/types';

// ─── Lookup tables ────────────────────────────────────────────────────────────

export function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy';
  if (aqi <= 200) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#7ED957';
  if (aqi <= 100) return '#F5C400';
  if (aqi <= 150) return '#FF7E00';
  if (aqi <= 200) return '#FF0000';
  return '#8B00FF';
}

export function getAQIBgClass(aqi: number): string {
  if (aqi <= 50) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (aqi <= 100) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (aqi <= 150) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (aqi <= 200) return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
}

export function getHealthRecommendation(aqi: number): HealthRecommendation {
  if (aqi <= 50)
    return { level: 'Good', message: 'Air quality is excellent. Great day for outdoor activities.', icon: '✅', color: '#7ED957' };
  if (aqi <= 100)
    return { level: 'Moderate', message: 'Acceptable air quality. Sensitive individuals should limit prolonged outdoor exposure.', icon: '⚠️', color: '#F5C400' };
  if (aqi <= 150)
    return { level: 'Unhealthy', message: 'Wear an N95 mask outdoors. Reduce prolonged physical activity outside.', icon: '😷', color: '#FF7E00' };
  if (aqi <= 200)
    return { level: 'Very Unhealthy', message: 'Avoid all outdoor activity. Keep windows closed and use air purifiers.', icon: '🚫', color: '#FF0000' };
  return { level: 'Hazardous', message: 'Emergency conditions. Stay indoors — hazardous levels pose serious health risks.', icon: '☠️', color: '#8B00FF' };
}

// ─── Seeded pseudo-random (deterministic within a session) ───────────────────

function seededNoise(seed: number, amplitude: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return ((x - Math.floor(x)) - 0.5) * 2 * amplitude;
}

// ─── Time-of-day pollution factor ────────────────────────────────────────────
// Almaty: rush hour peaks at 08:00 & 18:00; lowest at 04:00

function timeOfDayFactor(hour: number): number {
  // Rush-hour morning peak
  if (hour >= 7 && hour <= 9) return 1.25;
  // Evening rush peak
  if (hour >= 17 && hour <= 19) return 1.35;
  // Night inversion (cold-air trapping, common in Almaty)
  if (hour >= 22 || hour <= 3) return 1.15;
  // Afternoon wind dispersal
  if (hour >= 12 && hour <= 15) return 0.85;
  return 1.0;
}

// ─── Generate realistic 24 h historical data ─────────────────────────────────

export function generateHourlyData(baseAqi: number): HourlyDataPoint[] {
  const data: HourlyDataPoint[] = [];
  const now = new Date();

  let prev = baseAqi;
  for (let i = 23; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 3_600_000);
    const hour = ts.getHours();

    const tod = timeOfDayFactor(hour);
    // Slow-moving trend component (smooth wave)
    const trend = Math.sin((hour / 24) * Math.PI * 2 - Math.PI * 0.5) * 12;
    // Small random walk — limited so values don't jump wildly
    const noise = seededNoise(i + baseAqi, 8);
    // Momentum: 70 % previous + 30 % new target
    const target = baseAqi * tod + trend + noise;
    prev = prev * 0.7 + target * 0.3;

    const aqi = Math.max(10, Math.min(300, Math.round(prev)));
    data.push({
      time: hour.toString().padStart(2, '0') + ':00',
      aqi,
      pm25: Math.round(aqi * 0.48 + seededNoise(i, 3)),
      co2: Math.round(410 + aqi * 3.2 + seededNoise(i + 50, 20)),
    });
  }
  return data;
}

// ─── Trend slope (last 3 h) ───────────────────────────────────────────────────

export function calcTrend(history: HourlyDataPoint[]): number {
  if (history.length < 3) return 0;
  const recent = history.slice(-3).map((d) => d.aqi);
  return (recent[2] - recent[0]) / 2;
}

// ─── ML-like 24 h forecast ────────────────────────────────────────────────────

const forecastIcons: Record<string, string> = {
  Good: '☀️',
  Moderate: '⛅',
  Unhealthy: '🌫️',
  'Very Unhealthy': '🌧️',
  Hazardous: '🌑',
};

export function predictAQI(currentAqi: number, trendSlope = 0): ForecastPoint[] {
  const forecast: ForecastPoint[] = [];
  const now = new Date();

  // Decay constant: extreme trend fades within ~6 h
  const decayFactor = 0.75;

  let simAqi = currentAqi;
  let simTrend = trendSlope;

  for (let i = 1; i <= 8; i++) {
    const futureHour = (now.getHours() + i * 3) % 24;
    const tod = timeOfDayFactor(futureHour);

    // Weighted target: mean-reversion toward city baseline (100) + tod factor
    const baseline = 90;
    const meanReversion = (baseline - simAqi) * 0.08;
    const noise = seededNoise(i * 7 + currentAqi, 6);

    simTrend = simTrend * decayFactor + noise * 0.3;
    simAqi = simAqi + simTrend + meanReversion + (tod - 1) * 15;
    simAqi = Math.max(10, Math.min(300, simAqi));

    const rounded = Math.round(simAqi);
    const level = getAQILevel(rounded);
    const labelKey = level === 'Very Unhealthy' ? 'Very Unhealthy' : level;

    forecast.push({
      time: futureHour.toString().padStart(2, '0') + ':00',
      aqi: rounded,
      label: (level === 'Very Unhealthy' ? 'Unhealthy' : level) as ForecastPoint['label'],
      icon: forecastIcons[labelKey] ?? '🌫️',
    });
  }
  return forecast;
}

// ─── Real-time tick: realistic AQI delta ─────────────────────────────────────
// Called every N seconds to nudge the current AQI realistically

export function simulateTick(current: number, trend: number): number {
  const hour = new Date().getHours();
  const tod = timeOfDayFactor(hour);
  const baseline = 90;
  const meanReversion = (baseline * tod - current) * 0.03;
  const noise = (Math.random() - 0.5) * 4;
  const next = current + trend * 0.1 + meanReversion + noise;
  return Math.max(10, Math.min(300, Math.round(next)));
}
