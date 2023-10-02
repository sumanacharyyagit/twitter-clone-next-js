import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { prismaClient } from "../clients/db";
import { User } from "./user";
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";

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
            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
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
