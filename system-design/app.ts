import express from "express";
import { createBasicSlidingWindowLimiter } from "./rate-limiter.ts";

const app = express();
const limiter = createBasicSlidingWindowLimiter(10, 1); // 10 requests at capacity, refill rate = 1/sec

// middleware
app.use(limiter);

// app.use(authMiddleware);
