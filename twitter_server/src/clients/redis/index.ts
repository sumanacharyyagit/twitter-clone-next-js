import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_DB_URL!);
export { redisClient };
