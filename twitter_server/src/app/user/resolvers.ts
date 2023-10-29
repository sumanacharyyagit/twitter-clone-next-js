import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";
import { redisClient } from "../../clients/redis";

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const tokenValue = await UserService.verifyGoogleAuthToken(token);
        return tokenValue;
    },
    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        try {
            const id = ctx.user?.id;
            if (!id) return null;
            const user = await UserService.getCurrentUserById(id);
            return user;
        } catch (error) {
            // console.log(error, "Error");
            return null;
        }
    },
    getUserById: async (
        parent: any,
        { id }: { id: string },
        ctx: GraphqlContext
    ) => await UserService.getCurrentUserById(id),
};

const mutations = {
    followUser: async (
        parent: any,
        { to }: { to: string },
        ctx: GraphqlContext
    ) => {
        try {
            if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
            await UserService.followUser(ctx.user.id, to);
            await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
            return true;
        } catch (error) {
            return false;
        }
    },
    unfollowUser: async (
        parent: any,
        { to }: { to: string },
        ctx: GraphqlContext
    ) => {
        try {
            if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
            await UserService.unfollowUser(ctx.user.id, to);
            await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
            return true;
        } catch (error) {
            return false;
        }
    },
};

const extraResolvers = {
    User: {
        tweets: async (parent: User) =>
            await prismaClient.tweet.findMany({
                where: { author: { id: parent.id } },
            }),
        followers: async (parent: User) => {
            const res = await prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: {
                    follower: true,
                },
            });
            return res.map((el) => el.follower);
        },
        following: async (parent: User) => {
            const res = await prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: {
                    following: true,
                },
            });
            return res.map((el) => el.following);
        },
        recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
            if (!ctx.user) return [];

            const cachedValue = await redisClient.get(
                `RECOMMENDED_USERS:${ctx.user.id}`
            );

            if (cachedValue) {
                return JSON.parse(cachedValue);
            }

            const myFollowings = await prismaClient.follows.findMany({
                where: { follower: { id: ctx?.user?.id } },
                include: {
                    following: {
                        include: {
                            followers: {
                                include: {
                                    following: true,
                                },
                            },
                        },
                    },
                },
            });

            const toRecommendUsers: User[] = [];
            for (const followers of myFollowings) {
                for (const followingOfFollowedUser of followers.following
                    .followers) {
                    if (
                        followingOfFollowedUser.following.id !== ctx.user.id &&
                        myFollowings.findIndex(
                            (el) =>
                                el?.followerId ===
                                followingOfFollowedUser.following.id
                        ) < 0
                    ) {
                        toRecommendUsers.push(
                            followingOfFollowedUser.following
                        );
                    }
                }
            }

            await redisClient.set(
                `RECOMMENDED_USERS:${ctx.user.id}`,
                JSON.stringify(toRecommendUsers)
            );

            return toRecommendUsers;
        },
    },
};

export const resolvers = { queries, extraResolvers, mutations };
