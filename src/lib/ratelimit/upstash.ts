import { Ratelimit } from "@upstash/ratelimit";
import type { Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { RateLimiter } from "./types";

export class UpstashRateLimiter implements RateLimiter {
  private ratelimit: Ratelimit;

  constructor(requests: number = 5, window: Duration = "600 s") {
    this.ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(requests, window),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
  }

  async limit(identifier: string): Promise<{ success: boolean }> {
    return this.ratelimit.limit(identifier);
  }
}
