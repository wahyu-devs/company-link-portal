const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const { root, fixture, exportFile } = require("./helpers/survey-fixtures.cjs");

const storageKey = "projectSurveyFormDraft";
const heicFixturePath = process.env.PROJECT_SURVEY_HEIC_FIXTURE
  || path.join(root, "tests/fixtures/project-survey-logo.heic");
const firstDraft = { id: "first", savedAt: "2026-09-02T00:00:00Z", data: fixture() };
const secondDraft = {
  id: "second", savedAt: firstDraft.savedAt,
  data: { ...fixture(), customerName: "Another Customer", projectName: "Another Project" },
};

async function main() {
  const server = http.createServer(async (req, res) => {
    try {
      const relative = decodeURIComponent(new URL(req.url, "http://localhost").pathname).replace(/^\/+/, "");
      const file = path.resolve(root, relative || "index.html");
      if (!file.startsWith(root + path.sep)) throw new Error("Invalid path");
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".png": "image/png",
      };
      res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
      res.end(await fs.readFile(file));
    } catch {
      res.statusCode = 404;
      res.end();
    }
  });
  let browser;
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}),
    });
    const file = await exportFile();
    const payload = {
      name: "Survey.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: Buffer.from(await file.arrayBuffer()),
    };

    async function check(name, run, { mobile = false } = {}) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
      try {
        // Block external services so these checks cannot authenticate or send email.
        await context.route("**/*", (route) => route.request().url().startsWith(origin)
          ? route.continue()
          : route.fulfill({ body: "", contentType: route.request().resourceType() === "stylesheet" ? "text/css" : "text/javascript" }));
        await context.addInitScript(() => {
          const active = new Set();
          const add = window.addEventListener;
          const remove = window.removeEventListener;
          window.addEventListener = function (type, listener, options) {
            if (type === "beforeunload") active.add(listener);
            return add.call(this, type, listener, options);
          };
          window.removeEventListener = function (type, listener, options) {
            if (type === "beforeunload") active.delete(listener);
            return remove.call(this, type, listener, options);
          };
          window.unsavedListenerCount = () => active.size;
        });
        const page = await context.newPage();
        page.setDefaultTimeout(5000);
        const errors = [];
        const dialogs = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("dialog", async (dialog) => {
          dialogs.push(dialog.type());
          await dialog.dismiss();
        });
        await page.goto(origin + "/index.html");
        await page.evaluate(({ key, drafts }) => localStorage.setItem(key, JSON.stringify(drafts)), {
          key: storageKey, drafts: [firstDraft, secondDraft],
        });
        await page.goto(origin + "/project-survey.html");
        await page.locator("#pageLoader").waitFor({ state: "detached" });

        const dirty = async (expected) => assert.equal(await page.evaluate(() => window.unsavedListenerCount()), expected ? 1 : 0);
        const saved = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
        const modal = page.locator("#unsavedSurveyModal");
        const choose = async (choice) => {
          await modal.waitFor({ state: "visible" });
          const selector = choice === "cancel" ? "#unsavedSurveyCancel" : `[data-unsaved-choice="${choice}"]`;
          await modal.locator(selector).click();
          await modal.waitFor({ state: "hidden" });
        };
        const load = async (id = "first") => {
          await page.locator("#loadSurvey").click();
          await page.locator(`[data-load-saved="${id}"]`).click();
        };
        const waitForImport = () => page.waitForFunction(() => !document.querySelector("#importSurveyExcel").disabled);
        await run({ page, dirty, saved, modal, choose, load, waitForImport, dialogs });
        assert.deepEqual(errors, []);
        console.log(`PASS: ${name}`);
      } finally {
        await context.close();
      }
    }

    await check("clean forms, reverted edits, all row types, and non-document controls", async ({ page, dirty, modal, load }) => {
      await dirty(false);
      await page.locator("#resetSurvey").click();
      assert(await modal.isHidden());
      await page.locator("#themeToggle").click();
      await page.locator("#loadSurvey").click();
      await page.locator("#savedSurveySearch").fill("No Match");
      await dirty(false);
      await page.keyboard.press("Escape");
      await load();
      assert.equal(await page.locator("#remarkRows .survey-row-header span").nth(1).textContent(), "Catatan");
      assert.equal(await page.locator("#documentationRows .survey-row-header").count(), 0);
      const documentationLayout = await page.locator("#documentationRows").evaluate((table) => {
        const row = table.querySelector(".survey-row:not(.survey-row-header)");
        const tableStyle = getComputedStyle(table);
        const rowStyle = getComputedStyle(row);
        const card = row.getBoundingClientRect();
        const photo = row.querySelector(".survey-photo-field").getBoundingClientRect();
        const preview = row.querySelector(".survey-photo-preview").getBoundingClientRect();
        const number = row.querySelector(".survey-row-number").getBoundingClientRect();
        const description = row.querySelector('[data-field="description"]').getBoundingClientRect();
        const action = row.querySelector(".survey-remove-row").getBoundingClientRect();
        return {
          fits: table.scrollWidth <= table.clientWidth + 1,
          columns: tableStyle.gridTemplateColumns.split(" ").length,
          cardBorder: rowStyle.borderTopWidth,
          cardBackground: rowStyle.backgroundColor,
          photoWidth: photo.width,
          descriptionWidth: description.width,
          photoFillsCard: Math.abs(photo.left - card.left) <= 1 && Math.abs(photo.right - card.right) <= 1,
          overlaysPhoto: [number, action].every((control) => (
            control.top >= preview.top && control.bottom <= preview.bottom
          )),
          descriptionBelowPhoto: description.top >= preview.bottom,
          objectFit: getComputedStyle(row.querySelector(".survey-photo-preview img")).objectFit,
          compactHeights: [number.height, description.height, action.height],
        };
      });
      assert.equal(documentationLayout.fits, true);
      assert.equal(documentationLayout.columns, 2);
      assert.equal(documentationLayout.cardBorder, "1px");
      assert.notEqual(documentationLayout.cardBackground, "rgba(0, 0, 0, 0)");
      assert(documentationLayout.photoWidth >= 300);
      assert(documentationLayout.descriptionWidth >= 300);
      assert.equal(documentationLayout.photoFillsCard, true);
      assert.equal(documentationLayout.overlaysPhoto, true);
      assert.equal(documentationLayout.descriptionBelowPhoto, true);
      assert.equal(documentationLayout.objectFit, "cover");
      assert(documentationLayout.compactHeights.every((height) => Math.abs(height - 44) <= 1));
      assert.equal(
        await page.locator('#documentationRows [data-field="description"]').first().getAttribute("placeholder"),
        "Deskripsi foto"
      );
      await dirty(false);
      for (const id of ["surveyorName", "customerName", "customerPic", "projectName", "surveyDate"]) {
        const field = page.locator("#" + id);
        const original = await field.inputValue();
        await field.fill(id === "surveyDate" ? "2026-09-03" : "Changed");
        await dirty(true);
        await field.fill(original);
        await dirty(false);
      }
      const sectionFields = {
        pulls: "note",
        activeDevices: "note",
        materials: "note",
        extras: "note",
        remarks: "description",
        documentation: "description",
      };
      for (const [section, field] of Object.entries(sectionFields)) {
        const fields = page.locator(`[data-section="${section}"] [data-field="${field}"]`);
        const original = await fields.inputValue();
        await fields.fill("Changed Note");
        await dirty(true);
        await fields.fill(original);
        await dirty(false);
        await page.locator(`[data-add-row="${section}"]`).click();
        await dirty(true);
        await page.locator(`[data-remove-row="${section}"]`).last().click();
        await dirty(false);
      }
      const remarkDescription = page.locator('#remarkRows [data-field="description"]').first();
      await remarkDescription.press("Enter");
      assert.equal(await page.locator('#remarkRows [data-field="description"]').count(), 2);
      assert.equal(await page.evaluate(() => document.activeElement?.dataset.field), "description");
      await dirty(true);
      await page.locator('[data-remove-row="remarks"]').last().click();
      await dirty(false);
      await page.locator('#pullRows [data-field="type"]').selectOption("Power");
      await dirty(true);
      await page.locator('#pullRows [data-field="type"]').selectOption("Data");
      await page.locator('#pullRows [data-field="cable"]').selectOption("UTP");
      await dirty(false);
      await page.locator('#pullRows [data-field="qty"]').fill("3.5");
      await dirty(true);
      await page.locator("#saveSurvey").click();
      await dirty(false);
    });

    await check("documentation camera and gallery choices persist photos", async ({ page, dirty, saved, load }) => {
      await load();
      const photoField = page.locator("#documentationRows .survey-photo-field").first();
      assert.equal(await photoField.locator("[data-photo-toggle]").count(), 0);
      assert.equal(await photoField.locator("[data-clear-photo]").count(), 0);
      assert.equal(
        await page.locator('#documentationRows [data-remove-row="documentation"]').getAttribute("aria-label"),
        "Hapus Dokumentasi 1"
      );
      assert.equal(await photoField.locator("button span").count(), 0);
      assert.equal(await photoField.locator("[data-photo-status]").textContent(), "");
      assert.equal(await photoField.locator('[data-photo-source="camera"]').getAttribute("aria-label"), "Ambil Dari Kamera");
      assert.equal(await photoField.locator('[data-photo-source="gallery"]').getAttribute("aria-label"), "Pilih Dari Galeri");
      assert(await photoField.locator('[data-photo-source="camera"]').isVisible());
      assert(await photoField.locator('[data-photo-source="gallery"]').isVisible());
      assert.equal(await photoField.locator('[data-photo-input="camera"]').getAttribute("capture"), "environment");
      assert.equal(await photoField.locator('[data-photo-input="gallery"]').getAttribute("capture"), null);
      assert.match(await photoField.locator('[data-photo-input="gallery"]').getAttribute("accept"), /\.heic/);
      assert.equal(await photoField.locator(".survey-photo-preview img").count(), 1);

      await photoField.locator('[data-photo-input="gallery"]').setInputFiles({
        name: "not-a-photo.txt", mimeType: "text/plain", buffer: Buffer.from("not a photo"),
      });
      await page.waitForFunction(() => document.querySelector("[data-photo-status]")?.textContent.includes("valid"));
      assert.match(await photoField.locator("[data-photo-status]").textContent(), /valid/);

      await photoField.locator('[data-photo-input="gallery"]').setInputFiles({
        name: "iphone-photo.HEIC",
        mimeType: "application/octet-stream",
        buffer: await fs.readFile(heicFixturePath),
      });
      await page.waitForFunction(() => document.querySelector('#documentationRows [data-field="photo"]')
        ?.value.startsWith("data:image/jpeg;base64,"));
      await dirty(true);
      await page.locator("#saveSurvey").click();
      await dirty(false);
      assert((await saved()).find((draft) => draft.id === "first")
        .data.documentation[0].photo.startsWith("data:image/jpeg;base64,"));

      await page.locator('#documentationRows [data-remove-row="documentation"]').click();
      assert(await photoField.locator('[data-photo-source="camera"]').isVisible());
      assert(await photoField.locator('[data-photo-source="gallery"]').isVisible());
      await dirty(true);
      await page.locator("#saveSurvey").click();
      assert.match(await page.locator("#surveyToast").textContent(), /berhasil diperbarui/);
      await dirty(false);

      const imageBase64 = (await fs.readFile(
        path.join(root, "assets/images/project-survey-logo.png")
      )).toString("base64");
      const dataTransfer = await page.evaluateHandle((base64) => {
        const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
        const transfer = new DataTransfer();
        transfer.items.add(new File([bytes], "dropped-photo.png", { type: "image/png" }));
        return transfer;
      }, imageBase64);
      await photoField.locator("[data-photo-dropzone]").dispatchEvent("drop", { dataTransfer });
      await page.waitForFunction(() => document.querySelector('#documentationRows [data-field="photo"]')
        ?.value.startsWith("data:image/jpeg;base64,"));
      assert.equal(await photoField.locator(".survey-photo-preview img").count(), 1);
      await dirty(true);
    });

    await check("New: Cancel, keyboard focus, Discard, and Save & Continue", async ({ page, dirty, saved, modal, choose, load }) => {
      await load();
      await page.locator("#projectName").fill("Unsaved Project");
      await page.locator("#resetSurvey").click();
      assert.equal(await page.evaluate(() => document.activeElement.id), "unsavedSurveyCancel");
      assert.equal(await page.locator("#surveyForm").evaluate((form) => form.inert), true);
      const save = modal.locator('[data-unsaved-choice="save"]');
      const close = modal.locator(".survey-modal-close");
      await save.focus();
      await page.keyboard.press("Tab");
      assert(await close.evaluate((element) => element === document.activeElement));
      await page.keyboard.press("Shift+Tab");
      assert(await save.evaluate((element) => element === document.activeElement));
      await page.keyboard.press("Escape");
      assert(await modal.isHidden());
      assert.equal(await page.locator("#projectName").inputValue(), "Unsaved Project");
      await dirty(true);
      await page.locator("#resetSurvey").click();
      await choose("cancel");
      await page.locator("#resetSurvey").click();
      await choose("discard");
      assert.equal(await page.locator("#projectName").inputValue(), "");
      assert.equal((await saved()).length, 2);
      await dirty(false);
      await load();
      await page.locator("#customerPic").fill("Updated PIC");
      await page.locator("#resetSurvey").click();
      await choose("save");
      assert.equal((await saved()).find((draft) => draft.id === "first").data.customerPic, "Updated PIC");
      assert.equal(await page.locator("#projectName").inputValue(), "");
      await dirty(false);
    });

    await check("failed validation and storage writes never continue or clear the form", async ({ page, dirty, saved, choose, load, waitForImport }) => {
      await page.locator("#projectName").fill("Incomplete");
      await page.locator("#resetSurvey").click();
      await choose("save");
      assert.equal(await page.locator("#projectName").inputValue(), "Incomplete");
      assert.match(await page.locator("#surveyToast").textContent(), /wajib diisi/);
      await dirty(true);
      await load();
      await choose("discard");
      await page.locator('[data-add-row="extras"]').click();
      const quantity = page.locator('#extraRows [data-field="qty"]').last();
      await quantity.pressSequentially("-");
      assert(await quantity.evaluate((input) => input.validity.badInput));
      await page.locator("#resetSurvey").click();
      await choose("save");
      assert.match(await page.locator("#surveyToast").textContent(), /angka yang valid/);
      await dirty(true);
      await page.locator('[data-remove-row="extras"]').last().click();
      await page.locator("#customerPic").fill("Unsaved PIC");
      const baseline = await saved();
      await page.evaluate((key) => {
        const setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function (name, value) {
          if (name === key) throw new DOMException("Quota exceeded", "QuotaExceededError");
          return setItem.call(this, name, value);
        };
      }, storageKey);
      await load("second");
      await choose("save");
      assert.equal(await page.locator("#customerPic").inputValue(), "Unsaved PIC");
      assert.equal(await page.locator("#projectName").inputValue(), fixture().projectName);
      assert.match(await page.locator("#surveyToast").textContent(), /belum bisa disimpan/);
      assert.deepEqual(await saved(), baseline);
      await dirty(true);
      await page.locator("#loadSurvey").click();
      await page.locator("#surveyExcelFile").setInputFiles(payload);
      await choose("save");
      await waitForImport();
      assert.equal(await page.locator("#customerPic").inputValue(), "Unsaved PIC");
      assert.match(await page.locator("#surveyToast").textContent(), /belum bisa disimpan/);
      assert.deepEqual(await saved(), baseline);
      await dirty(true);
    });

    await check("Load: Escape preserves the picker, Discard loads, Save uses the latest stored document", async ({ page, dirty, saved, modal, choose, load }) => {
      await load();
      await page.locator("#customerPic").fill("Updated PIC");
      await load();
      await page.keyboard.press("Escape");
      assert(await modal.isHidden());
      assert(await page.locator("#savedSurveyModal").isVisible());
      assert.equal(await page.locator("#customerPic").inputValue(), "Updated PIC");
      await page.locator('[data-load-saved="first"]').click();
      await choose("save");
      assert.equal(await page.locator("#customerPic").inputValue(), "Updated PIC");
      assert.equal((await saved()).length, 2);
      await dirty(false);
      await page.locator("#customerPic").fill("Discard This");
      await load("second");
      await choose("discard");
      assert.equal(await page.locator("#projectName").inputValue(), "Another Project");
      await dirty(false);
    });

    await check("legacy saved values and empty sections do not cause false warnings", async ({ page, dirty, load }) => {
      await page.evaluate(({ key, draft }) => {
        draft.data.pulls[0].qty = "0";
        draft.data.activeDevices = [];
        delete draft.data.remarks;
        delete draft.data.documentation;
        localStorage.setItem(key, JSON.stringify([draft]));
      }, { key: storageKey, draft: firstDraft });
      await load();
      await dirty(false);
      await page.locator("#customerPic").fill("Changed");
      await dirty(true);
      await page.locator("#customerPic").fill("PIC");
      await dirty(false);
    });

    await check("Excel import: Cancel, Discard, invalid file, same-file retry, Save & Continue, and unsaved draft", async ({ page, dirty, saved, modal, choose, load, waitForImport }) => {
      await load();
      await page.locator("#customerPic").fill("Before Import");
      await page.locator("#loadSurvey").click();
      await page.locator("#surveyExcelFile").setInputFiles(payload);
      await choose("cancel");
      await waitForImport();
      assert.equal(await page.locator("#customerPic").inputValue(), "Before Import");
      assert.equal(await page.locator("#surveyExcelFile").inputValue(), "");
      await page.locator("#surveyExcelFile").setInputFiles({ ...payload, buffer: Buffer.from("invalid excel") });
      await waitForImport();
      assert(await modal.isHidden());
      assert.equal(await page.locator("#customerPic").inputValue(), "Before Import");
      await page.locator("#surveyExcelFile").setInputFiles(payload);
      await choose("discard");
      await waitForImport();
      assert.equal(await page.locator("#customerPic").inputValue(), "PIC");
      assert.equal((await saved()).find((draft) => draft.id === "first").data.customerPic, "PIC");
      await dirty(true);
      await page.locator("#customerPic").fill("Before Import");
      await page.locator("#loadSurvey").click();
      await page.locator("#surveyExcelFile").setInputFiles(payload);
      await choose("save");
      await waitForImport();
      assert.equal((await saved()).find((draft) => draft.id === "first").data.customerPic, "Before Import");
      assert.equal(await page.locator("#customerPic").inputValue(), "PIC");
      await dirty(true);
      for (const id of ["downloadExcel", "downloadPdf", "submitSurvey"]) {
        await page.locator("#" + id).click();
        assert.match(await page.locator("#surveyToast").textContent(), /Simpan survey terlebih dahulu/);
      }
      await page.locator("#saveSurvey").click();
      await dirty(false);
      const download = page.waitForEvent("download");
      await page.locator("#downloadExcel").click();
      assert.match((await download).suggestedFilename(), /\.xlsx$/);
    });

    await check("Back to Home: Cancel preserves work; Discard navigates without a second dialog", async ({ page, modal, choose, dialogs }) => {
      await page.locator("#projectName").fill("Unsaved Project");
      await page.locator(".survey-home-button").click();
      await choose("cancel");
      assert.match(page.url(), /project-survey\.html$/);
      await page.locator(".survey-home-button").click();
      await modal.locator('[data-unsaved-choice="discard"]').click();
      await page.waitForURL("**/index.html");
      assert.deepEqual(dialogs, []);
    });

    await check("Back to Home: Save must succeed before navigation", async ({ page, saved, choose, load, modal, dialogs }) => {
      await page.locator("#projectName").fill("Incomplete");
      await page.locator(".survey-home-button").click();
      await choose("save");
      assert.match(page.url(), /project-survey\.html$/);
      assert.equal(await page.locator("#projectName").inputValue(), "Incomplete");
      await load();
      await choose("discard");
      await page.locator("#customerPic").fill("Saved Before Leaving");
      await page.locator(".survey-home-button").click();
      await modal.locator('[data-unsaved-choice="save"]').click();
      await page.waitForURL("**/index.html");
      assert.equal((await saved()).find((draft) => draft.id === "first").data.customerPic, "Saved Before Leaving");
      assert.deepEqual(dialogs, []);
    });

    for (const action of ["refresh", "Back", "tab close"]) {
      await check(`native ${action} warns only while dirty`, async ({ page, dirty, dialogs }) => {
        await page.locator("#projectName").fill("Unsaved Project");
        const warning = page.waitForEvent("dialog");
        if (action === "refresh") await page.evaluate(() => location.reload());
        else if (action === "Back") await page.evaluate(() => history.back());
        else await page.close({ runBeforeUnload: true });
        assert.equal((await warning).type(), "beforeunload");
        assert.equal(page.isClosed(), false);
        assert.match(page.url(), /project-survey\.html$/);
        assert.equal(await page.locator("#projectName").inputValue(), "Unsaved Project");
        await page.locator("#projectName").fill("");
        await dirty(false);
        await page.reload();
        await page.locator("#pageLoader").waitFor({ state: "detached" });
        assert.equal(dialogs.length, 1);
      });
    }

    await check("mobile file chooser, unsaved dialog, and cancel", async ({ page, dirty, choose, waitForImport }) => {
      await page.locator("#loadSurvey").click();
      const chooser = page.waitForEvent("filechooser");
      await page.locator("#importSurveyExcel").click();
      await (await chooser).setFiles(payload);
      await waitForImport();
      await dirty(true);
      const documentationLayout = await page.locator("#documentationRows").evaluate((table) => {
        const row = table.querySelector(".survey-row:not(.survey-row-header)");
        const tableRect = table.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        return {
          fits: table.scrollWidth <= table.clientWidth + 1,
          rowFits: rowRect.left >= tableRect.left - 1 && rowRect.right <= tableRect.right + 1,
          columns: getComputedStyle(table).gridTemplateColumns.split(" ").length,
        };
      });
      assert.equal(documentationLayout.fits, true);
      assert.equal(documentationLayout.rowFits, true);
      assert.equal(documentationLayout.columns, 1);
      assert.equal(await page.locator("#documentationRows .survey-row-header").count(), 0);
      assert.equal(await page.locator("#documentationRows .survey-mobile-field-label").count(), 0);
      await page.locator("#resetSurvey").click();
      await choose("cancel");
      assert.equal(await page.locator("#projectName").inputValue(), fixture().projectName);
    }, { mobile: true });
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
