import { Tweet } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import UserService from "../../services/user";
import TweetService, { ICreateTweetPayload } from "../../services/twitter";

const s3Client = new S3Client({
    //? Autometically fetches the KEY and SECRET from .env
    region: process.env.AWS_DEFAULT_REGION,
});

const queries = {
    getAllTweets: async () => await TweetService.getAllTweetList(),
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
                Bucket: process.env.AWS_S3_BUCKET,
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
        { payload }: { payload: ICreateTweetPayload },
        ctx: GraphqlContext
    ) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated");
        }
        const tweet = await TweetService.createTweetData({
            ...payload,
            userId: ctx.user.id,
        });

        return tweet;
    },
};

const extraResolvers = {
    Tweet: {
        author: async (parent: Tweet) =>
            await UserService.getCurrentUserById(parent.authorId),
    },
};

export const resolvers = { queries, mutations, extraResolvers };
