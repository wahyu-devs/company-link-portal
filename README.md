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
- Project Survey Submit sends generated Excel/PDF files as Gmail attachments with Google OAuth

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap Icons
- Google Fonts
- Gmail API

## Usage

Open `index.html` directly in a browser, or deploy it to any static hosting service.

For the Project Survey submit workflow, serve the app over HTTP(S), create a
Google Cloud OAuth client, enable Gmail API, then fill
`project-survey.config.js`:

Use `project-survey.config.example.js` as the template. The real
`project-survey.config.js` is ignored by Git so local Google settings and email
addresses do not get committed.

```js
window.PROJECT_SURVEY_GOOGLE_CONFIG = {
  clientId: "your-application-client-id",
  notifyTo: "your-email@example.com",
  subjectPrefix: "New Project Survey Form",
};
```

The OAuth client must be a Web application with an Authorized JavaScript origin
that matches the site origin, for example `https://example.com`. For local
testing, add an origin such as `http://localhost:8000`.

Required Google OAuth scopes:

- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/userinfo.email`

The Save button only stores a local draft. The Submit button stores a local
draft, prompts Google login when needed, and sends the generated Excel/PDF files
as Gmail attachments. This
browser-based setup does not use a client secret.

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
