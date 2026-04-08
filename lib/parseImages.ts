/**
 * Normalizes the images field from Supabase vehicles (text[] column).
 * Handles every format the column might contain:
 *   - Proper string[]                      → returned as-is
 *   - ['["url1","url2"]']                  → JSON-encoded array in element 0 (Supabase dashboard quirk)
 *   - '"url"' (stringified string)         → unwrapped
 *   - null / undefined / []               → []
 */
export function parseImages(raw: unknown): string[] {
  if (!raw) return []
  if (!Array.isArray(raw)) {
    // Scalar string — maybe a raw URL or JSON array
    if (typeof raw === 'string') {
      const s = raw.trim()
      if (!s) return []
      if (s.startsWith('[')) {
        try {
          const parsed = JSON.parse(s)
          return Array.isArray(parsed) ? (parsed as string[]).filter(Boolean) : [s]
        } catch {
          return [s]
        }
      }
      return [s]
    }
    return []
  }

  if (raw.length === 0) return []

  // Single element that looks like a JSON array → unwrap it
  if (raw.length === 1 && typeof raw[0] === 'string' && raw[0].trimStart().startsWith('[')) {
    try {
      const parsed = JSON.parse(raw[0])
      return Array.isArray(parsed) ? (parsed as string[]).filter(Boolean) : raw as string[]
    } catch {
      return raw as string[]
    }
  }

  return (raw as string[]).filter(Boolean)
}

/**
 * Returns the first displayable image URL from any raw images value.
 * Handles every format parseImages handles, plus per-element JSON strings.
 * Returns '' when no valid image exists — callers should show a fallback UI.
 */
export function getFirstImage(raw: unknown): string {
  const images = parseImages(raw)
  if (images.length === 0) return ''

  const first = images[0].trim()
  if (!first) return ''

  // Element 0 is itself a stringified JSON array (double-encoded edge case)
  if (first.startsWith('[')) {
    try {
      const parsed = JSON.parse(first)
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') return parsed[0]
    } catch {}
  }

  return first
}
