// Fetches the real public IP once per session and caches it.
// Uses cloudflare's trace endpoint — no API key, no rate limit, CORS-safe.
let _cachedIp = null;

export async function getClientIp() {
  if (_cachedIp) return _cachedIp;
  try {
    const res  = await fetch('https://cloudflare.com/cdn-cgi/trace');
    const text = await res.text();
    const match = text.match(/ip=([^\n]+)/);
    if (match?.[1]) {
      _cachedIp = match[1].trim();
      return _cachedIp;
    }
  } catch (_) {}
  return null;
}
