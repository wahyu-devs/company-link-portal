const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const source = fs.readFileSync(path.join(root, "project-survey.js"), "utf8");
const logo = fs.readFileSync(path.join(root, "assets/images/project-survey-logo.png")).toString("base64");
const context = vm.createContext({
  Blob, TextEncoder, atob, Date,
  encoder: new TextEncoder(),
  getLogoBase64: async () => logo,
});

// Exercise the app's actual XLSX exporter without booting the form DOM.
const exportCode = source.slice(source.indexOf("  function escapeXml("), source.indexOf("  function getLogoBase64("))
  + source.slice(source.indexOf("  function base64ToUint8Array("), source.indexOf("  const PDF_LAYOUT ="))
  + source.slice(source.indexOf("  function formatSurveyDate("), source.indexOf("  function buildFileName("));
vm.runInContext(exportCode, context);

function fixture() {
  const item = (description) => ({ description, qty: 0, unit: "pcs", note: "" });
  return {
    surveyDate: "2026-09-02", surveyorName: "Surveyor", customerName: "Customer & Co",
    customerPic: "PIC", projectName: "Access Door Project",
    pulls: [{ type: "Data", qty: 0, unit: "mtr", cable: "UTP", location: "Room 1", note: "Panel East" }],
    activeDevices: [item("Switch")], materials: [item("RJ45")], extras: [item("Installation")],
  };
}

async function exportFile(data = fixture()) {
  const blob = await context.buildXlsx(data);
  return { name: "survey.xlsx", size: blob.size, arrayBuffer: () => blob.arrayBuffer() };
}

module.exports = { root, fixture, exportFile };
