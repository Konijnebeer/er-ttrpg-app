export default function sanitizeId(base: string): string {
  const sanitized = base
    .replace(/[^\w-]+/g, "")
    .toLowerCase()
    .trim();
  const prefix = sanitized || "item";
  return `${prefix}-${Date.now()}`;
}
