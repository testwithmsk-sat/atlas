function createField(id, label, placeholder, defaultValue, multiline = false) {
  return {
    id,
    label,
    placeholder,
    defaultValue,
    multiline
  };
}

function getProductFormatText(product) {
  return `${product?.details?.format || ""} ${product?.productType || ""}`.toLowerCase();
}

function getPreviewFacts(product) {
  return [product.category, product.subcategory, product.details?.format || product.productType].filter(Boolean);
}

export function supportsOnlineEditor(product) {
  if (!product || product.isBundle) return false;
  return getProductFormatText(product).includes("pdf");
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

export function getEditorTemplate(product) {
  const text = `${product.slug} ${product.name} ${product.summary}`.toLowerCase();
  const commonPreviewFacts = getPreviewFacts(product);

  if (text.includes("invitation")) {
    return {
      kind: "invitation",
      exportSuffix: "custom-invitation",
      previewFacts: commonPreviewFacts,
      tips: [
        "Update names, date, venue, and the main invitation message.",
        "Keep the headline short for the cleanest visual balance.",
        "Export unlocks after purchase or when the matching bundle is owned."
      ],
      fields: [
        createField("headline", "Couple or event title", "Ava & Liam", "Ava & Liam"),
        createField("subheadline", "Event label", "Invite you to celebrate", "Invite you to celebrate"),
        createField("date", "Date and time", "Saturday, 18 October 2026 - 5:30 PM", "Saturday, 18 October 2026 - 5:30 PM"),
        createField("venue", "Venue", "The Garden Pavilion", "The Garden Pavilion"),
        createField("details", "Details", "Dinner, dancing, and celebration to follow", "Dinner, dancing, and celebration to follow", true),
        createField("footer", "Footer note", "RSVP by 20 September", "RSVP by 20 September")
      ]
    };
  }

  if (text.includes("menu")) {
    return {
      kind: "menu",
      exportSuffix: "custom-menu",
      previewFacts: commonPreviewFacts,
      tips: [
        "Use short course titles for a more premium menu layout.",
        "The preview updates live as you type.",
        "Purchased customers can export a personalized PDF instantly."
      ],
      fields: [
        createField("headline", "Menu title", "Reception Menu", "Reception Menu"),
        createField("subheadline", "Subtitle", "Dinner & Signature Drinks", "Dinner & Signature Drinks"),
        createField("line1", "Course 1", "Starter - Burrata & basil", "Starter - Burrata & basil"),
        createField("line2", "Course 2", "Main - Herb roasted vegetables", "Main - Herb roasted vegetables"),
        createField("line3", "Course 3", "Dessert - Vanilla bean cake", "Dessert - Vanilla bean cake"),
        createField("line4", "Drinks", "Signature cocktail - Garden spritz", "Signature cocktail - Garden spritz"),
        createField("footer", "Footer note", "Thank you for celebrating with us", "Thank you for celebrating with us")
      ]
    };
  }

  if (text.includes("programme") || text.includes("program")) {
    return {
      kind: "program",
      exportSuffix: "custom-program",
      previewFacts: commonPreviewFacts,
      tips: [
        "List the event flow in a simple, easy-to-scan order.",
        "This format works best with short sections and timings.",
        "Export is only unlocked after purchase."
      ],
      fields: [
        createField("headline", "Programme title", "Wedding Programme", "Wedding Programme"),
        createField("subheadline", "Event line", "Saturday Ceremony", "Saturday Ceremony"),
        createField("line1", "Item 1", "4:00 PM - Guest arrival", "4:00 PM - Guest arrival"),
        createField("line2", "Item 2", "4:30 PM - Ceremony begins", "4:30 PM - Ceremony begins"),
        createField("line3", "Item 3", "5:15 PM - Cocktail hour", "5:15 PM - Cocktail hour"),
        createField("line4", "Item 4", "6:30 PM - Reception dinner", "6:30 PM - Reception dinner"),
        createField("footer", "Footer note", "Thank you for being part of our day", "Thank you for being part of our day")
      ]
    };
  }

  if (
    text.includes("checklist") ||
    text.includes("planner") ||
    text.includes("guide") ||
    text.includes("kit") ||
    text.includes("budget")
  ) {
    return {
      kind: "checklist",
      exportSuffix: "custom-checklist",
      previewFacts: commonPreviewFacts,
      tips: [
        "Rewrite the title and tasks so the checklist matches the buyer's event or plan.",
        "Short task lines keep the PDF cleaner and more readable.",
        "Customers can preview and customize here, but export stays locked until purchase."
      ],
      fields: [
        createField("headline", "Checklist title", product.name, product.name),
        createField("subheadline", "Subtitle", "A clean planning checklist ready to personalize", "A clean planning checklist ready to personalize"),
        createField("line1", "Task 1", "Confirm the main timeline and important dates", "Confirm the main timeline and important dates"),
        createField("line2", "Task 2", "Review vendors, contacts, and confirmations", "Review vendors, contacts, and confirmations"),
        createField("line3", "Task 3", "Finalize items that affect the event flow", "Finalize items that affect the event flow"),
        createField("line4", "Task 4", "Check logistics, delivery times, and setup details", "Check logistics, delivery times, and setup details"),
        createField("line5", "Task 5", "Prepare backup items, notes, and reminders", "Prepare backup items, notes, and reminders"),
        createField("footer", "Notes", "Add one final note or reminder here.", "Add one final note or reminder here.", true)
      ]
    };
  }

  return {
    kind: "generic",
    exportSuffix: "custom-document",
    previewFacts: commonPreviewFacts,
    tips: [
      "Edit the main title and supporting copy in the left panel.",
      "The preview gives customers a fast feel for how the final PDF can look.",
      "Export remains locked until the product has been purchased."
    ],
    fields: [
      createField("headline", "Document title", product.name, product.name),
      createField("subheadline", "Subtitle", "A polished digital template ready to personalize", "A polished digital template ready to personalize"),
      createField("line1", "Section 1", "Update the first section with the customer's content.", "Update the first section with the customer's content.", true),
      createField("line2", "Section 2", "Use this area for details, names, locations, or planning notes.", "Use this area for details, names, locations, or planning notes.", true),
      createField("footer", "Footer note", "Designed with The Digital Atlas editor", "Designed with The Digital Atlas editor")
    ]
  };
}
