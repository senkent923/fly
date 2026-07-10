// Атмосферные фоновые ролики для кроссфейда в hero-секции.
// Каждый ролик — визуальное настроение фирменного маршрута.
export const SCENES = [
  {
    id: 'aurora',
    label: 'СЕВЕРНОЕ СИЯНИЕ',
    route: 'МОСКВА — МУРМАНСК',
    accent: '#F598F2',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
  },
  {
    id: 'meridian',
    label: 'НОЧНОЙ МЕРИДИАН',
    route: 'МОСКВА — ТОКИО',
    accent: '#FFFFFF',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
  },
  {
    id: 'horizon',
    label: 'ГОРИЗОНТ',
    route: 'ДУБАЙ — МАЛЬДИВЫ',
    accent: '#FFFFFF',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4',
  },
]

export const DESTINATIONS = [
  { code: 'AER', city: 'Сочи', time: '2 ч 25 м', tag: 'Море и горы' },
  { code: 'LED', city: 'Санкт-Петербург', time: '1 ч 20 м', tag: 'Белые ночи' },
  { code: 'DXB', city: 'Дубай', time: '5 ч 10 м', tag: 'Золотой час' },
  { code: 'MLE', city: 'Мальдивы', time: '8 ч 40 м', tag: 'Над водой' },
  { code: 'IST', city: 'Стамбул', time: '3 ч 05 м', tag: 'Два берега' },
  { code: 'DPS', city: 'Бали', time: '12 ч 30 м', tag: 'Тропики' },
]

export const MARQUEE = [
  'ЧАСТНЫЕ ТЕРМИНАЛЫ',
  'ЛОЖА-КРОВАТЬ',
  'ПОСАДКА БЕЗ ОЧЕРЕДЕЙ',
  'УГЛЕРОДНО-НЕЙТРАЛЬНЫЙ ФЛОТ',
  'СОБСТВЕННЫЙ СОМЕЛЬЕ',
  'МАРШРУТ ПО ЗАПРОСУ',
]

export const CABINS = [
  {
    n: '01',
    name: 'Ателье',
    desc: 'Полностью закрытая каюта с дверью, кроватью в полный рост и панорамным иллюминатором во весь борт.',
    detail: 'Одноместная',
  },
  {
    n: '02',
    name: 'Салон',
    desc: 'Каюта для двоих: кресла напротив, которые превращаются в двуспальную кровать, и стол, сервированный к ужину на высоте.',
    detail: 'Двухместная',
  },
  {
    n: '03',
    name: 'Палуба',
    desc: 'Обзорная гостиная над крылом — панорамное остекление, бар и пространство, чтобы просто встать и замереть.',
    detail: 'Общая зона',
  },
]
