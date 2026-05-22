import type { RateLimiter } from "./types";
import { UpstashRateLimiter } from "./upstash";

let limiter: RateLimiter | null = null;

function getLimiter(): RateLimiter {
  if (!limiter) {
    limiter = new UpstashRateLimiter();
  }
  return limiter;
}

export function setRateLimiter(l: RateLimiter) {
  limiter = l;
}

export const ratelimit = {
  limit: (identifier: string) => getLimiter().limit(identifier),
};
