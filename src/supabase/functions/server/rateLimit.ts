import * as kv from "./kv_store.tsx";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Rate limiter using KV store for persistence
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private prefix: string;

  constructor(config: RateLimitConfig, prefix: string = "ratelimit") {
    this.config = config;
    this.prefix = prefix;
  }

  /**
   * Check if request is allowed and update counter
   * @param identifier - Unique identifier (IP address, email, etc.)
   * @returns true if allowed, false if rate limited
   */
  async checkLimit(identifier: string): Promise<{ allowed: boolean; resetTime?: number; remaining?: number }> {
    const key = `${this.prefix}:${identifier}`;
    const now = Date.now();

    try {
      // Get current rate limit entry
      const entry = await kv.get<RateLimitEntry>(key);

      if (!entry) {
        // First request - create new entry
        const resetTime = now + this.config.windowMs;
        await kv.set(key, { count: 1, resetTime }, this.config.windowMs);
        return { 
          allowed: true, 
          resetTime,
          remaining: this.config.maxRequests - 1
        };
      }

      // Check if window has expired
      if (now > entry.resetTime) {
        // Window expired - reset counter
        const resetTime = now + this.config.windowMs;
        await kv.set(key, { count: 1, resetTime }, this.config.windowMs);
        return { 
          allowed: true, 
          resetTime,
          remaining: this.config.maxRequests - 1
        };
      }

      // Within window - check if limit exceeded
      if (entry.count >= this.config.maxRequests) {
        return { 
          allowed: false, 
          resetTime: entry.resetTime,
          remaining: 0
        };
      }

      // Increment counter
      entry.count++;
      await kv.set(key, entry, Math.ceil((entry.resetTime - now) / 1000));
      return { 
        allowed: true, 
        resetTime: entry.resetTime,
        remaining: this.config.maxRequests - entry.count
      };
    } catch (error) {
      // On error, allow request (fail open) but log the error
      console.error("Rate limiter error:", error);
      return { allowed: true };
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  async reset(identifier: string): Promise<void> {
    const key = `${this.prefix}:${identifier}`;
    await kv.del(key);
  }
}

/**
 * Extract IP address from request
 */
export function getClientIP(request: Request): string {
  // Try common headers first
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to unknown
  return "unknown";
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: { remaining?: number; resetTime?: number }): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (result.remaining !== undefined) {
    headers["X-RateLimit-Remaining"] = result.remaining.toString();
  }
  
  if (result.resetTime !== undefined) {
    headers["X-RateLimit-Reset"] = Math.ceil(result.resetTime / 1000).toString();
  }
  
  return headers;
}
