import { graphQlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ["all-tweets"],
        queryFn: () => graphQlClient.request(getAllTweetsQuery),
    });

    return { ...query, tweets: query.data?.getAllTweets };
};

export const useCreateTweet = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) =>
            graphQlClient.request(createTweetMutation, {
                payload,
            }),
        onMutate: (payload) =>
            toast.loading("Posting tweet!", { id: "tweet-create" }),
        onSuccess: async (payload) => {
            await queryClient.invalidateQueries(["all-tweets"]);
            toast.success("Successfully posted tweet!", {
                id: "tweet-create",
            });
        },
    });
    return mutation;
};
