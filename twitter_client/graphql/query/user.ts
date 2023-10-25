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
            recommendedUsers {
                id
                firstName
                lastName
                email
                profileImageURL
            }
            followers {
                id
                firstName
                lastName
                email
                profileImageURL
            }
            following {
                id
                firstName
                lastName
                email
                profileImageURL
            }
            tweets {
                id
                content
                imageURL
                author {
                    id
                    firstName
                    lastName
                    email
                    profileImageURL
                }
            }
        }
    }
`);

export const getUserByIdQuery = graphql(`
    #graphql
    query GetUserById($id: ID!) {
        getUserById(id: $id) {
            id
            firstName
            lastName
            email
            profileImageURL
            followers {
                id
                firstName
                lastName
                email
                profileImageURL
            }
            following {
                id
                firstName
                lastName
                email
                profileImageURL
            }
            tweets {
                id
                content
                imageURL
                author {
                    id
                    firstName
                    lastName
                    email
                    profileImageURL
                }
            }
        }
    }
`);
