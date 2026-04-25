import { normalizePriceLabel } from "@/lib/currency";

const weddingSubcategories = {
  "invitations-stationery": "Invitations & Stationery",
  "planning-budget": "Planning & Budget",
  "signs-day-of-details": "Signs & Day-Of Details",
  "showers-parties": "Showers & Parties"
};

const weddingImages = {
  "invitations-stationery": "/products/wedding-invitation-template-bundle.svg",
  "planning-budget": "/products/budget-wedding-planner-bundle.svg",
  "signs-day-of-details": "/products/wedding-signs-bundle.svg",
  "showers-parties": "/products/bridal-shower-games-bundle.svg"
};

function createProduct({
  slug,
  name,
  subcategorySlug,
  badge,
  price,
  compareAt,
  summary,
  highlights,
  productType,
  image,
  details,
  bundleContents,
  isBundle = false,
  isFeatured = false,
  isBestSeller = false
}) {
  return {
    slug,
    name,
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: weddingSubcategories[subcategorySlug],
    subcategorySlug,
    badge,
    priceLabel: normalizePriceLabel(price),
    compareAtPriceLabel: compareAt ? normalizePriceLabel(compareAt) : "",
    status: "Digital download",
    productType,
    summary,
    image: image || weddingImages[subcategorySlug] || weddingImages["invitations-stationery"],
    highlights,
    isPurchasable: true,
    isBundle,
    isFeatured,
    isBestSeller,
    details,
    bundleContents: bundleContents || []
  };
}

export const fallbackProducts = [
  createProduct({
    slug: "editable-wedding-pdf-template-bundle",
    name: "Editable Wedding PDF Template Bundle",
    subcategorySlug: "invitations-stationery",
    badge: "Best Seller",
    price: 59,
    compareAt: 89,
    productType: "Bundle of 10 editable PDFs",
    summary:
      "A complete wedding bundle with 10 fillable PDF templates plus a customer how-to guide, packaged as one premium digital download.",
    highlights: [
      "11 files in one bundle with the guide included free",
      "Customers can type directly into the pink fillable fields",
      "Built for Adobe Acrobat Reader and other PDF viewers",
      "Perfect as the high-value wedding offer on your storefront"
    ],
    details: {
      size: "Mixed sizes including 5x7, 6x4, A5, letter, and tall menu formats",
      pages: "10 editable templates plus a 3-page customer guide",
      format: "ZIP download with fillable PDFs",
      editable: "Yes. Every template includes real clickable fillable fields for customer details.",
      printable: "Yes. Files are designed for digital sharing and print-ready export.",
      includes: [
        "Wedding Invitation",
        "Wedding Programme",
        "Seating Chart",
        "Menu Card",
        "Instagram Stories set",
        "Budget Planner",
        "Favour Tags and Thank You Card",
        "Bridal Party Proposal Cards",
        "Welcome Sign and Bar Menu",
        "RSVP Card"
      ]
    },
    bundleContents: [
      "00 Customer How-To Guide",
      "01 Wedding Invitation",
      "02 Wedding Programme",
      "03 Seating Chart",
      "04 Menu Card",
      "05 Instagram Stories",
      "06 Budget Planner",
      "07 Favour Tags and Thank You Card",
      "08 Bridal Party Proposal Cards",
      "09 Welcome Sign and Bar Menu",
      "10 RSVP Card"
    ],
    isBundle: true,
    isFeatured: true,
    isBestSeller: true
  }),
  createProduct({
    slug: "fillable-wedding-invitation-template",
    name: "Fillable Wedding Invitation Template",
    subcategorySlug: "invitations-stationery",
    badge: "Customer Favorite",
    price: 12,
    compareAt: 18,
    productType: "Editable fillable PDF",
    summary:
      "A polished 5x7 wedding invitation customers can personalize directly in their PDF viewer and save in minutes.",
    highlights: [
      "5x7 invitation layout",
      "Real fillable text fields",
      "Elegant digital stationery offer"
    ],
    details: {
      size: "5 x 7 inches",
      pages: "1 page",
      format: "Fillable PDF",
      editable: "Yes. Customers can type names, date, venue, and event details directly into the file.",
      printable: "Yes. Suitable for digital delivery or professional printing.",
      includes: ["Invitation design", "Clickable text fields", "Ready-to-save PDF format"]
    },
    isFeatured: true,
    isBestSeller: true
  }),
  createProduct({
    slug: "fillable-wedding-programme-template",
    name: "Fillable Wedding Programme Template",
    subcategorySlug: "invitations-stationery",
    badge: "New Arrival",
    price: 11,
    compareAt: 16,
    productType: "Editable fillable PDF",
    summary:
      "A refined A5 ceremony programme with space for timings, order of service, and custom wedding notes.",
    highlights: [
      "A5 programme format",
      "Ideal for ceremony flow and schedule details",
      "Easy to personalize for each event"
    ],
    details: {
      size: "A5",
      pages: "1 page",
      format: "Fillable PDF",
      editable: "Yes. Customers can type ceremony timing, order, and names into the document.",
      printable: "Yes. Designed for home or professional print use.",
      includes: ["Programme layout", "Fillable sections", "Editable wedding text areas"]
    }
  }),
  createProduct({
    slug: "fillable-wedding-seating-chart-template",
    name: "Fillable Wedding Seating Chart Template",
    subcategorySlug: "signs-day-of-details",
    badge: "Popular",
    price: 12,
    compareAt: 18,
    productType: "Editable fillable PDF",
    summary:
      "A clean seating chart for letter or A4 printing that helps couples organize guests with an elegant display-ready layout.",
    highlights: [
      "Letter or A4 layout",
      "Perfect for day-of signage",
      "Styled for printable event displays"
    ],
    details: {
      size: "Letter / A4",
      pages: "1 page",
      format: "Fillable PDF",
      editable: "Yes. Guests, table headings, and arrangement details can be typed into the chart.",
      printable: "Yes. Suitable for poster or standard print output depending on scaling.",
      includes: ["Seating chart layout", "Guest and table fields", "Display-ready PDF"]
    },
    isFeatured: true
  }),
  createProduct({
    slug: "fillable-wedding-menu-card-template",
    name: "Fillable Wedding Menu Card Template",
    subcategorySlug: "invitations-stationery",
    badge: "Reception Add-On",
    price: 9,
    compareAt: 14,
    productType: "Editable fillable PDF",
    summary:
      "A slim 4x9 reception menu card with editable meal sections, signature drink details, and a polished table-ready look.",
    highlights: [
      "4x9 menu card format",
      "Great add-on for reception styling",
      "Fast personalized upsell item"
    ],
    details: {
      size: "4 x 9 inches",
      pages: "1 page",
      format: "Fillable PDF",
      editable: "Yes. Course names, meal details, and drink wording can be updated directly.",
      printable: "Yes. Sized for elegant place setting or menu display printing.",
      includes: ["Menu card layout", "Fillable menu sections", "Reception-ready PDF"]
    }
  }),
  createProduct({
    slug: "editable-wedding-instagram-stories-pack",
    name: "Editable Wedding Instagram Stories Pack",
    subcategorySlug: "showers-parties",
    badge: "Social Add-On",
    price: 10,
    compareAt: 15,
    productType: "5-page editable PDF set",
    summary:
      "A coordinated set of wedding story slides for countdowns, announcements, reminders, and event-day social sharing.",
    highlights: [
      "5 coordinated story layouts",
      "Works as a digital upsell from the main bundle",
      "Useful for wedding-week social content"
    ],
    details: {
      size: "Story-sized digital pages",
      pages: "5 pages",
      format: "Fillable PDF set",
      editable: "Yes. Customers can type event dates, names, prompts, and short copy into each story slide.",
      printable: "No. Primarily designed for digital sharing.",
      includes: ["Five story designs", "Editable text areas", "Wedding social content pack"]
    }
  }),
  createProduct({
    slug: "fillable-wedding-budget-planner",
    name: "Fillable Wedding Budget Planner",
    subcategorySlug: "planning-budget",
    badge: "Planning Essential",
    price: 12,
    compareAt: 18,
    productType: "Editable fillable PDF",
    summary:
      "A full-page wedding budget planner for tracking estimated and actual spending across every major category.",
    highlights: [
      "Full-page budget tracker",
      "Great planner-category anchor product",
      "Easy wedding planning upsell"
    ],
    details: {
      size: "Full page",
      pages: "1 page",
      format: "Fillable PDF",
      editable: "Yes. Budget lines, categories, and amounts can be typed directly into the planner.",
      printable: "Yes. Works well for digital planning or printed binder use.",
      includes: ["Budget planner layout", "Editable spending fields", "Printable organizer page"]
    },
    isBestSeller: true
  }),
  createProduct({
    slug: "fillable-wedding-favour-tags-and-thank-you-card",
    name: "Wedding Favour Tags And Thank You Card",
    subcategorySlug: "invitations-stationery",
    badge: "Stationery Add-On",
    price: 9,
    compareAt: 14,
    productType: "Editable fillable PDF",
    summary:
      "A matching printable set for wedding favour tags and a thank you card, designed as a fast upsell from invitation buyers.",
    highlights: [
      "Letter-size printable set",
      "Combines favour tag and thank you card in one file",
      "Strong companion to invitation sales"
    ],
    details: {
      size: "Letter",
      pages: "1 page set",
      format: "Fillable PDF",
      editable: "Yes. Names, short messages, and event wording can be updated inside the file.",
      printable: "Yes. Designed for cutting and printing after editing.",
      includes: ["Favour tags", "Thank you card", "Editable stationery fields"]
    }
  }),
  createProduct({
    slug: "fillable-bridal-party-proposal-cards",
    name: "Bridal Party Proposal Cards",
    subcategorySlug: "showers-parties",
    badge: "Party Favorite",
    price: 11,
    compareAt: 16,
    productType: "5-page editable PDF set",
    summary:
      "A sweet proposal card set for bridesmaid, maid of honor, and bridal party asks with editable names and short messages.",
    highlights: [
      "Five proposal card pages",
      "Great for bridal party moments",
      "Easy upsell for celebration buyers"
    ],
    details: {
      size: "Card-sized printable set",
      pages: "5 pages",
      format: "Fillable PDF set",
      editable: "Yes. Each card can be personalized with names and short proposal wording.",
      printable: "Yes. Designed for at-home or professional card printing.",
      includes: ["Bridal party proposal pages", "Editable names and messages", "Printable keepsake set"]
    }
  }),
  createProduct({
    slug: "fillable-welcome-sign-and-bar-menu-pack",
    name: "Wedding Welcome Sign And Bar Menu Pack",
    subcategorySlug: "signs-day-of-details",
    badge: "Day-Of Favorite",
    price: 12,
    compareAt: 18,
    productType: "2-page editable PDF set",
    summary:
      "A two-piece reception pack with a welcome sign and matching bar menu, designed for a polished day-of event look.",
    highlights: [
      "Two matching wedding signage pages",
      "Ideal for ceremony or reception styling",
      "Great bundle companion item"
    ],
    details: {
      size: "Large sign plus bar menu pages",
      pages: "2 pages",
      format: "Fillable PDF set",
      editable: "Yes. Couple names, welcome copy, and drink list text can be typed into the pack.",
      printable: "Yes. Ready for print-shop or event signage workflows.",
      includes: ["Welcome sign", "Bar menu", "Editable event text fields"]
    }
  }),
  createProduct({
    slug: "fillable-wedding-rsvp-card",
    name: "Fillable Wedding RSVP Card",
    subcategorySlug: "invitations-stationery",
    badge: "Add-On Favorite",
    price: 9,
    compareAt: 14,
    productType: "Editable fillable PDF",
    summary:
      "A clean 6x4 RSVP card template with attendance, guest details, and response wording that customers can type into directly.",
    highlights: [
      "6x4 RSVP format",
      "Perfect low-ticket stationery upsell",
      "Simple for customers to customize"
    ],
    details: {
      size: "6 x 4 inches",
      pages: "1 page",
      format: "Fillable PDF",
      editable: "Yes. Response fields, guest names, and notes can be filled in directly.",
      printable: "Yes. Designed for digital delivery and easy print production.",
      includes: ["RSVP card layout", "Editable response fields", "Ready-to-save PDF"]
    }
  }),
  createProduct({
    slug: "wedding-planning-bundle-spreadsheet",
    name: "Wedding Planning Bundle Spreadsheet",
    subcategorySlug: "planning-budget",
    badge: "Planning Bundle",
    price: 29,
    compareAt: 44,
    productType: "Wedding planning spreadsheet bundle",
    summary:
      "A practical wedding planning spreadsheet bundle for tracking budget, vendors, checklist progress, and timeline details in one structured planning system.",
    highlights: [
      "Built for Excel-based wedding planning",
      "Combines budget, vendor, checklist, and timeline workflows",
      "High-value planning offer for organized couples"
    ],
    details: {
      size: "Multi-sheet digital planning file",
      pages: "Bundle workbook plus companion planning resources",
      format: "Excel spreadsheet bundle",
      editable: "Yes. Customers can update rows, dates, categories, and planning details directly in Excel.",
      printable: "Partly. Best used digitally, with printable sections where needed.",
      includes: [
        "Wedding budget tracking",
        "Vendor tracker workflow",
        "Checklist planning structure",
        "Wedding day timeline support"
      ]
    },
    bundleContents: [
      "Wedding Planning Bundle workbook",
      "Wedding Budget Spreadsheet",
      "Vendor Tracker",
      "Wedding Checklist PDF",
      "Wedding Day Timeline PDF",
      "Wedding Planning Checklist PDF"
    ],
    isBundle: true,
    isBestSeller: true
  }),
  createProduct({
    slug: "wedding-vendor-finance-bundle",
    name: "Wedding Vendor Finance Bundle",
    subcategorySlug: "planning-budget",
    badge: "Finance Bundle",
    price: 24,
    compareAt: 39,
    productType: "Wedding vendor and finance spreadsheet bundle",
    summary:
      "A focused spreadsheet bundle for managing wedding vendors, payments, budget visibility, and financial planning in one place.",
    highlights: [
      "Vendor and finance tracking in one bundle",
      "Strong planning upsell from printable products",
      "Useful for budget-conscious wedding buyers"
    ],
    details: {
      size: "Digital spreadsheet bundle",
      pages: "Workbook with finance and vendor planning sheets",
      format: "Excel spreadsheet bundle",
      editable: "Yes. Built for Excel editing and repeated updates during the planning process.",
      printable: "Primarily intended for digital planning.",
      includes: [
        "Vendor finance bundle workbook",
        "Wedding Budget Spreadsheet",
        "Vendor Tracker",
        "Planning support sheets"
      ]
    },
    bundleContents: [
      "Wedding Vendor Finance Bundle workbook",
      "Wedding Budget Spreadsheet",
      "Vendor Tracker",
      "Budget planning workflow",
      "Vendor payment tracking"
    ],
    isBundle: true
  }),
  createProduct({
    slug: "wedding-budget-spreadsheet",
    name: "Wedding Budget Spreadsheet",
    subcategorySlug: "planning-budget",
    badge: "Planning Favorite",
    price: 12,
    compareAt: 18,
    productType: "Editable Excel spreadsheet",
    summary:
      "An editable wedding budget spreadsheet for tracking estimated costs, actual spending, and category-by-category financial visibility.",
    highlights: [
      "Excel-based budget planner",
      "Great companion to vendor tracking",
      "Useful standalone planning product"
    ],
    details: {
      size: "Single spreadsheet file",
      pages: "Workbook",
      format: "Excel spreadsheet",
      editable: "Yes. Customers can update every category, amount, and note directly in Excel.",
      printable: "Primarily designed for digital planning, with optional printing if desired.",
      includes: ["Budget categories", "Estimate and actual tracking", "Wedding finance planner"]
    }
  }),
  createProduct({
    slug: "wedding-vendor-tracker",
    name: "Wedding Vendor Tracker",
    subcategorySlug: "planning-budget",
    badge: "Planner Tool",
    price: 12,
    compareAt: 18,
    productType: "Editable Excel spreadsheet",
    summary:
      "A vendor tracker spreadsheet for organizing contacts, bookings, payment stages, and key wedding supplier details in one sheet.",
    highlights: [
      "Keeps vendor details organized",
      "Pairs naturally with the budget spreadsheet",
      "Helpful for planning workflows and coordination"
    ],
    details: {
      size: "Single spreadsheet file",
      pages: "Workbook",
      format: "Excel spreadsheet",
      editable: "Yes. Vendor names, payments, contact details, and notes can be updated in Excel.",
      printable: "Best used digitally, though printable if needed.",
      includes: ["Vendor list", "Contact tracking", "Payment and booking fields"]
    }
  }),
  createProduct({
    slug: "wedding-checklist-pdf",
    name: "Wedding Checklist PDF",
    subcategorySlug: "planning-budget",
    badge: "Planning Add-On",
    price: 9,
    compareAt: 14,
    productType: "Printable PDF checklist",
    summary:
      "A practical wedding planning checklist PDF for keeping key tasks visible from booking through final event prep.",
    highlights: [
      "Simple printable planning workflow",
      "Low-ticket planner add-on",
      "Good companion to spreadsheet bundles"
    ],
    details: {
      size: "Printable planning page",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF checklist; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for print and handwritten planning use.",
      includes: ["Planning checklist", "Task tracking layout", "Wedding prep workflow"]
    }
  }),
  createProduct({
    slug: "wedding-day-timeline-pdf",
    name: "Wedding Day Timeline PDF",
    subcategorySlug: "planning-budget",
    badge: "Day-Of Planner",
    price: 9,
    compareAt: 14,
    productType: "Printable PDF planner",
    summary:
      "A wedding day timeline PDF for mapping the ceremony schedule, vendor arrival flow, and event-day timing with clarity.",
    highlights: [
      "Great for ceremony-day coordination",
      "Supports planners, couples, and coordinators",
      "Strong planning-category add-on"
    ],
    details: {
      size: "Printable timeline page",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF planner; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for quick print reference on the wedding day.",
      includes: ["Timeline structure", "Schedule planning", "Event-day coordination page"]
    }
  }),
  createProduct({
    slug: "classic-wedding-invitation-template-pdf",
    name: "Classic Wedding Invitation Template PDF",
    subcategorySlug: "invitations-stationery",
    badge: "Classic Stationery",
    price: 12,
    compareAt: 18,
    productType: "Printable invitation PDF",
    summary:
      "A classic wedding invitation template PDF for couples who want a clean printable invitation alongside the more editable invitation offers.",
    highlights: [
      "Formal invitation layout",
      "Clear alternative to the fillable invitation product",
      "Good stationery-category anchor"
    ],
    details: {
      size: "Invitation-sized PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF invitation template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for digital delivery or print production.",
      includes: ["Invitation layout", "Wedding stationery design", "Printable PDF format"]
    }
  }),
  createProduct({
    slug: "wedding-planning-checklist-pdf",
    name: "Wedding Planning Checklist PDF",
    subcategorySlug: "planning-budget",
    badge: "Checklist Favorite",
    price: 9,
    compareAt: 14,
    productType: "Printable PDF checklist",
    summary:
      "A wedding planning checklist PDF with a simple structure for milestones, reminders, and wedding prep priorities.",
    highlights: [
      "Clean planning checklist format",
      "Works as a lightweight planning printable",
      "Good upsell from spreadsheet products"
    ],
    details: {
      size: "Printable checklist page",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF checklist; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Best suited for print and handwritten planning.",
      includes: ["Checklist layout", "Milestone tracking", "Wedding planning printable"]
    }
  }),
  createProduct({
    slug: "wedding-bar-menu-sign-pdf",
    name: "Wedding Bar Menu Sign PDF",
    subcategorySlug: "signs-day-of-details",
    badge: "Reception Sign",
    price: 10,
    compareAt: 15,
    productType: "Printable sign PDF",
    summary:
      "A printable bar menu sign for weddings and receptions that want a polished drinks display without custom design work.",
    highlights: [
      "Ideal for reception bar styling",
      "Fast day-of signage upsell",
      "Works well with welcome sign products"
    ],
    details: {
      size: "Sign PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF sign template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for print-shop or framed sign use.",
      includes: ["Bar menu sign", "Reception sign layout", "Printable event detail"]
    }
  }),
  createProduct({
    slug: "wedding-hashtag-sign-pdf",
    name: "Wedding Hashtag Sign PDF",
    subcategorySlug: "signs-day-of-details",
    badge: "Social Sign",
    price: 10,
    compareAt: 15,
    productType: "Printable sign PDF",
    summary:
      "A wedding hashtag sign PDF for couples who want a simple, stylish social-sharing prompt at their reception or photo area.",
    highlights: [
      "Useful social-sharing sign",
      "Small but effective signage add-on",
      "Fits photo booth and reception bundles"
    ],
    details: {
      size: "Sign PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF sign template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Ready for display printing.",
      includes: ["Hashtag sign", "Printable social prompt", "Reception signage page"]
    }
  }),
  createProduct({
    slug: "classic-wedding-menu-card-pdf",
    name: "Classic Wedding Menu Card PDF",
    subcategorySlug: "invitations-stationery",
    badge: "Reception Card",
    price: 9,
    compareAt: 14,
    productType: "Printable stationery PDF",
    summary:
      "A classic menu card PDF for reception tables, ideal for couples who want a printable menu option alongside the editable menu offer.",
    highlights: [
      "Reception table stationery",
      "Alternative to the editable menu card",
      "Easy low-ticket add-on"
    ],
    details: {
      size: "Menu card PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF menu card; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Intended for table place settings and reception styling.",
      includes: ["Menu card layout", "Printable stationery design", "Reception add-on"]
    }
  }),
  createProduct({
    slug: "wedding-photo-booth-props-pdf",
    name: "Wedding Photo Booth Props PDF",
    subcategorySlug: "showers-parties",
    badge: "Party Printable",
    price: 11,
    compareAt: 16,
    productType: "Printable party PDF",
    summary:
      "A fun wedding photo booth props PDF for receptions, showers, and party stations that need an easy interactive extra.",
    highlights: [
      "Great for receptions and bridal events",
      "Adds a playful party element",
      "Pairs well with hashtag signs and games"
    ],
    details: {
      size: "Printable prop sheets",
      pages: "1 PDF set",
      format: "Printable PDF",
      editable: "Delivered as a PDF party printable and typically used as-is.",
      printable: "Yes. Designed for print, cut, and event use.",
      includes: ["Photo booth prop sheet", "Reception activity printable", "Party extra"]
    }
  }),
  createProduct({
    slug: "classic-wedding-rsvp-card-pdf",
    name: "Classic Wedding RSVP Card PDF",
    subcategorySlug: "invitations-stationery",
    badge: "Stationery Core",
    price: 9,
    compareAt: 14,
    productType: "Printable stationery PDF",
    summary:
      "A classic RSVP card PDF for response collection, offered as a printable stationery option alongside the fillable RSVP version.",
    highlights: [
      "Classic RSVP stationery layout",
      "Low-ticket invitation-suite add-on",
      "Useful alternative to the fillable RSVP card"
    ],
    details: {
      size: "RSVP card PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF RSVP template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Built for digital delivery and print use.",
      includes: ["RSVP card design", "Printable response card", "Invitation suite add-on"]
    }
  }),
  createProduct({
    slug: "wedding-table-number-cards-pdf",
    name: "Wedding Table Number Cards PDF",
    subcategorySlug: "signs-day-of-details",
    badge: "Reception Favorite",
    price: 11,
    compareAt: 16,
    productType: "Printable card set PDF",
    summary:
      "A printable set of wedding table number cards for couples who want cohesive reception tables without extra design work.",
    highlights: [
      "Useful for reception table styling",
      "Pairs with seating charts and signs",
      "Strong day-of add-on product"
    ],
    details: {
      size: "Card set PDF",
      pages: "Multi-card PDF set",
      format: "Printable PDF",
      editable: "Delivered as a PDF card set; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for cutting or tabletop display.",
      includes: ["Table number cards", "Reception table printable", "Day-of styling set"]
    }
  }),
  createProduct({
    slug: "classic-thank-you-card-pdf",
    name: "Classic Thank You Card PDF",
    subcategorySlug: "invitations-stationery",
    badge: "Post-Wedding Add-On",
    price: 9,
    compareAt: 14,
    productType: "Printable stationery PDF",
    summary:
      "A printable thank you card PDF for post-wedding notes, offered as a classic stationery option for the wedding suite.",
    highlights: [
      "Simple post-wedding stationery product",
      "Easy add-on from invitation buyers",
      "Pairs well with RSVP and invitation products"
    ],
    details: {
      size: "Card PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF thank you card; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Suitable for digital delivery and card printing.",
      includes: ["Thank you card", "Printable stationery layout", "Wedding note design"]
    }
  }),
  createProduct({
    slug: "welcome-sign-pdf",
    name: "Welcome Sign PDF",
    subcategorySlug: "signs-day-of-details",
    badge: "Day-Of Classic",
    price: 12,
    compareAt: 18,
    productType: "Printable sign PDF",
    summary:
      "A printable welcome sign PDF for ceremony or reception entrances, designed to give the event a polished first impression.",
    highlights: [
      "Strong standalone sign product",
      "Works for entrance displays and receptions",
      "Natural companion to bar menu and table number products"
    ],
    details: {
      size: "Sign PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF sign template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Ready for signage printing and display.",
      includes: ["Welcome sign", "Entrance display printable", "Wedding signage page"]
    }
  })
];

export function getAllProducts() {
  return fallbackProducts;
}

export function getFeaturedProducts() {
  return fallbackProducts.filter((product) => product.isFeatured).slice(0, 3);
}

export function getProductBySlug(slug) {
  return fallbackProducts.find((product) => product.slug === slug) || null;
}
