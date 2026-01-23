const DATA_URL = 'data/programs.csv';

const programGrid = document.getElementById('programGrid');
const programCount = document.getElementById('programCount');
const universityName = document.getElementById('universityName');
const universitySubtitle = document.getElementById('universitySubtitle');
const pdfLink = document.getElementById('pdfLink');
const emptyState = document.getElementById('emptyState');

const BASE_EDUCATION_HEADERS = [
  'base_education_level',
  'base_education',
  'basic_education',
  'basic_education_level',
  'education_base',
  'education_base_level',
  'базовый уровень образования',
  'базовый уровень',
];

const DESCRIPTION_HEADERS = ['description', 'program_description', 'описание', 'описание программы'];

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

const findHeader = (headers, candidates) => {
  const headerMap = new Map(headers.map((header) => [normalizeKey(header), header]));
  const found = candidates.map((candidate) => headerMap.get(normalizeKey(candidate))).find(Boolean);
  return found || '';
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

const createCard = (program, showDescription) => {
  const card = document.createElement('article');
  card.className = 'card';

  const badges = document.createElement('div');
  badges.className = 'card-badges';

  const formatBadge = document.createElement('span');
  formatBadge.className = 'badge';
  formatBadge.textContent = getDisplayValue(program.format, 'Формат не указан');
  badges.append(formatBadge);

  if (program.budgetSeat.toLowerCase() === 'да') {
    const budgetBadge = document.createElement('span');
    budgetBadge.className = 'badge accent';
    budgetBadge.textContent = 'Есть бюджет';
    badges.append(budgetBadge);
  }

  const title = document.createElement('h3');
  title.textContent = getDisplayValue(program.programName, 'Без названия');

  const institution = document.createElement('p');
  institution.textContent = getDisplayValue(program.institutionName, 'Организация не указана');

  const meta = document.createElement('div');
  meta.className = 'meta';

  const metaItems = [
    ['Формат обучения', getDisplayValue(program.format, 'Не указано')],
    ['Базовый уровень образования', getDisplayValue(program.baseEducation, 'Не указано')],
    ['Направление', getDisplayValue(program.direction, 'Другое')],
    ['Код ФГОС', getDisplayValue(program.fgosCode, 'Не указано')],
    ['Федеральный округ', getDisplayValue(program.federalDistrict, 'Не указано')],
    ['Город/регион', getDisplayValue(program.region, 'Не указано')],
    ['Бюджетные места', getDisplayValue(program.budgetSeat, 'Не указано')],
  ];

  if (showDescription) {
    metaItems.push(['Описание', getDisplayValue(program.description, 'Не указано')]);
  }

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

const renderPrograms = (items, showDescription) => {
  programGrid.innerHTML = '';
  items.forEach((program) => programGrid.append(createCard(program, showDescription)));
  programCount.textContent = items.length;
  emptyState.hidden = items.length > 0;
};

const init = async () => {
  const params = new URLSearchParams(window.location.search);
  const requestedName = sanitizeText(params.get('name'));
  const requestedKey = normalizeKey(requestedName);

  if (!requestedName) {
    universityName.textContent = 'Вуз не выбран';
    universitySubtitle.textContent = 'Укажите название вуза через параметр name в адресной строке.';
    emptyState.hidden = false;
    return;
  }

  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные CSV');
    }

    const text = await response.text();
    const { headers, rows } = parseCSV(text);
    const baseEducationKey = findHeader(headers, BASE_EDUCATION_HEADERS);
    const descriptionKey = findHeader(headers, DESCRIPTION_HEADERS);

    const programs = rows.map((raw) => ({
      id: raw.id,
      direction: directionFromValue(raw.macrogroup_name),
      format: sanitizeText(raw.education_level),
      baseEducation: baseEducationKey ? sanitizeText(raw[baseEducationKey]) : '',
      fgosCode: sanitizeText(raw.fgos_code),
      institutionName: sanitizeText(raw.institution_name),
      programName: sanitizeText(raw.program_name),
      region: sanitizeText(raw.region),
      federalDistrict: districtFromRegion(raw.region),
      budgetSeat: sanitizeText(raw.budget_seat),
      url: sanitizeText(raw.URL),
      description: descriptionKey ? sanitizeText(raw[descriptionKey]) : '',
    }));

    const universityPrograms = programs.filter(
      (program) => normalizeKey(program.institutionName) === requestedKey
    );

    const displayName = universityPrograms[0]?.institutionName || requestedName;
    universityName.textContent = displayName;

    const pdfProgram = universityPrograms.find((program) =>
      program.url.toLowerCase().endsWith('.pdf')
    );

    if (pdfProgram) {
      pdfLink.href = pdfProgram.url;
      pdfLink.hidden = false;
    } else {
      pdfLink.hidden = true;
    }

    renderPrograms(universityPrograms, Boolean(descriptionKey));

    if (universityPrograms.length === 0) {
      emptyState.hidden = false;
    }
  } catch (error) {
    emptyState.hidden = false;
    emptyState.querySelector('h2').textContent = 'Ошибка загрузки данных';
    emptyState.querySelector('p').textContent = error.message;
  }
};

init();
