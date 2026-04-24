import { normalizePriceLabel } from "@/lib/currency";

const categoryImages = {
  wedding: "/products/wedding-invitation-template-bundle.svg",
  "events-parties": "/products/bridal-shower-games-bundle.svg",
  business: "/products/budget-wedding-planner-bundle.svg",
  "planners-productivity": "/products/budget-wedding-planner-bundle.svg",
  "career-education": "/products/wedding-signs-bundle.svg",
  "social-content": "/products/bridal-shower-games-bundle.svg",
  "creative-assets": "/products/wedding-signs-bundle.svg",
  "templates-documents": "/products/budget-wedding-planner-bundle.svg"
};

const liveImportedProductSlugs = new Set([
  "budget-bride-botanical-rsvp-card",
  "budget-bride-botanical-save-the-date",
  "budget-bride-botanical-thank-you-card",
  "budget-bride-rose-details-card",
  "budget-bride-minimal-thank-you-card",
  "budget-bride-burgundy-rsvp-card",
  "budget-bride-burgundy-save-the-date",
  "budget-bride-burgundy-details-card",
  "budget-bride-burgundy-thank-you-card"
]);

function createProduct({
  slug,
  name,
  category,
  categorySlug,
  subcategory,
  subcategorySlug,
  badge,
  priceLabel,
  summary,
  highlights,
  productType,
  image,
  isPurchasable = false,
  status
}) {
  return {
    slug,
    name,
    category,
    categorySlug,
    subcategory,
    subcategorySlug,
    badge,
    priceLabel: normalizePriceLabel(priceLabel),
    status: status || (isPurchasable ? "Digital download" : "Coming soon"),
    productType,
    summary,
    image: image || categoryImages[categorySlug] || categoryImages.wedding,
    highlights,
    isPurchasable
  };
}

const pdfImportedProducts = [
  ...[
    ["budget-bride-botanical-invitation-template", "Budget Bride Botanical Invitation Template", "wedding", "Invitations & Stationery", "Wedding invitation template", "/products/pdf/wedding-budget-1/page-01.png", "A botanical wedding invitation with formal serif styling and a timeless ivory stationery look.", "$6.99"],
    ["budget-bride-botanical-rsvp-card", "Budget Bride Botanical RSVP Card", "wedding", "Invitations & Stationery", "RSVP card template", "/products/added/budget-bride-botanical-rsvp-card.svg", "A matching RSVP card with meal choices and classic botanical wedding styling.", "$3.49"],
    ["budget-bride-botanical-details-card", "Budget Bride Botanical Details Card", "wedding", "Invitations & Stationery", "Details card template", "/products/pdf/wedding-budget-1/page-03.png", "A coordinated wedding details card for accommodations, transport, and event notes.", "$3.49"],
    ["budget-bride-botanical-save-the-date", "Budget Bride Botanical Save The Date", "wedding", "Invitations & Stationery", "Save the date template", "/products/added/budget-bride-botanical-save-the-date.svg", "A botanical save-the-date design with classic wedding announcement styling.", "$4.99"],
    ["budget-bride-botanical-welcome-sign", "Budget Bride Botanical Welcome Sign", "wedding", "Signs & Day-Of Details", "Wedding welcome sign", "/products/pdf/wedding-budget-1/page-05.png", "A wedding welcome sign designed to coordinate with a classic botanical stationery suite.", "$5.99"],
    ["budget-bride-botanical-seating-chart", "Budget Bride Botanical Seating Chart", "wedding", "Signs & Day-Of Details", "Seating chart template", "/products/pdf/wedding-budget-1/page-06.png", "A botanical seating chart layout for elegant wedding guest display.", "$6.99"],
    ["budget-bride-botanical-table-number", "Budget Bride Botanical Table Number", "wedding", "Signs & Day-Of Details", "Table number template", "/products/pdf/wedding-budget-1/page-07.png", "A simple coordinated table number design for classic wedding tablescapes.", "$3.99"],
    ["budget-bride-botanical-planning-checklist", "Budget Bride Botanical Planning Checklist", "wedding", "Planning & Budget", "Wedding planner page", "/products/pdf/wedding-budget-1/page-08.png", "A wedding planning checklist page with botanical detailing and structured task tracking.", "$5.99"],
    ["budget-bride-botanical-budget-planner", "Budget Bride Botanical Budget Planner", "wedding", "Planning & Budget", "Wedding budget planner", "/products/pdf/wedding-budget-1/page-09.png", "A botanical wedding budget planner page for estimated and actual cost tracking.", "$5.99"],
    ["budget-bride-botanical-bridal-shower-bingo", "budget Bride Botanical Bridal Shower Bingo", "wedding", "Showers & Parties", "Bridal shower game", "/products/pdf/wedding-budget-1/page-10.png", "A botanical bridal shower bingo sheet for printable celebration games.", "$2.99"],
    ["budget-bride-botanical-bachelorette-itinerary", "Budget Bride Botanical Bachelorette Itinerary", "wedding", "Showers & Parties", "Bachelorette itinerary", "/products/pdf/wedding-budget-1/page-11.png", "A botanical bachelorette itinerary page for organizing a celebration weekend.", "$4.49"],
    ["budget-bride-botanical-thank-you-card", "Budget Bride Botanical Thank You Card", "wedding", "Invitations & Stationery", "Thank you card template", "/products/added/budget-bride-botanical-thank-you-card.svg", "A coordinating thank you card for post-wedding notes in the botanical collection.", "$3.49"],

    ["budget-bride-rose-invitation-template", "Budget Bride Rose Invitation Template", "wedding", "Invitations & Stationery", "Wedding invitation template", "/products/pdf/wedding-budget-2/page-01.png", "A romantic rose-framed invitation design with soft floral styling and modern script lettering.", "$6.99"],
    ["budget-bride-rose-rsvp-card", "Budget Bride Rose RSVP Card", "wedding", "Invitations & Stationery", "RSVP card template", "/products/pdf/wedding-budget-2/page-02.png", "A floral RSVP card with simple response options and a soft wedding palette.", "$3.49"],
    ["budget-bride-rose-details-card", "Budget Bride Rose Details Card", "wedding", "Invitations & Stationery", "Details card template", "/products/added/budget-bride-rose-details-card.svg", "A floral wedding details card for accommodations, dress code, and event notes.", "$3.49"],
    ["budget-bride-blush-save-the-date", "Budget Bride Blush Save The Date", "wedding", "Invitations & Stationery", "Save the date template", "/products/pdf/wedding-budget-2/page-04.png", "A blush-toned save-the-date card with soft geometric framing and elegant wedding styling.", "$4.99"],
    ["budget-bride-rustic-floral-welcome-sign", "Budget Bride Rustic Floral Welcome Sign", "wedding", "Signs & Day-Of Details", "Wedding welcome sign", "/products/pdf/wedding-budget-2/page-05.png", "A rustic floral welcome sign with dark wood texture and soft white botanical accents.", "$6.49"],
    ["budget-bride-art-deco-seating-chart", "Budget Bride Art Deco Seating Chart", "wedding", "Signs & Day-Of Details", "Seating chart template", "/products/pdf/wedding-budget-2/page-06.png", "A seating chart with a clean art-deco inspired frame and elegant guest layout.", "$6.99"],
    ["budget-bride-blue-table-number", "Budget Bride Blue Table Number", "wedding", "Signs & Day-Of Details", "Table number template", "/products/pdf/wedding-budget-2/page-07.png", "A blue and gold table number card for elevated wedding table styling.", "$3.99"],
    ["budget-bride-minimal-planning-checklist", "Budget Bride Minimal Planning Checklist", "wedding", "Planning & Budget", "Wedding planner page", "/products/pdf/wedding-budget-2/page-08.png", "A minimal wedding planning checklist with a clean editorial organization style.", "$5.99"],
    ["budget-bride-minimal-budget-planner", "Budget Bride Minimal Budget Planner", "wedding", "Planning & Budget", "Wedding budget planner", "/products/pdf/wedding-budget-2/page-09.png", "A clean budget planning page for tracking wedding categories, estimates, and actual spending.", "$5.99"],
    ["budget-bride-lavender-bridal-shower-bingo", "Budget Bride Lavender Bridal Shower Bingo", "wedding", "Showers & Parties", "Bridal shower game", "/products/pdf/wedding-budget-2/page-10.png", "A lavender bridal shower bingo sheet with a soft celebratory floral border.", "$2.99"],
    ["budget-bride-pink-bachelorette-itinerary", "Budget Bride Pink Bachelorette Itinerary", "wedding", "Showers & Parties", "Bachelorette itinerary", "/products/pdf/wedding-budget-2/page-11.png", "A pink bachelorette itinerary with a playful but polished celebration layout.", "$4.49"],
    ["budget-bride-minimal-thank-you-card", "Budget Bride Minimal Thank You Card", "wedding", "Invitations & Stationery", "Thank you card template", "/products/added/budget-bride-minimal-thank-you-card.svg", "A soft minimal thank you card with delicate wedding stationery styling.", "$3.49"],

    ["budget-bride-burgundy-welcome-sign", "Budget Bride Burgundy Welcome Sign", "wedding", "Signs & Day-Of Details", "Wedding welcome sign", "/products/pdf/wedding-budget-3/page-01.png", "A burgundy welcome sign with gold lettering and floral corner details for a dramatic wedding entrance.", "$6.49"],
    ["budget-bride-burgundy-rsvp-card", "Budget Bride Burgundy RSVP Card", "wedding", "Invitations & Stationery", "RSVP card template", "/products/added/budget-bride-burgundy-rsvp-card.svg", "A dark romantic RSVP card with menu options and gold-accent styling.", "$3.49"],
    ["budget-bride-burgundy-save-the-date", "Budget Bride Burgundy Save The Date", "wedding", "Invitations & Stationery", "Save the date template", "/products/added/budget-bride-burgundy-save-the-date.svg", "A burgundy save-the-date card with a dramatic formal wedding look.", "$4.99"],
    ["budget-bride-burgundy-details-card", "Budget Bride Burgundy Details Card", "wedding", "Invitations & Stationery", "Details card template", "/products/added/budget-bride-burgundy-details-card.svg", "A matching burgundy details card with transportation and additional wedding information.", "$3.49"],
    ["budget-bride-burgundy-seating-chart", "Budget Bride Burgundy Seating Chart", "wedding", "Signs & Day-Of Details", "Seating chart template", "/products/pdf/wedding-budget-3/page-06.png", "A burgundy wedding seating chart designed for a romantic evening reception aesthetic.", "$6.99"],
    ["budget-bride-burgundy-table-number-set", "Budget Bride Burgundy Table Number Set", "wedding", "Signs & Day-Of Details", "Table number collection", "/products/pdf/wedding-budget-3/page-07.png", "A coordinating burgundy table number collection for formal wedding tables.", "$4.49"],
    ["budget-bride-burgundy-planning-checklist", "Budget Bride Burgundy Planning Checklist", "wedding", "Planning & Budget", "Wedding planner page", "/products/pdf/wedding-budget-3/page-08.png", "A burgundy planning checklist for couples who want a richer, formal wedding planning style.", "$5.99"],
    ["budget-bride-burgundy-budget-planner", "Budget Bride Burgundy Budget Planner", "wedding", "Planning & Budget", "Wedding budget planner", "/products/pdf/wedding-budget-3/page-09.png", "A burgundy wedding budget planner page with a formal event-inspired look.", "$5.99"],
    ["budget-bride-burgundy-bridal-shower-bingo", "Budget Bride Burgundy Bridal Shower Bingo", "wedding", "Showers & Parties", "Bridal shower game", "/products/pdf/wedding-budget-3/page-10.png", "A dark romantic bridal shower bingo sheet for themed celebration events.", "$2.99"],
    ["budget-bride-burgundy-bachelorette-itinerary", "Budget Bride Burgundy Bachelorette Itinerary", "wedding", "Showers & Parties", "Bachelorette itinerary", "/products/pdf/wedding-budget-3/page-11.png", "A burgundy bachelorette itinerary for a more dramatic celebration aesthetic.", "$4.49"],
    ["budget-bride-burgundy-thank-you-card", "Budget Bride Burgundy Thank You Card", "wedding", "Invitations & Stationery", "Thank you card template", "/products/added/budget-bride-burgundy-thank-you-card.svg", "A matching burgundy thank you card with rich formal styling.", "$3.49"],

    ["budget-events-baby-shower-bingo", "Budget Events Baby Shower Bingo", "events-parties", "Games & Activities", "Baby shower game", "/products/pdf/events-1/page-02.png", "A baby shower bingo sheet designed for printable party play and easy guest participation.", "$3.49"],
    ["budget-events-birthday-party-invitation", "Budget Events Birthday Party Invitation", "events-parties", "Party Invitations", "Birthday invitation", "/products/pdf/events-1/page-03.png", "A birthday invitation template with bold party styling and editable celebration details.", "$4.99"],
    ["budget-events-party-welcome-sign", "Budget Events Party Welcome Sign", "events-parties", "Signs & Decor", "Party welcome sign", "/products/pdf/events-1/page-04.png", "A welcome sign for birthdays and celebration events with dramatic party styling.", "$5.99"],
    ["budget-events-party-game-card", "Budget Events Party Game Card", "events-parties", "Games & Activities", "Printable game", "/products/pdf/events-1/page-05.png", "A printable party game card layout for group activities and celebration prompts.", "$2.99"],
    ["budget-events-party-decor-sign", "Budget Events Party Decor Sign", "events-parties", "Signs & Decor", "Decor sign", "/products/pdf/events-1/page-06.png", "A party decor sign template for birthday or event table displays.", "$4.49"],
    ["budget-events-planning-checklist", "Budget Events Planning Checklist", "events-parties", "Signs & Decor", "Event planner", "/products/pdf/events-1/page-07.png", "An event planning checklist page for food, decor, setup, and guest organization.", "$4.99"],
    ["budget-events-menu-card", "Budget Events Menu Card", "events-parties", "Signs & Decor", "Menu card", "/products/pdf/events-1/page-08.png", "A printable event menu card for food and drink display at parties and celebrations.", "$3.49"],
    ["budget-events-favor-tags", "Budget Events Favor Tags", "events-parties", "Signs & Decor", "Favor tag set", "/products/pdf/events-1/page-09.png", "A printable favor tag sheet for attaching thank-you tags to party gifts and bags.", "$3.49"],
    ["budget-events-photo-booth-sign", "Budget Events Photo Booth Sign", "events-parties", "Signs & Decor", "Photo booth sign", "/products/pdf/events-1/page-10.png", "A photo booth sign for parties and event selfie stations.", "$4.49"],
    ["budget-events-itinerary", "Budget Events Itinerary", "events-parties", "Signs & Decor", "Event itinerary", "/products/pdf/events-1/page-11.png", "An event itinerary page for organizing a full party or celebration schedule.", "$4.99"],

    ["budget-business-invoice-template-blue", "Budget Business Invoice Template Blue", "business", "Client Documents", "Invoice template", "/products/pdf/business-1/page-01.png", "A clean blue invoice template with professional billing, payment notes, and totals.", "$9.99"],
    ["budget-business-project-proposal", "Budget Business Project Proposal", "business", "Client Documents", "Proposal template", "/products/pdf/business-1/page-02.png", "A structured project proposal template with scope, deliverables, timeline, and pricing.", "$14.99"],
    ["budget-business-service-agreement", "Budget Business Service Agreement", "business", "Client Documents", "Contract template", "/products/pdf/business-1/page-03.png", "A service agreement template for formalizing client work and payment terms.", "$12.99"],
    ["budget-business-client-welcome-guide", "Budget Business Client Welcome Guide", "business", "Client Documents", "Client welcome guide", "/products/pdf/business-1/page-04.png", "A multi-page client welcome guide for premium onboarding and service presentation.", "$16.99"],
    ["budget-business-brand-kit", "Budget Business Brand Kit", "business", "Marketing & Sales", "Brand kit", "/products/pdf/business-1/page-05.png", "A business brand kit template for logos, colors, typography, imagery, and visual systems.", "$14.99"],
    ["budget-business-media-kit", "Budget Business Media Kit", "business", "Marketing & Sales", "Media kit", "/products/pdf/business-1/page-06.png", "A media kit template for creators and businesses presenting audience, services, and brand details.", "$15.99"],
    ["budget-business-promotional-flyer", "Budget Business Promotional Flyer", "business", "Marketing & Sales", "Promotional flyer", "/products/pdf/business-1/page-07.png", "A one-page promotional flyer or service spotlight layout for business marketing.", "$8.99"],
    ["budget-business-content-planner", "Budget Business Content Planner", "business", "Marketing & Sales", "Content planner", "/products/pdf/business-1/page-08.png", "A content planning dashboard for campaigns, publishing schedules, and topic tracking.", "$10.99"],
    ["budget-business-lead-magnet-workbook", "Budget Business Lead Magnet Workbook", "business", "Marketing & Sales", "Lead magnet workbook", "/products/pdf/business-1/page-09.png", "A workbook template for opt-ins, educational content, and freebie offers.", "$12.99"],
    ["budget-business-pricing-guide", "Budget Business Pricing Guide", "business", "Marketing & Sales", "Pricing guide", "/products/pdf/business-1/page-10.png", "A pricing guide template for presenting service packages, investments, and add-ons.", "$11.99"],
    ["budget-business-presentation-deck", "Budget Business Presentation Deck", "business", "Marketing & Sales", "Presentation deck", "/products/pdf/business-1/page-11.png", "A business presentation deck for services, strategy, or internal reporting.", "$14.99"],
    ["budget-business-sop-template", "Budget Business SOP Template", "business", "Operations & Systems", "SOP template", "/products/pdf/business-1/page-12.png", "A standard operating procedure template for documenting repeatable workflows and client delivery systems.", "$13.99"]
  ].map(([slug, name, categorySlug, subcategory, productType, image, summary, priceLabel]) => {
    const categoryMap = {
      wedding: "Wedding",
      "events-parties": "Events & Parties",
      business: "Business"
    };
    const subcategorySlugMap = {
      "Invitations & Stationery": "invitations-stationery",
      "Signs & Day-Of Details": "signs-day-of-details",
      "Planning & Budget": "planning-budget",
      "Showers & Parties": "showers-parties",
      "Party Invitations": "party-invitations",
      "Games & Activities": "games-activities",
      "Signs & Decor": "signs-decor",
      "Client Documents": "client-documents",
      "Marketing & Sales": "marketing-sales",
      "Operations & Systems": "operations-systems"
    };
    return createProduct({
      slug,
      name,
      category: categoryMap[categorySlug],
      categorySlug,
      subcategory,
      subcategorySlug: subcategorySlugMap[subcategory],
      badge: "Launch Price",
      priceLabel,
      productType,
      image,
      summary,
      isPurchasable: liveImportedProductSlugs.has(slug),
      highlights: [
        "Part of the growing Digital Atlas collection",
        "Designed for printable or digital delivery",
        "Ready to feature in its category collection"
      ]
    });
  })
];

export const fallbackProducts = [
  createProduct({
    slug: "wedding-invitation-template-bundle",
    name: "Wedding Invitation Template Bundle",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Invitations & Stationery",
    subcategorySlug: "invitations-stationery",
    badge: "Best Seller",
    priceLabel: "₹649",
    productType: "Canva template bundle",
    isPurchasable: true,
    image: "/products/wedding-invitation-template-bundle.svg",
    summary: "A polished wedding stationery suite with a premium look for couples who want elegant printable details.",
    highlights: [
      "Ready-to-style invitation bundle",
      "Designed for modern printable delivery",
      "A polished choice for elegant wedding stationery"
    ]
  }),
  createProduct({
    slug: "budget-wedding-planner-bundle",
    name: "Budget Wedding Planner Bundle",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Planning Essential",
    priceLabel: "₹649",
    productType: "Printable planner bundle",
    isPurchasable: true,
    image: "/products/budget-wedding-planner-bundle.svg",
    summary: "A wedding planning and budget system designed to help customers organize details and spending clearly.",
    highlights: [
      "Budget tracking and planning pages",
      "Easy to use throughout the planning process",
      "A strong companion to wedding stationery bundles"
    ]
  }),
  createProduct({
    slug: "wedding-signs-bundle",
    name: "Wedding Signs Bundle",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Signs & Day-Of Details",
    subcategorySlug: "signs-day-of-details",
    badge: "Ceremony Favorite",
    priceLabel: "₹499",
    productType: "Printable sign bundle",
    isPurchasable: true,
    image: "/products/wedding-signs-bundle.svg",
    summary: "A cohesive wedding signage pack for ceremonies and receptions that need a clear, polished finish.",
    highlights: [
      "Event signage collection",
      "Strong cross-sell for invitation buyers",
      "Good fit for related-product merchandising"
    ]
  }),
  createProduct({
    slug: "bridal-shower-games-bundle",
    name: "Bridal Shower Games Bundle",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Showers & Parties",
    subcategorySlug: "showers-parties",
    badge: "Party Favorite",
    priceLabel: "₹399",
    productType: "Printable game bundle",
    isPurchasable: true,
    image: "/products/bridal-shower-games-bundle.svg",
    summary: "An easy party printable bundle for hosts who want polished celebration products with less setup.",
    highlights: [
      "Party-ready printable product",
      "Great for category merchandising",
      "Simple to use for bridal shower hosting"
    ]
  }),

  createProduct({
    slug: "budget-bride-plan-classic-invitation",
    name: "Budget Bride Botanical Wedding Suite",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Invitations & Stationery",
    subcategorySlug: "invitations-stationery",
    badge: "Launch Ready",
    priceLabel: "₹999",
    productType: "Wedding stationery suite",
    isPurchasable: true,
    image: "/products/added/budget-bride-plan-classic-invitation.svg",
    summary: "A botanical wedding suite with invitation, RSVP, details card, save the date, signage, planning sheets, and celebration extras in one coordinated collection.",
    highlights: [
      "12-page coordinated botanical wedding collection",
      "Includes stationery, signage, planning, and shower extras",
      "Delivered as a printable PDF suite"
    ]
  }),
  createProduct({
    slug: "budget-bride-botanical-details-3-page-suite",
    name: "Budget Bride Botanical Details 3-Page Suite",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Invitations & Stationery",
    subcategorySlug: "invitations-stationery",
    badge: "Download Ready",
    priceLabel: "$8.99",
    productType: "Wedding details bundle",
    isPurchasable: true,
    image: "/products/added/budget-bride-botanical-details-3-page-suite.svg",
    summary:
      "A compact botanical details suite with coordinated inserts for wedding notes, schedule details, and guest information in one printable set.",
    highlights: [
      "3-page botanical details collection",
      "Built for matching invitation add-ons",
      "Instant PDF download after checkout"
    ]
  }),
  createProduct({
    slug: "budget-bride-digital-atlas-suite",
    name: "Budget Bride Digital Atlas Wedding Suite",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Invitations & Stationery",
    subcategorySlug: "invitations-stationery",
    badge: "Signature Suite",
    priceLabel: "$11.99",
    productType: "Wedding stationery suite",
    isPurchasable: true,
    image: "/products/added/budget-bride-digital-atlas-suite.svg",
    summary:
      "A signature Digital Atlas wedding suite with coordinated stationery pages designed for customers who want a polished printable set in one purchase.",
    highlights: [
      "Curated Digital Atlas wedding suite",
      "Coordinated stationery pages in one PDF",
      "Ready for printable or digital delivery"
    ]
  }),
  createProduct({
    slug: "budget-bride-plan-rose-invitation",
    name: "Budget Bride Rose Wedding Suite",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Invitations & Stationery",
    subcategorySlug: "invitations-stationery",
    badge: "Launch Ready",
    priceLabel: "₹999",
    productType: "Wedding stationery suite",
    isPurchasable: true,
    image: "/products/budget-bride-plan-2.png",
    summary: "A romantic rose wedding suite with floral stationery, save the date, signage, planning pages, and party extras for a soft elegant celebration look.",
    highlights: [
      "12-page coordinated rose-themed wedding collection",
      "Includes invitation, RSVP, details, signs, and planners",
      "Great for romantic floral wedding styling"
    ]
  }),
  createProduct({
    slug: "budget-bride-plan-welcome-sign",
    name: "Budget Bride Burgundy Wedding Suite",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Signs & Day-Of Details",
    subcategorySlug: "signs-day-of-details",
    badge: "Launch Ready",
    priceLabel: "₹999",
    productType: "Wedding stationery suite",
    isPurchasable: true,
    image: "/products/budget-bride-plan-3.png",
    summary: "A dramatic burgundy wedding suite with dark romantic stationery, welcome signage, planning pages, and celebration printables.",
    highlights: [
      "12-page burgundy and gold wedding collection",
      "Includes signage, stationery, planning, and party extras",
      "Strong fit for evening or formal wedding themes"
    ]
  }),
  createProduct({
    slug: "budget-events-and-parties-bundle",
    name: "Budget Events & Parties Printable Bundle",
    category: "Events & Parties",
    categorySlug: "events-parties",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Launch Ready",
    priceLabel: "₹1199",
    productType: "Event printable bundle",
    isPurchasable: true,
    image: "/products/events-parties-bundle-1.png",
    summary: "A party printable bundle preview featuring invitations, games, signage, favor tags, menus, planning sheets, and itineraries.",
    highlights: [
      "10-page events and parties printable collection",
      "Includes invites, games, signs, tags, menus, and itineraries",
      "Great starter bundle for celebrations and party hosts"
    ]
  }),
  createProduct({
    slug: "budget-business-starter-template-pack",
    name: "Budget Business Starter Template Pack",
    category: "Business",
    categorySlug: "business",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Launch Ready",
    priceLabel: "₹1999",
    productType: "Business template pack",
    isPurchasable: true,
    image: "/products/business-invoice-template-1.png",
    summary: "A business template pack with invoice, proposal, agreement, welcome guide, brand kit, media kit, content planner, pricing guide, presentation deck, and SOP layouts.",
    highlights: [
      "12-page business starter collection",
      "Includes client docs, marketing assets, and operations templates",
      "Strong value-priced pack for service businesses"
    ]
  }),

  createProduct({
    slug: "save-the-date-canva-suite",
    name: "Save The Date Canva Suite",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Invitations & Stationery",
    subcategorySlug: "invitations-stationery",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Canva template pack",
    summary: "A modern save-the-date collection for couples who want polished announcement templates before invitations are ready.",
    highlights: ["Editable Canva files", "Matching styles for multiple event moods", "Designed as an easy add-on to invitation bundles"]
  }),
  createProduct({
    slug: "wedding-timeline-checklist-kit",
    name: "Wedding Timeline Checklist Kit",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Planning & Budget",
    subcategorySlug: "planning-budget",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Checklist pack",
    summary: "A timeline and checklist system that helps couples stay organized from booking to wedding week.",
    highlights: ["Month-by-month planning flow", "Printable checklist pages", "Strong companion to planner bundles"]
  }),
  createProduct({
    slug: "table-number-card-set",
    name: "Table Number Card Set",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Signs & Day-Of Details",
    subcategorySlug: "signs-day-of-details",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Printable card set",
    summary: "A coordinated set of table number cards for weddings and formal events that need cohesive printed details.",
    highlights: ["Pairs with wedding signs", "Fast printable setup", "Adds a polished event finish"]
  }),
  createProduct({
    slug: "bachelorette-weekend-itinerary",
    name: "Bachelorette Weekend Itinerary",
    category: "Wedding",
    categorySlug: "wedding",
    subcategory: "Showers & Parties",
    subcategorySlug: "showers-parties",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Itinerary template",
    summary: "A weekend itinerary template pack for bachelorette planners who want the trip details to feel organized and premium.",
    highlights: ["Editable itinerary pages", "Clean event styling", "Good upsell from shower and wedding party products"]
  }),

  createProduct({
    slug: "birthday-party-invitation-pack",
    name: "Birthday Party Invitation Pack",
    category: "Events & Parties",
    categorySlug: "events-parties",
    subcategory: "Party Invitations",
    subcategorySlug: "party-invitations",
    badge: "New Category",
    priceLabel: "Coming soon",
    productType: "Invitation template pack",
    summary: "A bright invitation pack built for birthday events, family celebrations, and polished printable party invites.",
    highlights: ["Editable invitation layouts", "Multiple celebration styles", "Fits party add-on bundles"]
  }),
  createProduct({
    slug: "baby-shower-games-pack",
    name: "Baby Shower Games Pack",
    category: "Events & Parties",
    categorySlug: "events-parties",
    subcategory: "Games & Activities",
    subcategorySlug: "games-activities",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Printable games pack",
    summary: "A game and activity bundle for baby shower hosts who want a ready-made printable experience.",
    highlights: ["Fast host setup", "Printable party flow", "Good fit for family event merchandising"]
  }),
  createProduct({
    slug: "party-welcome-sign-template",
    name: "Party Welcome Sign Template",
    category: "Events & Parties",
    categorySlug: "events-parties",
    subcategory: "Signs & Decor",
    subcategorySlug: "signs-decor",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Printable sign template",
    summary: "A welcome sign template for birthday parties, baby showers, and event entrances that need a styled first impression.",
    highlights: ["Great for matching decor sets", "Simple printable format", "Useful standalone or as part of a party bundle"]
  }),

  createProduct({
    slug: "client-welcome-guide-template",
    name: "Client Welcome Guide Template",
    category: "Business",
    categorySlug: "business",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Agency Favorite",
    priceLabel: "Coming soon",
    productType: "Editable PDF and Canva template",
    summary: "A client welcome guide template for freelancers and studios who want a more polished onboarding experience.",
    highlights: ["Premium service positioning", "Editable brand sections", "Strong fit for digital product businesses"]
  }),
  createProduct({
    slug: "service-proposal-template",
    name: "Service Proposal Template",
    category: "Business",
    categorySlug: "business",
    subcategory: "Client Documents",
    subcategorySlug: "client-documents",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Proposal template",
    summary: "A clean, conversion-focused proposal template for consultants, designers, and service providers.",
    highlights: ["Clear offer structure", "Brand-friendly presentation", "Useful in client workflow bundles"]
  }),
  createProduct({
    slug: "lead-magnet-workbook-template",
    name: "Lead Magnet Workbook Template",
    category: "Business",
    categorySlug: "business",
    subcategory: "Marketing & Sales",
    subcategorySlug: "marketing-sales",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Workbook template",
    summary: "A workbook template for creators and online businesses building list-growth freebies and opt-in offers.",
    highlights: ["Lead magnet ready", "Editable workbook pages", "Good cross-sell with content products"]
  }),
  createProduct({
    slug: "instagram-launch-template-pack",
    name: "Instagram Launch Template Pack",
    category: "Business",
    categorySlug: "business",
    subcategory: "Marketing & Sales",
    subcategorySlug: "marketing-sales",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Social media template pack",
    summary: "A launch-week template pack for creators and brands planning social media promotions around offers or product drops.",
    highlights: ["Launch campaign focused", "Multiple post formats", "Fits content and marketing bundles"]
  }),
  createProduct({
    slug: "sop-template-library",
    name: "SOP Template Library",
    category: "Business",
    categorySlug: "business",
    subcategory: "Operations & Systems",
    subcategorySlug: "operations-systems",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Operations template library",
    summary: "A standard operating procedure library for small businesses that want more repeatable systems and cleaner documentation.",
    highlights: ["Operations-focused templates", "Editable document set", "Strong value for business buyers"]
  }),

  createProduct({
    slug: "monthly-budget-spreadsheet",
    name: "Monthly Budget Spreadsheet",
    category: "Planners & Productivity",
    categorySlug: "planners-productivity",
    subcategory: "Finance & Budgeting",
    subcategorySlug: "finance-budgeting",
    badge: "Finance Favorite",
    priceLabel: "Coming soon",
    productType: "Spreadsheet template",
    summary: "A practical spreadsheet for monthly budget tracking, spending reviews, and simple personal finance planning.",
    highlights: ["Spreadsheet-based planning", "Finance category anchor", "Easy repeat-use product"]
  }),
  createProduct({
    slug: "debt-payoff-tracker",
    name: "Debt Payoff Tracker",
    category: "Planners & Productivity",
    categorySlug: "planners-productivity",
    subcategory: "Finance & Budgeting",
    subcategorySlug: "finance-budgeting",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Tracker spreadsheet",
    summary: "A payoff tracker for customers who want more visible progress and structure while reducing debt.",
    highlights: ["Goal-oriented finance product", "Clear visual tracking", "Good companion to budget tools"]
  }),
  createProduct({
    slug: "goal-planner-notion-system",
    name: "Goal Planner Notion System",
    category: "Planners & Productivity",
    categorySlug: "planners-productivity",
    subcategory: "Goal Planning",
    subcategorySlug: "goal-planning",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Notion template",
    summary: "A Notion-based goal system for creators and planners who prefer a digital dashboard over printable pages.",
    highlights: ["Digital-first planning", "Notion audience fit", "Strong productivity product"]
  }),
  createProduct({
    slug: "daily-routine-planner-pack",
    name: "Daily Routine Planner Pack",
    category: "Planners & Productivity",
    categorySlug: "planners-productivity",
    subcategory: "Goal Planning",
    subcategorySlug: "goal-planning",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Printable planner pack",
    summary: "A daily planner pack focused on routines, priorities, and calmer day-to-day execution.",
    highlights: ["Repeat-use printable", "Pairs well with habit products", "Broad planner appeal"]
  }),
  createProduct({
    slug: "family-command-center-kit",
    name: "Family Command Center Kit",
    category: "Planners & Productivity",
    categorySlug: "planners-productivity",
    subcategory: "Home & Family",
    subcategorySlug: "home-family",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Printable home organizer",
    summary: "A family organization kit with calendars, routines, and household planning pages.",
    highlights: ["Home planning bundle", "Family workflow support", "Great for printable audiences"]
  }),

  createProduct({
    slug: "modern-resume-template-pack",
    name: "Modern Resume Template Pack",
    category: "Career & Education",
    categorySlug: "career-education",
    subcategory: "Resume & Job Search",
    subcategorySlug: "resume-job-search",
    badge: "Career Favorite",
    priceLabel: "Coming soon",
    productType: "Resume template pack",
    summary: "A resume pack designed for modern job seekers who want a cleaner presentation and easy editing.",
    highlights: ["Career category anchor", "Multiple resume layouts", "Fits job-search bundles"]
  }),
  createProduct({
    slug: "job-application-tracker",
    name: "Job Application Tracker",
    category: "Career & Education",
    categorySlug: "career-education",
    subcategory: "Resume & Job Search",
    subcategorySlug: "resume-job-search",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Tracker spreadsheet",
    summary: "A job-search tracker for applications, interviews, follow-ups, and search progress.",
    highlights: ["Useful practical tool", "Pairs with resume templates", "Spreadsheet-friendly product"]
  }),
  createProduct({
    slug: "student-study-planner",
    name: "Student Study Planner",
    category: "Career & Education",
    categorySlug: "career-education",
    subcategory: "Study & School",
    subcategorySlug: "study-school",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Study planner",
    summary: "A printable planner built for students who want a clearer structure for assignments, study blocks, and deadlines.",
    highlights: ["Education category anchor", "Simple printable format", "Broad student appeal"]
  }),
  createProduct({
    slug: "teacher-lesson-planner-bundle",
    name: "Teacher Lesson Planner Bundle",
    category: "Career & Education",
    categorySlug: "career-education",
    subcategory: "Teacher Resources",
    subcategorySlug: "teacher-resources",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Lesson planner bundle",
    summary: "A lesson planning bundle for teachers who want more organized classroom preparation and printable workflows.",
    highlights: ["Teacher-facing product", "Printable planning system", "Good for education collections"]
  }),

  createProduct({
    slug: "pinterest-pin-template-bundle",
    name: "Pinterest Pin Template Bundle",
    category: "Social & Content",
    categorySlug: "social-content",
    subcategory: "Social Templates",
    subcategorySlug: "social-templates",
    badge: "Creator Favorite",
    priceLabel: "Coming soon",
    productType: "Canva template bundle",
    summary: "A pin template bundle for bloggers, creators, and stores that want faster, more consistent Pinterest design.",
    highlights: ["Fits current marketing audience", "High-volume content use case", "Good lead-in to content products"]
  }),
  createProduct({
    slug: "content-calendar-dashboard",
    name: "Content Calendar Dashboard",
    category: "Social & Content",
    categorySlug: "social-content",
    subcategory: "Content Calendars",
    subcategorySlug: "content-calendars",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Notion or spreadsheet system",
    summary: "A content planning dashboard for creators and businesses managing posts, campaigns, and publishing schedules.",
    highlights: ["Useful ongoing product", "Good for creator workflows", "Supports repeat engagement"]
  }),
  createProduct({
    slug: "ebook-workbook-template-kit",
    name: "Ebook Workbook Template Kit",
    category: "Social & Content",
    categorySlug: "social-content",
    subcategory: "Lead Magnets & Workbooks",
    subcategorySlug: "lead-magnets-workbooks",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Lead magnet template kit",
    summary: "A workbook and ebook kit for digital businesses creating premium free or paid educational content.",
    highlights: ["Strong digital product fit", "Good for info-product creators", "Flexible content use"]
  }),

  createProduct({
    slug: "wedding-svg-bundle",
    name: "Wedding SVG Bundle",
    category: "Creative Assets",
    categorySlug: "creative-assets",
    subcategory: "SVG & Cut Files",
    subcategorySlug: "svg-cut-files",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "SVG bundle",
    summary: "A cut-file bundle for wedding signs, decor, and creative project use.",
    highlights: ["Asset-focused category entry", "Good for craft audiences", "Strong bundle potential"]
  }),
  createProduct({
    slug: "brand-mockup-scene-pack",
    name: "Brand Mockup Scene Pack",
    category: "Creative Assets",
    categorySlug: "creative-assets",
    subcategory: "Mockups & Brand Assets",
    subcategorySlug: "mockups-brand-assets",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Mockup pack",
    summary: "A mockup pack for presenting logos, brand assets, and digital products with more polish.",
    highlights: ["Visual merchandising support", "Useful for designers and shops", "Great for creative catalog depth"]
  }),
  createProduct({
    slug: "procreate-brush-starter-kit",
    name: "Procreate Brush Starter Kit",
    category: "Creative Assets",
    categorySlug: "creative-assets",
    subcategory: "Presets & Brushes",
    subcategorySlug: "presets-brushes",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Brush pack",
    summary: "A starter brush set for illustrators and creators working in Procreate.",
    highlights: ["Digital asset product", "Creative tool category", "Useful for artist audiences"]
  }),

  createProduct({
    slug: "fillable-invoice-pdf",
    name: "Fillable Invoice PDF",
    category: "Templates & Documents",
    categorySlug: "templates-documents",
    subcategory: "Printable Forms",
    subcategorySlug: "printable-forms",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Fillable PDF",
    summary: "A fillable invoice PDF for simple, printable client billing.",
    highlights: ["Fast-use document template", "Useful standalone or in bundles", "Fits small business buyers"]
  }),
  createProduct({
    slug: "guided-journal-workbook",
    name: "Guided Journal Workbook",
    category: "Templates & Documents",
    categorySlug: "templates-documents",
    subcategory: "Journals & Workbooks",
    subcategorySlug: "journals-workbooks",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Workbook",
    summary: "A guided workbook product for reflection, planning, and personal development routines.",
    highlights: ["Workbook-style offer", "Strong printable format", "Useful for wellness and planning audiences"]
  }),
  createProduct({
    slug: "editable-checklist-library",
    name: "Editable Checklist Library",
    category: "Templates & Documents",
    categorySlug: "templates-documents",
    subcategory: "Editable Documents",
    subcategorySlug: "editable-documents",
    badge: "Coming Soon",
    priceLabel: "Coming soon",
    productType: "Document template library",
    summary: "A checklist library with editable documents for workflows, planning, and recurring admin tasks.",
    highlights: ["Broad-use template pack", "Great for business and productivity buyers", "Supports many upsell paths"]
  }),
  ...pdfImportedProducts
];

const hiddenProductSlugs = new Set([
  "save-the-date-canva-suite",
  "wedding-timeline-checklist-kit",
  "table-number-card-set",
  "bachelorette-weekend-itinerary",
  "birthday-party-invitation-pack",
  "baby-shower-games-pack",
  "party-welcome-sign-template",
  "client-welcome-guide-template",
  "service-proposal-template",
  "lead-magnet-workbook-template",
  "instagram-launch-template-pack",
  "sop-template-library",
  "monthly-budget-spreadsheet",
  "debt-payoff-tracker",
  "goal-planner-notion-system",
  "daily-routine-planner-pack",
  "family-command-center-kit",
  "modern-resume-template-pack",
  "job-application-tracker",
  "student-study-planner",
  "teacher-lesson-planner-bundle",
  "pinterest-pin-template-bundle",
  "content-calendar-dashboard",
  "ebook-workbook-template-kit",
  "wedding-svg-bundle",
  "brand-mockup-scene-pack",
  "procreate-brush-starter-kit",
  "fillable-invoice-pdf",
  "guided-journal-workbook",
  "editable-checklist-library"
]);

const activeFallbackProducts = fallbackProducts.filter((product) => !hiddenProductSlugs.has(product.slug));

export function getAllProducts() {
  return activeFallbackProducts;
}

export function getFeaturedProducts() {
  return activeFallbackProducts.slice(0, 3);
}

export function getProductBySlug(slug) {
  return activeFallbackProducts.find((product) => product.slug === slug);
}
