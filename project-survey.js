const THEME_STORAGE_KEY = "linkPortalTheme";
const SURVEY_STORAGE_KEY = "projectSurveyFormDraft";

(() => {
  try {
    if (localStorage.getItem(THEME_STORAGE_KEY) === "light") {
      document.documentElement.dataset.theme = "light";
    }
  } catch {
    // Keep the default dark theme if storage is unavailable.
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const LOGO_BASE64 = "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";
  const LOGO_DATA_URL = `data:image/png;base64,${LOGO_BASE64}`;
  const LOGO_PATH = "assets/images/project-survey-logo.png";
  const encoder = new TextEncoder();
  let logoBase64Promise;
  const pullTypeOptions = [
    "CCTV Indoor",
    "CCTV Outdoor",
    "AP Indoor",
    "AP Outdoor",
    "Data",
    "Fiber Optic",
    "Power",
  ];
  const networkCableOptions = ["UTP", "STP"];
  const fiberCableOptions = [
    "FO Indoor Multimode",
    "FO Indoor Singlemode",
    "FO Outdoor Multimode",
    "FO Outdoor Singlemode",
  ];
  const powerCableOptions = ["Power"];
  const cableTypeOptions = [
    "UTP",
    "STP",
    "FO Indoor Multimode",
    "FO Indoor Singlemode",
    "FO Outdoor Multimode",
    "FO Outdoor Singlemode",
    "Power",
  ];
  const unitOptions = ["pcs", "unit", "lot", "mtr", "kg", "btg", "roll", "pack", "node"];

  const defaultSurvey = {
    surveyDate: "",
    surveyorName: "",
    customerName: "",
    customerPic: "",
    projectName: "",
    pulls: [{ type: "", length: "", cable: "", location: "", note: "" }],
    activeDevices: [{ description: "", qty: "", unit: "" }],
    materials: [{ description: "", qty: "", unit: "" }],
    extras: [{ description: "", qty: "", unit: "" }],
  };

  const sectionConfig = {
    pulls: {
      target: document.getElementById("pullRows"),
      columns: [
        { key: "type", label: "Jenis Tarikan", input: "select", options: pullTypeOptions },
        { key: "length", label: "Panjang (m)", input: "number" },
        { key: "cable", label: "Tipe Kabel", input: "select", optionsForRow: cableOptionsForPullType },
        { key: "location", label: "Detail Lokasi", input: "text" },
        { key: "note", label: "Catatan", input: "text" },
      ],
    },
    activeDevices: {
      target: document.getElementById("activeDeviceRows"),
      columns: itemColumns(),
    },
    materials: {
      target: document.getElementById("materialRows"),
      columns: itemColumns(),
    },
    extras: {
      target: document.getElementById("extraRows"),
      columns: itemColumns(),
    },
  };

  let state = cloneSurvey(defaultSurvey);

  const themeToggle = document.getElementById("themeToggle");
  const themeSwitchLabel = document.getElementById("themeSwitchLabel");
  const themeToggleIcon = document.getElementById("themeToggleIcon");
  const themeColorMeta = document.getElementById("themeColorMeta");
  const surveyToast = document.getElementById("surveyToast");
  const savedSurveyModal = document.getElementById("savedSurveyModal");
  const savedSurveyClose = document.getElementById("savedSurveyClose");
  const savedSurveyList = document.getElementById("savedSurveyList");
  const pageLoader = document.getElementById("pageLoader");
  const LOADER_MIN_DURATION = 2000;
  const loaderStartedAt = performance.now();
  let toastTimeoutId;
  let savedSurveySnapshot = "";

  function itemColumns() {
    return [
      { key: "description", label: "Deskripsi", input: "text" },
      { key: "qty", label: "Qty", input: "number" },
      { key: "unit", label: "Satuan", input: "select", options: unitOptions },
    ];
  }

  function cloneSurvey(survey) {
    return JSON.parse(JSON.stringify(survey));
  }

  function setTheme(theme) {
    const isLight = theme === "light";

    if (isLight) {
      document.documentElement.dataset.theme = "light";
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
    themeSwitchLabel.textContent = isLight ? "Light" : "Dark";
    themeToggleIcon.className = isLight ? "bi bi-sun-fill" : "bi bi-moon-fill";
    themeColorMeta.setAttribute("content", isLight ? "#f5f7fb" : "#101010");

    try {
      localStorage.setItem(THEME_STORAGE_KEY, isLight ? "light" : "dark");
    } catch {
      // Theme still applies for this session if storage is unavailable.
    }
  }

  function initializeForm() {
    document.getElementById("surveyDate").value = state.surveyDate ?? "";
    document.getElementById("surveyorName").value = state.surveyorName ?? "";
    document.getElementById("customerName").value = state.customerName ?? "";
    document.getElementById("customerPic").value = state.customerPic ?? "";
    document.getElementById("projectName").value = state.projectName ?? "";
    renderAllSections();
  }

  function renderAllSections() {
    Object.keys(sectionConfig).forEach(renderSection);
  }

  function renderSection(sectionKey) {
    const config = sectionConfig[sectionKey];
    const rows = state[sectionKey].length ? state[sectionKey] : [emptyRow(config.columns)];
    const fragment = document.createDocumentFragment();

    const header = document.createElement("div");
    header.className = "survey-row survey-row-header";
    header.innerHTML = [
      `<span>No</span>`,
      ...config.columns.map((column) => `<span>${column.label}</span>`),
      `<span>Aksi</span>`,
    ].join("");
    fragment.appendChild(header);

    rows.forEach((row, rowIndex) => {
      const rowElement = document.createElement("div");
      rowElement.className = "survey-row";
      rowElement.dataset.rowIndex = String(rowIndex);

      rowElement.appendChild(rowNumber(rowIndex + 1));

      config.columns.forEach((column) => {
        const label = document.createElement("label");
        label.className = "survey-row-field";

        const input = createRowControl(column, row);
        input.value = row[column.key] ?? "";
        input.dataset.section = sectionKey;
        input.dataset.field = column.key;
        input.setAttribute("aria-label", `${column.label} ${rowIndex + 1}`);

        label.append(input);
        rowElement.appendChild(label);
      });

      const removeButton = document.createElement("button");
      removeButton.className = "survey-remove-row";
      removeButton.type = "button";
      removeButton.dataset.removeRow = sectionKey;
      removeButton.dataset.rowIndex = String(rowIndex);
      removeButton.setAttribute("aria-label", `Hapus baris ${rowIndex + 1}`);
      removeButton.innerHTML = `<i class="bi bi-trash" aria-hidden="true"></i>`;
      rowElement.appendChild(removeButton);

      fragment.appendChild(rowElement);
    });

    config.target.replaceChildren(fragment);
  }

  function createRowControl(column, row = {}) {
    if (column.input === "select") {
      const select = document.createElement("select");
      const options = column.optionsForRow ? column.optionsForRow(row) : column.options;
      select.appendChild(new Option("", ""));

      options.forEach((option) => {
        select.appendChild(new Option(option, option));
      });

      return select;
    }

    const input = document.createElement("input");
    input.type = column.input;
    input.inputMode = column.input === "number" ? "decimal" : "text";
    input.min = column.input === "number" ? "0" : "";

    return input;
  }

  function cableOptionsForPullType(rowOrType) {
    const pullType = (typeof rowOrType === "string" ? rowOrType : rowOrType.type) ?? "";

    if (!pullType) {
      return [];
    }

    if (pullType.startsWith("CCTV") || pullType.startsWith("AP") || pullType === "Data") {
      return networkCableOptions;
    }

    if (pullType === "Fiber Optic") {
      return fiberCableOptions;
    }

    if (pullType === "Power") {
      return powerCableOptions;
    }

    return cableTypeOptions;
  }

  function normalizePullCable(row) {
    const allowedCableOptions = cableOptionsForPullType(row.type);

    if (!allowedCableOptions.includes(row.cable)) {
      row.cable = "";
    }
  }

  function rowNumber(number) {
    const element = document.createElement("span");
    element.className = "survey-row-number";
    element.textContent = String(number);
    return element;
  }

  function emptyRow(columns) {
    return columns.reduce((row, column) => {
      row[column.key] = "";
      return row;
    }, {});
  }

  function createEmptySurvey() {
    return {
      surveyDate: "",
      surveyorName: "",
      customerName: "",
      customerPic: "",
      projectName: "",
      pulls: [emptyRow(sectionConfig.pulls.columns)],
      activeDevices: [emptyRow(sectionConfig.activeDevices.columns)],
      materials: [emptyRow(sectionConfig.materials.columns)],
      extras: [emptyRow(sectionConfig.extras.columns)],
    };
  }

  function collectFormData() {
    const data = {
      surveyDate: document.getElementById("surveyDate").value,
      surveyorName: document.getElementById("surveyorName").value.trim(),
      customerName: document.getElementById("customerName").value.trim(),
      customerPic: document.getElementById("customerPic").value.trim(),
      projectName: document.getElementById("projectName").value.trim(),
      pulls: collectRows("pulls"),
      activeDevices: collectRows("activeDevices"),
      materials: collectRows("materials"),
      extras: collectRows("extras"),
    };

    Object.keys(sectionConfig).forEach((sectionKey) => {
      if (!data[sectionKey].length) {
        data[sectionKey].push(emptyRow(sectionConfig[sectionKey].columns));
      }
    });

    return data;
  }

  function collectRows(sectionKey) {
    const config = sectionConfig[sectionKey];
    const rows = Array.from(config.target.querySelectorAll(".survey-row:not(.survey-row-header)"));

    return rows.map((rowElement) => {
      const row = {};
      config.columns.forEach((column) => {
        const input = rowElement.querySelector(`[data-field="${column.key}"]`);
        const value = input?.value.trim() ?? "";
        row[column.key] = column.input === "number" ? numberOrBlank(value) : value;
      });
      return row;
    });
  }

  function numberOrBlank(value) {
    if (value === "") {
      return "";
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : "";
  }

  function syncStateFromForm() {
    state = collectFormData();
    return state;
  }

  function saveSurvey() {
    const data = syncStateFromForm();
    if (!validateSurvey(data)) {
      return;
    }

    try {
      const savedSurveys = readSavedSurveys();
      const draft = {
        id: createDraftId(),
        savedAt: new Date().toISOString(),
        data: cloneSurvey(data),
      };

      savedSurveys.unshift(draft);
      writeSavedSurveys(savedSurveys);
      renderSavedSurveys(savedSurveys);
      markSurveySaved(data);
      setStatus("Draft survey berhasil disimpan.", "success");
    } catch {
      setStatus("Draft survey belum bisa disimpan di browser ini.", "danger");
    }
  }

  function loadSurvey() {
    try {
      const savedSurveys = readSavedSurveys();
      renderSavedSurveys(savedSurveys);
      openSavedSurveyModal();

      if (!savedSurveys.length) {
        setStatus("Belum ada draft survey yang tersimpan.", "warning");
        return;
      }

      setStatus("Pilih draft survey yang ingin dimuat.", "info");
    } catch {
      setStatus("Draft survey tersimpan tidak bisa dibaca.", "danger");
    }
  }

  function resetSurvey() {
    state = createEmptySurvey();
    initializeForm();
    savedSurveySnapshot = "";
    closeSavedSurveyModal();
    setStatus("Form survey sudah dikosongkan.", "success");
  }

  function normalizeSurvey(savedSurvey) {
    const fallback = createEmptySurvey();
    const normalized = {
      ...fallback,
      ...(savedSurvey && typeof savedSurvey === "object" ? savedSurvey : {}),
    };

    Object.keys(sectionConfig).forEach((sectionKey) => {
      normalized[sectionKey] = Array.isArray(normalized[sectionKey])
        ? normalized[sectionKey]
        : fallback[sectionKey];
    });

    return normalized;
  }

  function readSavedSurveys() {
    const savedSurvey = localStorage.getItem(SURVEY_STORAGE_KEY);

    if (!savedSurvey) {
      return [];
    }

    const parsed = JSON.parse(savedSurvey);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((draft) => draft && typeof draft === "object")
        .map((draft, index) => ({
          id: draft.id || `saved-survey-${index}`,
          savedAt: draft.savedAt || "",
          data: normalizeSurvey(draft.data),
        }));
    }

    return [
      {
        id: "legacy-saved-survey",
        savedAt: "",
        data: normalizeSurvey(parsed),
      },
    ];
  }

  function writeSavedSurveys(savedSurveys) {
    localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(savedSurveys));
  }

  function renderSavedSurveys(savedSurveys = readSavedSurveys()) {
    const fragment = document.createDocumentFragment();

    if (!savedSurveys.length) {
      const emptyState = document.createElement("p");
      emptyState.className = "survey-saved-empty";
      emptyState.textContent = "Belum ada form tersimpan.";
      fragment.appendChild(emptyState);
      savedSurveyList.replaceChildren(fragment);
      return;
    }

    savedSurveys.forEach((draft) => {
      const item = document.createElement("article");
      item.className = "survey-saved-item";

      const text = document.createElement("div");
      text.className = "survey-saved-text";

      const title = document.createElement("h3");
      title.textContent = savedSurveyTitle(draft);

      const meta = document.createElement("p");
      meta.textContent = draft.savedAt ? `Saved ${formatSavedAt(draft.savedAt)}` : "Saved draft";

      text.append(title, meta);

      const loadButton = document.createElement("button");
      loadButton.className = "survey-list-action";
      loadButton.type = "button";
      loadButton.dataset.loadSaved = draft.id;
      loadButton.innerHTML = `<i class="bi bi-folder2-open" aria-hidden="true"></i><span>Load</span>`;

      const deleteButton = document.createElement("button");
      deleteButton.className = "survey-list-action survey-list-action-danger";
      deleteButton.type = "button";
      deleteButton.dataset.deleteSaved = draft.id;
      deleteButton.innerHTML = `<i class="bi bi-trash" aria-hidden="true"></i><span>Hapus</span>`;

      item.append(text, loadButton, deleteButton);
      fragment.appendChild(item);
    });

    savedSurveyList.replaceChildren(fragment);
  }

  function loadSavedSurvey(draftId) {
    const savedSurveys = readSavedSurveys();
    const draft = savedSurveys.find((item) => item.id === draftId);

    if (!draft) {
      renderSavedSurveys(savedSurveys);
      setStatus("Draft survey tidak ditemukan.", "danger");
      return;
    }

    state = normalizeSurvey(draft.data);
    initializeForm();
    markSurveySaved(state);
    closeSavedSurveyModal();
    setStatus(`${savedSurveyTitle(draft)} berhasil dimuat.`, "success");
  }

  function deleteSavedSurvey(draftId) {
    const savedSurveys = readSavedSurveys();
    const nextSurveys = savedSurveys.filter((draft) => draft.id !== draftId);

    writeSavedSurveys(nextSurveys);
    renderSavedSurveys(nextSurveys);
    setStatus("Draft survey berhasil dihapus.", "success");
  }

  function savedSurveyTitle(draft) {
    const data = draft.data || {};
    const surveyDate = formatSurveyDate(data.surveyDate) || "No date";
    const projectName = data.projectName || "Untitled project";

    return `${surveyDate} - ${projectName}`;
  }

  function formatSavedAt(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function createDraftId() {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function validateSurvey(data) {
    const requiredFields = [
      ["surveyDate", "Tanggal Survey"],
      ["surveyorName", "Nama Surveyor"],
      ["customerName", "Nama Customer"],
      ["customerPic", "PIC Customer"],
      ["projectName", "Nama Project"],
    ];

    for (const [key, label] of requiredFields) {
      if (!data[key]) {
        setStatus(`${label} wajib diisi.`, "warning");
        document.getElementById(key)?.focus();
        return false;
      }
    }

    const sectionRules = [
      {
        key: "pulls",
        title: "Tarikan Kabel",
        requiredFields: ["type", "length", "cable", "location"],
      },
      {
        key: "activeDevices",
        title: "Perangkat Aktif",
        requiredFields: ["description", "qty", "unit"],
      },
      {
        key: "materials",
        title: "Material",
        requiredFields: ["description", "qty", "unit"],
      },
      {
        key: "extras",
        title: "Pekerjaan Tambahan",
        requiredFields: ["description", "qty", "unit"],
      },
    ];

    for (const rule of sectionRules) {
      const rows = data[rule.key] ?? [];

      for (const [rowIndex, row] of rows.entries()) {
        if (isEmptySurveyRow(rule.key, row)) {
          continue;
        }

        for (const fieldKey of rule.requiredFields) {
          if (isBlankValue(row[fieldKey])) {
            const label = fieldLabel(rule.key, fieldKey);
            setStatus(`${rule.title} baris ${rowIndex + 1}: ${label} wajib diisi.`, "warning");
            focusRowInput(rule.key, rowIndex, fieldKey);
            return false;
          }
        }
      }
    }

    setStatus("");
    return true;
  }

  function isEmptySurveyRow(sectionKey, row) {
    return sectionConfig[sectionKey].columns.every((column) => isBlankValue(row[column.key]));
  }

  function isBlankValue(value) {
    return value === "" || value === null || value === undefined;
  }

  function fieldLabel(sectionKey, fieldKey) {
    return sectionConfig[sectionKey].columns.find((column) => column.key === fieldKey)?.label ?? fieldKey;
  }

  function focusRowInput(sectionKey, rowIndex, fieldKey) {
    const rows = sectionConfig[sectionKey].target.querySelectorAll(".survey-row:not(.survey-row-header)");
    rows[rowIndex]?.querySelector(`[data-field="${fieldKey}"]`)?.focus();
  }

  function markSurveySaved(data) {
    savedSurveySnapshot = serializeSurvey(data);
  }

  function isSurveySaved(data) {
    return Boolean(savedSurveySnapshot) && serializeSurvey(data) === savedSurveySnapshot;
  }

  function serializeSurvey(data) {
    return JSON.stringify(data);
  }

  function openSavedSurveyModal() {
    savedSurveyModal.hidden = false;
    savedSurveyClose?.focus();
  }

  function closeSavedSurveyModal() {
    savedSurveyModal.hidden = true;
  }

  function setStatus(message, variant = "info") {
    clearTimeout(toastTimeoutId);

    if (!message) {
      hideStatusToast();
      return;
    }

    const icon = document.createElement("i");
    icon.className = `bi ${toastIcon(variant)}`;
    icon.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.textContent = message;

    surveyToast.className = `survey-toast survey-toast-${toastVariant(variant)}`;
    surveyToast.replaceChildren(icon, text);
    surveyToast.hidden = false;
    requestAnimationFrame(() => {
      surveyToast.classList.add("is-visible");
    });

    toastTimeoutId = setTimeout(hideStatusToast, 3600);
  }

  function toastVariant(variant) {
    return ["success", "warning", "danger", "info"].includes(variant) ? variant : "info";
  }

  function toastIcon(variant) {
    const icons = {
      success: "bi-check-circle-fill",
      warning: "bi-exclamation-triangle-fill",
      danger: "bi-x-circle-fill",
      info: "bi-info-circle-fill",
    };

    return icons[toastVariant(variant)];
  }

  function hideStatusToast() {
    clearTimeout(toastTimeoutId);
    surveyToast.classList.remove("is-visible");
    surveyToast.addEventListener(
      "transitionend",
      () => {
        if (!surveyToast.classList.contains("is-visible")) {
          surveyToast.hidden = true;
        }
      },
      { once: true }
    );
  }

  function hidePageLoader() {
    const elapsed = performance.now() - loaderStartedAt;
    const remainingDelay = Math.max(0, LOADER_MIN_DURATION - elapsed);

    setTimeout(() => {
      pageLoader?.classList.add("is-hidden");
      pageLoader?.addEventListener("transitionend", () => pageLoader.remove(), { once: true });
    }, remainingDelay);
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function xmlText(value) {
    const stringValue = String(value ?? "");
    const preserve = /^\s|\s$/.test(stringValue) ? ` xml:space="preserve"` : "";
    return `<t${preserve}>${escapeXml(stringValue)}</t>`;
  }

  function colName(index) {
    let dividend = index;
    let name = "";

    while (dividend > 0) {
      const modulo = (dividend - 1) % 26;
      name = String.fromCharCode(65 + modulo) + name;
      dividend = Math.floor((dividend - modulo) / 26);
    }

    return name;
  }

  function cell(ref, style, value) {
    const attrs = [`r="${ref}"`, `s="${style}"`];

    if (value === "" || value === null || value === undefined) {
      return `<c ${attrs.join(" ")}/>`;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return `<c ${attrs.join(" ")}><v>${value}</v></c>`;
    }

    return `<c ${attrs.join(" ")} t="inlineStr"><is>${xmlText(value)}</is></c>`;
  }

  function blankCells(rowNumber, style, startCol = 1, endCol = 6) {
    const cells = [];

    for (let col = startCol; col <= endCol; col += 1) {
      cells.push(cell(`${colName(col)}${rowNumber}`, style, ""));
    }

    return cells;
  }

  function rowXml(rowNumber, cells, options = {}) {
    const attrs = [`r="${rowNumber}"`, `spans="1:6"`];

    if (options.height) {
      attrs.push(`ht="${options.height}"`);
      if (options.customHeight) {
        attrs.push(`customHeight="1"`);
      }
    }

    attrs.push(`x14ac:dyDescent="0.15"`);
    return `<row ${attrs.join(" ")}>${cells.join("")}</row>`;
  }

  function rowHeightForDescription(description) {
    return String(description ?? "").length > 24 ? 30 : 15;
  }

  function buildWorksheetXml(data) {
    const rows = [];
    let rowNumber = 6;

    rows.push(rowXml(rowNumber, [
      cell("A6", 13, "PROJECT SURVEY FORM"),
      ...blankCells(6, 13, 2, 6),
    ], { height: 20 }));
    rowNumber += 1;

    rows.push(rowXml(rowNumber, blankCells(rowNumber, 4)));
    rowNumber += 1;
    rows.push(rowXml(rowNumber, blankCells(rowNumber, 4)));
    rowNumber += 1;

    const metaRows = [
      ["Tanggal Survey", formatSurveyDate(data.surveyDate)],
      ["Nama Surveyor", data.surveyorName],
      ["Nama Customer", data.customerName],
      ["PIC Customer", data.customerPic],
      ["Nama Project", data.projectName],
    ];

    metaRows.forEach(([label, value]) => {
      rows.push(rowXml(rowNumber, [
        cell(`A${rowNumber}`, 4, label),
        cell(`C${rowNumber}`, 9, `: ${value}`),
      ]));
      rowNumber += 1;
    });

    rowNumber += 1;
    rowNumber = appendPullSection(rows, rowNumber, data.pulls);
    rowNumber += 1;
    rowNumber = appendItemSection(rows, rowNumber, "B. PERANGKAT AKTIF", data.activeDevices);
    rowNumber += 1;
    rowNumber = appendItemSection(rows, rowNumber, "C. MATERIAL", data.materials);
    rowNumber += 1;
    rowNumber = appendItemSection(rows, rowNumber, "D. PEKERJAAN TAMBAHAN", data.extras);

    const lastRow = rowNumber - 1;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{00000000-0001-0000-0000-000000000000}"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A6:F${lastRow}"/><sheetViews><sheetView tabSelected="1" zoomScale="120" zoomScaleNormal="120" workbookViewId="0"><selection activeCell="A1" sqref="A1"/></sheetView></sheetViews><sheetFormatPr baseColWidth="10" defaultColWidth="8.83203125" defaultRowHeight="14" x14ac:dyDescent="0.15"/><cols><col min="1" max="1" width="6" style="12" customWidth="1"/><col min="2" max="2" width="22.33203125" style="12" customWidth="1"/><col min="3" max="4" width="12" style="12" customWidth="1"/><col min="5" max="6" width="24" style="12" customWidth="1"/><col min="7" max="16384" width="8.83203125" style="12"/></cols><sheetData>${rows.join("")}</sheetData><mergeCells count="1"><mergeCell ref="A6:F6"/></mergeCells><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/><pageSetup scale="85" orientation="portrait" horizontalDpi="4294967295" verticalDpi="4294967295"/><drawing r:id="rId1"/></worksheet>`;
  }

  function appendPullSection(rows, rowNumber, pulls) {
    rows.push(rowXml(rowNumber, [cell(`A${rowNumber}`, 4, "A. TARIKAN KABEL")]));
    rowNumber += 1;
    rows.push(rowXml(rowNumber, [cell(`A${rowNumber}`, 4, "")]));
    rowNumber += 1;
    rows.push(rowXml(rowNumber, [
      cell(`A${rowNumber}`, 1, "No"),
      cell(`B${rowNumber}`, 1, "Jenis Tarikan"),
      cell(`C${rowNumber}`, 5, "Panjang (m)"),
      cell(`D${rowNumber}`, 1, "Tipe Kabel"),
      cell(`E${rowNumber}`, 1, "Detail Lokasi"),
      cell(`F${rowNumber}`, 1, "Catatan"),
    ], { height: 15, customHeight: true }));
    rowNumber += 1;

    pulls.forEach((pull, index) => {
      rows.push(rowXml(rowNumber, [
        cell(`A${rowNumber}`, 2, index + 1),
        cell(`B${rowNumber}`, 6, pull.type),
        cell(`C${rowNumber}`, 2, pull.length),
        cell(`D${rowNumber}`, 7, pull.cable),
        cell(`E${rowNumber}`, 8, pull.location),
        cell(`F${rowNumber}`, 8, pull.note),
      ], { height: 15 }));
      rowNumber += 1;
    });

    return rowNumber;
  }

  function appendItemSection(rows, rowNumber, title, items) {
    rows.push(rowXml(rowNumber, [cell(`A${rowNumber}`, 4, title)]));
    rowNumber += 1;
    rows.push(rowXml(rowNumber, [cell(`A${rowNumber}`, 4, "")]));
    rowNumber += 1;
    rows.push(rowXml(rowNumber, [
      cell(`A${rowNumber}`, 1, "No"),
      cell(`B${rowNumber}`, 1, "Deskripsi"),
      cell(`C${rowNumber}`, 5, "Qty"),
      cell(`D${rowNumber}`, 1, "Satuan"),
      cell(`E${rowNumber}`, 10, ""),
      cell(`F${rowNumber}`, 10, ""),
    ], { height: 15, customHeight: true }));
    rowNumber += 1;

    items.forEach((item, index) => {
      rows.push(rowXml(rowNumber, [
        cell(`A${rowNumber}`, 2, index + 1),
        cell(`B${rowNumber}`, 3, item.description),
        cell(`C${rowNumber}`, 2, item.qty),
        cell(`D${rowNumber}`, 7, item.unit),
        cell(`E${rowNumber}`, 11, ""),
        cell(`F${rowNumber}`, 11, ""),
      ], { height: rowHeightForDescription(item.description) }));
      rowNumber += 1;
    });

    return rowNumber;
  }

  function buildStylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2 xr" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"><fonts count="6" x14ac:knownFonts="1"><font><sz val="11"/><color rgb="FF000000"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font><font><b/><sz val="11"/><name val="Arial"/><family val="2"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/><family val="2"/></font><font><sz val="11"/><name val="Arial"/><family val="2"/></font><font><b/><sz val="16"/><name val="Arial"/><family val="2"/></font><font><sz val="11"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="14"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="3" fontId="3" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="3" fontId="3" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="3" fontId="3" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/></styleSheet>`;
  }

  async function buildXlsx(data) {
    const createdAt = new Date().toISOString();
    const logoBase64 = await getLogoBase64();
    const files = [
      {
        name: "[Content_Types].xml",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="png" ContentType="image/png"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`,
      },
      {
        name: "_rels/.rels",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      },
      {
        name: "xl/workbook.xml",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="7" lowestEdited="5" rupBuild="10426"/><workbookPr filterPrivacy="1"/><bookViews><workbookView xWindow="0" yWindow="600" windowWidth="28800" windowHeight="15940"/></bookViews><sheets><sheet name="Survey" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="191029"/></workbook>`,
      },
      {
        name: "xl/_rels/workbook.xml.rels",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
      },
      {
        name: "xl/styles.xml",
        data: buildStylesXml(),
      },
      {
        name: "xl/worksheets/sheet1.xml",
        data: buildWorksheetXml(data),
      },
      {
        name: "xl/worksheets/_rels/sheet1.xml.rels",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/></Relationships>`,
      },
      {
        name: "xl/drawings/drawing1.xml",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>0</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>1</xdr:col><xdr:colOff>1366859</xdr:colOff><xdr:row>4</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="3" name="Picture 2"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1821942" cy="719667"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>`,
      },
      {
        name: "xl/drawings/_rels/drawing1.xml.rels",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/></Relationships>`,
      },
      {
        name: "xl/media/image1.png",
        data: base64ToUint8Array(logoBase64),
      },
      {
        name: "docProps/core.xml",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Perkom Indah Murni</dc:creator><cp:lastModifiedBy>Perkom Indah Murni</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${createdAt}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${createdAt}</dcterms:modified></cp:coreProperties>`,
      },
      {
        name: "docProps/app.xml",
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Survey</vt:lpstr></vt:vector></TitlesOfParts><Company>Perkom Indah Murni</Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>`,
      },
    ];

    return createZip(files, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  }

  function getLogoBase64() {
    if (!logoBase64Promise) {
      logoBase64Promise = loadLogoBase64();
    }

    return logoBase64Promise;
  }

  async function getLogoDataUrl() {
    return `data:image/png;base64,${await getLogoBase64()}`;
  }

  async function loadLogoBase64() {
    try {
      const response = await fetch(LOGO_PATH);
      if (response.ok) {
        return arrayBufferToBase64(await response.arrayBuffer());
      }
    } catch {
      // Fall back to image decoding for direct file access.
    }

    try {
      return await loadLogoBase64FromImage();
    } catch {
      return LOGO_BASE64;
    }
  }

  function loadLogoBase64FromImage() {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          canvas.getContext("2d").drawImage(image, 0, 0);
          resolve(canvas.toDataURL("image/png").split(",")[1]);
        } catch (error) {
          reject(error);
        }
      }, { once: true });

      image.addEventListener("error", reject, { once: true });
      image.src = LOGO_PATH;
    });
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    const chunks = [];

    for (let index = 0; index < bytes.length; index += chunkSize) {
      const chunk = bytes.subarray(index, index + chunkSize);
      chunks.push(String.fromCharCode(...chunk));
    }

    return btoa(chunks.join(""));
  }

  function base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  }

  function createZip(files, mimeType) {
    const parts = [];
    const centralDirectory = [];
    let offset = 0;
    const { dosTime, dosDate } = getDosDateTime(new Date());

    files.forEach((file) => {
      const fileName = encoder.encode(file.name);
      const data = typeof file.data === "string" ? encoder.encode(file.data) : file.data;
      const crc = crc32(data);
      const localHeader = new Uint8Array(30 + fileName.length);
      const localView = new DataView(localHeader.buffer);

      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, dosTime, true);
      localView.setUint16(12, dosDate, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, fileName.length, true);
      localView.setUint16(28, 0, true);
      localHeader.set(fileName, 30);

      parts.push(localHeader, data);

      const centralHeader = new Uint8Array(46 + fileName.length);
      const centralView = new DataView(centralHeader.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, dosTime, true);
      centralView.setUint16(14, dosDate, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, fileName.length, true);
      centralView.setUint16(30, 0, true);
      centralView.setUint16(32, 0, true);
      centralView.setUint16(34, 0, true);
      centralView.setUint16(36, 0, true);
      centralView.setUint32(38, 0, true);
      centralView.setUint32(42, offset, true);
      centralHeader.set(fileName, 46);

      centralDirectory.push(centralHeader);
      offset += localHeader.length + data.length;
    });

    const centralStart = offset;
    centralDirectory.forEach((header) => {
      parts.push(header);
      offset += header.length;
    });

    const centralSize = offset - centralStart;
    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, files.length, true);
    endView.setUint16(10, files.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, centralStart, true);
    endView.setUint16(20, 0, true);
    parts.push(endRecord);

    return new Blob(parts, { type: mimeType });
  }

  function getDosDateTime(date) {
    const year = Math.max(1980, date.getFullYear());
    return {
      dosTime: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
      dosDate: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    };
  }

  const crcTable = (() => {
    const table = new Uint32Array(256);

    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) {
        value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      }
      table[index] = value >>> 0;
    }

    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;

    for (let index = 0; index < bytes.length; index += 1) {
      crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
  }

  function drawPdf(data, logoDataUrl) {
    const jsPdfNamespace = globalThis.jspdf;
    if (!jsPdfNamespace?.jsPDF) {
      throw new Error("PDF library is not available.");
    }

    const doc = new jsPdfNamespace.jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });

    doc.setTextColor(0, 0, 0);
    doc.addImage(logoDataUrl || LOGO_DATA_URL, "PNG", 49.2, 53.3, 117.77, 42.64);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13.1);
    doc.text("PROJECT SURVEY FORM", 297.6, 119, { align: "center" });

    drawMetadata(doc, data);

    let nextY = 228;
    nextY = drawPullPdfSection(doc, data.pulls, nextY) + 31.16;
    nextY = drawItemPdfSection(doc, "B. PERANGKAT AKTIF", data.activeDevices, nextY) + 31.16;
    nextY = drawItemPdfSection(doc, "C. MATERIAL", data.materials, nextY) + 31.16;
    drawItemPdfSection(doc, "D. PEKERJAAN TAMBAHAN", data.extras, nextY);

    return doc;
  }

  function drawMetadata(doc, data) {
    const labels = [
      ["Tanggal Survey", formatSurveyDate(data.surveyDate)],
      ["Nama Surveyor", data.surveyorName],
      ["Nama Customer", data.customerName],
      ["PIC Customer", data.customerPic],
      ["Nama Project", data.projectName],
    ];

    doc.setFontSize(9);
    labels.forEach(([label, value], index) => {
      const y = 151.7 + index * 10.66;
      doc.setFont("helvetica", "bold");
      doc.text(label, 51.7, y);
      doc.setFont("helvetica", "normal");
      doc.text(`: ${value}`, 191.1, y);
    });
  }

  function drawPullPdfSection(doc, pulls, topY) {
    return drawPdfSection(doc, {
      title: "A. TARIKAN KABEL",
      topY,
      width: 494.46,
      columns: [
        { label: "No", width: 29.52, align: "center", key: "no" },
        { label: "Jenis Tarikan", width: 109.88, align: "center", key: "type" },
        { label: "Panjang (m)", width: 59.04, align: "center", key: "length" },
        { label: "Tipe Kabel", width: 59.04, align: "center", key: "cable" },
        { label: "Detail Lokasi", width: 117.26, align: "center", key: "location" },
        { label: "Catatan", width: 119.72, align: "center", key: "note" },
      ],
      rows: pulls.map((row, index) => ({
        no: index + 1,
        type: row.type,
        length: row.length,
        cable: row.cable,
        location: row.location,
        note: row.note,
      })),
    });
  }

  function drawItemPdfSection(doc, title, items, topY) {
    return drawPdfSection(doc, {
      title,
      topY,
      width: 258.3,
      columns: [
        { label: "No", width: 29.52, align: "center", key: "no" },
        { label: "Deskripsi", width: 109.88, align: "left", key: "description" },
        { label: "Qty", width: 59.04, align: "center", key: "qty" },
        { label: "Satuan", width: 59.86, align: "center", key: "unit" },
      ],
      rows: items.map((row, index) => ({
        no: index + 1,
        description: row.description,
        qty: row.qty,
        unit: row.unit,
      })),
      getRowHeight: (row) => String(row.description ?? "").length > 24 ? 22.96 : 11.48,
    });
  }

  function drawPdfSection(doc, config) {
    const left = 49.2;
    const headerHeight = 12.3;
    const defaultRowHeight = 11.48;
    const rows = config.rows.length ? config.rows : [{}];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(config.title, 51.7, config.topY - 12.3);

    doc.setFillColor(31, 78, 120);
    doc.rect(left, config.topY, config.width, headerHeight, "F");
    drawGrid(doc, left, config.topY, config.width, headerHeight, config.columns);

    let x = left;
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    config.columns.forEach((column) => {
      doc.text(column.label, x + column.width / 2, config.topY + 8.6, { align: "center" });
      x += column.width;
    });

    let rowY = config.topY + headerHeight;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(0, 0, 0);

    rows.forEach((row) => {
      const rowHeight = config.getRowHeight ? config.getRowHeight(row) : defaultRowHeight;
      drawGrid(doc, left, rowY, config.width, rowHeight, config.columns);

      let cellX = left;
      config.columns.forEach((column) => {
        const text = fitText(doc, row[column.key] ?? "", column.width - 5);
        const textX = column.align === "left" ? cellX + 4 : cellX + column.width / 2;
        doc.text(String(text), textX, rowY + Math.min(8.3, rowHeight - 3), {
          align: column.align === "left" ? "left" : "center",
        });
        cellX += column.width;
      });

      rowY += rowHeight;
    });

    doc.setTextColor(0, 0, 0);
    return rowY;
  }

  function drawGrid(doc, left, top, width, height, columns) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.82);
    doc.rect(left, top, width, height);

    let x = left;
    columns.slice(0, -1).forEach((column) => {
      x += column.width;
      doc.line(x, top, x, top + height);
    });
  }

  function fitText(doc, value, maxWidth) {
    let text = String(value ?? "");

    if (doc.getTextWidth(text) <= maxWidth) {
      return text;
    }

    while (text.length > 1 && doc.getTextWidth(`${text}...`) > maxWidth) {
      text = text.slice(0, -1);
    }

    return `${text}...`;
  }

  function formatSurveyDate(value) {
    if (!value) {
      return "";
    }

    const [year, month, day] = value.split("-").map(Number);
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    if (!year || !month || !day) {
      return value;
    }

    return `${day} ${monthNames[month - 1]} ${year}`;
  }

  function buildFileName(data, extension) {
    const projectName = data.projectName || "Project Survey";
    const safeProjectName = projectName
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return `Survey Form - ${safeProjectName}.${extension}`;
  }

  function downloadBlob(blob, fileName) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  Object.keys(sectionConfig).forEach((sectionKey) => {
    sectionConfig[sectionKey].target.addEventListener("input", syncStateFromForm);
  });

  sectionConfig.pulls.target.addEventListener("change", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('[data-field="type"]')
      : null;

    if (!target) {
      return;
    }

    const rowElement = target.closest(".survey-row");
    const rowIndex = Number(rowElement?.dataset.rowIndex);

    syncStateFromForm();
    if (!Number.isInteger(rowIndex) || !state.pulls[rowIndex]) {
      return;
    }

    normalizePullCable(state.pulls[rowIndex]);
    renderSection("pulls");
  });

  document.querySelectorAll("[data-add-row]").forEach((button) => {
    button.addEventListener("click", () => {
      syncStateFromForm();
      const sectionKey = button.dataset.addRow;
      state[sectionKey].push(emptyRow(sectionConfig[sectionKey].columns));
      renderSection(sectionKey);
    });
  });

  document.querySelectorAll("[data-section]").forEach((section) => {
    section.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-row]");
      if (!removeButton) {
        return;
      }

      syncStateFromForm();
      const sectionKey = removeButton.dataset.removeRow;
      const rowIndex = Number(removeButton.dataset.rowIndex);

      if (state[sectionKey].length > 1) {
        state[sectionKey].splice(rowIndex, 1);
      } else {
        state[sectionKey] = [emptyRow(sectionConfig[sectionKey].columns)];
      }

      renderSection(sectionKey);
    });
  });

  document.getElementById("saveSurvey").addEventListener("click", saveSurvey);
  document.getElementById("loadSurvey").addEventListener("click", loadSurvey);
  document.getElementById("resetSurvey").addEventListener("click", resetSurvey);
  savedSurveyList.addEventListener("click", (event) => {
    const actionButton = event.target instanceof Element
      ? event.target.closest("[data-load-saved], [data-delete-saved]")
      : null;

    if (!actionButton) {
      return;
    }

    const loadId = actionButton.getAttribute("data-load-saved");
    const deleteId = actionButton.getAttribute("data-delete-saved");

    if (loadId) {
      loadSavedSurvey(loadId);
    }

    if (deleteId) {
      deleteSavedSurvey(deleteId);
    }
  });
  savedSurveyClose.addEventListener("click", closeSavedSurveyModal);
  savedSurveyModal.addEventListener("click", (event) => {
    const closeButton = event.target instanceof Element
      ? event.target.closest("[data-close-saved-modal]")
      : null;

    if (closeButton) {
      closeSavedSurveyModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !savedSurveyModal.hidden) {
      closeSavedSurveyModal();
    }
  });

  document.getElementById("downloadExcel").addEventListener("click", async () => {
    const data = collectFormData();
    if (!validateSurvey(data)) {
      return;
    }

    if (!isSurveySaved(data)) {
      setStatus("Simpan survey terlebih dahulu sebelum download.", "warning");
      return;
    }

    try {
      downloadBlob(await buildXlsx(data), buildFileName(data, "xlsx"));
      setStatus("File Excel berhasil dibuat.", "success");
    } catch {
      setStatus("File Excel belum bisa dibuat karena asset logo gagal dimuat.", "danger");
    }
  });

  document.getElementById("downloadPdf").addEventListener("click", async () => {
    const data = collectFormData();
    if (!validateSurvey(data)) {
      return;
    }

    if (!isSurveySaved(data)) {
      setStatus("Simpan survey terlebih dahulu sebelum download.", "warning");
      return;
    }

    try {
      const doc = drawPdf(data, await getLogoDataUrl());
      doc.save(buildFileName(data, "pdf"));
      setStatus("File PDF berhasil dibuat.", "success");
    } catch {
      setStatus("PDF belum bisa dibuat karena library PDF gagal dimuat.", "danger");
    }
  });

  const activeTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  setTheme(activeTheme);
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  });

  initializeForm();

  if (document.readyState === "complete") {
    hidePageLoader();
  } else {
    globalThis.addEventListener("load", hidePageLoader, { once: true });
  }
});
