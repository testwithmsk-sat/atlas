export const categoryDirectory = [
  {
    slug: "wedding",
    name: "Wedding",
    navLabel: "Wedding",
    description: "Elegant templates and printables for invitations, planning, signage, and celebration extras.",
    subcategories: [
      { slug: "invitations-stationery", name: "Invitations & Stationery" },
      { slug: "planning-budget", name: "Planning & Budget" },
      { slug: "signs-day-of-details", name: "Signs & Day-Of Details" },
      { slug: "showers-parties", name: "Showers & Parties" }
    ]
  },
  {
    slug: "events-parties",
    name: "Events & Parties",
    navLabel: "Parties",
    description: "Printable invites, games, itineraries, and decor details for birthdays, baby showers, and celebrations.",
    subcategories: [
      { slug: "party-invitations", name: "Party Invitations" },
      { slug: "games-activities", name: "Games & Activities" },
      { slug: "signs-decor", name: "Signs & Decor" }
    ]
  },
  {
    slug: "business",
    name: "Business",
    navLabel: "Business",
    description: "Templates for client work, branded documents, offers, marketing, and operations.",
    subcategories: [
      { slug: "client-documents", name: "Client Documents" },
      { slug: "marketing-sales", name: "Marketing & Sales" },
      { slug: "operations-systems", name: "Operations & Systems" }
    ]
  },
  {
    slug: "planners-productivity",
    name: "Planners & Productivity",
    navLabel: "Planners",
    description: "Trackers, planners, and digital tools for finance, routines, goals, and everyday organization.",
    subcategories: [
      { slug: "finance-budgeting", name: "Finance & Budgeting" },
      { slug: "goal-planning", name: "Goal Planning" },
      { slug: "home-family", name: "Home & Family" }
    ]
  },
  {
    slug: "career-education",
    name: "Career & Education",
    navLabel: "Career",
    description: "Resume templates, study planners, classroom resources, and career organization tools.",
    subcategories: [
      { slug: "resume-job-search", name: "Resume & Job Search" },
      { slug: "study-school", name: "Study & School" },
      { slug: "teacher-resources", name: "Teacher Resources" }
    ]
  },
  {
    slug: "social-content",
    name: "Social & Content",
    navLabel: "Content",
    description: "Canva packs, pin templates, content calendars, and digital marketing assets.",
    subcategories: [
      { slug: "social-templates", name: "Social Templates" },
      { slug: "lead-magnets-workbooks", name: "Lead Magnets & Workbooks" },
      { slug: "content-calendars", name: "Content Calendars" }
    ]
  },
  {
    slug: "creative-assets",
    name: "Creative Assets",
    navLabel: "Assets",
    description: "SVG bundles, icons, mockups, clipart, presets, and design support assets.",
    subcategories: [
      { slug: "svg-cut-files", name: "SVG & Cut Files" },
      { slug: "mockups-brand-assets", name: "Mockups & Brand Assets" },
      { slug: "presets-brushes", name: "Presets & Brushes" }
    ]
  },
  {
    slug: "templates-documents",
    name: "Templates & Documents",
    navLabel: "Templates",
    description: "Editable documents, printable forms, workbooks, checklists, journals, and fillable resources.",
    subcategories: [
      { slug: "printable-forms", name: "Printable Forms" },
      { slug: "journals-workbooks", name: "Journals & Workbooks" },
      { slug: "editable-documents", name: "Editable Documents" }
    ]
  }
];

export const starterCatalogPlan = [
  { slug: "wedding-invitation-template-bundle", name: "Wedding Invitation Template Bundle", categorySlug: "wedding", subcategorySlug: "invitations-stationery", productType: "Canva template bundle", stage: "Live" },
  { slug: "save-the-date-canva-suite", name: "Save The Date Canva Suite", categorySlug: "wedding", subcategorySlug: "invitations-stationery", productType: "Canva template", stage: "Planned" },
  { slug: "budget-wedding-planner-bundle", name: "Budget Wedding Planner Bundle", categorySlug: "wedding", subcategorySlug: "planning-budget", productType: "Printable planner bundle", stage: "Live" },
  { slug: "wedding-timeline-checklist-kit", name: "Wedding Timeline Checklist Kit", categorySlug: "wedding", subcategorySlug: "planning-budget", productType: "Checklist pack", stage: "Planned" },
  { slug: "wedding-signs-bundle", name: "Wedding Signs Bundle", categorySlug: "wedding", subcategorySlug: "signs-day-of-details", productType: "Printable sign bundle", stage: "Live" },
  { slug: "table-number-card-set", name: "Table Number Card Set", categorySlug: "wedding", subcategorySlug: "signs-day-of-details", productType: "Printable card set", stage: "Planned" },
  { slug: "bridal-shower-games-bundle", name: "Bridal Shower Games Bundle", categorySlug: "wedding", subcategorySlug: "showers-parties", productType: "Printable game bundle", stage: "Live" },
  { slug: "bachelorette-weekend-itinerary", name: "Bachelorette Weekend Itinerary", categorySlug: "wedding", subcategorySlug: "showers-parties", productType: "Itinerary template", stage: "Planned" },

  { slug: "birthday-party-invitation-pack", name: "Birthday Party Invitation Pack", categorySlug: "events-parties", subcategorySlug: "party-invitations", productType: "Invitation template pack", stage: "Planned" },
  { slug: "baby-shower-games-pack", name: "Baby Shower Games Pack", categorySlug: "events-parties", subcategorySlug: "games-activities", productType: "Printable games pack", stage: "Planned" },
  { slug: "party-welcome-sign-template", name: "Party Welcome Sign Template", categorySlug: "events-parties", subcategorySlug: "signs-decor", productType: "Printable sign template", stage: "Planned" },

  { slug: "client-welcome-guide-template", name: "Client Welcome Guide Template", categorySlug: "business", subcategorySlug: "client-documents", productType: "Editable PDF and Canva template", stage: "Planned" },
  { slug: "service-proposal-template", name: "Service Proposal Template", categorySlug: "business", subcategorySlug: "client-documents", productType: "Proposal template", stage: "Planned" },
  { slug: "lead-magnet-workbook-template", name: "Lead Magnet Workbook Template", categorySlug: "business", subcategorySlug: "marketing-sales", productType: "Workbook template", stage: "Planned" },
  { slug: "instagram-launch-template-pack", name: "Instagram Launch Template Pack", categorySlug: "business", subcategorySlug: "marketing-sales", productType: "Social media template pack", stage: "Planned" },
  { slug: "sop-template-library", name: "SOP Template Library", categorySlug: "business", subcategorySlug: "operations-systems", productType: "Operations template library", stage: "Planned" },

  { slug: "monthly-budget-spreadsheet", name: "Monthly Budget Spreadsheet", categorySlug: "planners-productivity", subcategorySlug: "finance-budgeting", productType: "Spreadsheet template", stage: "Planned" },
  { slug: "debt-payoff-tracker", name: "Debt Payoff Tracker", categorySlug: "planners-productivity", subcategorySlug: "finance-budgeting", productType: "Tracker spreadsheet", stage: "Planned" },
  { slug: "goal-planner-notion-system", name: "Goal Planner Notion System", categorySlug: "planners-productivity", subcategorySlug: "goal-planning", productType: "Notion template", stage: "Planned" },
  { slug: "daily-routine-planner-pack", name: "Daily Routine Planner Pack", categorySlug: "planners-productivity", subcategorySlug: "goal-planning", productType: "Printable planner pack", stage: "Planned" },
  { slug: "family-command-center-kit", name: "Family Command Center Kit", categorySlug: "planners-productivity", subcategorySlug: "home-family", productType: "Printable home organizer", stage: "Planned" },

  { slug: "modern-resume-template-pack", name: "Modern Resume Template Pack", categorySlug: "career-education", subcategorySlug: "resume-job-search", productType: "Resume template pack", stage: "Planned" },
  { slug: "job-application-tracker", name: "Job Application Tracker", categorySlug: "career-education", subcategorySlug: "resume-job-search", productType: "Tracker spreadsheet", stage: "Planned" },
  { slug: "student-study-planner", name: "Student Study Planner", categorySlug: "career-education", subcategorySlug: "study-school", productType: "Study planner", stage: "Planned" },
  { slug: "teacher-lesson-planner-bundle", name: "Teacher Lesson Planner Bundle", categorySlug: "career-education", subcategorySlug: "teacher-resources", productType: "Lesson planner bundle", stage: "Planned" },

  { slug: "pinterest-pin-template-bundle", name: "Pinterest Pin Template Bundle", categorySlug: "social-content", subcategorySlug: "social-templates", productType: "Canva template bundle", stage: "Planned" },
  { slug: "content-calendar-dashboard", name: "Content Calendar Dashboard", categorySlug: "social-content", subcategorySlug: "content-calendars", productType: "Notion or spreadsheet system", stage: "Planned" },
  { slug: "ebook-workbook-template-kit", name: "Ebook Workbook Template Kit", categorySlug: "social-content", subcategorySlug: "lead-magnets-workbooks", productType: "Lead magnet template kit", stage: "Planned" },

  { slug: "wedding-svg-bundle", name: "Wedding SVG Bundle", categorySlug: "creative-assets", subcategorySlug: "svg-cut-files", productType: "SVG bundle", stage: "Planned" },
  { slug: "brand-mockup-scene-pack", name: "Brand Mockup Scene Pack", categorySlug: "creative-assets", subcategorySlug: "mockups-brand-assets", productType: "Mockup pack", stage: "Planned" },
  { slug: "procreate-brush-starter-kit", name: "Procreate Brush Starter Kit", categorySlug: "creative-assets", subcategorySlug: "presets-brushes", productType: "Brush pack", stage: "Planned" },

  { slug: "fillable-invoice-pdf", name: "Fillable Invoice PDF", categorySlug: "templates-documents", subcategorySlug: "printable-forms", productType: "Fillable PDF", stage: "Planned" },
  { slug: "guided-journal-workbook", name: "Guided Journal Workbook", categorySlug: "templates-documents", subcategorySlug: "journals-workbooks", productType: "Workbook", stage: "Planned" },
  { slug: "editable-checklist-library", name: "Editable Checklist Library", categorySlug: "templates-documents", subcategorySlug: "editable-documents", productType: "Document template library", stage: "Planned" }
];

export function getCategoryBySlug(slug) {
  return categoryDirectory.find((category) => category.slug === slug) || null;
}

export function getCatalogBlueprintGroups() {
  return categoryDirectory.map((category) => ({
    ...category,
    products: starterCatalogPlan.filter((product) => product.categorySlug === category.slug)
  }));
}
