const supportedEditorProductSlugs = [
  "wedding-checklist-customer-guide",
  "twelve-month-master-wedding-checklist",
  "final-countdown-wedding-checklist",
  "vendor-booking-wedding-checklist",
  "attire-beauty-wedding-checklist",
  "ceremony-planning-wedding-checklist",
  "reception-planning-wedding-checklist",
  "wedding-day-emergency-kit-checklist",
  "honeymoon-planning-checklist",
  "post-wedding-admin-checklist",
  "wedding-day-checklist-template",
  "business-templates-guide",
  "business-proposal-template",
  "business-invoice-template",
  "business-pitch-deck-template",
  "media-kit-template",
  "meeting-agenda-template",
  "project-status-report-template",
  "client-onboarding-template",
  "service-agreement-template",
  "brand-guidelines-template",
  "event-registration-template",
  "client-onboarding-kit",
  "social-media-branding-guide",
  "business-startup-checklist",
  "room-design-templates",
  "mood-board-guide",
  "diy-project-checklist",
  "interior-design-checklist",
  "event-customer-guide",
  "party-invitation-template",
  "event-planning-checklist",
  "guest-list-rsvp-tracker",
  "event-budget-planner",
  "party-run-sheet",
  "vendor-supplier-contacts",
  "seating-plan-table-assignments",
  "food-drinks-planner",
  "activities-games-planner",
  "post-event-wrap-up-report",
  "baby-shower-checklist-template",
  "baby-shower-games-pack",
  "baby-shower-invitation-template",
  "birthday-invitation-template",
  "birthday-party-checklist",
  "birthday-thank-you-card-template",
  "bridal-shower-games-pack",
  "bridal-shower-invitation-template",
  "corporate-event-invitation-template",
  "corporate-event-planner",
  "farewell-party-invitation-template",
  "graduation-party-invitation-template",
  "housewarming-invitation-template",
  "kids-party-activity-sheet"
];

const supportedEditorSlugSet = new Set(supportedEditorProductSlugs);

function getProductFormatText(product) {
  return `${product?.details?.format || ""} ${product?.productType || ""}`.toLowerCase();
}

export function supportsOnlineEditor(product) {
  if (!product || product.isBundle) return false;
  return supportedEditorSlugSet.has(product.slug) && getProductFormatText(product).includes("pdf");
}

export function customerHasEditorAccess(product, purchasedProducts = []) {
  if (!product || !Array.isArray(purchasedProducts) || purchasedProducts.length === 0) return false;

  if (purchasedProducts.some((item) => item.slug === product.slug)) {
    return true;
  }

  return purchasedProducts.some(
    (item) => item.isBundle === true && Array.isArray(item.bundleContents) && item.bundleContents.includes(product.name)
  );
}

export function formatEditorFieldLabel(name) {
  return String(name || "Field")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
