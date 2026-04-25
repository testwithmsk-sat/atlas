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

function getStorefrontPrice(price, isBundle) {
  if (isBundle) return 10;

  if (price >= 13) return 5;
  if (price >= 11) return 4;
  if (price >= 10) return 3;
  if (price >= 9) return 2;
  return 1;
}

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
  const storefrontPrice = getStorefrontPrice(price, isBundle);

  return {
    slug,
    name,
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: weddingSubcategories[subcategorySlug],
    subcategorySlug,
    badge,
    priceLabel: normalizePriceLabel(storefrontPrice),
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
  }),
  createProduct({
    slug: "dusty-rose-gold-customer-guide-vol-2",
    name: "Customer Guide Vol. 2 - Dusty Rose & Gold",
    subcategorySlug: "planning-budget",
    badge: "Guide Vol. 2",
    price: 6,
    compareAt: 10,
    productType: "Customer guide PDF",
    summary:
      "A customer guide PDF for Wedding Bundle Vol. 2, designed to help buyers use the Dusty Rose & Gold collection with confidence.",
    highlights: [
      "Support guide for the Dusty Rose & Gold bundle",
      "Useful reference for premium wedding buyers",
      "Matches the Vol. 2 collection naming"
    ],
    details: {
      size: "Guide PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF guide and typically used as-is.",
      printable: "Yes. Suitable for digital reference or print.",
      includes: ["Customer guide", "Bundle usage reference", "Luxury collection support"]
    }
  }),
  createProduct({
    slug: "wedding-bundle-vol-2-dusty-rose-gold",
    name: "Wedding Bundle Vol. 2 - Dusty Rose & Gold Collection",
    subcategorySlug: "invitations-stationery",
    badge: "Bundle Vol. 2",
    price: 59,
    compareAt: 89,
    productType: "Dusty Rose wedding PDF bundle",
    summary:
      "A romantic Dusty Rose & Gold wedding bundle with invitation, timeline, seating, vows, guest planning, and post-wedding organization templates in one polished collection.",
    highlights: [
      "10 templates plus the customer guide included",
      "A different collection from Vol. 1 with 6 brand-new template types",
      "Dusty Rose & Gold palette with elegant wedding styling",
      "Great standalone bundle or part of a future mega-bundle"
    ],
    details: {
      size: "Mixed stationery and planner PDF sizes",
      pages: "10 templates plus customer guide",
      format: "ZIP download with printable PDF files",
      editable: "Delivered as PDF templates; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for digital delivery and luxury print output.",
      includes: [
        "Luxury Wedding Invitation",
        "Wedding Day Timeline",
        "Table Seating Planner",
        "Wedding Vows Card",
        "Guest Book Sign-In Sheet",
        "Vendor Contact Sheet",
        "Rehearsal Dinner Invitation",
        "Gift Registry Card",
        "Post-Wedding Thank You Tracker",
        "Honeymoon Packing List"
      ]
    },
    bundleContents: [
      "00 Customer Guide",
      "01 Luxury Wedding Invitation",
      "02 Wedding Day Timeline",
      "03 Table Seating Planner",
      "04 Wedding Vows Card",
      "05 Guest Book Sign-In Sheet",
      "06 Vendor Contact Sheet",
      "07 Rehearsal Dinner Invitation",
      "08 Gift Registry Card",
      "09 Post-Wedding Thank You Tracker",
      "10 Honeymoon Packing List"
    ],
    isBundle: true,
    isBestSeller: true
  }),
  createProduct({
    slug: "luxury-wedding-invitation-pdf-vol-2",
    name: "Luxury Wedding Invitation PDF Vol. 2",
    subcategorySlug: "invitations-stationery",
    badge: "Stationery Vol. 2",
    price: 12,
    compareAt: 19,
    productType: "Printable invitation PDF",
    summary:
      "A luxury wedding invitation from the Dusty Rose & Gold collection with a romantic premium style for formal wedding stationery.",
    highlights: [
      "Dusty Rose & Gold invitation style",
      "Formal premium stationery layout",
      "Vol. 2 invitation listing"
    ],
    details: {
      size: "Invitation-sized PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF invitation template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Built for digital delivery and premium print production.",
      includes: ["Invitation layout", "Dusty Rose & Gold design", "Printable wedding stationery"]
    }
  }),
  createProduct({
    slug: "wedding-day-timeline-pdf-vol-2",
    name: "Wedding Day Timeline PDF Vol. 2",
    subcategorySlug: "planning-budget",
    badge: "Planner Vol. 2",
    price: 12,
    compareAt: 18,
    productType: "Printable timeline PDF",
    summary:
      "A full-letter wedding day timeline PDF from the Dusty Rose & Gold collection for organizing the ceremony and event flow.",
    highlights: [
      "Full letter planning layout",
      "Useful for wedding-day coordination",
      "Vol. 2 planning printable"
    ],
    details: {
      size: "Full letter",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF planner; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Intended for printed planning reference.",
      includes: ["Wedding timeline", "Schedule planning", "Day-of coordination printable"]
    }
  }),
  createProduct({
    slug: "table-seating-planner-pdf-vol-2",
    name: "Table Seating Planner PDF Vol. 2",
    subcategorySlug: "signs-day-of-details",
    badge: "Seating Vol. 2",
    price: 11,
    compareAt: 16,
    productType: "Printable seating PDF",
    summary:
      "A table seating planner PDF from the Dusty Rose & Gold collection with nine table blocks for organizing reception seating clearly.",
    highlights: [
      "Nine table blocks",
      "Great reception organization tool",
      "Vol. 2 seating product"
    ],
    details: {
      size: "Planner PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF seating planner; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Intended for planning and seating reference use.",
      includes: ["Table seating planner", "Reception table layout", "Wedding organization printable"]
    }
  }),
  createProduct({
    slug: "wedding-vows-card-pdf-vol-2",
    name: "Wedding Vows Card PDF Vol. 2",
    subcategorySlug: "invitations-stationery",
    badge: "Vows Vol. 2",
    price: 10,
    compareAt: 15,
    productType: "Printable vows PDF",
    summary:
      "A wedding vows card PDF from the Dusty Rose & Gold collection with two A5 pages, one for each partner.",
    highlights: [
      "Two-page vows card set",
      "A5 layout for both partners",
      "Unique romantic product in Vol. 2"
    ],
    details: {
      size: "A5, 2 pages",
      pages: "2 PDF pages",
      format: "Printable PDF",
      editable: "Delivered as a PDF vows card; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for ceremony keepsakes and vow reading.",
      includes: ["Two vows card pages", "Partner vow layout", "Ceremony stationery printable"]
    }
  }),
  createProduct({
    slug: "guest-book-sign-in-sheet-pdf-vol-2",
    name: "Guest Book Sign-In Sheet PDF Vol. 2",
    subcategorySlug: "planning-budget",
    badge: "Guest Sheet Vol. 2",
    price: 11,
    compareAt: 16,
    productType: "Printable sign-in PDF",
    summary:
      "A guest book sign-in sheet PDF from the Dusty Rose & Gold collection with room for ten guest rows.",
    highlights: [
      "10 guest rows",
      "Useful reception and welcome-area printable",
      "Vol. 2 guest sign-in product"
    ],
    details: {
      size: "Sign-in sheet PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF sign-in sheet; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for guest book or welcome table use.",
      includes: ["Guest sign-in rows", "Reception sign-in sheet", "Wedding guest printable"]
    }
  }),
  createProduct({
    slug: "vendor-contact-sheet-pdf-vol-2",
    name: "Vendor Contact Sheet PDF Vol. 2",
    subcategorySlug: "planning-budget",
    badge: "Vendor Sheet Vol. 2",
    price: 11,
    compareAt: 16,
    productType: "Printable vendor PDF",
    summary:
      "A vendor contact sheet PDF from the Dusty Rose & Gold collection with space for twelve vendor categories.",
    highlights: [
      "12 vendor categories",
      "Useful for wedding planning and coordination",
      "Vol. 2 planning printable"
    ],
    details: {
      size: "Planning PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF vendor sheet; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Intended for planning binders and vendor reference.",
      includes: ["Vendor contact layout", "12 vendor slots", "Wedding planning printable"]
    }
  }),
  createProduct({
    slug: "rehearsal-dinner-invitation-pdf-vol-2",
    name: "Rehearsal Dinner Invitation PDF Vol. 2",
    subcategorySlug: "invitations-stationery",
    badge: "Dinner Invite Vol. 2",
    price: 10,
    compareAt: 15,
    productType: "Printable invitation PDF",
    summary:
      "A rehearsal dinner invitation PDF from the Dusty Rose & Gold collection in a romantic 5x7 format.",
    highlights: [
      "5x7 rehearsal dinner invitation",
      "Useful pre-wedding event add-on",
      "Vol. 2 invitation suite product"
    ],
    details: {
      size: "5 x 7 inches",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF invitation template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for digital delivery and print use.",
      includes: ["Rehearsal dinner invitation", "Event stationery layout", "Printable invitation add-on"]
    }
  }),
  createProduct({
    slug: "gift-registry-card-pdf-vol-2",
    name: "Gift Registry Card PDF Vol. 2",
    subcategorySlug: "invitations-stationery",
    badge: "Registry Vol. 2",
    price: 9,
    compareAt: 14,
    productType: "Printable stationery PDF",
    summary:
      "A gift registry card PDF from the Dusty Rose & Gold collection in a business-card format for elegant invitation suite inserts.",
    highlights: [
      "Business card size",
      "Perfect invitation-suite insert",
      "Vol. 2 stationery add-on"
    ],
    details: {
      size: "Business card size",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF registry card; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for invitation suite printing.",
      includes: ["Gift registry card", "Small-format insert", "Printable stationery add-on"]
    }
  }),
  createProduct({
    slug: "post-wedding-thank-you-tracker-pdf-vol-2",
    name: "Post-Wedding Thank You Tracker PDF Vol. 2",
    subcategorySlug: "planning-budget",
    badge: "Tracker Vol. 2",
    price: 10,
    compareAt: 15,
    productType: "Printable tracker PDF",
    summary:
      "A post-wedding thank you tracker PDF from the Dusty Rose & Gold collection with 18 rows and checkboxes for gift follow-up.",
    highlights: [
      "18 rows plus checkboxes",
      "Perfect post-wedding admin product",
      "Pairs naturally with registry and gift planning"
    ],
    details: {
      size: "Tracker PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF tracker; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Great for post-wedding organization.",
      includes: ["Thank you tracker", "Gift follow-up sheet", "Post-wedding planning printable"]
    }
  }),
  createProduct({
    slug: "honeymoon-packing-list-pdf-vol-2",
    name: "Honeymoon Packing List PDF Vol. 2",
    subcategorySlug: "planning-budget",
    badge: "Packing Vol. 2",
    price: 10,
    compareAt: 16,
    productType: "Printable checklist PDF",
    summary:
      "A honeymoon packing list PDF from the Dusty Rose & Gold collection with a practical two-column checklist layout.",
    highlights: [
      "Two-column checklist",
      "Useful travel and post-wedding planning printable",
      "Vol. 2 honeymoon add-on"
    ],
    details: {
      size: "Checklist PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF checklist; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for travel prep and planning use.",
      includes: ["Packing checklist", "Honeymoon planning sheet", "Travel prep printable"]
    }
  }),
  createProduct({
    slug: "midnight-ivory-gold-customer-guide-vol-3",
    name: "Customer Guide Vol. 3 - Midnight, Ivory & Gold",
    subcategorySlug: "planning-budget",
    badge: "Guide Vol. 3",
    price: 6,
    compareAt: 10,
    productType: "Customer guide PDF",
    summary:
      "A customer guide PDF for Wedding Bundle Vol. 3, created to help buyers use the Midnight, Ivory & Gold luxury collection confidently.",
    highlights: [
      "Support guide for the luxury Vol. 3 collection",
      "Matches the premium midnight gold bundle naming",
      "Useful for bundle and individual file buyers"
    ],
    details: {
      size: "Guide PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF guide and typically used as-is.",
      printable: "Yes. Suitable for digital reference or print.",
      includes: ["Customer guide", "Bundle usage reference", "Luxury collection support"]
    }
  }),
  createProduct({
    slug: "wedding-bundle-vol-3-midnight-ivory-gold",
    name: "Wedding Bundle Vol. 3 - Midnight, Ivory & Gold Luxury Collection",
    subcategorySlug: "invitations-stationery",
    badge: "Bundle Vol. 3",
    price: 79,
    compareAt: 119,
    productType: "Luxury wedding PDF bundle",
    summary:
      "A dramatic Midnight, Ivory & Gold luxury wedding bundle with Art Deco-inspired stationery and premium planning templates for high-end wedding buyers.",
    highlights: [
      "10 luxury templates plus the customer guide",
      "Most premium bundle in the catalog",
      "Midnight black, ivory, and gold luxury styling",
      "Great premium upsell above the other wedding bundles"
    ],
    details: {
      size: "Mixed premium stationery and planner PDF sizes",
      pages: "10 templates plus customer guide",
      format: "ZIP download with printable PDF files",
      editable: "Delivered as PDF templates; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for digital delivery and luxury print output.",
      includes: [
        "Black Tie Wedding Invitation",
        "Luxury Ceremony Programme",
        "Estate Dinner Menu Card",
        "Wedding Speech Planner",
        "Premium Gift Tracking Ledger",
        "Luxury RSVP Card",
        "Floral Decor Brief",
        "Music And Entertainment Planner",
        "Pre-Wedding Beauty Countdown",
        "Wedding Weekend Itinerary"
      ]
    },
    bundleContents: [
      "00 Customer Guide",
      "01 Black Tie Wedding Invitation",
      "02 Luxury Ceremony Programme",
      "03 Estate Dinner Menu Card",
      "04 Wedding Speech Planner",
      "05 Premium Gift Tracking Ledger",
      "06 Luxury RSVP Card",
      "07 Floral Decor Brief",
      "08 Music Entertainment Planner",
      "09 PreWedding Beauty Countdown",
      "10 Wedding Weekend Itinerary"
    ],
    isBundle: true,
    isBestSeller: true
  }),
  createProduct({
    slug: "black-tie-wedding-invitation-pdf-vol-3",
    name: "Black-Tie Wedding Invitation PDF Vol. 3",
    subcategorySlug: "invitations-stationery",
    badge: "Luxury Vol. 3",
    price: 13,
    compareAt: 19,
    productType: "Printable invitation PDF",
    summary:
      "A black-tie wedding invitation PDF from the Midnight, Ivory & Gold luxury collection with a formal Art Deco-inspired feel.",
    highlights: [
      "Formal black-tie invitation design",
      "Premium luxury stationery product",
      "Vol. 3 invitation listing"
    ],
    details: {
      size: "Invitation-sized PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF invitation template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Built for digital delivery and luxury print production.",
      includes: ["Invitation layout", "Black-tie luxury design", "Printable wedding stationery"]
    }
  }),
  createProduct({
    slug: "luxury-ceremony-programme-pdf-vol-3",
    name: "Luxury Ceremony Programme PDF Vol. 3",
    subcategorySlug: "invitations-stationery",
    badge: "Programme Vol. 3",
    price: 12,
    compareAt: 18,
    productType: "Printable ceremony PDF",
    summary:
      "A luxury ceremony programme PDF from the Midnight, Ivory & Gold collection with a premium formal presentation.",
    highlights: [
      "Luxury ceremony programme layout",
      "Premium stationery companion to the black-tie invitation",
      "Vol. 3 ceremony printable"
    ],
    details: {
      size: "Programme PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF programme template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Intended for ceremony printing and premium wedding stationery use.",
      includes: ["Ceremony programme", "Order-of-service layout", "Luxury wedding printable"]
    }
  }),
  createProduct({
    slug: "estate-dinner-menu-card-pdf-vol-3",
    name: "Estate Dinner Menu Card PDF Vol. 3",
    subcategorySlug: "invitations-stationery",
    badge: "Reception Vol. 3",
    price: 11,
    compareAt: 16,
    productType: "Printable menu PDF",
    summary:
      "An estate dinner menu card PDF from the Midnight, Ivory & Gold collection designed for elevated reception table settings.",
    highlights: [
      "Tall estate menu layout",
      "Luxury reception stationery product",
      "Vol. 3 dinner menu add-on"
    ],
    details: {
      size: "Menu card PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF menu card; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for elegant reception table styling.",
      includes: ["Dinner menu card", "Reception table printable", "Luxury stationery add-on"]
    }
  }),
  createProduct({
    slug: "wedding-speech-planner-pdf-vol-3",
    name: "Wedding Speech Planner PDF Vol. 3",
    subcategorySlug: "planning-budget",
    badge: "Planner Vol. 3",
    price: 11,
    compareAt: 16,
    productType: "Printable planner PDF",
    summary:
      "A wedding speech planner PDF from the Midnight, Ivory & Gold collection for organizing reception speakers and key talking points.",
    highlights: [
      "Luxury planning add-on",
      "Useful for reception speech coordination",
      "Vol. 3 planner printable"
    ],
    details: {
      size: "Planner PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF planner; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Suitable for printed planning reference.",
      includes: ["Speech planning layout", "Speaker organization", "Reception coordination page"]
    }
  }),
  createProduct({
    slug: "premium-gift-tracking-ledger-pdf-vol-3",
    name: "Premium Gift Tracking Ledger PDF Vol. 3",
    subcategorySlug: "planning-budget",
    badge: "Ledger Vol. 3",
    price: 11,
    compareAt: 16,
    productType: "Printable ledger PDF",
    summary:
      "A premium gift tracking ledger PDF from the Midnight, Ivory & Gold collection for organized post-wedding follow-up.",
    highlights: [
      "20-row ledger style product",
      "Useful post-wedding admin printable",
      "Vol. 3 premium tracking tool"
    ],
    details: {
      size: "Ledger PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF ledger; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Best suited for printed gift tracking and recordkeeping.",
      includes: ["Gift tracking ledger", "Thank-you follow-up support", "Wedding organization printable"]
    }
  }),
  createProduct({
    slug: "luxury-rsvp-card-pdf-vol-3",
    name: "Luxury RSVP Card PDF Vol. 3",
    subcategorySlug: "invitations-stationery",
    badge: "RSVP Vol. 3",
    price: 10,
    compareAt: 15,
    productType: "Printable RSVP PDF",
    summary:
      "A luxury RSVP card PDF from the Midnight, Ivory & Gold collection for formal invitation suites.",
    highlights: [
      "Luxury response card styling",
      "Invitation suite upsell",
      "Vol. 3 RSVP listing"
    ],
    details: {
      size: "RSVP card PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF RSVP template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for formal invitation printing.",
      includes: ["RSVP card layout", "Luxury response card design", "Printable suite add-on"]
    }
  }),
  createProduct({
    slug: "floral-decor-brief-pdf-vol-3",
    name: "Floral Decor Brief PDF Vol. 3",
    subcategorySlug: "planning-budget",
    badge: "Decor Vol. 3",
    price: 11,
    compareAt: 16,
    productType: "Printable planning PDF",
    summary:
      "A floral decor brief PDF from the Midnight, Ivory & Gold collection for handing a polished creative brief to florists and stylists.",
    highlights: [
      "Luxury decor planning tool",
      "Useful for styling conversations and florals",
      "Vol. 3 design-planning printable"
    ],
    details: {
      size: "Planner PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF brief; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for planning meetings and decor reference.",
      includes: ["Floral brief layout", "Decor planning prompts", "Wedding styling printable"]
    }
  }),
  createProduct({
    slug: "music-entertainment-planner-pdf-vol-3",
    name: "Music & Entertainment Planner PDF Vol. 3",
    subcategorySlug: "planning-budget",
    badge: "Music Vol. 3",
    price: 11,
    compareAt: 16,
    productType: "Printable planner PDF",
    summary:
      "A music and entertainment planner PDF from the Midnight, Ivory & Gold collection for organizing every ceremony and reception song moment.",
    highlights: [
      "Luxury entertainment planning tool",
      "Supports ceremony and reception coordination",
      "Vol. 3 planning add-on"
    ],
    details: {
      size: "Planner PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF planner; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Intended for wedding planning and vendor reference.",
      includes: ["Music planning page", "Entertainment coordination", "Wedding schedule support"]
    }
  }),
  createProduct({
    slug: "prewedding-beauty-countdown-pdf-vol-3",
    name: "Pre-Wedding Beauty Countdown PDF Vol. 3",
    subcategorySlug: "planning-budget",
    badge: "Beauty Vol. 3",
    price: 10,
    compareAt: 15,
    productType: "Printable countdown PDF",
    summary:
      "A pre-wedding beauty countdown PDF from the Midnight, Ivory & Gold collection for organizing glow-up milestones before the big day.",
    highlights: [
      "Luxury bridal prep printable",
      "Useful for pre-wedding prep",
      "Vol. 3 beauty planning product"
    ],
    details: {
      size: "Countdown planner PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF planner; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for personal planning and checklist use.",
      includes: ["Beauty countdown", "Appointment planning", "Pre-wedding prep workflow"]
    }
  }),
  createProduct({
    slug: "wedding-weekend-itinerary-pdf-vol-3",
    name: "Wedding Weekend Itinerary PDF Vol. 3",
    subcategorySlug: "planning-budget",
    badge: "Weekend Vol. 3",
    price: 12,
    compareAt: 18,
    productType: "Printable itinerary PDF",
    summary:
      "A wedding weekend itinerary PDF from the Midnight, Ivory & Gold collection for mapping Friday rehearsal events and the full wedding day schedule.",
    highlights: [
      "Premium multi-day wedding planner",
      "Useful for rehearsal and guest events",
      "Vol. 3 itinerary listing"
    ],
    details: {
      size: "Itinerary PDF",
      pages: "1 PDF",
      format: "Printable PDF",
      editable: "Delivered as a PDF itinerary template; customization depends on the customer's PDF editing workflow.",
      printable: "Yes. Designed for digital delivery or printed weekend schedules.",
      includes: ["Weekend itinerary layout", "Guest event schedule", "Multi-day wedding planner"]
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
