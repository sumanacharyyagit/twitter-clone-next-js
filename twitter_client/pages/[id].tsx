import { graphQlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import {
    followUserMutation,
    unfollowUserMutation,
} from "@/graphql/mutation/user";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { BsArrowLeft } from "react-icons/bs";

interface ServerProps {
    user?: User;
}

const UserProfilePage: NextPage<ServerProps> = ({ user }) => {
    const router = useRouter();
    const { user: currentUser } = useCurrentUser();

    const queryClient = useQueryClient();

    const handleFollowUser = useCallback(async () => {
        if (!user?.id) return;
        await graphQlClient.request(followUserMutation, { to: user?.id });
        await queryClient.invalidateQueries(["current-user"]);
    }, [user?.id, queryClient]);

    const handleUnfollowUser = useCallback(async () => {
        if (!user?.id) return;
        await graphQlClient.request(unfollowUserMutation, { to: user?.id });
        await queryClient.invalidateQueries(["current-user"]);
    }, [user?.id, queryClient]);

    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className=" flex items-center gap-3 py-3 px-3">
                        <BsArrowLeft className="text-4xl" />
                        <div>
                            <h1 className="text-2xl font-bold">
                                {`${user?.firstName} ${user?.lastName}`}
                            </h1>
                            <h1 className="text-md font-bold text-slate-500">
                                {user?.tweets?.length} tweets
                            </h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {user && user?.profileImageURL && (
                            <Image
                                src={user.profileImageURL}
                                alt="userImage"
                                className="rounded-full"
                                width={200}
                                height={200}
                            />
                        )}
                        <h1 className="text-2xl font-bold mt-5">
                            {`${user?.firstName} ${user?.lastName}`}
                        </h1>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 mt-2 text-sm text-gray-300">
                                <span>{user?.followers?.length} Followers</span>
                                <span>{user?.following?.length} Following</span>
                            </div>
                            {currentUser?.id != user?.id && (
                                <>
                                    {(currentUser?.following &&
                                        currentUser?.following?.findIndex(
                                            (el: { id: string }) =>
                                                el?.id === user?.id
                                        )) ??
                                    -1 < 0 ? (
                                        <button
                                            onClick={handleFollowUser}
                                            className="bg-white text-black px-3 py-1 rounded-full text-sm"
                                        >
                                            Follow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleUnfollowUser}
                                            className="bg-white text-black px-3 py-1 rounded-full text-sm"
                                        >
                                            unfollow
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        {user &&
                            user?.tweets?.map((tweet) => (
                                <FeedCard
                                    key={tweet?.id}
                                    data={tweet as Tweet}
                                />
                            ))}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
    context
) => {
    const id = context.query.id as string | undefined;
    if (!id)
        return {
            notFound: true,
            props: {
                user: undefined,
            },
        };
    const userInfo = await graphQlClient.request(getUserByIdQuery, { id });
    if (!userInfo)
        return {
            notFound: true,
            props: {
                user: undefined,
            },
        };

    return {
        props: {
            user: userInfo?.getUserById as User,
        },
    };
};

export default UserProfilePage;
