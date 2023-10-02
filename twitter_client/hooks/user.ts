import { graphQlClient } from "@/clients/api";
import { getCurrentUserDetailsQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: () => graphQlClient.request(getCurrentUserDetailsQuery),
    });

    return { ...query, user: query.data?.getCurrentUser };
};
