<div align="center">

# 🌬️ AirVision Almaty

**Платформа мониторинга качества воздуха Алматы: карта AQI по районам, прогноз на 24 часа и «чистые» маршруты по городу**

[![Demo](https://img.shields.io/badge/demo-airvision--almaty.vercel.app-7ED957?style=for-the-badge&logo=vercel&logoColor=white)](https://airvision-almaty.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)

</div>

---

## 💡 Идея

Зимой Алматы регулярно попадает в списки городов с самым грязным воздухом: смог держится в котловине из-за температурной инверсии и пробок. AirVision показывает, **где** в городе сейчас дышать тяжелее, **как** будет меняться ситуация в ближайшие часы и **каким путём** проехать, чтобы миновать самые загрязнённые районы.

## ✨ Возможности

| | Функция | Как работает |
|---|---|---|
| 🗺️ | **Карта AQI по районам** | Leaflet-карта 8 районов (Алмалинский, Бостандыкский, Медеуский, Ауэзовский и др.) с цветовой шкалой AQI |
| ⏱️ | **Live-обновление** | Каждые 7 секунд значения сдвигаются симуляцией: среднее возвращается к базовому уровню, плюс суточный фактор и шум |
| 📈 | **Прогноз на 24 часа** | 8 точек с шагом 3 часа: учитывает тренд за последние 3 часа (с затуханием), час пик в 08:00 и 18:00, ночную инверсию |
| 🩺 | **Рекомендации по здоровью** | 5 уровней AQI (Good → Hazardous) с советами: маска N95, закрыть окна и т.д. |
| 🧭 | **Чистые маршруты** | Алгоритм Дейкстры по графу районов с весом `distance_km × (1 + AQI / 100)`, поэтому маршрут обходит грязные районы |
| 🔔 | **Алерты** | Toast-уведомление, когда AQI города пересекает порог 120, и лента уведомлений |
| 🌱 | **Eco Score** | Итоговая оценка города 0–100 по среднему AQI районов |
| 🌗 | **Тёмная / светлая тема** | Переключатель в настройках, состояние в Zustand |

> [!NOTE]
> Это MVP: данные датчиков пока **моковые** (`data/mockAirData.json`), а «живые» обновления и прогноз считает детерминированная симуляция в `lib/ai/predict.ts`. Чтобы подключить реальный источник (IQAir, OpenAQ, AirKaz), достаточно заменить функции в `lib/api/airData.ts`.

## 📱 Страницы

| Маршрут | Экран |
|---|---|
| `/` | Карта + текущий AQI, прогноз, погодные условия, рекомендации |
| `/routing` | Построение «чистого» маршрута между районами |
| `/dashboard` | Графики трендов AQI, PM2.5, CO₂ (Recharts) |
| `/notifications` | Лента алертов |
| `/settings` | Тема и настройки уведомлений |

## 🚀 Запуск

```bash
git clone https://github.com/Denryy/airvision-almaty.git
cd airvision-almaty
npm install
npm run dev
```

Открой http://localhost:3000.

```bash
npm run build && npm start   # production-сборка
npm run lint                 # ESLint
```

## 🗂️ Структура

```text
app/                  # страницы (App Router): /, /routing, /dashboard, /notifications, /settings
components/
  cards/              # AQIGauge, ForecastCard, HealthCard, ConditionsCard, EcoScoreCard
  charts/             # TrendChart (Recharts)
  map/                # AirQualityMap (Leaflet, без SSR)
  routing/            # UI построения маршрута
  ui/                 # Navbar, Card, ToastContainer
lib/
  ai/predict.ts       # уровни AQI, симуляция, прогноз
  api/airData.ts      # слой данных (сейчас mock)
  routing/cleanRoute.ts  # Дейкстра с учётом загрязнения
  hooks/useRealTimeData.ts
store/appStore.ts     # Zustand: тема, уведомления, тосты
data/mockAirData.json # данные районов
```

## 🛣️ Планы

- [ ] Реальные данные с открытых API датчиков
- [ ] Прогноз на ML-модели вместо эвристики (погода + история)
- [ ] Маршруты по реальной дорожной сети, а не по центрам районов
- [ ] Push-уведомления

---

<div align="center">
  <sub>Автор: <a href="https://github.com/Denryy">Arman Zhetessov</a></sub>
</div>
