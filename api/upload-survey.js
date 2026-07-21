const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
const GRAPH_TOKEN_SCOPE = "https://graph.microsoft.com/.default";
const DEFAULT_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

async function uploadSurveyHandler(req, res) {
  applyCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  try {
    const payload = normalizePayload(req.body ?? await readRawRequestBody(req));
    const files = normalizeFiles(payload.files);
    const token = await getGraphAccessToken();
    const uploadedItems = [];

    for (const file of files) {
      uploadedItems.push(await uploadFileToOneDrive(token, file));
    }

    await sendOutlookNotification(token, payload.survey || {}, uploadedItems);

    sendJson(res, 200, {
      uploaded: uploadedItems.map(({ id, name, size, webUrl }) => ({ id, name, size, webUrl })),
      notified: true,
    });
  } catch (error) {
    console.error("Survey upload failed", error);
    sendJson(res, error.statusCode || 500, {
      error: error.publicMessage || "Survey upload failed.",
    });
  }
}

module.exports = uploadSurveyHandler;
module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

function readRawRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

function normalizePayload(body) {
  if (!body) {
    throw httpError(400, "Request body is required.");
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      throw httpError(400, "Request body must be valid JSON.");
    }
  }

  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString("utf8"));
    } catch {
      throw httpError(400, "Request body must be valid JSON.");
    }
  }

  if (typeof body === "object") {
    return body;
  }

  throw httpError(400, "Request body is invalid.");
}

function normalizeFiles(files) {
  if (!Array.isArray(files) || !files.length) {
    throw httpError(400, "At least one file is required.");
  }

  return files.map((file) => {
    if (!file || typeof file !== "object") {
      throw httpError(400, "Each file must be an object.");
    }

    const name = sanitizeOneDriveFileName(file.name || file.fileName);
    const contentType = String(file.contentType || "application/octet-stream");
    const content = decodeBase64File(file.contentBase64);

    if (!name) {
      throw httpError(400, "File name is required.");
    }

    if (!content.length) {
      throw httpError(400, `File ${name} is empty.`);
    }

    if (content.byteLength > maxUploadBytes()) {
      throw httpError(413, `File ${name} is larger than the configured upload limit.`);
    }

    return { name, contentType, content };
  });
}

function decodeBase64File(value) {
  const text = String(value || "");
  const base64 = text.includes(",") ? text.split(",").pop() : text;
  return Buffer.from(base64, "base64");
}

async function getGraphAccessToken() {
  const tenantId = requireEnv("MICROSOFT_TENANT_ID");
  const clientId = requireEnv("MICROSOFT_CLIENT_ID");
  const clientSecret = requireEnv("MICROSOFT_CLIENT_SECRET");
  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        scope: GRAPH_TOKEN_SCOPE,
      }),
    }
  );
  const data = await readResponseJson(response);

  if (!response.ok || !data.access_token) {
    throw graphError(response, data, "Microsoft Graph authentication failed.");
  }

  return data.access_token;
}

async function uploadFileToOneDrive(token, file) {
  const response = await fetch(oneDriveUploadUrl(file.name), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.contentType,
    },
    body: file.content,
  });
  const data = await readResponseJson(response);

  if (!response.ok) {
    throw graphError(response, data, `OneDrive upload failed for ${file.name}.`);
  }

  return {
    id: data.id,
    name: data.name || file.name,
    size: data.size || file.content.byteLength,
    webUrl: data.webUrl || "",
  };
}

function oneDriveUploadUrl(fileName) {
  const driveId = process.env.ONEDRIVE_DRIVE_ID;
  const userId = process.env.ONEDRIVE_USER_ID;
  const folderItemId = process.env.ONEDRIVE_FOLDER_ITEM_ID;
  const encodedFileName = encodeURIComponent(fileName);

  if (driveId) {
    const encodedDriveId = encodeURIComponent(driveId);

    if (folderItemId) {
      return `${GRAPH_ROOT}/drives/${encodedDriveId}/items/${encodeURIComponent(folderItemId)}:/${encodedFileName}:/content`;
    }

    return `${GRAPH_ROOT}/drives/${encodedDriveId}/root:/${encodedOneDrivePath(fileName)}:/content`;
  }

  if (!userId) {
    throw httpError(500, "ONEDRIVE_USER_ID or ONEDRIVE_DRIVE_ID is not configured.");
  }

  const encodedUserId = encodeURIComponent(userId);

  if (folderItemId) {
    return `${GRAPH_ROOT}/users/${encodedUserId}/drive/items/${encodeURIComponent(folderItemId)}:/${encodedFileName}:/content`;
  }

  return `${GRAPH_ROOT}/users/${encodedUserId}/drive/root:/${encodedOneDrivePath(fileName)}:/content`;
}

function encodedOneDrivePath(fileName) {
  return [...folderPathSegments(), fileName].map(encodeURIComponent).join("/");
}

function folderPathSegments() {
  return String(process.env.ONEDRIVE_FOLDER_PATH || "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

async function sendOutlookNotification(token, survey, uploadedItems) {
  const mailboxUserId = process.env.OUTLOOK_MAILBOX_USER_ID || process.env.ONEDRIVE_USER_ID;
  const recipients = emailRecipients(process.env.OUTLOOK_NOTIFY_TO || mailboxUserId);

  if (!mailboxUserId || !recipients.length) {
    throw httpError(500, "Outlook notification is not configured.");
  }

  const response = await fetch(
    `${GRAPH_ROOT}/users/${encodeURIComponent(mailboxUserId)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: emailSubject(survey),
          body: {
            contentType: "HTML",
            content: notificationHtml(survey, uploadedItems),
          },
          toRecipients: recipients.map((address) => ({
            emailAddress: { address },
          })),
        },
        saveToSentItems: true,
      }),
    }
  );
  const data = await readResponseJson(response);

  if (!response.ok) {
    throw graphError(response, data, "Outlook notification failed.");
  }
}

function emailSubject(survey) {
  const prefix = process.env.OUTLOOK_NOTIFY_SUBJECT_PREFIX || "New Project Survey Upload";
  const customerName = survey.customerName || "Customer";
  const projectName = survey.projectName || "Project";
  return `${prefix}: ${customerName} - ${projectName}`;
}

function notificationHtml(survey, uploadedItems) {
  const fileItems = uploadedItems
    .map((item) => {
      const label = escapeHtml(item.name);
      return item.webUrl
        ? `<li><a href="${escapeHtml(item.webUrl)}">${label}</a></li>`
        : `<li>${label}</li>`;
    })
    .join("");

  return [
    "<p>New Project Survey files have been uploaded to OneDrive.</p>",
    "<table>",
    tableRow("Tanggal Survey", survey.surveyDate),
    tableRow("Nama Surveyor", survey.surveyorName),
    tableRow("Nama Customer", survey.customerName),
    tableRow("PIC Customer", survey.customerPic),
    tableRow("Nama Project", survey.projectName),
    "</table>",
    `<ul>${fileItems}</ul>`,
  ].join("");
}

function tableRow(label, value) {
  return `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value || "-")}</td></tr>`;
}

function emailRecipients(value) {
  return String(value || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

function sanitizeOneDriveFileName(value) {
  return String(value || "")
    .replace(/[<>:"/\\|?*\x00-\x1f]+/g, "")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim()
    .slice(0, 180);
}

function maxUploadBytes() {
  const configuredLimit = Number(process.env.SURVEY_UPLOAD_MAX_BYTES);
  return Number.isFinite(configuredLimit) && configuredLimit > 0
    ? configuredLimit
    : DEFAULT_MAX_UPLOAD_BYTES;
}

async function readResponseJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function graphError(response, data, fallbackMessage) {
  const graphMessage = data?.error?.message || data?.error_description || data?.raw;
  const message = graphMessage || fallbackMessage;
  const error = httpError(502, fallbackMessage);
  error.message = message;
  return error;
}

function httpError(statusCode, publicMessage) {
  const error = new Error(publicMessage);
  error.statusCode = statusCode;
  error.publicMessage = publicMessage;
  return error;
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw httpError(500, `${name} is not configured.`);
  }

  return value;
}

function applyCorsHeaders(req, res) {
  const allowedOrigins = String(process.env.UPLOAD_ALLOWED_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = req.headers.origin;

  if (requestOrigin && (allowedOrigins.includes("*") || allowedOrigins.includes(requestOrigin))) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes("*") ? "*" : requestOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
