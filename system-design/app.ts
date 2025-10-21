import express from "express";
import { createBasicTokenBucket } from "./rate-limiter.ts";

const app = express();
const limiter = createBasicTokenBucket(10, 1); // 10 requests at capacity, refill rate = 1/sec

app.use((req, res, next) => {
  const userId = req.ip;
  if (userId && !limiter.isRequestAllowed(userId)) {
    return res.status(429).send("Too many requests");
  }
  next();
});

app.get("/", (req, res) => res.send("Hello world!"));

app.listen(3000, () => console.log("Server running on port 3000"));
