/**
 * Client-side rate limiter using localStorage
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class ClientRateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private storageKey: string;

  constructor(maxRequests: number, windowMs: number, key: string) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.storageKey = `ratelimit_${key}`;
  }

  /**
   * Check if action is allowed
   */
  check(): { allowed: boolean; resetTime?: number; remaining?: number; message?: string } {
    try {
      const now = Date.now();
      const stored = localStorage.getItem(this.storageKey);

      if (!stored) {
        // First request
        const resetTime = now + this.windowMs;
        const entry: RateLimitEntry = { count: 1, resetTime };
        localStorage.setItem(this.storageKey, JSON.stringify(entry));
        return { 
          allowed: true, 
          resetTime,
          remaining: this.maxRequests - 1
        };
      }

      const entry: RateLimitEntry = JSON.parse(stored);

      // Check if window expired
      if (now > entry.resetTime) {
        const resetTime = now + this.windowMs;
        const newEntry: RateLimitEntry = { count: 1, resetTime };
        localStorage.setItem(this.storageKey, JSON.stringify(newEntry));
        return { 
          allowed: true, 
          resetTime,
          remaining: this.maxRequests - 1
        };
      }

      // Check if limit exceeded
      if (entry.count >= this.maxRequests) {
        const remainingMs = entry.resetTime - now;
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        return { 
          allowed: false, 
          resetTime: entry.resetTime,
          remaining: 0,
          message: `Too many attempts. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`
        };
      }

      // Increment counter
      entry.count++;
      localStorage.setItem(this.storageKey, JSON.stringify(entry));
      return { 
        allowed: true, 
        resetTime: entry.resetTime,
        remaining: this.maxRequests - entry.count
      };
    } catch (error) {
      // If localStorage fails, allow the request (fail open)
      console.error("Client rate limiter error:", error);
      return { allowed: true };
    }
  }

  /**
   * Reset the rate limit
   */
  reset(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Error resetting rate limit:", error);
    }
  }
}
