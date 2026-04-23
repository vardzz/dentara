/**
 * In-Memory Sliding Window Rate Limiter
 *
 * Lightweight, zero-dependency rate limiter designed for Next.js Edge Middleware.
 * Uses a sliding window counter approach with automatic cleanup.
 *
 * Production note: For multi-instance deployments (e.g., Vercel with multiple
 * serverless functions), consider upgrading to Upstash Redis (@upstash/ratelimit).
 * For a single-instance or low-traffic deployment, this is perfectly sufficient.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Auto-cleanup stale entries every 60 seconds to prevent memory leaks
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request from the given identifier is within rate limits.
 *
 * @param identifier - Unique key (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed and remaining quota
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const entry = store.get(identifier);

  // No existing entry or window expired — allow and start fresh
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // Within active window
  if (entry.count < config.maxRequests) {
    entry.count += 1;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // Rate limit exceeded
  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}
