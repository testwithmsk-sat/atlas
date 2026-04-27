const PDF_TYPE = {
  fileType: "pdf",
  contentType: "application/pdf"
};

const XLSX_TYPE = {
  fileType: "xlsx",
  contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

function formatPriceLabel(basePrice, isBundle = false) {
  if (isBundle) return "$10.00";
  if (basePrice >= 13) return "$5.00";
  if (basePrice >= 11) return "$4.00";
  if (basePrice >= 10) return "$3.00";
  if (basePrice >= 9) return "$2.00";
  return "$1.00";
}

function createFile(localPath, storagePath, type) {
  return {
    localPath,
    storagePath,
    ...type
  };
}

function createCatalogEntry({
  slug,
  name,
  category,
  categorySlug,
  subcategory,
  subcategorySlug,
  badge,
  basePrice,
  isBundle = false,
  productType,
  summary,
  image,
  highlights,
  files
}) {
  return {
    slug,
    name,
    category,
    categorySlug,
    subcategory,
    subcategorySlug,
    badge,
    priceLabel: formatPriceLabel(basePrice, isBundle),
    status: "Digital download",
    productType,
    summary,
    image,
    highlights,
    isPurchasable: true,
    files
  };
}

const businessImage = "/products/business-invoice-template-1.png";
const eventsImage = "/products/events-parties-bundle-1.png";
const planningImage = "/products/budget-bride-plan-1.png";
const weddingPlanningImage = "/products/budget-wedding-planner-bundle.svg";

const weddingChecklistFiles = [
  {
    slug: "wedding-checklist-customer-guide",
    name: "Wedding Checklist Customer Guide",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Guide",
    basePrice: 8,
    productType: "Printable PDF checklist",
    summary: "A customer guide that shows buyers how to use the full wedding checklist collection with confidence.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\00_Customer_Guide.pdf`,
        "wedding/checklists/00_Customer_Guide.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "twelve-month-master-wedding-checklist",
    name: "12-Month Master Wedding Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Planning Essential",
    basePrice: 12,
    productType: "Printable PDF checklist",
    summary: "A master wedding checklist for planning each milestone across a full 12-month timeline.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\01_12Month_Master_Wedding_Checklist.pdf`,
        "wedding/checklists/01_12Month_Master_Wedding_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "final-countdown-wedding-checklist",
    name: "Final Countdown Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Deadline Saver",
    basePrice: 10,
    productType: "Printable PDF checklist",
    summary: "A final countdown checklist for the last-stage wedding tasks before the big day.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\02_FinalCountdown_Checklist.pdf`,
        "wedding/checklists/02_FinalCountdown_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "vendor-booking-wedding-checklist",
    name: "Vendor Booking Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Vendor Planner",
    basePrice: 10,
    productType: "Printable PDF checklist",
    summary: "A vendor booking checklist for managing research, bookings, and supplier follow-up steps.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\03_Vendor_Booking_Checklist.pdf`,
        "wedding/checklists/03_Vendor_Booking_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "attire-beauty-wedding-checklist",
    name: "Attire & Beauty Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Style Planner",
    basePrice: 10,
    productType: "Printable PDF checklist",
    summary: "An attire and beauty checklist for gowns, fittings, styling, and preparation appointments.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\04_Attire_Beauty_Checklist.pdf`,
        "wedding/checklists/04_Attire_Beauty_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "ceremony-planning-wedding-checklist",
    name: "Ceremony Planning Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Ceremony Planner",
    basePrice: 10,
    productType: "Printable PDF checklist",
    summary: "A ceremony planning checklist for organizing vows, order of events, and ceremony logistics.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\05_Ceremony_Planning_Checklist.pdf`,
        "wedding/checklists/05_Ceremony_Planning_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "reception-planning-wedding-checklist",
    name: "Reception Planning Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Reception Planner",
    basePrice: 10,
    productType: "Printable PDF checklist",
    summary: "A reception planning checklist for tracking setup, decor, food, music, and guest experience details.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\06_Reception_Planning_Checklist.pdf`,
        "wedding/checklists/06_Reception_Planning_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "wedding-day-emergency-kit-checklist",
    name: "Wedding Day Emergency Kit",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Day-Of Essential",
    basePrice: 9,
    productType: "Printable PDF checklist",
    summary: "A wedding day emergency kit checklist for packing the practical extras couples often need on the day.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\07_Wedding_Day_Emergency_Kit.pdf`,
        "wedding/checklists/07_Wedding_Day_Emergency_Kit.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "honeymoon-planning-checklist",
    name: "Honeymoon Planning Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Travel Planner",
    basePrice: 10,
    productType: "Printable PDF checklist",
    summary: "A honeymoon planning checklist for bookings, packing, and post-wedding travel preparation.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\08_Honeymoon_Planning_Checklist.pdf`,
        "wedding/checklists/08_Honeymoon_Planning_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "post-wedding-admin-checklist",
    name: "Post-Wedding Admin Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "After The Day",
    basePrice: 9,
    productType: "Printable PDF checklist",
    summary: "A post-wedding admin checklist for final paperwork, thank-yous, and after-the-day follow-up tasks.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\09_PostWedding_Admin_Checklist.pdf`,
        "wedding/checklists/09_PostWedding_Admin_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "wedding-day-checklist-template",
    name: "Wedding Day Checklist",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Day-Of Planner",
    basePrice: 10,
    productType: "Printable PDF checklist",
    summary: "A wedding day checklist for keeping the full event timeline and responsibilities organized.",
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\10_Wedding_Day_Checklist.pdf`,
        "wedding/checklists/10_Wedding_Day_Checklist.pdf",
        PDF_TYPE
      )
    ]
  }
];

const businessCoreFiles = [
  {
    slug: "business-templates-guide",
    name: "Business Templates Guide",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Guide",
    basePrice: 8,
    productType: "Printable PDF template",
    summary: "A setup guide that helps customers use the full business document collection with confidence.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\00_HOW_TO_USE_Business_Templates.pdf`,
        "business/core/00_HOW_TO_USE_Business_Templates.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "business-proposal-template",
    name: "Business Proposal Template",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Client Essential",
    basePrice: 12,
    productType: "Printable PDF template",
    summary: "A polished proposal template for pitching services, retainers, and custom business offers.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\01_Business_Proposal.pdf`,
        "business/core/01_Business_Proposal.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "business-invoice-template",
    name: "Business Invoice Template",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Popular",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A clean invoice template for sending professional billing documents to clients.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\02_Invoice.pdf`,
        "business/core/02_Invoice.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "business-pitch-deck-template",
    name: "Business Pitch Deck Template",
    subcategory: "Marketing & Sales",
    subcategorySlug: "marketing-sales",
    badge: "Sales Deck",
    basePrice: 12,
    productType: "Printable PDF template",
    summary: "A business pitch deck template for presentations, sales storytelling, and partnership outreach.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\03_Pitch_Deck.pdf`,
        "business/core/03_Pitch_Deck.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "media-kit-template",
    name: "Media Kit Template",
    subcategory: "Marketing & Sales",
    subcategorySlug: "marketing-sales",
    badge: "Brand Asset",
    basePrice: 12,
    productType: "Printable PDF template",
    summary: "A branded media kit template for partnerships, sponsorships, and collaboration outreach.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\04_Media_Kit.pdf`,
        "business/core/04_Media_Kit.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "meeting-agenda-template",
    name: "Meeting Agenda Template",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Ops Tool",
    basePrice: 9,
    productType: "Printable PDF template",
    summary: "A structured agenda template for client meetings, workshops, and internal planning calls.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\05_Meeting_Agenda.pdf`,
        "business/core/05_Meeting_Agenda.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "project-status-report-template",
    name: "Project Status Report Template",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Reporting",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A project report template for updates, stakeholders, and client communication.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\06_Project_Status_Report.pdf`,
        "business/core/06_Project_Status_Report.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "client-onboarding-template",
    name: "Client Onboarding Template",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Best Seller",
    basePrice: 12,
    productType: "Printable PDF template",
    summary: "A client onboarding template for welcoming new customers with a polished first impression.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\07_Client_Onboarding.pdf`,
        "business/core/07_Client_Onboarding.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "service-agreement-template",
    name: "Service Agreement Template",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Client Essential",
    basePrice: 11,
    productType: "Printable PDF template",
    summary: "A service agreement template for formalizing project terms and expectations.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\08_Service_Agreement.pdf`,
        "business/core/08_Service_Agreement.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "brand-guidelines-template",
    name: "Brand Guidelines Template",
    subcategory: "Marketing & Sales",
    subcategorySlug: "marketing-sales",
    badge: "Brand Asset",
    basePrice: 11,
    productType: "Printable PDF template",
    summary: "A brand guidelines template for sharing visual rules and presentation standards.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\09_Brand_Guidelines.pdf`,
        "business/core/09_Brand_Guidelines.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "event-registration-template",
    name: "Event Registration Template",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Organizer",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "An event registration template for attendee capture, workshops, and sign-up workflows.",
    files: [
      createFile(
        String.raw`D:\New folder\TheDigitalAtlas_Business_Templates\10_Event_Registration.pdf`,
        "business/core/10_Event_Registration.pdf",
        PDF_TYPE
      )
    ]
  }
];

const businessGrowthFiles = [
  {
    slug: "invoice-quote-template",
    name: "Invoice & Quote Template",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Client Essential",
    basePrice: 12,
    productType: "Editable spreadsheet template",
    summary: "A quote and invoice workbook for generating polished client billing documents.",
    files: [
      createFile(
        String.raw`D:\New folder\files (3)\01_Invoice_Quote_Template.xlsx`,
        "business/growth/01_Invoice_Quote_Template.xlsx",
        XLSX_TYPE
      )
    ]
  },
  {
    slug: "monthly-pl-tracker",
    name: "Monthly P&L Tracker",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Finance Tool",
    basePrice: 12,
    productType: "Editable spreadsheet template",
    summary: "A monthly P&L tracker for monitoring business performance and profit visibility.",
    files: [
      createFile(
        String.raw`D:\New folder\files (3)\02_Monthly_PL_Tracker.xlsx`,
        "business/growth/02_Monthly_PL_Tracker.xlsx",
        XLSX_TYPE
      )
    ]
  },
  {
    slug: "ninety-day-action-plan",
    name: "90-Day Action Plan",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Planning Tool",
    basePrice: 11,
    productType: "Editable spreadsheet template",
    summary: "A quarterly action plan workbook for mapping goals, tasks, and milestones.",
    files: [
      createFile(
        String.raw`D:\New folder\files (3)\03_90-Day_Action_Plan.xlsx`,
        "business/growth/03_90-Day_Action_Plan.xlsx",
        XLSX_TYPE
      )
    ]
  },
  {
    slug: "client-onboarding-kit",
    name: "Client Onboarding Kit",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Client Essential",
    basePrice: 12,
    productType: "Printable PDF template",
    summary: "A client onboarding kit for streamlining welcome packs, expectations, and setup steps.",
    files: [
      createFile(
        String.raw`D:\New folder\files (3)\04_Client_Onboarding_Kit.pdf`,
        "business/growth/04_Client_Onboarding_Kit.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "social-media-branding-guide",
    name: "Social Media Branding Guide",
    subcategory: "Marketing & Sales",
    subcategorySlug: "marketing-sales",
    badge: "Brand Asset",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A social branding guide for keeping content and social presentation aligned.",
    files: [
      createFile(
        String.raw`D:\New folder\files (3)\05_Social_Media_Branding_Guide.pdf`,
        "business/growth/05_Social_Media_Branding_Guide.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "business-startup-checklist",
    name: "Business Startup Checklist",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Checklist",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A startup checklist for launching a business with clear setup steps and systems.",
    files: [
      createFile(
        String.raw`D:\New folder\files (3)\06_Business_Startup_Checklist.pdf`,
        "business/growth/06_Business_Startup_Checklist.pdf",
        PDF_TYPE
      )
    ]
  }
];

const interiorDesignFiles = [
  {
    slug: "room-design-templates",
    name: "Room Design Templates",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Design Pack",
    basePrice: 12,
    productType: "Printable PDF template",
    summary: "A room design template pack for planning concepts and layout direction.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\01_Room_Design_Templates.pdf`,
        "planning/interior/01_Room_Design_Templates.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "color-palette-creator",
    name: "Color Palette Creator",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Planner Tool",
    basePrice: 11,
    productType: "Editable spreadsheet template",
    summary: "A color palette creator workbook for testing and organizing design combinations.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\02_Color_Palette_Creator.xlsx`,
        "planning/interior/02_Color_Palette_Creator.xlsx",
        XLSX_TYPE
      )
    ]
  },
  {
    slug: "furniture-layout-planner",
    name: "Furniture Layout Planner",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Layout Tool",
    basePrice: 12,
    productType: "Editable spreadsheet template",
    summary: "A furniture layout planner for mapping room flow before moving or buying pieces.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\03_Furniture_Layout_Planner.xlsx`,
        "planning/interior/03_Furniture_Layout_Planner.xlsx",
        XLSX_TYPE
      )
    ]
  },
  {
    slug: "budget-cost-tracker",
    name: "Budget Cost Tracker",
    subcategory: "Finance & Budgeting",
    subcategorySlug: "finance-budgeting",
    badge: "Budget Tool",
    basePrice: 12,
    productType: "Editable spreadsheet template",
    summary: "A cost tracker for renovation, decor, and home project budgets.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\04_Budget_Cost_Tracker.xlsx`,
        "planning/interior/04_Budget_Cost_Tracker.xlsx",
        XLSX_TYPE
      )
    ]
  },
  {
    slug: "mood-board-guide",
    name: "Mood Board Guide",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Creative Guide",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A mood board guide for shaping visual direction across interior projects.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\05_Mood_Board_Guide.pdf`,
        "planning/interior/05_Mood_Board_Guide.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "diy-project-checklist",
    name: "DIY Project Checklist",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Checklist",
    basePrice: 9,
    productType: "Printable PDF template",
    summary: "A DIY checklist for tracking supplies, tasks, and completion steps at home.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\06_DIY_Project_Checklist.pdf`,
        "planning/interior/06_DIY_Project_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "paint-material-selector",
    name: "Paint & Material Selector",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Selection Tool",
    basePrice: 11,
    productType: "Editable spreadsheet template",
    summary: "A selector workbook for comparing paint finishes and material options.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\07_Paint_Material_Selector.xlsx`,
        "planning/interior/07_Paint_Material_Selector.xlsx",
        XLSX_TYPE
      )
    ]
  },
  {
    slug: "interior-design-checklist",
    name: "Interior Design Checklist",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Bonus Checklist",
    basePrice: 9,
    productType: "Printable PDF template",
    summary: "A bonus checklist for keeping interior design projects on track room by room.",
    files: [
      createFile(
        String.raw`D:\New folder\files (4)\08_BONUS_Interior_Design_Checklist.pdf`,
        "planning/interior/08_BONUS_Interior_Design_Checklist.pdf",
        PDF_TYPE
      )
    ]
  }
];

const eventPlanningFiles = [
  {
    slug: "event-customer-guide",
    name: "Event Customer Guide",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Guide",
    basePrice: 8,
    productType: "Printable PDF template",
    summary: "A guide that helps customers use the full event planning collection confidently.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\00_Customer_Guide.pdf`,
        "events/planning/00_Customer_Guide.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "party-invitation-template",
    name: "Party Invitation Template",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Invitation",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A party invitation template for polished private events and celebrations.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\01_Party_Invitation.pdf`,
        "events/planning/01_Party_Invitation.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "event-planning-checklist",
    name: "Event Planning Checklist",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Checklist",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "An event checklist for tracking planning tasks from kickoff through setup.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\02_Event_Planning_Checklist.pdf`,
        "events/planning/02_Event_Planning_Checklist.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "guest-list-rsvp-tracker",
    name: "Guest List & RSVP Tracker",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Planning Tool",
    basePrice: 11,
    productType: "Printable PDF template",
    summary: "A guest and RSVP tracker for keeping attendance details organized.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\03_Guest_List_RSVP_Tracker.pdf`,
        "events/planning/03_Guest_List_RSVP_Tracker.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "event-budget-planner",
    name: "Event Budget Planner",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Budget Tool",
    basePrice: 11,
    productType: "Printable PDF template",
    summary: "An event budget planner for vendor, decor, and venue cost visibility.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\04_Event_Budget_Planner.pdf`,
        "events/planning/04_Event_Budget_Planner.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "party-run-sheet",
    name: "Party Run Sheet",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Run Of Show",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A run sheet for coordinating timings, hosts, and key event-day moments.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\05_Party_Run_Sheet.pdf`,
        "events/planning/05_Party_Run_Sheet.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "vendor-supplier-contacts",
    name: "Vendor & Supplier Contacts",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Ops Tool",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A contacts sheet for keeping vendors and suppliers in one place.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\06_Vendor_Supplier_Contacts.pdf`,
        "events/planning/06_Vendor_Supplier_Contacts.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "seating-plan-table-assignments",
    name: "Seating Plan & Table Assignments",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Guest Flow",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A seating plan template for guest flow and table assignment planning.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\07_Seating_Plan_Table_Assignments.pdf`,
        "events/planning/07_Seating_Plan_Table_Assignments.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "food-drinks-planner",
    name: "Food & Drinks Planner",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Menu Planner",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A planner for menus, drinks, and catering details across event setups.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\08_Food_Drinks_Planner.pdf`,
        "events/planning/08_Food_Drinks_Planner.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "activities-games-planner",
    name: "Activities & Games Planner",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Activities",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "An activity planner for games, engagement moments, and guest entertainment.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\09_Activities_Games_Planner.pdf`,
        "events/planning/09_Activities_Games_Planner.pdf",
        PDF_TYPE
      )
    ]
  },
  {
    slug: "post-event-wrap-up-report",
    name: "Post-Event Wrap-Up Report",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Review Tool",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A wrap-up report for post-event notes, outcomes, and next-step follow-up.",
    files: [
      createFile(
        String.raw`D:\New folder\files (5)\10_Post_Event_Wrap_Up_Report.pdf`,
        "events/planning/10_Post_Event_Wrap_Up_Report.pdf",
        PDF_TYPE
      )
    ]
  }
];

const celebrationFiles = [
  {
    slug: "baby-shower-checklist-template",
    name: "Baby Shower Checklist",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Checklist",
    basePrice: 9,
    productType: "Printable PDF template",
    summary: "A baby shower checklist for organized planning and prep milestones.",
    files: [createFile(String.raw`D:\New folder\files (6)\Baby_Shower_Checklist.pdf`, "events/celebrations/Baby_Shower_Checklist.pdf", PDF_TYPE)]
  },
  {
    slug: "baby-shower-games-pack",
    name: "Baby Shower Games",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Party Favorite",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A printable games pack for baby shower celebrations and guest fun.",
    files: [createFile(String.raw`D:\New folder\files (6)\Baby_Shower_Games.pdf`, "events/celebrations/Baby_Shower_Games.pdf", PDF_TYPE)]
  },
  {
    slug: "baby-shower-invitation-template",
    name: "Baby Shower Invitation",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Invitation",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A baby shower invitation template for quick and polished event invites.",
    files: [createFile(String.raw`D:\New folder\files (6)\Baby_Shower_Invitation.pdf`, "events/celebrations/Baby_Shower_Invitation.pdf", PDF_TYPE)]
  },
  {
    slug: "birthday-invitation-template",
    name: "Birthday Invitation",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Invitation",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A birthday invitation template for casual and celebratory party invites.",
    files: [createFile(String.raw`D:\New folder\files (6)\Birthday_Invitation.pdf`, "events/celebrations/Birthday_Invitation.pdf", PDF_TYPE)]
  },
  {
    slug: "birthday-party-checklist",
    name: "Birthday Party Checklist",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Checklist",
    basePrice: 9,
    productType: "Printable PDF template",
    summary: "A birthday planning checklist for keeping tasks and prep organized.",
    files: [createFile(String.raw`D:\New folder\files (6)\Birthday_Party_Checklist.pdf`, "events/celebrations/Birthday_Party_Checklist.pdf", PDF_TYPE)]
  },
  {
    slug: "birthday-thank-you-card-template",
    name: "Birthday Thank You Card",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Stationery",
    basePrice: 9,
    productType: "Printable PDF template",
    summary: "A birthday thank-you card template for easy post-party follow-up.",
    files: [createFile(String.raw`D:\New folder\files (6)\Birthday_Thank_You_Card.pdf`, "events/celebrations/Birthday_Thank_You_Card.pdf", PDF_TYPE)]
  },
  {
    slug: "bridal-shower-games-pack",
    name: "Bridal Shower Games",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Party Favorite",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A bridal shower games pack for adding fun guest activities to the event.",
    files: [createFile(String.raw`D:\New folder\files (6)\Bridal_Shower_Games.pdf`, "events/celebrations/Bridal_Shower_Games.pdf", PDF_TYPE)]
  },
  {
    slug: "bridal-shower-invitation-template",
    name: "Bridal Shower Invitation",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Invitation",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A bridal shower invitation template for refined celebration invites.",
    files: [createFile(String.raw`D:\New folder\files (6)\Bridal_Shower_Invitation.pdf`, "events/celebrations/Bridal_Shower_Invitation.pdf", PDF_TYPE)]
  },
  {
    slug: "corporate-event-invitation-template",
    name: "Corporate Event Invitation",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Event Invite",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A corporate event invitation template for business and branded gatherings.",
    files: [createFile(String.raw`D:\New folder\files (6)\Corporate_Event_Invitation.pdf`, "events/celebrations/Corporate_Event_Invitation.pdf", PDF_TYPE)]
  },
  {
    slug: "corporate-event-planner",
    name: "Corporate Event Planner",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Planner",
    basePrice: 11,
    productType: "Printable PDF template",
    summary: "A corporate event planner for schedules, deliverables, and event logistics.",
    files: [createFile(String.raw`D:\New folder\files (6)\Corporate_Event_Planner.pdf`, "events/celebrations/Corporate_Event_Planner.pdf", PDF_TYPE)]
  },
  {
    slug: "events-master-planner",
    name: "Events Master Planner",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Master Planner",
    basePrice: 12,
    productType: "Editable spreadsheet template",
    summary: "An events master planner workbook for tracking multiple event workflows together.",
    files: [createFile(String.raw`D:\New folder\files (6)\Events_Master_Planner.xlsx`, "events/celebrations/Events_Master_Planner.xlsx", XLSX_TYPE)]
  },
  {
    slug: "farewell-party-invitation-template",
    name: "Farewell Party Invitation",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Invitation",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A farewell party invitation template for simple printable event announcements.",
    files: [createFile(String.raw`D:\New folder\files (6)\Farewell_Party_Invitation.pdf`, "events/celebrations/Farewell_Party_Invitation.pdf", PDF_TYPE)]
  },
  {
    slug: "graduation-party-invitation-template",
    name: "Graduation Party Invitation",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Invitation",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A graduation invitation template for announcement-style party invites.",
    files: [createFile(String.raw`D:\New folder\files (6)\Graduation_Party_Invitation.pdf`, "events/celebrations/Graduation_Party_Invitation.pdf", PDF_TYPE)]
  },
  {
    slug: "housewarming-invitation-template",
    name: "Housewarming Invitation",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Invitation",
    basePrice: 10,
    productType: "Printable PDF template",
    summary: "A housewarming invitation template for casual home celebration invites.",
    files: [createFile(String.raw`D:\New folder\files (6)\Housewarming_Invitation.pdf`, "events/celebrations/Housewarming_Invitation.pdf", PDF_TYPE)]
  },
  {
    slug: "kids-party-activity-sheet",
    name: "Kids Party Activity Sheet",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Activities",
    basePrice: 9,
    productType: "Printable PDF template",
    summary: "A kids party activity sheet for keeping younger guests engaged.",
    files: [createFile(String.raw`D:\New folder\files (6)\Kids_Party_Activity_Sheet.pdf`, "events/celebrations/Kids_Party_Activity_Sheet.pdf", PDF_TYPE)]
  }
];

export const additionalDownloadManifest = [
  createCatalogEntry({
    slug: "wedding-checklist-bundle-sage-green-blush",
    name: "Wedding Checklist Bundle - Sage Green & Blush",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Checklist Bundle",
    basePrice: 59,
    isBundle: true,
    productType: "ZIP wedding checklist bundle",
    summary: "A complete wedding checklist bundle covering timeline planning, vendors, ceremony, reception, honeymoon, and day-of organization.",
    image: weddingPlanningImage,
    highlights: [
      "11 printable checklist files with the customer guide included",
      "Delivered as one ready-to-download bundle ZIP after checkout",
      "Organized in the Wedding planning category"
    ],
    files: [
      createFile(
        String.raw`C:\Users\Dell\Downloads\files (3)\Wedding_Checklist_Bundle_SageGreen_Blush.zip`,
        "wedding/checklists/Wedding_Checklist_Bundle_SageGreen_Blush.zip",
        {
          fileType: "zip",
          contentType: "application/zip"
        }
      )
    ]
  }),
  ...weddingChecklistFiles.map((item) =>
    createCatalogEntry({
      ...item,
      category: "Wedding",
      categorySlug: "wedding",
      image: weddingPlanningImage,
      highlights: [
        "Instant digital download after checkout",
        "Mapped directly to the original source file",
        "Organized in the Wedding planning category"
      ]
    })
  ),
  createCatalogEntry({
    slug: "complete-business-templates-bundle",
    name: "Complete Business Templates Bundle",
    category: "Business",
    categorySlug: "business",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Business Bundle",
    basePrice: 79,
    isBundle: true,
    productType: "11-file digital bundle",
    summary: "A complete business bundle with proposal, invoice, onboarding, brand, and operations templates.",
    image: businessImage,
    highlights: [
      "11 business files in one organized bundle",
      "Mix of client-facing, marketing, and operations templates",
      "Delivered through the customer download library after checkout"
    ],
    files: businessCoreFiles.flatMap((item) => item.files)
  }),
  ...businessCoreFiles.map((item) =>
    createCatalogEntry({
      ...item,
      category: "Business",
      categorySlug: "business",
      image: businessImage,
      highlights: [
        "Instant digital download after checkout",
        "Mapped directly to the original source file",
        "Organized in the Business category"
      ]
    })
  ),
  createCatalogEntry({
    slug: "business-growth-toolkit-bundle",
    name: "Business Growth Toolkit Bundle",
    category: "Business",
    categorySlug: "business",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Growth Bundle",
    basePrice: 49,
    isBundle: true,
    productType: "6-file digital bundle",
    summary: "A business toolkit bundle combining finance tracking, planning sheets, onboarding, branding, and startup systems.",
    image: businessImage,
    highlights: [
      "Mixes spreadsheets with printable business templates",
      "Built for freelancers, studios, and service businesses",
      "Bundle purchase unlocks all included source files"
    ],
    files: businessGrowthFiles.flatMap((item) => item.files)
  }),
  ...businessGrowthFiles.map((item) =>
    createCatalogEntry({
      ...item,
      category: "Business",
      categorySlug: "business",
      image: businessImage,
      highlights: [
        "Instant digital download after checkout",
        "Mapped directly to the original source file",
        "Organized in the Business category"
      ]
    })
  ),
  createCatalogEntry({
    slug: "interior-design-planner-bundle",
    name: "Interior Design Planner Bundle",
    category: "Planners & Productivity",
    categorySlug: "planners-productivity",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Home Bundle",
    basePrice: 59,
    isBundle: true,
    productType: "8-file digital bundle",
    summary: "A home-planning bundle with room templates, cost trackers, material selectors, and design guides.",
    image: planningImage,
    highlights: [
      "Supports room planning, decor direction, and budgeting",
      "Mixes spreadsheets with printable design guides",
      "Bundle purchase unlocks all included source files"
    ],
    files: interiorDesignFiles.flatMap((item) => item.files)
  }),
  ...interiorDesignFiles.map((item) =>
    createCatalogEntry({
      ...item,
      category: "Planners & Productivity",
      categorySlug: "planners-productivity",
      image: planningImage,
      highlights: [
        "Instant digital download after checkout",
        "Mapped directly to the original source file",
        "Organized in the Planners category"
      ]
    })
  ),
  createCatalogEntry({
    slug: "event-planning-bundle",
    name: "Event Planning Bundle",
    category: "Events & Parties",
    categorySlug: "events-parties",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Event Bundle",
    basePrice: 69,
    isBundle: true,
    productType: "11-file digital bundle",
    summary: "A complete event planning bundle with invitations, guest tracking, budgeting, seating, food, activities, and wrap-up reporting.",
    image: eventsImage,
    highlights: [
      "11 event planning files with a customer guide included",
      "Built for hosts, planners, and celebration organizers",
      "Bundle purchase unlocks all included source files"
    ],
    files: eventPlanningFiles.flatMap((item) => item.files)
  }),
  ...eventPlanningFiles.map((item) =>
    createCatalogEntry({
      ...item,
      category: "Events & Parties",
      categorySlug: "events-parties",
      image: eventsImage,
      highlights: [
        "Instant digital download after checkout",
        "Mapped directly to the original source file",
        "Organized in the Events category"
      ]
    })
  ),
  createCatalogEntry({
    slug: "celebration-party-planner-bundle",
    name: "Celebration Party Planner Bundle",
    category: "Events & Parties",
    categorySlug: "events-parties",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "Celebration Bundle",
    basePrice: 79,
    isBundle: true,
    productType: "15-file digital bundle",
    summary: "A celebration bundle covering baby showers, birthdays, bridal showers, corporate events, invitations, and activity templates.",
    image: eventsImage,
    highlights: [
      "Covers multiple celebration types in one digital bundle",
      "Mixes invitations, planners, and activity templates",
      "Bundle purchase unlocks all included source files"
    ],
    files: celebrationFiles.flatMap((item) => item.files)
  }),
  ...celebrationFiles.map((item) =>
    createCatalogEntry({
      ...item,
      category: "Events & Parties",
      categorySlug: "events-parties",
      image: eventsImage,
      highlights: [
        "Instant digital download after checkout",
        "Mapped directly to the original source file",
        "Organized in the Events category"
      ]
    })
  )
];
