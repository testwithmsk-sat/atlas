export function parseNumericAmount(value) {
  const amount = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

const INR_PER_USD = 93;

export function formatUsdAmount(value) {
  const amount = Number(value || 0);
  const normalized = Number.isFinite(amount) ? amount : 0;
  return `$${normalized.toFixed(2)}`;
}

export function normalizePriceLabel(label) {
  if (!label) return "$0.00";

  const text = String(label).trim();
  if (!text || /coming soon/i.test(text)) return "Coming soon";

  const numericAmount = parseNumericAmount(text);
  const isRupeeAmount = /₹|inr|â‚¹/i.test(text);
  const usdAmount = isRupeeAmount ? numericAmount / INR_PER_USD : numericAmount;

  return formatUsdAmount(usdAmount);
}
