import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";
import { logError } from "./logger";
import { asyncHandler } from "./middleware-helper";

type Bucket = {
  tokens: number;
  lastRefillTimeMilli: number;
};

// problem with this = only tracks requests per server instance
export function createBasicTokenBucket(capacity: number, refillRate: number) {
  const buckets = new Map<string, Bucket>();

  const refill = (bucket: Bucket) => {
    const timeNowMilli = Date.now();
    const elapsedSeconds = (timeNowMilli - bucket.lastRefillTimeMilli) / 1000; // divide by 1000 to convert ms -> s
    const newTokens = Math.floor(elapsedSeconds * refillRate);
    if (newTokens > 0) {
      bucket.tokens = Math.min(capacity, bucket.tokens + newTokens);
      bucket.lastRefillTimeMilli = timeNowMilli;
    }
  };

  const isRequestAllowed = (userId: string) => {
    // get user's existing bucket, otherwise return new bucket
    const bucket = buckets.get(userId) || {
      tokens: capacity,
      lastRefillTimeMilli: Date.now(),
    };

    refill(bucket);

    if (bucket.tokens > 0) {
      bucket.tokens--;
      buckets.set(userId, bucket);
      return true;
    }
    buckets.set(userId, bucket);
    return false;
  };

  return { isRequestAllowed };
}

// redis = creates a centralized data store (shared by all instances)
export function createRedisTokenBucket(
  capacity: number,
  refillRateSeconds: number
) {
  const redis = new Redis();

  async function isRequestAllowed(userId: string) {
    const key = `bucket:${userId}`;
    const timeNowMilli = Date.now();

    const data = await redis.hgetall(key);
    let tokens = parseFloat(data.tokens) || capacity;
    let lastRefillTimeMilli = parseInt(data.lastRefillTime) || timeNowMilli;

    const timeElapsedSeconds = (timeNowMilli - lastRefillTimeMilli) / 1000;
    const newTokens = Math.floor(timeElapsedSeconds * refillRateSeconds);
    if (newTokens > 0) {
      tokens = Math.min(capacity, tokens + newTokens);
      lastRefillTimeMilli = timeNowMilli;
    }

    const newBucketData: Bucket = {
      tokens,
      lastRefillTimeMilli,
    };

    if (tokens > 0) {
      tokens--;
      await redis.hset(key, newBucketData);
      await redis.expire(key, Math.ceil(capacity / refillRateSeconds)); // sets TTL, i.e. clears out the hash after inactivity for this many seconds (we don't need it at that point since its guaranteed to be full)
      return true;
    } else {
      await redis.hset(key, newBucketData);
      return false;
    }
  }
  return { isRequestAllowed };
}

export function createBasicSlidingWindowLimiter(
  timeWindowMilli: number,
  maxRequests: number
) {
  const timestampRequestsLog = new Map<string, number[]>();

  return asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      const timeNowMilli = Date.now();
      const userIp = request.ip;

      if (!userIp) {
        await logError("Missing IP address", {
          url: request.url,
          headers: request.headers,
        });
        return response
          .status(400)
          .json({ message: "Invalid request: missing IP" });
      }

      if (!timestampRequestsLog.get(userIp)) {
        timestampRequestsLog.set(userIp, []);
      }

      const userTimestampsWithinWindow: number[] = timestampRequestsLog
        .get(userIp)!
        .filter(
          (userTimestamp) => userTimestamp - timeNowMilli < timeWindowMilli
        );

      if (userTimestampsWithinWindow.length >= maxRequests) {
        const retryAfter =
          Math.ceil(
            timeWindowMilli -
              (timeNowMilli - timestampRequestsLog.get(userIp)![0])
          ) / 1000;

        response.setHeader("Retry-after", retryAfter.toString());

        return response
          .status(429)
          .json({
            message: `Rate limit exceeded. Try again in ${retryAfter}s.`,
          });
      }

      timestampRequestsLog.get(userIp)!.push(timeNowMilli);

      next();
    }
  );
}
