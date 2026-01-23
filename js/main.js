const DATA_SOURCES = ['data/programs.csv', 'Ресоциализация СВО - Итог.csv'];
const DIAGNOSTICS_ENABLED = false;

let programs = [];

const searchInput = document.getElementById('searchInput');
const formatSelect = document.getElementById('formatSelect');
const baseEducationSelect = document.getElementById('baseEducationSelect');
const baseEducationHint = document.getElementById('baseEducationHint');
const directionSelect = document.getElementById('directionSelect');
const districtSelect = document.getElementById('districtSelect');
const budgetToggle = document.getElementById('budgetToggle');
const resetFiltersButton = document.getElementById('resetFilters');
const resetFiltersEmptyButton = document.getElementById('resetFiltersEmpty');
const clearSearchButton = document.getElementById('clearSearch');
const grid = document.getElementById('programGrid');
const totalVisible = document.getElementById('totalVisible');
const activeFilters = document.getElementById('activeFilters');
const emptyState = document.getElementById('emptyState');

const CANONICAL_DIRECTIONS = [
  'Агро, ветеринария и пищевые технологии',
  'Здравоохранение и биотехнологии',
  'Машиностроение и производственные технологии',
  'Нефтегазовая промышленность и недропользование',
  'Образование и гуманитарные направления',
  'Право, управление и коммуникации',
  'Строительство, архитектура и геоданные',
];

const BASE_EDUCATION_RULES = [
  {
    value: 'Основное общее (9 классов)',
    allowedFormats: ['СПО'],
    hint: 'После 9 классов доступны только программы СПО.',
  },
  {
    value: 'Среднее общее (11 классов)',
    allowedFormats: ['СПО', 'ВО'],
    hint: 'После 11 классов доступны программы СПО и ВО.',
  },
  {
    value: 'Среднепрофессиональное (СПО)',
    allowedFormats: ['СПО', 'ВО'],
    hint: 'После СПО доступны программы СПО и ВО.',
  },
  {
    value: 'Высшее (ВО)',
    allowedFormats: ['ВО'],
    hint: 'После ВО доступны программы ВО.',
  },
];

const DIRECTION_EXACT_MAP = new Map([
  ['агро и пищевые технологии', 'Агро, ветеринария и пищевые технологии'],
  ['здравоохранение', 'Здравоохранение и биотехнологии'],
  ['машиностроение', 'Машиностроение и производственные технологии'],
  ['нефтегазовая промышленность', 'Нефтегазовая промышленность и недропользование'],
  ['образование и гуманитарные', 'Образование и гуманитарные направления'],
  ['право и управление', 'Право, управление и коммуникации'],
  ['строительство и архитектура', 'Строительство, архитектура и геоданные'],
]);

const DIRECTION_KEYWORDS = [
  {
    label: 'Агро, ветеринария и пищевые технологии',
    keywords: ['агро', 'ветеринар', 'пищев', 'агропром'],
  },
  {
    label: 'Здравоохранение и биотехнологии',
    keywords: ['здравоохран', 'биотех', 'медицин', 'фарма', 'клинич', 'биомед'],
  },
  {
    label: 'Машиностроение и производственные технологии',
    keywords: [
      'машиностро',
      'производств',
      'транспорт',
      'бпла',
      'энергетик',
      'электросет',
      'механ',
      'станко',
      'авиа',
    ],
  },
  {
    label: 'Нефтегазовая промышленность и недропользование',
    keywords: ['нефт', 'газ', 'недропольз', 'горн', 'геолог', 'бур'],
  },
  {
    label: 'Образование и гуманитарные направления',
    keywords: ['образован', 'гуманитар', 'педагог', 'социолог', 'психолог', 'культур', 'филолог'],
  },
  {
    label: 'Право, управление и коммуникации',
    keywords: ['прав', 'юрид', 'управлен', 'коммуникац', 'эконом', 'финанс', 'менедж', 'маркет'],
  },
  {
    label: 'Строительство, архитектура и геоданные',
    keywords: ['строител', 'архитект', 'геодан', 'геодез', 'кадастр', 'землеустр', 'урбан'],
  },
];

const FEDERAL_DISTRICTS = [
  {
    district: 'Центральный федеральный округ',
    regions: [
      'Москва',
      'Зеленоград',
      'Дмитров',
      'Долгопрудный',
      'Егорьевск',
      'Жуковский',
      'Королёв',
      'Красногорск',
      'Люберцы',
      'Мытищи',
      'Ногинск',
      'Орехово-Зуево',
      'Реутов',
      'Ступино',
      'Фрязино',
      'Щёлково',
      'Троицк',
      'Белгород',
      'Алексеевка',
      'Борисоглебск',
      'Старый Оскол',
      'Бобров',
      'Брянск',
      'Владимир',
      'Воронеж',
      'Иваново',
      'Калуга',
      'Ковров',
      'Курск',
      'Липецк',
      'липецк',
      'Орел',
      'Орёл',
      'Рязань',
      'Ряжск',
      'Смоленск',
      'Тамбов',
      'Тверь',
      'Тула',
      'Ярославль',
      'Переславль-Залесский',
      'Елец',
      'Железногорск',
      'Кирсанов',
      'Кашин',
      'Кимры',
      'Муром',
      'Богородицк',
      'Болохово',
      'Рыбинск',
    ],
  },
  {
    district: 'Северо-Западный федеральный округ',
    regions: [
      'Санкт-Петербург',
      'Санкт-петербург',
      'Калининград',
      'Калининград ',
      'Архангельск',
      'Вологда',
      'Череповец',
      'Мурманск',
      'Апатиты',
      'Петрозаводск',
      'петрозаводск',
      'Сыктывкар',
      'Ухта',
      'Котлас',
      'Каргополь',
      'Луга',
      'Ленинградская область',
      'Великий Новгород',
      'Псков',
      'Боровичи',
      'Великий Устюг',
    ],
  },
  {
    district: 'Южный федеральный округ',
    regions: [
      'Ростов-на-Дону',
      'Ростов на дону',
      'Ростов‑на‑Дону',
      'Ростовская область',
      'Новочеркасск',
      'Шахты',
      'Каменск-Шахтинский',
      'Волгодонск',
      'Краснодар',
      'Новороссийск',
      'Апшеронск',
      'Астрахань',
      'Ахтубинск',
      'Волгоград',
      'Волжский',
      'Севастополь',
      'Симферополь',
      'Симферопль',
      'Ялта',
      'Керчь',
      'Евпатория',
      'Республика Крым',
      'Рекспублика Крым',
      'Мелитополь',
      'Элиста',
      'Майкоп',
    ],
  },
  {
    district: 'Северо-Кавказский федеральный округ',
    regions: [
      'Грозный',
      'Владикавказ',
      'Нальчик',
      'Махачкала',
      'Каспийск',
      'Кизляр',
      'Карачаевск',
      'Черкесск',
      'Пятигорск',
      'Минеральные Воды',
      'Невинномысск',
      'Ставрополь',
      'Ардон',
    ],
  },
  {
    district: 'Приволжский федеральный округ',
    regions: [
      'Казань',
      ' Казань',
      'Альметьевск',
      'Арск',
      'Лаишево',
      'Набережные Челны',
      'Нижнекамск',
      'Йошкар-Ола',
      'Йошкар‑Ола',
      'Саранск',
      'Республика Мордовия',
      'Пенза',
      'Самара',
      'Саратов',
      'Энгельс',
      'Тольятти',
      'Тольяти',
      'Ульяновск',
      'Оренбург',
      'Пермь',
      'Ижевск',
      'Чебоксары',
      'Киров',
      'Княгинино',
      'Бор',
      'Дзержинск',
      'Нижний Новгород',
      'Нижегородская область',
      'Балаково',
      'Балашов',
      'Сибай',
      'Стерлитамак',
      'Уфа',
      'УФА',
      'Башкирия',
      'Удмуртская республика',
      'Арск',
    ],
  },
  {
    district: 'Уральский федеральный округ',
    regions: [
      'Екатеринбург',
      'Свердловская область',
      'Нижний Тагил',
      'Нижний тагил',
      'Алапаевск',
      'Курган',
      'Тюмень',
      'Ханты-Мансийск',
      'Сургут',
      'Нижневартовск',
      'Челябинск',
      'Магнитогорск',
      'Троицк',
      'Златоуст',
      'Урал',
      'Уральск',
    ],
  },
  {
    district: 'Сибирский федеральный округ',
    regions: [
      'Новосибирск',
      'Омск',
      'Томск',
      'Кемерово',
      'Новокузнецк',
      'Барнаул',
      'Красноярск',
      'Красноярский край',
      'Ачинск',
      'Абакан',
      'Иркутск',
      'Иркутская область',
      'Ангарск',
      'Асино',
      'Балаганск',
      'Лесосибирск',
      'Байконур',
    ],
  },
  {
    district: 'Дальневосточный федеральный округ',
    regions: [
      'Владивосток',
      'Хабаровск',
      'Комсомольск-на-Амуре',
      'Уссурийск',
      'Магадан',
      'Петропавловск-Камчатский',
      'Якутск',
      'Анадырь',
      'Благовещенск',
      'Чита',
      'Забайкальский край',
      'Амурская область',
    ],
  },
];

const normalizeText = (value) => (value || '').toString().toLowerCase();

// Нормализация текстовых значений для вывода и маппингов.
const sanitizeText = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return value
    .toString()
    .replace(/\uFEFF/g, '')
    .replace(/[\u200B-\u200D\u2060]/g, '')
    .replace(/[\u00A0]/g, ' ')
    .replace(/[–—−]/g, '-')
    .replace(/рекспублика/gi, 'Республика')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeKey = (value) =>
  sanitizeText(value)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-z0-9а-я]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const detectDelimiter = (text) => {
  const headerLine = text.split(/\r?\n/)[0] || '';
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  return commas > semicolons ? ',' : ';';
};

const parseCsvWithDetection = (text) => {
  const primary = detectDelimiter(text);
  const parsed = parseCSV(text, primary);
  if (parsed.rows.length === 0 && parsed.headers.length <= 1) {
    const fallback = primary === ';' ? ',' : ';';
    return parseCSV(text, fallback);
  }
  return parsed;
};

// Надежный CSV-парсер под ';' с поддержкой кавычек и переносов.
const parseCSV = (text, delimiter = ';') => {
  const rows = [];
  let current = '';
  let row = [];
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  const headers = (rows.shift() || []).map((header) => sanitizeText(header));
  const entries = rows
    .filter((values) => values.some((value) => sanitizeText(value) !== ''))
    .map((values) => {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = sanitizeText(values[index] || '');
      });
      return entry;
    });

  return { headers, rows: entries };
};

// Канонизация направлений под точный список каталога.
const directionFromValue = (value) => {
  const normalized = normalizeKey(value);
  if (!normalized) {
    return 'Другое';
  }
  if (DIRECTION_EXACT_MAP.has(normalized)) {
    return DIRECTION_EXACT_MAP.get(normalized);
  }
  const match = DIRECTION_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );
  return match ? match.label : 'Другое';
};

// Маппинг городов/регионов в федеральные округа РФ.
const DISTRICT_MAP = (() => {
  const map = new Map();
  FEDERAL_DISTRICTS.forEach(({ district, regions }) => {
    regions.forEach((region) => {
      map.set(normalizeKey(region), district);
    });
  });
  return map;
})();

const districtFromRegion = (region) => {
  const key = normalizeKey(region);
  return DISTRICT_MAP.get(key) || 'Не указано';
};

const getDisplayValue = (value, fallback = 'Не указано') => (value ? value : fallback);

const buildSearchIndex = (program) => {
  const parts = [
    program.programName,
    program.institutionName,
    program.fgosCode,
    program.direction,
    program.federalDistrict,
    program.region,
  ];
  const base = normalizeForSearch(parts.join(' '));
  const initials = [
    buildInitials(program.institutionName),
    buildInitials(program.programName),
  ]
    .filter(Boolean)
    .join(' ');
  return `${base} ${initials}`.trim();
};

const normalizeForSearch = (value) =>
  normalizeText(value)
    .replace(/ё/g, 'е')
    .replace(/[^a-z0-9а-я]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildInitials = (value) => {
  const words = (value || '').toString().match(/[A-Za-zА-Яа-яЁё]+/g) || [];
  const initials = words
    .filter((word) => word.length > 2)
    .map((word) => word[0])
    .join('');
  return normalizeForSearch(initials);
};

const logDiagnostics = (items, context) => {
  if (!DIAGNOSTICS_ENABLED) {
    return;
  }

  const directionCounts = items.reduce((acc, program) => {
    const key = program.direction || 'Другое';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const universities = Array.from(
    new Set(items.map((program) => program.institutionName).filter(Boolean))
  ).sort();

  console.group('Диагностика фильтров');
  console.log('Контекст:', context);
  console.table(directionCounts);
  console.log('Университеты:', universities);
  console.groupEnd();
};

const createCard = (program) => {
  const card = document.createElement('article');
  card.className = 'card';

  const badges = document.createElement('div');
  badges.className = 'card-badges';

  const formatBadge = document.createElement('span');
  formatBadge.className = 'badge';
  formatBadge.textContent = getDisplayValue(program.format, 'Формат не указан');
  badges.append(formatBadge);

  if (normalizeText(program.budgetSeat) === 'да') {
    const budgetBadge = document.createElement('span');
    budgetBadge.className = 'badge accent';
    budgetBadge.textContent = 'Есть бюджет';
    badges.append(budgetBadge);
  }

  const title = document.createElement('h3');
  title.textContent = getDisplayValue(program.programName, 'Без названия');

  const institution = document.createElement('p');
  if (program.institutionName) {
    const link = document.createElement('a');
    link.className = 'institution-link';
    link.href = `university.html?name=${encodeURIComponent(program.institutionName)}`;
    link.textContent = program.institutionName;
    institution.append(link);
  } else {
    institution.textContent = 'Организация не указана';
  }

  const meta = document.createElement('div');
  meta.className = 'meta';

  const metaItems = [
    ['Формат обучения', getDisplayValue(program.format, 'Не указано')],
    ['Направление', getDisplayValue(program.direction, 'Другое')],
    ['Код ФГОС', getDisplayValue(program.fgosCode, 'Не указано')],
    ['Федеральный округ', getDisplayValue(program.federalDistrict, 'Не указано')],
    ['Город/регион', getDisplayValue(program.region, 'Не указано')],
    ['Бюджетные места', getDisplayValue(program.budgetSeat, 'Не указано')],
  ];

  metaItems.forEach(([label, value]) => {
    const line = document.createElement('p');
    line.innerHTML = `${label}: <span>${value}</span>`;
    meta.append(line);
  });

  const link = document.createElement('a');
  link.href = program.url || '#';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Перейти к программе';

  if (!program.url) {
    link.removeAttribute('target');
    link.removeAttribute('rel');
  }

  card.append(badges, title, institution, meta, link);
  return card;
};

const renderPrograms = (items) => {
  grid.innerHTML = '';
  items.forEach((program) => grid.append(createCard(program)));
  totalVisible.textContent = items.length;
  emptyState.hidden = items.length > 0;
};

const updateResetButtonState = () => {
  const hasFilters =
    searchInput.value.trim() !== '' ||
    formatSelect.value !== '' ||
    baseEducationSelect.value !== '' ||
    directionSelect.value !== '' ||
    districtSelect.value !== '' ||
    budgetToggle.checked;
  resetFiltersButton.disabled = !hasFilters;
};

const toggleClearButton = () => {
  const shouldShow = searchInput.value.trim() !== '';
  clearSearchButton.classList.toggle('is-visible', shouldShow);
};

const updateActiveFilters = () => {
  const filters = [];

  if (searchInput.value.trim()) {
    filters.push(`Запрос: ${searchInput.value.trim()}`);
  }
  if (formatSelect.value) {
    filters.push(`Формат: ${formatSelect.value}`);
  }
  if (baseEducationSelect.value) {
    filters.push(`Базовый уровень: ${baseEducationSelect.value}`);
  }
  if (directionSelect.value) {
    filters.push(`Направление: ${directionSelect.value}`);
  }
  if (districtSelect.value) {
    filters.push(`Округ: ${districtSelect.value}`);
  }
  if (budgetToggle.checked) {
    filters.push('Только бюджетные места');
  }

  activeFilters.innerHTML = '';
  if (filters.length === 0) {
    const chip = document.createElement('span');
    chip.className = 'filter-chip';
    chip.textContent = 'Фильтры не заданы';
    activeFilters.append(chip);
    return;
  }

  filters.forEach((label) => {
    const chip = document.createElement('span');
    chip.className = 'filter-chip';
    chip.textContent = label;
    activeFilters.append(chip);
  });
};

// Фильтры не должны удалять строки: неизвестные значения остаются в выдаче.
const getBaseEducationRule = (value) => BASE_EDUCATION_RULES.find((rule) => rule.value === value);

const updateFormatAvailability = () => {
  if (!formatSelect || !baseEducationSelect) {
    return;
  }

  const rule = getBaseEducationRule(baseEducationSelect.value);
  const allowedFormats = rule ? new Set(rule.allowedFormats) : null;

  Array.from(formatSelect.options).forEach((option, index) => {
    if (index === 0) {
      option.disabled = false;
      return;
    }
    option.disabled = Boolean(allowedFormats) && !allowedFormats.has(option.value);
  });

  if (allowedFormats && formatSelect.value && !allowedFormats.has(formatSelect.value)) {
    formatSelect.value = '';
  }

  baseEducationHint.textContent = rule ? rule.hint : '';
};

const applyFilters = () => {
  const query = normalizeForSearch(searchInput.value.trim());
  const format = formatSelect.value;
  const baseEducation = baseEducationSelect.value;
  const direction = directionSelect.value;
  const district = districtSelect.value;
  const budgetOnly = budgetToggle.checked;
  const baseEducationRule = getBaseEducationRule(baseEducation);
  const allowedFormats = baseEducationRule ? baseEducationRule.allowedFormats : null;

  const filtered = programs.filter((program) => {
    const haystack = program.searchIndex || '';
    const queryTokens = query.split(/\s+/).filter(Boolean);
    const matchesQuery = queryTokens.every((token) => haystack.includes(token));
    const matchesFormat = !format || program.format === format;
    const matchesBaseEducation = !allowedFormats || allowedFormats.includes(program.format);
    const matchesDirection = !direction || program.direction === direction;
    const matchesDistrict = !district || program.federalDistrict === district;
    const matchesBudget = !budgetOnly || normalizeText(program.budgetSeat) === 'да';
    return (
      matchesQuery &&
      matchesFormat &&
      matchesBaseEducation &&
      matchesDirection &&
      matchesDistrict &&
      matchesBudget
    );
  });

  renderPrograms(filtered);
  updateResetButtonState();
  updateActiveFilters();
  toggleClearButton();
  logDiagnostics(filtered, {
    format,
    baseEducation,
    direction,
    district,
    budgetOnly,
    query,
  });
};

const populateSelect = (select, values) => {
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
};

const populateFormats = () => {
  const formats = Array.from(new Set(programs.map((program) => program.format).filter(Boolean))).sort();
  populateSelect(formatSelect, formats);
};

const populateBaseEducation = () => {
  if (!baseEducationSelect) {
    return;
  }

  baseEducationSelect.disabled = false;
  baseEducationHint.textContent = '';
  populateSelect(
    baseEducationSelect,
    BASE_EDUCATION_RULES.map((rule) => rule.value)
  );
};

const populateDirections = () => {
  const directions = Array.from(
    new Set(programs.map((program) => program.direction).filter(Boolean))
  ).sort((a, b) => {
    const aIndex = CANONICAL_DIRECTIONS.indexOf(a);
    const bIndex = CANONICAL_DIRECTIONS.indexOf(b);
    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b, 'ru');
    }
    if (aIndex === -1) {
      return 1;
    }
    if (bIndex === -1) {
      return -1;
    }
    return aIndex - bIndex;
  });

  populateSelect(directionSelect, directions);
};

const populateDistricts = () => {
  const districts = Array.from(
    new Set(programs.map((program) => program.federalDistrict).filter(Boolean))
  ).sort();
  populateSelect(districtSelect, districts);
};

const buildProgram = (raw) => {
  const program = {
    id: raw.id,
    directionRaw: sanitizeText(raw.macrogroup_name),
    direction: directionFromValue(raw.macrogroup_name),
    format: sanitizeText(raw.education_level),
    fgosCode: sanitizeText(raw.fgos_code),
    institutionName: sanitizeText(raw.institution_name),
    programName: sanitizeText(raw.program_name),
    region: sanitizeText(raw.region),
    federalDistrict: districtFromRegion(raw.region),
    budgetSeat: sanitizeText(raw.budget_seat),
    url: sanitizeText(raw.URL),
  };

  return {
    ...program,
    searchIndex: buildSearchIndex(program),
  };
};

const loadPrograms = async () => {
  const aggregated = new Map();
  const errors = [];

  for (const source of DATA_SOURCES) {
    const encodedSource = encodeURI(source);
    try {
      const response = await fetch(encodedSource, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Не удалось загрузить данные CSV: ${source}`);
      }
      const text = await response.text();
      const { rows } = parseCsvWithDetection(text);

      rows.forEach((raw) => {
        const program = buildProgram(raw);
        const key =
          program.id ||
          `${normalizeKey(program.institutionName)}|${normalizeKey(program.programName)}|${program.fgosCode}`;
        if (!aggregated.has(key)) {
          aggregated.set(key, program);
        }
      });
    } catch (error) {
      errors.push(error);
    }
  }

  if (aggregated.size === 0) {
    throw errors[0] || new Error('Не удалось загрузить данные CSV');
  }

  return Array.from(aggregated.values());
};

const init = async () => {
  try {
    programs = await loadPrograms();

    populateFormats();
    populateBaseEducation();
    populateDirections();
    populateDistricts();

    renderPrograms(programs);
    updateFormatAvailability();
    updateResetButtonState();
    updateActiveFilters();
    toggleClearButton();
  } catch (error) {
    grid.innerHTML = '';
    emptyState.hidden = false;
    emptyState.querySelector('h2').textContent = 'Ошибка загрузки данных';
    emptyState.querySelector('p').textContent = error.message;
  }
};

const resetFilters = () => {
  searchInput.value = '';
  formatSelect.value = '';
  baseEducationSelect.value = '';
  directionSelect.value = '';
  districtSelect.value = '';
  budgetToggle.checked = false;
  updateFormatAvailability();
  applyFilters();
  searchInput.focus();
};

resetFiltersButton.addEventListener('click', resetFilters);
resetFiltersEmptyButton.addEventListener('click', resetFilters);
searchInput.addEventListener('input', applyFilters);
formatSelect.addEventListener('change', applyFilters);
baseEducationSelect.addEventListener('change', () => {
  updateFormatAvailability();
  applyFilters();
});
directionSelect.addEventListener('change', applyFilters);
districtSelect.addEventListener('change', applyFilters);
budgetToggle.addEventListener('change', applyFilters);
clearSearchButton.addEventListener('click', () => {
  searchInput.value = '';
  applyFilters();
  searchInput.focus();
});

init();
