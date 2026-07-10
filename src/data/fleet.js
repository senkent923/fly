// Three aircraft tiers. Specs are grounded in real long-range jets
// (regional jet / Airbus A321XLR / Gulfstream G650-class) and restyled
// for AETHER. Each defines an exterior scale and a cabin seat layout.
export const FLEET = [
  {
    id: 'economy',
    tier: 'Эконом',
    model: 'AETHER Air',
    ref: 'на базе Airbus A320neo',
    tagline: 'Просторный узкофюзеляжный лайнер для коротких и средних плеч.',
    classId: 'economy',
    accent: '#8ab4ff',
    specs: [
      { k: 'Дальность', v: '6 300', unit: 'км' },
      { k: 'Скорость', v: '0.78', unit: 'Маха' },
      { k: 'Мест', v: '162', unit: '' },
      { k: 'Ширина кресла', v: '46', unit: 'см' },
    ],
    exteriorScale: 0.82,
    // cabin: 3-3 layout
    cabin: { rows: 9, layout: ['s', 's', 's', 'a', 's', 's', 's'], seatW: 20, seatH: 20, gap: 5 },
    seatProfile: 'economy',
    seatNote: 'Эргономичное кресло, наклон 12°, USB-C и экран 11".',
  },
  {
    id: 'business',
    tier: 'Бизнес',
    model: 'AETHER One',
    ref: 'на базе Airbus A321XLR',
    tagline: 'Тихий сверхдальний джет с горизонтальными лежачими местами.',
    classId: 'business',
    accent: '#F598F2',
    specs: [
      { k: 'Дальность', v: '11 200', unit: 'км' },
      { k: 'Скорость', v: '0.82', unit: 'Маха' },
      { k: 'Мест', v: '48', unit: '' },
      { k: 'Длина места', v: '198', unit: 'см' },
    ],
    exteriorScale: 1,
    // cabin: 1-2-1 lie-flat
    cabin: { rows: 6, layout: ['s', 'a', 's', 's', 'a', 's'], seatW: 30, seatH: 30, gap: 8 },
    seatProfile: 'business',
    seatNote: 'Кресло раскладывается в ровную кровать 198 см, дверь-перегородка.',
  },
  {
    id: 'lux',
    tier: 'Люкс',
    model: 'AETHER Privé',
    ref: 'на базе Gulfstream G650ER',
    tagline: 'Частный борт с отдельными каютами и обзорной палубой.',
    classId: 'first',
    accent: '#ffd27a',
    specs: [
      { k: 'Дальность', v: '13 890', unit: 'км' },
      { k: 'Скорость', v: '0.90', unit: 'Маха' },
      { k: 'Кают', v: '6', unit: '' },
      { k: 'Высота салона', v: '198', unit: 'см' },
    ],
    exteriorScale: 0.7,
    // cabin: private suites 1-1
    cabin: { rows: 4, layout: ['s', 'a', 's'], seatW: 46, seatH: 46, gap: 12 },
    seatProfile: 'lux',
    seatNote: 'Личная каюта с двуспальной кроватью, диваном и душем на борту.',
  },
]
