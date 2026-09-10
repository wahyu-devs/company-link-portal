const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { root, fixture, exportFile } = require("./helpers/survey-fixtures.cjs");
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
  assert.deepEqual(await read(await exportFile(data)), data);
});

test("empty sections are restored as an empty editable row", async () => {
  const data = fixture();
  for (const key of ["pulls", "activeDevices", "materials", "extras"]) data[key] = [];
  const parsed = await read(await exportFile(data));
  for (const key of ["pulls", "activeDevices", "materials", "extras"]) {
    assert.equal(parsed[key].length, 1);
    assert(Object.values(parsed[key][0]).every((value) => value === ""));
  }
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
    for (const cell of Object.values(sheet)) {
      if (cell?.v === "Catatan") cell.v = "";
    }
    for (const [address, cell] of Object.entries(sheet)) {
      if (/^G\d+$/.test(address)) cell.v = "";
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
