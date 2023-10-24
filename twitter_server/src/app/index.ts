import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";
import { Tweet } from "./tweet";
import { User } from "./user";

export async function initServer() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    // prismaClient.user.create({
    //     data: {},
    // });

    const graphQlServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types}
            ${Tweet.types}  
            type Query {
                ${User.queries}
                ${Tweet.queries}
            }

            type Mutation {
                ${User.mutations}
                ${Tweet.mutations}
            }

        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries,
            },

            Mutation: {
                ...User.resolvers.mutations,
                ...Tweet.resolvers.mutations,
            },
            ...User.resolvers.extraResolvers,
            ...Tweet.resolvers.extraResolvers,
        },
    });

    await graphQlServer.start();

    app.use(
        "/api/graphql",
        expressMiddleware(graphQlServer, {
            context: async ({ req, res }) => {
                return {
                    user: req?.headers?.authorization
                        ? JWTService.decodeToken(req.headers.authorization)
                        : undefined,
                };
            },
        })
    );

    return app;
}
