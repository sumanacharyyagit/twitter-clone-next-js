import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphQlClient = new GraphQLClient(
    "http://localhost:8080/api/graphql",
    {
        headers: () => ({
            Authorization: isClient
                ? `Bearer ${window.localStorage.getItem("__twitter_token")}`
                : "",
        }),
    }
);
