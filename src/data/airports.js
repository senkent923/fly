// Real airports with coordinates. Prices and durations are derived from the
// great-circle distance so any pair of airports yields realistic numbers.
export const AIRPORTS = [
  { code: 'SVO', city: 'Москва', name: 'Шереметьево', country: 'Россия', lat: 55.9736, lon: 37.4125 },
  { code: 'LED', city: 'Санкт-Петербург', name: 'Пулково', country: 'Россия', lat: 59.8003, lon: 30.2625 },
  { code: 'AER', city: 'Сочи', name: 'Адлер', country: 'Россия', lat: 43.4499, lon: 39.9566 },
  { code: 'KZN', city: 'Казань', name: 'Казань', country: 'Россия', lat: 55.6062, lon: 49.2787 },
  { code: 'SVX', city: 'Екатеринбург', name: 'Кольцово', country: 'Россия', lat: 56.7431, lon: 60.8027 },
  { code: 'IST', city: 'Стамбул', name: 'Istanbul Airport', country: 'Турция', lat: 41.2753, lon: 28.7519 },
  { code: 'DXB', city: 'Дубай', name: 'Dubai Intl', country: 'ОАЭ', lat: 25.2532, lon: 55.3657 },
  { code: 'CDG', city: 'Париж', name: 'Charles de Gaulle', country: 'Франция', lat: 49.0097, lon: 2.5479 },
  { code: 'LHR', city: 'Лондон', name: 'Heathrow', country: 'Великобритания', lat: 51.47, lon: -0.4543 },
  { code: 'MLE', city: 'Мальдивы', name: 'Velana Intl', country: 'Мальдивы', lat: 4.1918, lon: 73.5291 },
  { code: 'BKK', city: 'Бангкок', name: 'Suvarnabhumi', country: 'Таиланд', lat: 13.69, lon: 100.7501 },
  { code: 'DPS', city: 'Бали', name: 'Ngurah Rai', country: 'Индонезия', lat: -8.7482, lon: 115.1672 },
  { code: 'HND', city: 'Токио', name: 'Haneda', country: 'Япония', lat: 35.5494, lon: 139.7798 },
  { code: 'JFK', city: 'Нью-Йорк', name: 'John F. Kennedy', country: 'США', lat: 40.6413, lon: -73.7781 },
]

export const CLASSES = [
  { id: 'economy', label: 'Стандарт', mult: 1 },
  { id: 'business', label: 'Бизнес', mult: 1.85 },
  { id: 'first', label: 'Приват', mult: 2.9 },
]

export function findAirport(code) {
  return AIRPORTS.find((a) => a.code === code)
}

function toRad(d) {
  return (d * Math.PI) / 180
}

// Great-circle distance in km.
export function distanceKm(a, b) {
  if (!a || !b) return 0
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Flight time incl. taxi/climb, returned as { hours, label }.
export function flightDuration(km) {
  const hours = km / 815 + 0.6
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return { hours, label: `${h} ч ${m.toString().padStart(2, '0')} м` }
}

// Per-seat fare priced on flight hours, calibrated to real premium
// private-aviation levels (charter-grade, split across the cabin).
export function basePrice(km) {
  const hours = km / 815 + 0.6
  return Math.round((hours * 55000 + 30000) / 1000) * 1000
}

// Round trips price both legs at a ~5% return discount, like real fares.
export const ROUND_TRIP_FACTOR = 1.9

export function priceFor(km, classId, pax = 1, round = false) {
  const cls = CLASSES.find((c) => c.id === classId) || CLASSES[0]
  const legs = round ? ROUND_TRIP_FACTOR : 1
  return Math.round((basePrice(km) * cls.mult * pax * legs) / 1000) * 1000
}

export function formatRub(n) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(n)
}
