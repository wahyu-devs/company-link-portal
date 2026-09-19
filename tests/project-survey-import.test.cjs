const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { root, fixture, exportFile, pdfLayout } = require("./helpers/survey-fixtures.cjs");
const XLSX = require("../assets/vendor/sheetjs/xlsx-0.20.3.mini.min.js");
const context = vm.createContext({ XLSX, Date });
vm.runInContext(fs.readFileSync(path.join(root, "project-survey-import.js"), "utf8"), context);
const read = async (file) => JSON.parse(JSON.stringify(await context.ProjectSurveyExcel.readFile(file)));

async function mutateWorkbook(edit) {
  const workbook = XLSX.read(await (await exportFile()).arrayBuffer(), { type: "array" });
  edit(workbook.Sheets.Survey, workbook);
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx", compression: true, bookSST: true });
  return { name: "renamed.XLSX", size: buffer.byteLength, arrayBuffer: async () => buffer };
}

test("app XLSX export round-trips metadata, all sections and zero quantities", async () => {
  assert.deepEqual(await read(await exportFile()), fixture());
});

test("many rows, decimals, literal formula-like text and long notes survive import", async () => {
  const data = fixture();
  data.pulls = Array.from({ length: 500 }, (_, i) => ({ ...data.pulls[0], qty: i + 0.25, location: `Room ${i}` }));
  data.materials[0].note = 'Long note <tag> & "quotes" '.repeat(100);
  data.materials[0].note = data.materials[0].note.trim();
  data.extras[0].description = "=SUM(A1:A2)";
  data.remarks[0].description = "General note ".repeat(100).trim();
  assert.deepEqual(await read(await exportFile(data)), data);
});

test("empty sections are restored as an empty editable row", async () => {
  const data = fixture();
  for (const key of ["pulls", "activeDevices", "materials", "extras", "remarks"]) data[key] = [];
  const parsed = await read(await exportFile(data));
  for (const key of ["pulls", "activeDevices", "materials", "extras", "remarks"]) {
    assert.equal(parsed[key].length, 1);
    assert(Object.values(parsed[key][0]).every((value) => value === ""));
  }
});

test("Excel item and remark columns use the requested spans", async () => {
  const workbook = XLSX.read(await (await exportFile()).arrayBuffer(), { type: "array" });
  const sheet = workbook.Sheets.Survey;
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, defval: "", blankrows: true });
  const merges = sheet["!merges"].map((range) => XLSX.utils.encode_range(range));

  for (const title of ["B. PERANGKAT AKTIF", "C. MATERIAL", "D. PEKERJAAN TAMBAHAN"]) {
    const sectionIndex = rows.findIndex((row) => row[0] === title);
    const headerRow = sectionIndex + 2;
    const dataRow = sectionIndex + 3;
    assert.deepEqual(rows[headerRow].slice(0, 7), ["No", "Deskripsi", "", "Qty", "Satuan", "Catatan", ""]);
    for (const row of [headerRow, dataRow]) {
      assert(merges.includes(`B${row + 1}:C${row + 1}`));
      assert(merges.includes(`F${row + 1}:G${row + 1}`));
    }
  }

  const remarkSectionIndex = rows.findIndex((row) => row[0] === "E. CATATAN");
  const remarkHeaderRow = remarkSectionIndex + 2;
  const remarkDataRow = remarkSectionIndex + 3;
  assert.deepEqual(rows[remarkHeaderRow].slice(0, 7), ["No", "Catatan", "", "", "", "", ""]);
  assert(merges.includes(`B${remarkHeaderRow + 1}:G${remarkHeaderRow + 1}`));
  assert(merges.includes(`B${remarkDataRow + 1}:G${remarkDataRow + 1}`));
});

test("Excel item note width follows the longest note content", async () => {
  const noteSpanWidth = async (data) => {
    const workbook = XLSX.read(await (await exportFile(data)).arrayBuffer(), {
      type: "array",
      cellStyles: true,
    });
    const columns = workbook.Sheets.Survey["!cols"];
    return Number((columns[5].width + columns[6].width).toFixed(2));
  };
  const shortNotes = fixture();
  const longNotes = fixture();
  longNotes.materials[0].note = "Long material note for automatic column sizing";
  const shortWidth = await noteSpanWidth(shortNotes);
  const longWidth = await noteSpanWidth(longNotes);

  assert(longWidth > shortWidth);
  assert.equal(longWidth, longNotes.materials[0].note.length + 1);
});

test("PDF item and remark columns match the Excel column spans", () => {
  const pullWidths = pdfLayout.pullColumns.map((column) => column.width);
  const sumWidths = (widths) => Number(widths.reduce((total, width) => total + width, 0).toFixed(2));
  const remarkWidth = sumWidths(pdfLayout.remarkColumns.map((column) => column.width));
  const itemWidths = pdfLayout.itemColumns.map((column) => column.width);

  assert.equal(pdfLayout.itemTableWidth, pdfLayout.fullTableWidth);
  assert.deepEqual(itemWidths, [
    pullWidths[0],
    sumWidths(pullWidths.slice(1, 3)),
    pullWidths[3],
    pullWidths[4],
    sumWidths(pullWidths.slice(5, 7)),
  ]);
  assert.equal(remarkWidth, pdfLayout.itemTableWidth);
  assert.equal(pdfLayout.remarkColumns[1].label, "Catatan");
  assert.equal(pdfLayout.remarkColumns[1].width, sumWidths(pullWidths.slice(1)));
});

test("older exports without the remarks section remain importable", async () => {
  const parsed = await read(await mutateWorkbook((sheet, workbook) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, defval: "", blankrows: true });
    const sectionIndex = rows.findIndex((row) => row[0] === "E. CATATAN");
    workbook.Sheets.Survey = XLSX.utils.aoa_to_sheet(rows.slice(0, sectionIndex));
  }));
  const expected = fixture();
  expected.remarks = [{ description: "" }];
  assert.deepEqual(parsed, expected);
});

test("older remarks headers named Deskripsi remain importable", async () => {
  const parsed = await read(await mutateWorkbook((sheet) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, defval: "", blankrows: true });
    const sectionIndex = rows.findIndex((row) => row[0] === "E. CATATAN");
    sheet[`B${sectionIndex + 3}`].v = "Deskripsi";
  }));
  assert.deepEqual(parsed, fixture());
});

test("reject malformed remarks section headers", async () => {
  await assert.rejects(read(await mutateWorkbook((sheet) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, defval: "", blankrows: true });
    const sectionIndex = rows.findIndex((row) => row[0] === "E. CATATAN");
    sheet[`B${sectionIndex + 3}`].v = "Wrong header";
  })), /E\. CATATAN/);
});

test("compressed Excel-resaved files with shared strings import correctly", async () => {
  assert.deepEqual(await read(await mutateWorkbook(() => {})), fixture());
});

test("section positions are discovered after inserting rows", async () => {
  const file = await mutateWorkbook((sheet, workbook) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0 });
    rows.splice(14, 0, [], [], []);
    workbook.Sheets.Survey = XLSX.utils.aoa_to_sheet(rows);
  });
  assert.deepEqual(await read(file), fixture());
});

test("item notes are optional in older exports", async () => {
  const parsed = await read(await mutateWorkbook((sheet) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, defval: "", blankrows: true });
    const titles = ["A. TARIKAN KABEL", "B. PERANGKAT AKTIF", "C. MATERIAL", "D. PEKERJAAN TAMBAHAN", "E. CATATAN"];
    const starts = titles.map((title) => rows.findIndex((row) => row[0] === title));
    for (let section = 0; section < starts.length - 1; section += 1) {
      const headerRow = starts[section] + 2;
      const noteColumn = rows[headerRow].indexOf("Catatan");
      if (noteColumn < 0) continue;
      for (let row = headerRow; row < starts[section + 1]; row += 1) {
        const address = XLSX.utils.encode_cell({ r: row, c: noteColumn });
        if (sheet[address]) sheet[address].v = "";
      }
    }
  }));
  assert.equal(parsed.pulls[0].note, "");
  assert.equal(parsed.materials[0].note, "");
});

for (const [description, value, expected] of [
  ["Indonesian leap date", ": 29 Februari 2024", "2024-02-29"],
  ["ISO date", "2026-09-02", "2026-09-02"],
  ["typed Excel date", new Date(2026, 8, 2), "2026-09-02"],
]) {
  test(description, async () => {
    const parsed = await read(await mutateWorkbook((sheet) => {
      sheet.C9 = XLSX.utils.aoa_to_sheet([[value]], { cellDates: true }).A1;
    }));
    assert.equal(parsed.surveyDate, expected);
  });
}

for (const [description, edit, message] of [
  ["missing survey sheet", (sheet, wb) => { delete wb.Sheets.Survey; wb.SheetNames = ["Other"]; wb.Sheets.Other = sheet; }, /Sheet Survey/],
  ["invalid title", (sheet) => { sheet.A6.v = "Other Form"; }, /Struktur/],
  ["missing section", (sheet) => { sheet.A30.v = "Other Section"; }, /section tidak/],
  ["missing header", (sheet) => { sheet.B17.v = "Wrong header"; }, /header tabel/],
  ["missing metadata", (sheet) => { sheet.C11.v = ": "; }, /Nama Customer/],
  ["invalid date", (sheet) => { sheet.C9.v = ": 31 Februari 2026"; }, /Tanggal Survey/],
  ["invalid quantity", (sheet) => { sheet.C18 = { t: "s", v: "not a number" }; }, /Qty/],
  ["negative quantity", (sheet) => { sheet.C18 = { t: "n", v: -1 }; }, /Qty/],
  ["missing required item field", (sheet) => { sheet.F18.v = ""; }, /Detail Lokasi/],
  ["formula cell", (sheet) => { sheet.C18 = { t: "n", v: 2, f: "1+1" }; }, /formula/],
  ["error cell", (sheet) => { sheet.C18 = { t: "e", v: 7 }; }, /error/],
]) {
  test(`reject ${description}`, async () => {
    await assert.rejects(read(await mutateWorkbook(edit)), message);
  });
}

test("reject an unrelated file renamed to xlsx", async () => {
  const buffer = new TextEncoder().encode("<html>not a workbook</html>").buffer;
  await assert.rejects(read({ name: "fake.xlsx", size: buffer.byteLength, arrayBuffer: async () => buffer }), /bukan workbook/);
});

test("reject unsupported extension and empty files", async () => {
  await assert.rejects(read({ name: "survey.xls", size: 100 }), /Pilih file .xlsx/);
  await assert.rejects(read({ name: "survey.xlsx", size: 0 }), /berisi data/);
});

test("reading the same file twice is supported", async () => {
  const file = await exportFile();
  assert.deepEqual(await read(file), await read(file));
});
