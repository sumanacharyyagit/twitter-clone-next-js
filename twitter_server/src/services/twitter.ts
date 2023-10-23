import { prismaClient } from "../clients/db";

export interface ICreateTweetPayload {
    content: string;
    imageURL?: string;
    userId: string;
}

class TweetService {
    public static async createTweetData(data: ICreateTweetPayload) {
        const tweet = await prismaClient.tweet.create({
            data: {
                content: data.content,
                imageURL: data.imageURL,
                author: {
                    connect: { id: data.userId },
                },
            },
        });
    }
    public static async getAllTweetList() {
        return prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });
    }
}

export default TweetService;
