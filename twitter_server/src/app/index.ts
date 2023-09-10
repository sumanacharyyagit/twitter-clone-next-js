import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { prismaClient } from "../clients/db";
import { User } from "./user";

export async function initServer() {
    const app = express();
    app.use(express.json());

    // prismaClient.user.create({
    //     data: {},
    // });

    const graphQlServer = new ApolloServer({
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

    app.use("/api/graphql", expressMiddleware(graphQlServer));

    return app;
}
