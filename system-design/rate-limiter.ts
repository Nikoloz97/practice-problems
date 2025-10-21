import Redis from "ioredis";

type Bucket = {
  tokens: number;
  lastRefillTime: number;
};

// problem with this = only tracks requests per server instance
export function createBasicTokenBucket(capacity: number, refillRate: number) {
  const buckets = new Map<string, Bucket>();

  const refill = (bucket: Bucket) => {
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - bucket.lastRefillTime) / 1000; // divide by 1000 to convert ms -> s
    const newTokens = Math.floor(elapsedSeconds * refillRate);
    if (newTokens > 0) {
      bucket.tokens = Math.min(capacity, bucket.tokens + newTokens);
      bucket.lastRefillTime = currentTime;
    }
  };

  const isRequestAllowed = (userId: string) => {
    // get user's existing bucket, otherwise return new bucket
    const bucket = buckets.get(userId) || {
      tokens: capacity,
      lastRefillTime: Date.now(),
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

export function createRedisTokenBucket(capacity: number, refillRate: number) {
  const redis = new Redis();
}
