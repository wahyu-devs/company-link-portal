# Company Link Portal

A lightweight internal link portal for centralized access to company documents and resources.

## Overview

Company Link Portal is a simple static web page designed to help internal users access important company links from one centralized place. It provides a clean, responsive, and mobile-friendly interface with search functionality.

## Features

- Centralized internal company links
- Responsive layout for desktop and mobile
- Search by link name or description
- Dark/light mode interface
- Bootstrap Icons integration
- Favicon and mobile home screen icon support
- Social sharing preview metadata
- Static HTML, CSS, and JavaScript with no build process required
- Project Survey Save can upload generated Excel/PDF files to OneDrive and send an Outlook notification through the serverless API

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap Icons
- Google Fonts
- Microsoft Graph API

## Usage

Open `index.html` directly in a browser, or deploy it to any static hosting service.

For the Project Survey upload workflow, deploy with the included `api/upload-survey.js`
serverless endpoint and configure these environment variables:

```text
MICROSOFT_TENANT_ID=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
ONEDRIVE_USER_ID=
ONEDRIVE_FOLDER_PATH=
OUTLOOK_MAILBOX_USER_ID=
OUTLOOK_NOTIFY_TO=
```

`ONEDRIVE_DRIVE_ID` can be used instead of `ONEDRIVE_USER_ID`, and
`ONEDRIVE_FOLDER_ITEM_ID` can be used instead of `ONEDRIVE_FOLDER_PATH`.
The Microsoft Entra app registration needs Microsoft Graph application
permissions for `Files.ReadWrite.All` and `Mail.Send` with admin consent.

When the app is served over HTTP(S), the Save button posts generated files to
`/api/upload-survey` after the local draft is saved. To use a separate upload
service, set `window.PROJECT_SURVEY_UPLOAD_ENDPOINT` or store the endpoint in
`localStorage.projectSurveyUploadEndpoint`.

## Project Structure

```text
.
├── api
│   └── upload-survey.js
├── assets
│   └── images
├── index.html
├── main.js
├── styles.css
└── README.md
```

## Deployment Options

This project can be deployed using:

- GitHub Pages
- Vercel
- Netlify
- Internal company server
- Static hosting via cPanel or Nginx

## Customization

To add or update internal links, edit the `internalLinks` array inside `main.js`.

Example:

```js
{
  name: "Document Proposal Project",
  category: "Documentation",
  description: "Project proposal documents and related files.",
  icon: "bi-file-earmark-text",
  url: "https://example.com",
  badge: ""
}
```

## Author

Developed by Wahyu.

## License

This project is intended for internal company use.
