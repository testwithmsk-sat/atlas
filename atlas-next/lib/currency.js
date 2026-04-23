export function parseNumericAmount(value) {
  const amount = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatInrAmount(value) {
  const amount = Number(value || 0);
  const normalized = Number.isFinite(amount) ? amount : 0;
  const formatted = normalized % 1 === 0 ? normalized.toFixed(0) : normalized.toFixed(2);
  return `INR ${formatted}`;
}

export function normalizePriceLabel(label) {
  if (!label) return "INR 0";

  const text = String(label).trim();
  if (!text || /coming soon/i.test(text)) return "Coming soon";

  return formatInrAmount(parseNumericAmount(text));
}
