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

const extraResolvers = {
    User: {
        tweets: async (parent: User) =>
            await prismaClient.tweet.findMany({
                where: { author: { id: parent.id } },
            }),
    },
};

export const resolvers = { queries, extraResolvers };
