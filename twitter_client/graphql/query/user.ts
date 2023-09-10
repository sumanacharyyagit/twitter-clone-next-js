import { graphql } from "../../gql";

export const verifyGoogleTokenQuery = graphql(`
    #graphql
    query VerifyUserGoogleToken($token: String!) {
        verifyGoogleToken(token: $token)
    }
`);
