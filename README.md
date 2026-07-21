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
- Project Survey Submit uploads generated Excel/PDF files to OneDrive and sends an Outlook notification with Microsoft delegated login

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap Icons
- Google Fonts
- Microsoft Graph API

## Usage

Open `index.html` directly in a browser, or deploy it to any static hosting service.

For the Project Survey submit workflow, serve the app over HTTP(S), register a
Microsoft single-page application, then fill `project-survey.config.js`:

```js
window.PROJECT_SURVEY_MICROSOFT_CONFIG = {
  clientId: "your-application-client-id",
  tenantId: "common",
  folderPath: "Project Survey/Uploads",
  notifyTo: "your-email@example.com",
  subjectPrefix: "New Project Survey Upload",
};
```

The Microsoft app registration needs a SPA redirect URI that exactly matches
the deployed `project-survey.html` URL, for example
`https://example.com/project-survey.html`. For local testing, add a local HTTP
redirect URI such as `http://localhost:8000/project-survey.html`.

Add Microsoft Graph delegated permissions:

- `Files.ReadWrite`
- `Mail.Send`
- `User.Read`

The Save button only stores a local draft. The Submit button stores a local
draft, prompts Microsoft login when needed, uploads the generated Excel/PDF
files to the configured OneDrive folder, and sends the Outlook notification.
This delegated setup does not use a client secret.

## Project Structure

```text
.
├── assets
│   └── images
├── index.html
├── main.js
├── project-survey.config.js
├── project-survey.html
├── project-survey.js
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
