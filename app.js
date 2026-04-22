const toggleButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const topbar = document.querySelector(".topbar");
const navCta = document.querySelector(".nav-cta");
const filterButtons = document.querySelectorAll(".filter-chip");
const productCards = document.querySelectorAll(".product-card");
const demoForms = document.querySelectorAll("[data-demo-form]");
const demoUser = document.querySelector("[data-demo-user]");

const pageKey = document.body.dataset.page || "default";
const editableNodes = Array.from(document.querySelectorAll("[data-edit-id]"));
const editableNodeMap = new Map(editableNodes.map((node) => [node.dataset.editId, node]));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const sectionMap = new Map(sections.map((section) => [section.dataset.section, section]));
const pageMain = document.querySelector("main");
const categoryTitles = Array.from(document.querySelectorAll("[data-category-title]"));
const sortableContainers = Array.from(
  document.querySelectorAll(".category-grid, .product-grid, .bundle-grid, .feature-grid, .faq-grid, .dashboard-grid, .auth-grid")
);

const brandEyebrow = document.querySelector("#brand-eyebrow");
const primaryCta = document.querySelector("#primary-cta");
const urlParams = new URLSearchParams(window.location.search);
const EDITOR_QUERY_KEY = "editor";

const AI_STATE_KEY = "tda-ai-helper-state";
const AI_EDITOR_ENABLED_KEY = "tda-ai-helper-enabled";
const PRIMARY_NAV_LINKS = [
  { href: "shop.html", label: "Shop" },
  { href: "category-wedding.html", label: "Categories" },
  { href: "bundles.html", label: "Bundles" },
  { href: "shop.html#shop", label: "Best Sellers" },
  { href: "free-resources.html", label: "Freebies" },
  { href: "contact.html", label: "Support" }
];
const NAV_TOOL_LINKS = [
  { href: "shop.html", label: "Search" },
  { href: "login.html", label: "Account" }
];
const EXPORTABLE_PAGES = [
  "index.html",
  "shop.html",
  "category-wedding.html",
  "bundles.html",
  "free-resources.html",
  "about.html",
  "faq.html",
  "contact.html",
  "login.html",
  "dashboard.html"
];

const themePresets = {
  luxury: {
    "--bg": "#0a0a0a",
    "--bg-soft": "#151515",
    "--panel": "rgba(17, 17, 17, 0.82)",
    "--panel-strong": "#121212",
    "--text": "#f8f2dc",
    "--muted": "#c4b384",
    "--line": "rgba(212, 175, 55, 0.2)",
    "--gold": "#d4af37",
    "--gold-soft": "#f2d782",
    "--cream": "#fbf3df"
  },
  light: {
    "--bg": "#f5efe3",
    "--bg-soft": "#ece2d1",
    "--panel": "rgba(255, 251, 244, 0.92)",
    "--panel-strong": "#fffaf2",
    "--text": "#1d140f",
    "--muted": "#6b584c",
    "--line": "rgba(133, 95, 47, 0.18)",
    "--gold": "#b8891e",
    "--gold-soft": "#9a6e15",
    "--cream": "#241913"
  },
  soft: {
    "--bg": "#161214",
    "--bg-soft": "#211b1f",
    "--panel": "rgba(28, 22, 26, 0.86)",
    "--panel-strong": "#221a1f",
    "--text": "#f7ecdf",
    "--muted": "#cab3a0",
    "--line": "rgba(201, 166, 130, 0.18)",
    "--gold": "#c6925b",
    "--gold-soft": "#efc08f",
    "--cream": "#fff1e3"
  }
};

const accentPresets = {
  gold: {
    "--gold": "#d4af37",
    "--gold-soft": "#f2d782",
    "--button-primary-bg": "linear-gradient(135deg, #b8891e 0%, #f2d782 100%)",
    "--button-primary-text": "#141414"
  },
  emerald: {
    "--gold": "#2f8f6f",
    "--gold-soft": "#7de0c0",
    "--button-primary-bg": "linear-gradient(135deg, #1d6b54 0%, #7de0c0 100%)",
    "--button-primary-text": "#081510"
  },
  rose: {
    "--gold": "#b56a79",
    "--gold-soft": "#f3b7c1",
    "--button-primary-bg": "linear-gradient(135deg, #8f4757 0%, #f3b7c1 100%)",
    "--button-primary-text": "#180a0f"
  },
  blue: {
    "--gold": "#3e78c9",
    "--gold-soft": "#9bc6ff",
    "--button-primary-bg": "linear-gradient(135deg, #28579e 0%, #9bc6ff 100%)",
    "--button-primary-text": "#09111f"
  }
};

const densityPresets = {
  airy: "104px",
  balanced: "88px",
  compact: "64px"
};

const buttonShapePresets = {
  pill: "999px",
  rounded: "18px",
  square: "8px"
};

const dragState = {
  active: false,
  type: "",
  item: null,
  sourceContainer: null
};

const syncStoreHeader = () => {
  if (!topbar || !nav || !navCta) return;

  nav.setAttribute("aria-label", "Primary navigation");
  nav.innerHTML = PRIMARY_NAV_LINKS.map(
    (link) => `<a href="${link.href}">${link.label}</a>`
  ).join("");

  let navTools = topbar.querySelector(".nav-tools");
  if (!navTools) {
    navTools = document.createElement("div");
    navTools.className = "nav-tools";
    topbar.insertBefore(navTools, navCta);
  }

  navTools.innerHTML = NAV_TOOL_LINKS.map(
    (link) => `<a class="nav-link-pill" href="${link.href}">${link.label}</a>`
  ).join("");

  navCta.href = "shop.html";
  navCta.textContent = "View Catalog";
};

syncStoreHeader();

const isEditorMode = () => urlParams.get(EDITOR_QUERY_KEY) === "1" || localStorage.getItem(AI_EDITOR_ENABLED_KEY) === "true";

if (toggleButton && nav) {
  toggleButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");

    productCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.dataset.hidden = String(!matches);
    });
  });
});

const saveDemoUser = (name, email) => {
  const value = JSON.stringify({ name: name || "Guest User", email: email || "" });
  localStorage.setItem("tda-demo-user", value);
};

const loadDemoUser = () => {
  try {
    const raw = localStorage.getItem("tda-demo-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const currentUser = loadDemoUser();
if (demoUser && currentUser?.name) demoUser.textContent = currentUser.name;

demoForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const type = form.dataset.demoForm;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const existingMessage = form.querySelector(".success-message");
    if (existingMessage) existingMessage.remove();

    if (!form.reportValidity()) {
      const message = document.createElement("p");
      message.className = "success-message";
      message.textContent = "Please complete the required fields before continuing.";
      form.appendChild(message);
      return;
    }

    if (type === "signup" || type === "login") {
      saveDemoUser(name || email || "Customer", email || "");
      window.location.href = "dashboard.html";
      return;
    }

    const message = document.createElement("p");
    message.className = "success-message";
    message.textContent =
      type === "freebie"
        ? "Success: your demo freebie signup was saved in this browser."
        : "Success: your demo message was submitted in this browser.";

    form.appendChild(message);
    form.reset();
  });
});

const getAiState = () => {
  try {
    const raw = localStorage.getItem(AI_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveAiState = (state) => {
  localStorage.setItem(AI_STATE_KEY, JSON.stringify(state));
};

const getPageState = () => {
  const state = getAiState();
  return state.pages?.[pageKey] || {};
};

const updatePageState = (patch) => {
  const state = getAiState();
  const pages = { ...(state.pages || {}) };
  pages[pageKey] = { ...(pages[pageKey] || {}), ...patch };
  saveAiState({ ...state, pages });
  applyContentState();
};

const updateGlobalState = (patch) => {
  const state = { ...getAiState(), ...patch };
  saveAiState(state);
  applyContentState();
};

const applyCssVariables = (preset) => {
  Object.entries(preset).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

const applyTheme = (themeName) => {
  applyCssVariables(themePresets[themeName] || themePresets.luxury);
};

const applyAccent = (accentName) => {
  applyCssVariables(accentPresets[accentName] || accentPresets.gold);
};

const applyDensity = (densityName) => {
  document.documentElement.style.setProperty("--section-gap", densityPresets[densityName] || densityPresets.balanced);
};

const applyButtonShape = (shapeName) => {
  document.documentElement.style.setProperty("--button-radius", buttonShapePresets[shapeName] || buttonShapePresets.pill);
};

const assignSortableMetadata = () => {
  sortableContainers.forEach((container, containerIndex) => {
    const groupId = `${pageKey}-group-${containerIndex}`;
    container.dataset.sortGroup = groupId;

    Array.from(container.children).forEach((child, childIndex) => {
      child.dataset.sortItem = "true";
      if (!child.dataset.sortId) {
        child.dataset.sortId = `${groupId}-item-${childIndex}`;
      }
    });
  });
};

const applyEditableContent = (contentState) => {
  Object.entries(contentState || {}).forEach(([id, value]) => {
    const node = editableNodeMap.get(id);
    if (node) node.textContent = value;
  });
};

const applyCategoryTitles = (titleState) => {
  if (!titleState) return;
  categoryTitles.forEach((node) => {
    const key = node.dataset.categoryTitle;
    if (titleState[key]) node.textContent = titleState[key];
  });
};

const applySectionVisibility = (visibilityState) => {
  sections.forEach((section) => {
    const isHidden = Boolean(visibilityState?.[section.dataset.section]);
    section.dataset.sectionHidden = String(isHidden);
  });
};

const applySectionOrder = (orderState) => {
  if (!pageMain || !Array.isArray(orderState) || orderState.length === 0) return;
  const ordered = orderState.map((name) => sectionMap.get(name)).filter(Boolean);
  if (ordered.length !== sections.length) return;
  ordered.forEach((section) => pageMain.appendChild(section));
};

const applySortableOrders = (sortOrders) => {
  if (!sortOrders) return;

  sortableContainers.forEach((container) => {
    const group = container.dataset.sortGroup;
    const order = sortOrders[group];
    if (!order) return;

    const items = new Map(Array.from(container.children).map((child) => [child.dataset.sortId, child]));
    order.forEach((id) => {
      const node = items.get(id);
      if (node) container.appendChild(node);
    });
  });
};

const applyContentState = () => {
  const state = getAiState();
  const pageState = getPageState();

  if (state.theme) applyTheme(state.theme);
  if (state.accent) applyAccent(state.accent);
  if (state.density) applyDensity(state.density);
  if (state.buttonShape) applyButtonShape(state.buttonShape);

  if (brandEyebrow && state.brandName) brandEyebrow.textContent = state.brandName;
  if (primaryCta && state.primaryCta) primaryCta.textContent = state.primaryCta;

  assignSortableMetadata();
  applyEditableContent(pageState.content || {});
  applyCategoryTitles(pageState.categoryTitles);
  applySectionVisibility(pageState.hiddenSections);
  applySectionOrder(pageState.sectionOrder);
  applySortableOrders(pageState.sortOrders);
};

const resetAiState = () => {
  localStorage.removeItem(AI_STATE_KEY);
  window.location.reload();
};

const toggleEditorMode = () => {
  const enabled = localStorage.getItem(AI_EDITOR_ENABLED_KEY) === "true";
  if (enabled) {
    localStorage.removeItem(AI_EDITOR_ENABLED_KEY);
  } else {
    localStorage.setItem(AI_EDITOR_ENABLED_KEY, "true");
  }
  window.location.reload();
};

const parseQuotedValue = (prompt) => {
  const quoted = prompt.match(/"([^"]+)"/);
  if (quoted) return quoted[1].trim();

  const colon = prompt.split(":");
  if (colon.length > 1) return colon.slice(1).join(":").trim();

  return "";
};

const getDefaultSectionOrder = () => sections.map((section) => section.dataset.section);

const getSectionNameFromPrompt = (prompt) => {
  const names = Array.from(sectionMap.keys());
  return names.find((name) => prompt.includes(name)) || "";
};

const getAccentNameFromPrompt = (prompt) => {
  const names = ["gold", "emerald", "rose", "blue"];
  return names.find((name) => prompt.includes(name)) || "";
};

const getButtonShapeFromPrompt = (prompt) => {
  const names = ["pill", "rounded", "square"];
  return names.find((name) => prompt.includes(name)) || "";
};

const setEditableText = (id, value) => {
  if (!value || !editableNodeMap.has(id)) return false;
  const pageState = getPageState();
  const content = { ...(pageState.content || {}), [id]: value };
  updatePageState({ content });
  return true;
};

const setCategoryTitle = (index, value) => {
  if (!value || !categoryTitles.some((node) => node.dataset.categoryTitle === index)) return false;
  const pageState = getPageState();
  const nextCategoryTitles = { ...(pageState.categoryTitles || {}), [index]: value };
  updatePageState({ categoryTitles: nextCategoryTitles });
  return true;
};

const hideSection = (name) => {
  if (!sectionMap.has(name)) return false;
  const pageState = getPageState();
  const hiddenSections = { ...(pageState.hiddenSections || {}), [name]: true };
  updatePageState({ hiddenSections });
  return true;
};

const showSection = (name) => {
  if (!sectionMap.has(name)) return false;
  const pageState = getPageState();
  const hiddenSections = { ...(pageState.hiddenSections || {}) };
  delete hiddenSections[name];
  updatePageState({ hiddenSections });
  return true;
};

const moveSection = (source, target, mode) => {
  if (!sectionMap.has(source) || !sectionMap.has(target) || source === target) return false;
  const pageState = getPageState();
  const order = [...(pageState.sectionOrder || getDefaultSectionOrder())];
  const sourceIndex = order.indexOf(source);
  const targetIndex = order.indexOf(target);
  if (sourceIndex === -1 || targetIndex === -1) return false;

  order.splice(sourceIndex, 1);
  const nextTargetIndex = order.indexOf(target);
  const insertAt = mode === "after" ? nextTargetIndex + 1 : nextTargetIndex;
  order.splice(insertAt, 0, source);
  updatePageState({ sectionOrder: order });
  return true;
};

const persistSectionOrderFromDom = () => {
  if (!pageMain) return;
  const order = Array.from(pageMain.querySelectorAll(":scope > [data-section]")).map((section) => section.dataset.section);
  updatePageState({ sectionOrder: order });
};

const persistSortableOrder = (container) => {
  const group = container.dataset.sortGroup;
  if (!group) return;
  const order = Array.from(container.children)
    .filter((child) => child.dataset.sortItem === "true")
    .map((child) => child.dataset.sortId);

  const pageState = getPageState();
  const sortOrders = { ...(pageState.sortOrders || {}), [group]: order };
  updatePageState({ sortOrders });
};

const toggleDragMode = (statusNode) => {
  dragState.active = !dragState.active;
  document.body.classList.toggle("drag-mode", dragState.active);

  sections.forEach((section) => {
    section.draggable = dragState.active;
  });

  sortableContainers.forEach((container) => {
    Array.from(container.children).forEach((child) => {
      if (child.dataset.sortItem === "true") {
        child.draggable = dragState.active;
      }
    });
  });

  statusNode.textContent = dragState.active
    ? "Drag mode is on. Drag sections or cards visually."
    : "Drag mode is off.";
};

const setDragHandlers = () => {
  sections.forEach((section) => {
    section.addEventListener("dragstart", () => {
      if (!dragState.active) return;
      dragState.type = "section";
      dragState.item = section;
      section.classList.add("is-dragging");
    });

    section.addEventListener("dragend", () => {
      if (dragState.item === section) {
        section.classList.remove("is-dragging");
        dragState.type = "";
        dragState.item = null;
        persistSectionOrderFromDom();
      }
    });

    section.addEventListener("dragover", (event) => {
      if (!dragState.active || dragState.type !== "section" || !dragState.item || dragState.item === section) return;
      event.preventDefault();
      const rect = section.getBoundingClientRect();
      const before = event.clientY < rect.top + rect.height / 2;
      if (before) {
        pageMain.insertBefore(dragState.item, section);
      } else {
        pageMain.insertBefore(dragState.item, section.nextSibling);
      }
    });
  });

  sortableContainers.forEach((container) => {
    Array.from(container.children).forEach((child) => {
      child.addEventListener("dragstart", () => {
        if (!dragState.active) return;
        dragState.type = "card";
        dragState.item = child;
        dragState.sourceContainer = container;
        child.classList.add("is-dragging");
      });

      child.addEventListener("dragend", () => {
        if (dragState.item === child) {
          child.classList.remove("is-dragging");
          persistSortableOrder(container);
          dragState.type = "";
          dragState.item = null;
          dragState.sourceContainer = null;
        }
      });
    });

    container.addEventListener("dragover", (event) => {
      if (!dragState.active || dragState.type !== "card" || !dragState.item) return;
      event.preventDefault();
      const target = event.target.closest("[data-sort-item]");
      if (!target || target === dragState.item || target.parentElement !== container) return;
      const rect = target.getBoundingClientRect();
      const before = event.clientY < rect.top + rect.height / 2;
      if (before) {
        container.insertBefore(dragState.item, target);
      } else {
        container.insertBefore(dragState.item, target.nextSibling);
      }
    });

    container.addEventListener("drop", () => {
      if (dragState.active && dragState.type === "card") {
        persistSortableOrder(container);
      }
    });
  });
};

const collectStylesheetText = () => {
  let cssText = "";
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      cssText += Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n");
    } catch {
      // Ignore inaccessible sheets.
    }
  });
  return cssText;
};

const buildExportHtml = () => {
  const clone = document.documentElement.cloneNode(true);

  clone.querySelectorAll(".ai-helper, .ai-helper-launch").forEach((node) => node.remove());
  clone.querySelectorAll("script[src='app.js']").forEach((node) => node.remove());
  clone.querySelectorAll("[draggable='true']").forEach((node) => node.removeAttribute("draggable"));
  clone.querySelectorAll(".is-dragging").forEach((node) => node.classList.remove("is-dragging"));
  clone.querySelectorAll("[data-hidden='true']").forEach((node) => {
    node.style.display = "none";
  });

  const head = clone.querySelector("head");
  if (head) {
    head.querySelectorAll("link[rel='stylesheet']").forEach((node) => node.remove());
    const style = document.createElement("style");
    style.textContent = collectStylesheetText();
    head.appendChild(style);
  }

  return `<!doctype html>\n${clone.outerHTML}`;
};

const downloadTextFile = async (suggestedName, contents, mimeType) => {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: mimeType,
            accept: {
              [mimeType]: [suggestedName.endsWith(".json") ? ".json" : ".html"]
            }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(contents);
      await writable.close();
      return true;
    } catch {
      // Fall back to download if the picker is cancelled or unavailable.
    }
  }

  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return true;
};

const exportCurrentPage = async (statusNode) => {
  const html = buildExportHtml();
  await downloadTextFile(`${pageKey}-edited.html`, html, "text/html");
  statusNode.textContent = `Exported ${pageKey}-edited.html.`;
};

const exportAiState = async (statusNode) => {
  const state = JSON.stringify(getAiState(), null, 2);
  await downloadTextFile("the-digital-atlas-state.json", state, "application/json");
  statusNode.textContent = "Exported the-digital-atlas-state.json.";
};

const importAiState = async (statusNode) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) {
      statusNode.textContent = "Import cancelled.";
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      saveAiState(parsed);
      applyContentState();
      statusNode.textContent = `Imported ${file.name}. Refresh other open pages to see synced changes.`;
    } catch {
      statusNode.textContent = "Import failed. Please choose a valid JSON state export.";
    }
  });

  input.click();
};

const collectDocumentTitle = (htmlText, fallbackName) => {
  const titleMatch = htmlText.match(/<title>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : fallbackName;
};

const fetchPageHtml = async (pageName) => {
  const response = await fetch(pageName, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${pageName}`);
  }
  return response.text();
};

const buildProjectPackage = async () => {
  const packagePages = [];

  for (const pageName of EXPORTABLE_PAGES) {
    const htmlText = await fetchPageHtml(pageName);
    packagePages.push({
      file: pageName,
      title: collectDocumentTitle(htmlText, pageName),
      source: htmlText
    });
  }

  return {
    exportedAt: new Date().toISOString(),
    currentPage: pageKey,
    state: getAiState(),
    pages: packagePages
  };
};

const exportAllPages = async (statusNode) => {
  try {
    const bundle = await buildProjectPackage();
    const contents = JSON.stringify(bundle, null, 2);
    await downloadTextFile("the-digital-atlas-project-package.json", contents, "application/json");
    statusNode.textContent = "Exported the-digital-atlas-project-package.json.";
  } catch {
    statusNode.textContent =
      "Export all pages needs the site to be opened from a hosted or served URL. Single-page export still works locally.";
  }
};

const runAiCommand = (rawPrompt) => {
  const prompt = rawPrompt.trim();
  const lower = prompt.toLowerCase();

  if (!prompt) {
    return 'Type something like "make it lighter", "set shop-hero-title: New Title", "hide faq", or "move bundles before freebies".';
  }

  if (lower === "reset" || lower.includes("reset design")) {
    resetAiState();
    return "Resetting the website to its original design.";
  }

  if (lower.includes("light")) {
    updateGlobalState({ theme: "light" });
    return "Applied a lighter theme across the site.";
  }

  if (lower.includes("soft")) {
    updateGlobalState({ theme: "soft" });
    return "Applied a softer editorial theme.";
  }

  if (lower.includes("luxury") || lower.includes("dark") || lower.includes("black and gold")) {
    updateGlobalState({ theme: "luxury" });
    return "Applied the luxury dark theme.";
  }

  const accentName = getAccentNameFromPrompt(lower);
  if (lower.includes("accent") && accentName) {
    updateGlobalState({ accent: accentName });
    return `Updated the accent color to ${accentName}.`;
  }

  const buttonShape = getButtonShapeFromPrompt(lower);
  if ((lower.includes("button shape") || lower.includes("buttons")) && buttonShape) {
    updateGlobalState({ buttonShape });
    return `Updated the button shape to ${buttonShape}.`;
  }

  if (lower.includes("compact")) {
    updateGlobalState({ density: "compact" });
    return "Made the layout more compact.";
  }

  if (lower.includes("airy") || lower.includes("more space")) {
    updateGlobalState({ density: "airy" });
    return "Added more breathing room to the layout.";
  }

  if (lower.includes("balanced spacing") || lower.includes("normal spacing")) {
    updateGlobalState({ density: "balanced" });
    return "Restored balanced spacing.";
  }

  if (lower.includes("brand name")) {
    const value = parseQuotedValue(prompt.replace(/brand name/i, ""));
    if (value) {
      updateGlobalState({ brandName: value });
      return "Updated the visible brand name on the homepage.";
    }
  }

  if (lower.includes("primary button") || lower.includes("button text")) {
    const value = parseQuotedValue(prompt.replace(/primary button|button text/i, ""));
    if (value) {
      updateGlobalState({ primaryCta: value });
      return "Updated the primary button text.";
    }
  }

  const setMatch = prompt.match(/^set\s+([a-z0-9-]+)\s*:\s*(.+)$/i);
  if (setMatch) {
    const editId = setMatch[1].trim();
    const value = parseQuotedValue(setMatch[2]) || setMatch[2].trim();
    if (setEditableText(editId, value)) {
      return `Updated ${editId} on this page.`;
    }
  }

  const categoryMatch = lower.match(/category\s+([1-6])/);
  if (categoryMatch) {
    const value = parseQuotedValue(prompt);
    if (value && setCategoryTitle(categoryMatch[1], value)) {
      return `Updated category ${categoryMatch[1]}.`;
    }
  }

  if (lower.startsWith("hide ")) {
    const sectionName = getSectionNameFromPrompt(lower);
    if (sectionName && hideSection(sectionName)) {
      return `Hid the ${sectionName} section on this page.`;
    }
  }

  if (lower.startsWith("show ")) {
    const sectionName = getSectionNameFromPrompt(lower);
    if (sectionName && showSection(sectionName)) {
      return `Showed the ${sectionName} section on this page.`;
    }
  }

  if (lower.includes("move") && (lower.includes("before") || lower.includes("after"))) {
    const names = Array.from(sectionMap.keys());
    const source = names.find((name) => lower.includes(`move ${name}`) || lower.includes(` ${name} `)) || "";
    const target = names.find((name) => lower.includes(`before ${name}`) || lower.includes(`after ${name}`)) || "";

    if (source && target) {
      const mode = lower.includes("after") ? "after" : "before";
      if (moveSection(source, target, mode)) {
        return `Moved ${source} ${mode} ${target} on this page.`;
      }
    }
  }

  if (lower.includes("make it more premium")) {
    updateGlobalState({
      theme: "luxury",
      accent: "gold",
      density: "airy",
      buttonShape: "pill"
    });
    if (pageKey === "home") {
      setEditableText("hero-title", "Premium digital storefront for elevated templates and planners.");
    }
    return "Shifted the current page toward a more premium presentation.";
  }

  return "I can edit global theme/accent/button styles, set page text with `set edit-id: value`, rename homepage categories, hide/show/move sections, export files, and support drag mode.";
};

const SUPPORT_BOT_STORAGE_KEY = "tda-support-chat-state";
const pageLabels = {
  home: "homepage",
  shop: "shop",
  bundles: "bundles page",
  freebies: "free resources page",
  faq: "FAQ page",
  contact: "contact page",
  about: "about page",
  login: "account page",
  dashboard: "dashboard page"
};

const supportSuggestions = [
  "How are files delivered?",
  "What bundle should I start with?",
  "Do you offer custom services?",
  "How do I contact support?"
];

const supportBotLinks = {
  shop: "shop.html",
  bundles: "bundles.html",
  freebies: "free-resources.html",
  faq: "faq.html",
  contact: "contact.html",
  login: "login.html"
};

const supportBotMetaLinks = [
  { label: "Privacy", href: "privacy.html" },
  { label: "Terms", href: "terms.html" },
  { label: "Refunds", href: "refund-policy.html" },
  { label: "License", href: "license.html" }
];

const ensureHeadAssets = () => {
  const head = document.head;
  if (!head) return;

  if (!head.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#0b0b0d";
    head.appendChild(meta);
  }

  if (!head.querySelector('link[rel="icon"]')) {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = "the-digital-atlas-logo.svg";
    head.appendChild(link);
  }

  if (!head.querySelector('link[rel="manifest"]')) {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "site.webmanifest";
    head.appendChild(link);
  }
};

const ensureFooterSupport = () => {
  let footer = document.querySelector(".footer");
  if (!footer) {
    footer = document.createElement("footer");
    footer.className = "footer footer-mini";
    footer.innerHTML = `
      <div>
        <h2>The Digital Atlas</h2>
        <p>Premium templates, printables, spreadsheets, and planners for modern customers.</p>
      </div>
      <div class="footer-links">
        <a href="shop.html">Shop</a>
        <a href="faq.html">FAQ</a>
        <a href="contact.html">Contact</a>
        <a href="refund-policy.html">Refunds</a>
      </div>
    `;

    const siteShell = document.querySelector(".site-shell");
    if (siteShell) siteShell.appendChild(footer);
  }

  if (!footer.querySelector(".footer-links--meta")) {
    const metaLinks = document.createElement("div");
    metaLinks.className = "footer-links footer-links--meta";

    supportBotMetaLinks.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      metaLinks.appendChild(link);
    });

    footer.appendChild(metaLinks);
  }

  const footerIntro = footer.querySelector("div");
  if (footerIntro && !footerIntro.querySelector(".site-badge-row")) {
    const badgeRow = document.createElement("div");
    badgeRow.className = "site-badge-row";
    ["Instant downloads", "Website checkout ready", "Support contact page"].forEach((label) => {
      const badge = document.createElement("span");
      badge.className = "site-badge";
      badge.textContent = label;
      badgeRow.appendChild(badge);
    });
    footerIntro.appendChild(badgeRow);
  }
};

const getSupportState = () => {
  try {
    const raw = sessionStorage.getItem(SUPPORT_BOT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveSupportState = (state) => {
  sessionStorage.setItem(SUPPORT_BOT_STORAGE_KEY, JSON.stringify(state));
};

const getCurrentPageLabel = () => pageLabels[pageKey] || "website";

const createSupportReply = (message) => {
  const lower = message.toLowerCase();
  const isGreeting = /(^|\b)(hi|hello|hey|good morning|good afternoon|good evening)(\b|$)/.test(lower);

  if (isGreeting) {
    return {
      text: `Hello. I can help with products, bundles, freebies, account questions, or support while you browse the ${getCurrentPageLabel()}.`,
      ctas: [
        { label: "Shop", href: supportBotLinks.shop },
        { label: "FAQ", href: supportBotLinks.faq }
      ]
    };
  }

  if (/(file|download|deliver|delivery|instant|access)/.test(lower)) {
    return {
      text: "Digital products are intended to be delivered as instant downloads after purchase. If you need access help or a replacement file, use the contact page so support can step in.",
      ctas: [
        { label: "Read FAQ", href: supportBotLinks.faq },
        { label: "Contact Support", href: supportBotLinks.contact }
      ]
    };
  }

  if (/(bundle|collection|package)/.test(lower)) {
    return {
      text: "Bundles are best when you want a coordinated set instead of a single template. The storefront is currently set up for wedding, business, and organized-life style collections.",
      ctas: [
        { label: "View Bundles", href: supportBotLinks.bundles },
        { label: "Browse Shop", href: supportBotLinks.shop }
      ]
    };
  }

  if (/(free|freebie|lead magnet|sample|checklist)/.test(lower)) {
    return {
      text: "The free resources area is meant for starter downloads, checklists, and sample files that help customers try the brand before buying.",
      ctas: [
        { label: "See Freebies", href: supportBotLinks.freebies },
        { label: "Browse Shop", href: supportBotLinks.shop }
      ]
    };
  }

  if (/(custom|service|done for you|designer|design help|personalized|personalised)/.test(lower)) {
    return {
      text: "This site is positioned around digital products first. If a customer needs a custom service or wants to ask about tailored help, the best next step is the contact page so you can reply personally.",
      ctas: [
        { label: "Contact Page", href: supportBotLinks.contact }
      ]
    };
  }

  if (/(wedding|invitation|signage|event)/.test(lower)) {
    return {
      text: "Wedding products are framed as elegant, editable resources like invitations, signage, planners, and event support downloads.",
      ctas: [
        { label: "Wedding Category", href: "category-wedding.html" },
        { label: "Shop", href: supportBotLinks.shop }
      ]
    };
  }

  if (/(business|client|proposal|brand)/.test(lower)) {
    return {
      text: "Business templates are a good fit for onboarding packs, branded forms, client materials, and operational documents that need a polished presentation.",
      ctas: [
        { label: "Browse Shop", href: supportBotLinks.shop },
        { label: "Contact", href: supportBotLinks.contact }
      ]
    };
  }

  if (/(career|resume|cv|job|interview)/.test(lower)) {
    return {
      text: "Career products are positioned around resumes, application trackers, interview prep, and planning tools that make a job search feel more organized.",
      ctas: [
        { label: "Browse Shop", href: supportBotLinks.shop }
      ]
    };
  }

  if (/(refund|return|cancel|problem|issue|support|help)/.test(lower)) {
    return {
      text: "For order issues, file questions, or refund-related conversations, the fastest path is the contact page so support can review the request directly.",
      ctas: [
        { label: "Contact Support", href: supportBotLinks.contact },
        { label: "FAQ", href: supportBotLinks.faq }
      ]
    };
  }

  if (/(login|account|dashboard|sign in|signup|sign up)/.test(lower)) {
    return {
      text: "Account and access actions live in the login and dashboard flow. If a customer cannot access something, direct them to the account page first, then contact support if the problem continues.",
      ctas: [
        { label: "Account", href: supportBotLinks.login },
        { label: "Contact Support", href: supportBotLinks.contact }
      ]
    };
  }

  if (/(price|cost|how much|pricing)/.test(lower)) {
    return {
      text: "The current storefront layout is ready for pricing, but exact prices are not shown in every section yet. The best next step is to browse the shop or ask through the contact page if you want manual guidance.",
      ctas: [
        { label: "Browse Shop", href: supportBotLinks.shop },
        { label: "Contact", href: supportBotLinks.contact }
      ]
    };
  }

  if (/(contact|email|reach|talk|speak|phone)/.test(lower)) {
    return {
      text: "You can reach support through the contact page. That is the best place for pre-sale questions, file help, collaboration requests, or service inquiries.",
      ctas: [
        { label: "Open Contact Page", href: supportBotLinks.contact }
      ]
    };
  }

  return {
    text: `I can help answer common questions about downloads, bundles, custom-service requests, account access, and support. If you want personal help, the contact page is the safest next step.`,
    ctas: [
      { label: "FAQ", href: supportBotLinks.faq },
      { label: "Contact", href: supportBotLinks.contact }
    ]
  };
};

const createSupportChatbot = () => {
  const launch = document.createElement("button");
  launch.className = "support-bot-launch";
  launch.type = "button";
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "support-bot-panel");
  launch.setAttribute("data-has-unread", "true");
  launch.innerHTML = `<span>Chat With Atlas</span><small>Questions before you buy?</small>`;

  const panel = document.createElement("section");
  panel.className = "support-bot";
  panel.id = "support-bot-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="support-bot__header">
      <div>
        <p class="panel-label">Customer Assistant</p>
        <h2>Atlas Concierge</h2>
        <p>Ask about products, bundles, downloads, or service support.</p>
      </div>
      <button class="support-bot__close" type="button" aria-label="Close chat">Close</button>
    </div>
    <p class="support-bot__welcome">Fast answers for delivery, pricing, support, policies, and service requests.</p>
    <div class="support-bot__messages" aria-live="polite"></div>
    <div class="support-bot__suggestions"></div>
    <form class="support-bot__composer">
      <label class="support-bot__label" for="support-bot-input">Message</label>
      <textarea id="support-bot-input" class="support-bot__input" rows="3" placeholder="Ask about delivery, bundles, custom work, support, or account access"></textarea>
      <div class="support-bot__actions">
        <button class="button button-primary" type="submit">Send</button>
      </div>
    </form>
  `;

  document.body.append(launch, panel);

  const messages = panel.querySelector(".support-bot__messages");
  const suggestions = panel.querySelector(".support-bot__suggestions");
  const form = panel.querySelector(".support-bot__composer");
  const input = panel.querySelector(".support-bot__input");
  const closeButton = panel.querySelector(".support-bot__close");

  const renderMessage = (entry) => {
    const item = document.createElement("article");
    item.className = `support-bot__message support-bot__message--${entry.role}`;

    const bubble = document.createElement("div");
    bubble.className = "support-bot__bubble";
    bubble.textContent = entry.text;
    item.appendChild(bubble);

    if (entry.role === "assistant" && Array.isArray(entry.ctas) && entry.ctas.length > 0) {
      const actions = document.createElement("div");
      actions.className = "support-bot__cta-row";

      entry.ctas.forEach((cta) => {
        const link = document.createElement("a");
        link.className = "support-bot__cta";
        link.href = cta.href;
        link.textContent = cta.label;
        actions.appendChild(link);
      });

      item.appendChild(actions);
    }

    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  };

  const syncState = () => {
    const history = Array.from(messages.querySelectorAll(".support-bot__message")).map((node) => ({
      role: node.classList.contains("support-bot__message--user") ? "user" : "assistant",
      text: node.querySelector(".support-bot__bubble")?.textContent || "",
      ctas: Array.from(node.querySelectorAll(".support-bot__cta")).map((link) => ({
        label: link.textContent || "",
        href: link.getAttribute("href") || ""
      }))
    }));

    saveSupportState({ history, open: !panel.hidden });
  };

  const addAssistantReply = (reply) => {
    renderMessage({ role: "assistant", text: reply.text, ctas: reply.ctas || [] });
    syncState();
  };

  const handleCustomerMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    renderMessage({ role: "user", text: trimmed });
    addAssistantReply(createSupportReply(trimmed));
  };

  const renderSuggestions = () => {
    suggestions.innerHTML = "";

    supportSuggestions.forEach((suggestion) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "support-bot__suggestion";
      chip.textContent = suggestion;
      chip.addEventListener("click", () => {
        input.value = suggestion;
        handleCustomerMessage(suggestion);
        input.value = "";
      });
      suggestions.appendChild(chip);
    });
  };

  const restoreState = () => {
    const state = getSupportState();

    if (!state?.history?.length) {
      addAssistantReply({
        text: `Welcome to The Digital Atlas. I can help visitors on the ${getCurrentPageLabel()} with product questions, digital download info, bundles, and support directions.`,
        ctas: [
          { label: "Browse Shop", href: supportBotLinks.shop },
          { label: "Contact Support", href: supportBotLinks.contact }
        ]
      });
      return;
    }

    state.history.forEach((entry) => renderMessage(entry));
    panel.hidden = !state.open;
    launch.setAttribute("aria-expanded", String(!panel.hidden));
    launch.setAttribute("data-has-unread", String(!state.open));
  };

  launch.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    launch.setAttribute("aria-expanded", String(!panel.hidden));
    launch.setAttribute("data-has-unread", "false");
    syncState();
    if (!panel.hidden) input.focus();
  });

  closeButton.addEventListener("click", () => {
    panel.hidden = true;
    launch.setAttribute("aria-expanded", "false");
    syncState();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleCustomerMessage(input.value);
    input.value = "";
    input.focus();
  });

  renderSuggestions();
  restoreState();

  if (!getSupportState()?.history?.length && window.innerWidth > 900) {
    window.setTimeout(() => {
      if (panel.hidden) {
        panel.hidden = false;
        launch.setAttribute("aria-expanded", "true");
        launch.setAttribute("data-has-unread", "false");
      }
    }, 1200);
  }
};

const createAiHelper = () => {
  const launch = document.createElement("button");
  launch.className = "ai-helper-launch";
  launch.type = "button";
  launch.textContent = "AI Helper";

  const panel = document.createElement("section");
  panel.className = "ai-helper";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="ai-helper__header">
      <div>
        <h2>AI Website Helper</h2>
        <p>Edit this page directly in the browser.</p>
      </div>
      <button class="ai-helper__close" type="button">Close</button>
    </div>
    <div class="ai-helper__body">
      <textarea class="ai-helper__prompt" placeholder='Try: make it lighter, accent blue, set shop-hero-title: "A curated template marketplace", hide faq, move bundles before freebies, reset'></textarea>
      <div class="ai-helper__chips">
        <button class="ai-helper__chip" type="button" data-ai-prompt="accent blue">Blue accent</button>
        <button class="ai-helper__chip" type="button" data-ai-prompt="button shape rounded">Rounded buttons</button>
        <button class="ai-helper__chip" type="button" data-ai-prompt='set shop-hero-title: "A curated template marketplace"'>Rename page title</button>
        <button class="ai-helper__chip" type="button" data-ai-prompt="hide faq">Hide section</button>
        <button class="ai-helper__chip" type="button" data-ai-prompt="make it more premium">More premium</button>
        <button class="ai-helper__chip" type="button" data-ai-prompt="reset">Reset</button>
      </div>
      <div class="ai-helper__actions">
        <button class="button button-primary" type="button" data-ai-run>Apply</button>
        <button class="button button-secondary" type="button" data-ai-clear>Clear</button>
      </div>
      <div class="ai-helper__actions ai-helper__actions--secondary">
        <button class="button button-secondary" type="button" data-ai-drag>Drag Mode</button>
        <button class="button button-secondary" type="button" data-ai-export-html>Export HTML</button>
        <button class="button button-secondary" type="button" data-ai-export-json>Export State</button>
      </div>
      <div class="ai-helper__actions ai-helper__actions--secondary">
        <button class="button button-secondary" type="button" data-ai-import-json>Import State</button>
        <button class="button button-secondary" type="button" data-ai-export-all>Export All Pages</button>
      </div>
    </div>
    <div class="ai-helper__response" data-ai-response></div>
    <div class="ai-helper__status" data-ai-status></div>
    <div class="ai-helper__footer">
      <p class="ai-helper__hint">Changes are saved locally in this browser, are page-aware, and can now be exported as files.</p>
    </div>
  `;

  document.body.append(launch, panel);

  const closeButton = panel.querySelector(".ai-helper__close");
  const promptField = panel.querySelector(".ai-helper__prompt");
  const runButton = panel.querySelector("[data-ai-run]");
  const clearButton = panel.querySelector("[data-ai-clear]");
  const dragButton = panel.querySelector("[data-ai-drag]");
  const exportHtmlButton = panel.querySelector("[data-ai-export-html]");
  const exportJsonButton = panel.querySelector("[data-ai-export-json]");
  const importJsonButton = panel.querySelector("[data-ai-import-json]");
  const exportAllButton = panel.querySelector("[data-ai-export-all]");
  const response = panel.querySelector("[data-ai-response]");
  const status = panel.querySelector("[data-ai-status]");
  const chips = panel.querySelectorAll("[data-ai-prompt]");

  launch.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) promptField.focus();
  });

  closeButton.addEventListener("click", () => {
    panel.hidden = true;
  });

  runButton.addEventListener("click", () => {
    response.textContent = runAiCommand(promptField.value);
  });

  clearButton.addEventListener("click", () => {
    promptField.value = "";
    response.textContent = "";
  });

  dragButton.addEventListener("click", () => {
    toggleDragMode(status);
  });

  exportHtmlButton.addEventListener("click", async () => {
    await exportCurrentPage(status);
  });

  exportJsonButton.addEventListener("click", async () => {
    await exportAiState(status);
  });

  importJsonButton.addEventListener("click", async () => {
    await importAiState(status);
  });

  exportAllButton.addEventListener("click", async () => {
    await exportAllPages(status);
  });

  promptField.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      response.textContent = runAiCommand(promptField.value);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const suggestion = chip.dataset.aiPrompt || "";
      promptField.value = suggestion;
      response.textContent = runAiCommand(suggestion);
    });
  });
};

applyContentState();
setDragHandlers();
ensureHeadAssets();
ensureFooterSupport();
createSupportChatbot();

document.addEventListener("keydown", (event) => {
  if (event.shiftKey && event.altKey && event.key.toLowerCase() === "e") {
    toggleEditorMode();
  }
});

if (isEditorMode()) {
  createAiHelper();
}
