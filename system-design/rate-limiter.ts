import Redis from "ioredis";

type Bucket = {
  tokens: number;
  lastRefillTimeMilli: number;
};

// problem with this = only tracks requests per server instance
export function createBasicTokenBucket(capacity: number, refillRate: number) {
  const buckets = new Map<string, Bucket>();

  const refill = (bucket: Bucket) => {
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - bucket.lastRefillTimeMilli) / 1000; // divide by 1000 to convert ms -> s
    const newTokens = Math.floor(elapsedSeconds * refillRate);
    if (newTokens > 0) {
      bucket.tokens = Math.min(capacity, bucket.tokens + newTokens);
      bucket.lastRefillTimeMilli = currentTime;
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
