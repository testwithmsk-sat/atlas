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
