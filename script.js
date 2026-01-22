const CSV_PATH = "Ресоциализация СВО - Итог.csv";

const state = {
  programs: [],
  groups: [],
  formats: [],
  query: "",
  group: "all",
  format: "all"
};

const nodes = {
  search: document.getElementById("search"),
  groupSelect: document.getElementById("groupSelect"),
  formatSelect: document.getElementById("formatSelect"),
  groupGrid: document.getElementById("groupGrid"),
  programs: document.getElementById("programs"),
  programCount: document.getElementById("programCount"),
  groupCount: document.getElementById("groupCount"),
  resultsHint: document.getElementById("resultsHint")
};

const normalize = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();

const parseCSV = (text) => {
  const rows = [];
  let current = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      current.push(field);
      field = "";
    } else if (char === "\n" && !inQuotes) {
      current.push(field);
      rows.push(current);
      current = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field || current.length) {
    current.push(field);
    rows.push(current);
  }

  const [header, ...data] = rows;
  return data
    .filter((row) => row.some((cell) => cell && cell.trim()))
    .map((row) => {
      const entry = {};
      header.forEach((key, index) => {
        entry[key.trim()] = (row[index] || "").trim();
      });
      return entry;
    });
};

const loadPrograms = async () => {
  const response = await fetch(encodeURI(CSV_PATH));
  if (!response.ok) {
    throw new Error("Не удалось загрузить CSV");
  }
  const text = await response.text();
  return parseCSV(text);
};

const buildFilters = () => {
  nodes.groupSelect.innerHTML = "";
  const groupOption = document.createElement("option");
  groupOption.value = "all";
  groupOption.textContent = "Все макрогруппы";
  nodes.groupSelect.appendChild(groupOption);
  state.groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    nodes.groupSelect.appendChild(option);
  });

  nodes.formatSelect.innerHTML = "";
  const formatOption = document.createElement("option");
  formatOption.value = "all";
  formatOption.textContent = "Любой формат";
  nodes.formatSelect.appendChild(formatOption);
  state.formats.forEach((format) => {
    const option = document.createElement("option");
    option.value = format;
    option.textContent = format;
    nodes.formatSelect.appendChild(option);
  });
};

const renderGroups = () => {
  nodes.groupGrid.innerHTML = "";
  const counts = state.groups.map((group) => {
    const total = state.programs.filter((program) => program["Макрогруппа"] === group).length;
    return { group, total };
  });

  counts.forEach(({ group, total }) => {
    const card = document.createElement("article");
    card.className = "group-card";
    card.innerHTML = `
      <h3>${group}</h3>
      <p><span class="count">${total}</span> программ</p>
      <button type="button" class="ghost-link">Показать</button>
    `;
    const button = card.querySelector("button");
    button.addEventListener("click", () => {
      state.group = group;
      nodes.groupSelect.value = group;
      renderPrograms();
      nodes.programs.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    nodes.groupGrid.appendChild(card);
  });
};

const buildSearchIndex = (program) =>
  normalize([
    program["Программа"],
    program["Макрогруппа"],
    program["Навыки"],
    program["Организация"],
    program["Формат"],
    program["Уровень"]
  ].join(" "));

const filterPrograms = () => {
  const tokens = normalize(state.query).split(" ").filter(Boolean);
  return state.programs
    .map((program) => ({
      program,
      index: buildSearchIndex(program)
    }))
    .filter(({ program, index }) => {
      if (state.group !== "all" && program["Макрогруппа"] !== state.group) return false;
      if (state.format !== "all" && program["Формат"] !== state.format) return false;
      if (!tokens.length) return true;
      return tokens.every((token) => index.includes(token));
    })
    .map(({ program }) => program);
};

const renderPrograms = () => {
  const results = filterPrograms();
  nodes.programs.innerHTML = "";

  if (!results.length) {
    nodes.resultsHint.textContent = "Ничего не найдено. Попробуйте изменить запрос.";
  } else {
    nodes.resultsHint.textContent = `Найдено программ: ${results.length}`;
  }

  results.forEach((program) => {
    const card = document.createElement("article");
    card.className = "program-card";
    card.innerHTML = `
      <h4>${program["Программа"]}</h4>
      <div class="program-meta">
        <span>${program["Макрогруппа"]}</span>
        <span>${program["Формат"]}</span>
        <span>${program["Длительность"]}</span>
        <span>${program["Уровень"]}</span>
      </div>
      <p>${program["Навыки"]}</p>
      <p>${program["Организация"]}</p>
      <a href="${program["Ссылка"]}" target="_blank" rel="noopener">Перейти на страницу программы</a>
    `;
    nodes.programs.appendChild(card);
  });

  nodes.programCount.textContent = `${state.programs.length} программ`;
  nodes.groupCount.textContent = `${state.groups.length} макрогрупп`;
};

const init = async () => {
  try {
    state.programs = await loadPrograms();
    state.groups = [...new Set(state.programs.map((p) => p["Макрогруппа"]))].sort();
    state.formats = [...new Set(state.programs.map((p) => p["Формат"]))].sort();
    buildFilters();
    renderGroups();
    renderPrograms();
  } catch (error) {
    nodes.groupGrid.innerHTML = `<p>Ошибка загрузки данных. Проверьте CSV файл.</p>`;
    nodes.resultsHint.textContent = "Не удалось загрузить данные.";
    console.error(error);
  }
};

nodes.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderPrograms();
});

nodes.groupSelect.addEventListener("change", (event) => {
  state.group = event.target.value;
  renderPrograms();
});

nodes.formatSelect.addEventListener("change", (event) => {
  state.format = event.target.value;
  renderPrograms();
});

init();
