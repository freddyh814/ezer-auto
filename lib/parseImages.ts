/**
 * Normalizes the images field from Supabase vehicles (text[] column).
 * Rows inserted via the dashboard may store a JSON-encoded string as the
 * first element, e.g. images[0] = '["https://..."]' instead of the URL itself.
 */
export function parseImages(raw: string[] | null | undefined): string[] {
  if (!raw || raw.length === 0) return []
  // Single element that looks like a JSON array → unwrap it
  if (raw.length === 1 && raw[0].trimStart().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw[0])
      return Array.isArray(parsed) ? (parsed as string[]) : raw
    } catch {
      return raw
    }
  }
  return raw
}
