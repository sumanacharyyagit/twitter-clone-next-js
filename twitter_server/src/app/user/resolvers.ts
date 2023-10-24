import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";

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
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
        await UserService.followUser(ctx.user.id, to);
        return true;
    },
    unfollowUser: async (
        parent: any,
        { to }: { to: string },
        ctx: GraphqlContext
    ) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
        await UserService.unfollowUser(ctx.user.id, to);
        return true;
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
    },
};

export const resolvers = { queries, extraResolvers, mutations };
