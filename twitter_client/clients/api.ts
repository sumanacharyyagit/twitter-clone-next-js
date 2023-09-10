import { GraphQLClient } from "graphql-request";

export const graphQlClient = new GraphQLClient(
    "http://localhost:8080/api/graphql"
);
