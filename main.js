const THEME_STORAGE_KEY = "linkPortalTheme";

(() => {
  try {
    if (localStorage.getItem(THEME_STORAGE_KEY) === "light") {
      document.documentElement.dataset.theme = "light";
    }
  } catch {
    // Keep the default dark theme if storage is unavailable.
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  scrollPageToTop();

  const internalLinks = [
    {
      name: "Document Proposal Project Ayana Bali",
      category: "Documentation",
      description: "Penawaran, datasheet, design drawing, RFSI dan lainnya",
      icon: "bi-file-earmark-text",
      url: "https://ptperkomindahmurni.sharepoint.com/sites/DOCUMENTPROPOSALPROJECTAYANA-GROUP/Shared%20Documents/Forms/AllItems.aspx",
      badge: "Frequently Used",
    },
    {
      name: "Document Pre Installation Project Ayana Bali",
      category: "Documentation",
      description: "Material approval, shop drawing, schedule kerja dan lainnya",
      icon: "bi-file-earmark-text",
      url: "https://ptperkomindahmurni.sharepoint.com/sites/DOCUMENTPREINSTALLATION/Shared%20Documents/Forms/AllItems.aspx",
      badge: "Important",
    },
    {
      name: "Document After Installation Project Ayana Bali",
      category: "Documentation",
      description: "BAST, scan DO, as built drawing, foto pemasangan dan lainnya",
      icon: "bi-file-earmark-text",
      url: "https://ptperkomindahmurni.sharepoint.com/sites/DOCUMENTAFTERINSTALLATION/Dokumen%20Berbagi/Forms/AllItems.aspx",
      badge: "Frequently Used",
    },
    {
      name: "Project Quotation Progress",
      category: "Progress",
      description: "Update progress penawaran project cabling",
      icon: "bi-file-earmark-text",
      url: "https://ptperkomindahmurni-my.sharepoint.com/:x:/g/personal/wahyu_perkom_co_id/IQDGbV5HQfc-R6Y7A2CpGldgAUs5nwAVrEcflySGiQMoMXQ?e=piXdKY",
      badge: "",
    },
    {
      name: "Project Progress Ayana Bali",
      category: "Progress",
      description: "Update progress pekerjaan project Ayana Bali",
      icon: "bi-file-earmark-text",
      url: "https://docs.google.com/spreadsheets/d/1INY7dGlIusZRGX0RKLKqqjtIiH4rxtKUb-7Us-DbvaI/edit?gid=1533323113#gid=1533323113",
      badge: "",
    },
    {
      name: "Checklist Project Ballroom Ayana Bali",
      category: "Progress",
      description: "Checklist pekerjaan project Ballroom Ayana Bali",
      icon: "bi-file-earmark-text",
      url: "https://ptperkomindahmurni-my.sharepoint.com/:x:/g/personal/madeyudhi_putra_perkom_co_id/IQCzsRu4MhuLSIIDIFtm098zAZfdj-5KbRw5rkUfN4fv0w8?e=mClHv8",
      badge: "",
    },
    {
      name: "Travel Expense Form",
      category: "Form",
      description: "Form pengajuan biaya perjalanan",
      icon: "bi-file-earmark-text",
      url: "https://travelexpensepro.vercel.app/",
      badge: "",
    },
    {
      name: "Project Survey Form",
      category: "Form",
      description: "Form survey project cabling",
      icon: "bi-file-earmark-text",
      url: "project-survey.html",
      badge: "",
    },
  ];

  const searchInput = document.getElementById("searchInput");
  const linkList = document.getElementById("linkList");
  const emptyState = document.getElementById("emptyState");
  const themeToggle = document.getElementById("themeToggle");
  const themeSwitchLabel = document.getElementById("themeSwitchLabel");
  const themeToggleIcon = document.getElementById("themeToggleIcon");
  const themeColorMeta = document.getElementById("themeColorMeta");
  const pageLoader = document.getElementById("pageLoader");
  const LOADER_MIN_DURATION = 2000;
  const loaderStartedAt = performance.now();

  function setTheme(theme) {
    const isLight = theme === "light";

    if (isLight) {
      document.documentElement.dataset.theme = "light";
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
    themeSwitchLabel.textContent = isLight ? "Light" : "Dark";
    themeToggleIcon.className = isLight ? "bi bi-sun-fill" : "bi bi-moon-fill";
    themeColorMeta.setAttribute("content", isLight ? "#f5f7fb" : "#101010");

    try {
      localStorage.setItem(THEME_STORAGE_KEY, isLight ? "light" : "dark");
    } catch {
      // Theme still applies for this session if storage is unavailable.
    }
  }

  function createLinkCard(link) {
    const card = document.createElement("a");
    const isExternalLink = /^https?:\/\//i.test(link.url);

    card.className = "link-card";
    card.href = link.url;

    if (isExternalLink) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    card.setAttribute(
      "aria-label",
      `Open ${link.name} - ${link.description}`
    );

    card.innerHTML = `
      <div class="link-icon" aria-hidden="true">
        <i class="bi ${link.icon}"></i>
      </div>

      <div class="link-content">
        <div class="link-title-row">
          <h3 class="link-title">${link.name}</h3>
        </div>

        <p class="link-description">${link.description}</p>
      </div>

      <span class="link-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 17L17 7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 7H17V15" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    `;

    return card;
  }

  function createLinkCategory(category, links) {
    const section = document.createElement("section");
    section.className = "link-category-group";
    section.setAttribute("aria-label", `${category} links`);

    const header = document.createElement("div");
    header.className = "link-category-header";

    const title = document.createElement("h2");
    title.textContent = category;

    const count = document.createElement("span");
    count.textContent = `${links.length} ${links.length === 1 ? "link" : "links"}`;

    const list = document.createElement("div");
    list.className = "link-category-list";

    links.forEach((link) => {
      list.appendChild(createLinkCard(link));
    });

    header.append(title, count);
    section.append(header, list);

    return section;
  }

  function isMatch(link, keyword) {
    const searchableText = `
      ${link.name}
      ${link.category}
      ${link.description}
      ${link.badge}
    `.toLowerCase();

    return searchableText.includes(keyword.toLowerCase());
  }

  function renderLinks() {
    const keyword = searchInput.value.trim();

    const filteredLinks = keyword
      ? internalLinks.filter((link) => isMatch(link, keyword))
      : internalLinks;

    const fragment = document.createDocumentFragment();
    const categoryGroups = groupLinksByCategory(filteredLinks);

    categoryGroups.forEach(({ category, links }) => {
      fragment.appendChild(createLinkCategory(category, links));
    });

    linkList.replaceChildren(fragment);

    const hasResult = filteredLinks.length > 0;
    emptyState.hidden = hasResult;
    linkList.hidden = !hasResult;
  }

  function groupLinksByCategory(links) {
    return links.reduce((groups, link) => {
      const category = link.category || "Other";
      let group = groups.find((item) => item.category === category);

      if (!group) {
        group = { category, links: [] };
        groups.push(group);
      }

      group.links.push(link);

      return groups;
    }, []);
  }

  function hidePageLoader() {
    const elapsed = performance.now() - loaderStartedAt;
    const remainingDelay = Math.max(0, LOADER_MIN_DURATION - elapsed);

    setTimeout(() => {
      pageLoader?.classList.add("is-hidden");
      pageLoader?.addEventListener("transitionend", () => pageLoader.remove(), { once: true });
    }, remainingDelay);
  }

  function scrollPageToTop() {
    requestAnimationFrame(() => {
      const scrollingElement = document.scrollingElement || document.documentElement;

      scrollingElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
  }

  const activeTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";

  setTheme(activeTheme);
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
  });

  searchInput.addEventListener("input", renderLinks);

  renderLinks();

  if (document.readyState === "complete") {
    hidePageLoader();
  } else {
    globalThis.addEventListener("load", hidePageLoader, { once: true });
  }

  globalThis.addEventListener("pageshow", scrollPageToTop);
});
