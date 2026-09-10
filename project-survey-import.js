(() => {
  const metadata = [
    ["surveyDate", "Tanggal Survey"],
    ["surveyorName", "Nama Surveyor"],
    ["customerName", "Nama Customer"],
    ["customerPic", "PIC Customer"],
    ["projectName", "Nama Project"],
  ];
  const itemColumns = [
    ["description", "Deskripsi"], ["qty", "Qty"], ["unit", "Satuan"], ["note", "Catatan"],
  ];
  const sections = [
    { key: "pulls", title: "A. TARIKAN KABEL", columns: [
      ["type", "Jenis Tarikan"], ["qty", "Qty"], ["unit", "Satuan"],
      ["cable", "Tipe Kabel"], ["location", "Detail Lokasi"], ["note", "Catatan"],
    ] },
    { key: "activeDevices", title: "B. PERANGKAT AKTIF", columns: itemColumns },
    { key: "materials", title: "C. MATERIAL", columns: itemColumns },
    { key: "extras", title: "D. PEKERJAAN TAMBAHAN", columns: itemColumns },
  ];
  let libraryPromise;

  function loadLibrary() {
    if (globalThis.XLSX?.read) return Promise.resolve(globalThis.XLSX);
    if (!libraryPromise) {
      libraryPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const fail = () => {
          clearTimeout(timeout);
          script.remove();
          reject(new Error("Pembaca Excel gagal dimuat. Silakan coba lagi."));
        };
        const timeout = setTimeout(fail, 15000);
        script.src = "assets/vendor/sheetjs/xlsx-0.20.3.mini.min.js";
        script.onload = () => {
          clearTimeout(timeout);
          if (globalThis.XLSX?.read) resolve(globalThis.XLSX);
          else fail();
        };
        script.onerror = fail;
        document.head.appendChild(script);
      }).catch((error) => {
        libraryPromise = undefined;
        throw error;
      });
    }
    return libraryPromise;
  }

  function label(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  function isBlank(value) {
    return value === null || value === undefined || String(value).trim() === "";
  }

  function textValue(value, context) {
    if (isBlank(value)) return "";
    if (typeof value !== "string" && !(typeof value === "number" && Number.isFinite(value))) {
      throw new Error(`${context}: nilai sel tidak valid.`);
    }
    return String(value).trim();
  }

  function parseDate(value, XLSX, date1904) {
    let year, month, day;
    if (value instanceof Date) {
      year = value.getUTCFullYear();
      month = value.getUTCMonth() + 1;
      day = value.getUTCDate();
    } else if (typeof value === "number") {
      const date = XLSX.SSF.parse_date_code(value, { date1904 });
      if (date) ({ y: year, m: month, d: day } = date);
    } else {
      const text = textValue(value, "Tanggal Survey").replace(/^:\s*/, "");
      const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
      const written = /^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i.exec(text);
      const months = [
        "januari", "februari", "maret", "april", "mei", "juni",
        "juli", "agustus", "september", "oktober", "november", "desember",
      ];
      if (iso) [, year, month, day] = iso.map(Number);
      else if (written) {
        year = Number(written[3]);
        month = months.indexOf(written[2].toLowerCase()) + 1;
        day = Number(written[1]);
      }
    }
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    if (!(year >= 1 && year <= 9999) || date.getUTCFullYear() !== year
      || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
      throw new Error("Tanggal Survey tidak valid. Gunakan tanggal seperti 2 September 2026.");
    }
    return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function readSection(rows, section, start, end) {
    let headerIndex = start + 1;
    while (headerIndex < end && rows[headerIndex].every(isBlank)) headerIndex += 1;
    const headers = (rows[headerIndex] || []).map(label);
    const allowedHeaders = ["no", ...section.columns.map(([, name]) => label(name))];
    if (headers.filter((name) => name === "no").length !== 1
      || headers.some((name) => name && !allowedHeaders.includes(name))) {
      throw new Error(`${section.title}: header tabel tidak sesuai format app.`);
    }
    const columns = section.columns.map(([key, name]) => {
      const matches = headers.flatMap((header, index) => header === label(name) ? [index] : []);
      if (matches.length > 1 || (matches.length === 0 && key !== "note")) {
        throw new Error(`${section.title}: kolom ${name} tidak ditemukan atau duplikat.`);
      }
      return { key, name, index: matches[0] ?? -1 };
    });
    const data = [];
    for (let index = headerIndex + 1; index < end; index += 1) {
      const cells = rows[index];
      if (cells.every(isBlank)) continue;
      if (cells.some((value, column) => !isBlank(value) && !headers[column])) {
        throw new Error(`${section.title}, baris Excel ${index + 1}: ada data tanpa header kolom.`);
      }
      const row = {};
      for (const column of columns) {
        const context = `${section.title}, baris Excel ${index + 1}, ${column.name}`;
        const value = textValue(cells[column.index], context);
        if (column.key === "qty" && value !== "") {
          if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)
            || !Number.isFinite(Number(value))) {
            throw new Error(`${context}: isi dengan angka nol atau lebih besar.`);
          }
          row[column.key] = Number(value);
        } else row[column.key] = value;
      }
      if (Object.values(row).every(isBlank)) continue;
      const number = Number(cells[headers.indexOf("no")]);
      if (!Number.isInteger(number) || number < 1) {
        throw new Error(`${section.title}, baris Excel ${index + 1}: nomor item tidak valid.`);
      }
      for (const column of columns) {
        if (column.key !== "note" && isBlank(row[column.key])) {
          throw new Error(`${section.title}, baris Excel ${index + 1}: ${column.name} wajib diisi.`);
        }
      }
      data.push(row);
    }
    return data.length ? data : [Object.fromEntries(section.columns.map(([key]) => [key, ""]))];
  }

  function parseWorkbook(workbook, XLSX) {
    const sheet = workbook.Sheets.Survey;
    if (!sheet?.["!ref"]) {
      throw new Error("Sheet Survey tidak ditemukan. Pilih Excel hasil Download Excel dari app ini.");
    }
    // Reject formulas and error cells instead of silently importing cached or missing values.
    for (const [address, cell] of Object.entries(sheet)) {
      if (!address.startsWith("!") && (cell.f || cell.t === "e")) {
        throw new Error(`Sel ${address} berisi formula atau error. Gunakan Excel hasil download app.`);
      }
    }
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    if (range.e.r >= 20000 || range.e.c >= 32) {
      throw new Error("Area data Excel terlalu besar untuk dimuat. Pilih file survey yang lebih kecil.");
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, raw: true, defval: "", blankrows: true, UTC: true });
    const titleIndex = rows.findIndex((row) => label(row[0]) === "project survey form");
    const starts = sections.map((section) => {
      const matches = rows.flatMap((row, index) => label(row[0]) === label(section.title) ? [index] : []);
      if (matches.length !== 1) throw new Error(`${section.title}: section tidak ditemukan atau duplikat.`);
      return matches[0];
    });
    if (titleIndex < 0 || starts[0] <= titleIndex || starts.some((start, index) => index > 0 && start <= starts[index - 1])) {
      throw new Error("Struktur Excel tidak sesuai Project Survey Form.");
    }
    const data = {};
    for (const [key, name] of metadata) {
      const matches = rows.slice(titleIndex + 1, starts[0]).filter((row) => label(row[0]) === label(name));
      const values = matches[0]?.slice(1).filter((value) => !isBlank(value)) || [];
      if (matches.length !== 1 || values.length !== 1) throw new Error(`${name} tidak ditemukan atau tidak valid.`);
      data[key] = key === "surveyDate"
        ? parseDate(values[0], XLSX, Boolean(workbook.Workbook?.WBProps?.date1904))
        : textValue(values[0], name).replace(/^:\s*/, "");
      if (!data[key]) throw new Error(`${name} wajib diisi.`);
    }
    sections.forEach((section, index) => {
      data[section.key] = readSection(rows, section, starts[index], starts[index + 1] ?? rows.length);
    });
    return data;
  }

  async function readFile(file) {
    if (!/\.xlsx$/i.test(file.name)) throw new Error("Pilih file .xlsx hasil Download Excel dari app ini.");
    if (!file.size || file.size > 20 * 1024 * 1024) throw new Error("File Excel harus berisi data dan berukuran maksimal 20 MB.");
    let buffer;
    try {
      buffer = await file.arrayBuffer();
    } catch {
      throw new Error("File Excel tidak bisa dibaca. Silakan pilih ulang file.");
    }
    const signature = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 4));
    if (signature.length !== 4 || signature[0] !== 0x50 || signature[1] !== 0x4b
      || signature[2] !== 0x03 || signature[3] !== 0x04) {
      throw new Error("File bukan workbook .xlsx yang valid.");
    }
    const XLSX = await loadLibrary();
    let workbook;
    try {
      workbook = XLSX.read(buffer, { type: "array", cellDates: true, cellFormula: true, cellHTML: false });
    } catch {
      throw new Error("File Excel rusak, terkunci, atau tidak bisa dibaca.");
    }
    return parseWorkbook(workbook, XLSX);
  }

  globalThis.ProjectSurveyExcel = Object.freeze({ readFile });
})();
