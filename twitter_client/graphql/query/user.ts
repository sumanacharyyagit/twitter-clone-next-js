import { graphql } from "@/gql";

export const verifyGoogleTokenQuery = graphql(`
    #graphql
    query VerifyUserGoogleToken($token: String!) {
        verifyGoogleToken(token: $token)
    }
`);

export const getCurrentUserDetailsQuery = graphql(`
    #graphql
    query GetCurrentUser {
        getCurrentUser {
            id
            email
            firstName
            lastName
            profileImageURL
        }
    }
`);
