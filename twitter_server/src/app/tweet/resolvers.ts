import { Tweet } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface CreateTweetPayload {
    content: string;
    imageURL?: string;
}

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_S3_KEY ?? "",
        secretAccessKey: process.env.AWS_S3_SECRET ?? "",
    },
    region: "ap-south-1",
});

const queries = {
    getAllTweets: async () =>
        await prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
    getSignedURLForTweet: async (
        parent: any,
        { imageName, imageType }: { imageName: string; imageType: string },
        ctx: GraphqlContext
    ) => {
        try {
            if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
            const allowedImageTypes = ["avif", "webp", "jpeg", "png", "jpg"];
            if (!allowedImageTypes.includes(imageType))
                throw new Error("Unsupported image type!");

            const pcreatePUTObjectCommand = new PutObjectCommand({
                Bucket: "twitter-dev-bucket",
                Key: `/uploads/${
                    ctx.user.id
                }/tweets/${imageName}-${Date.now().toString()}.${imageType}`,
            });

            const signedURL = await getSignedUrl(
                s3Client,
                pcreatePUTObjectCommand,
                { expiresIn: 3600 }
            );
            return signedURL;
        } catch (error) {
            console.log("Error: ", error);

            // throw error;
        }
    },
};

const mutations = {
    createTweet: async (
        parent: any,
        { payload }: { payload: CreateTweetPayload },
        ctx: GraphqlContext
    ) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }
        const tweet = await prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: {
                    connect: { id: ctx.user.id },
                },
            },
        });
        return tweet;
    },
};

const extraResolvers = {
    Tweet: {
        author: (parent: Tweet) =>
            prismaClient.user.findUnique({ where: { id: parent.authorId } }),
    },
};

export const resolvers = { queries, mutations, extraResolvers };
