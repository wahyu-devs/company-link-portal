# Perkom Link Portal

A lightweight internal link portal for centralized access to company documents, tools, and resources.

## Overview

Perkom Link Portal is a simple static web page designed to help internal users access important company links from one centralized place. It provides a clean, responsive, and mobile-friendly interface with search functionality.

## Features

- Centralized internal company links
- Responsive layout for desktop and mobile
- Search by link name, category, or description
- Dark mode interface
- Bootstrap Icons integration
- Favicon and mobile home screen icon support
- Static HTML, CSS, and JavaScript with no build process required

## Project Structure

```text
.
├── index.html
├── perkom-logo.png
├── favicon.png
└── README.md
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap Icons
- Google Fonts

## Usage

Open `index.html` directly in a browser, or deploy it to any static hosting service.

## Deployment Options

This project can be deployed using:

- GitHub Pages
- Vercel
- Netlify
- Internal company server
- Static hosting via cPanel or Nginx

## Customization

To add or update internal links, edit the `internalLinks` array inside `index.html`.

Example:

```js
{
  name: "Document Proposal Project Ayana Bali",
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
