import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";

export interface ICreateTweetPayload {
    content: string;
    imageURL?: string;
    userId: string;
}

class TweetService {
    public static async createTweetData(data: ICreateTweetPayload) {
        try {
            const rateLimitFlag = await redisClient.get(
                `RATE_LIMIT:TWEET:${data.userId}`
            );
            if (rateLimitFlag) throw new Error("Please wait...!");
            const tweet = await prismaClient.tweet.create({
                data: {
                    content: data.content,
                    imageURL: data.imageURL,
                    author: {
                        connect: { id: data.userId },
                    },
                },
            });

            await redisClient.setex(`RATE_LIMIT:TWEET:${data.userId}`, 10, 1);

            await redisClient.del("ALL_TWEETS");

            return tweet;
        } catch (error) {
            return error;
        }
    }
    public static async getAllTweetList() {
        const cachedTweets = await redisClient.get("ALL_TWEETS");
        if (cachedTweets) return JSON.parse(cachedTweets);
        const tweets = await prismaClient.tweet.findMany({
            orderBy: { createdAt: "desc" },
        });
        await redisClient.setex("ALL_TWEETS", 86400, JSON.stringify(tweets));

        return tweets;
    }
}

export default TweetService;
