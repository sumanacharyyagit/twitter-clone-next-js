import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import React, { useCallback, useState } from "react";

import { graphQlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import { Tweet } from "@/gql/graphql";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { BiImages } from "react-icons/bi";
import { GetServerSideProps } from "next";
import { getAllTweetsQuery } from "@/graphql/query/tweet";

interface HomeProps {
    tweets?: Tweet[];
}
export default function Home({ tweets = [] }: HomeProps) {
    const [content, setContent] = useState("");

    const queryClient = useQueryClient();

    const { user } = useCurrentUser();
    // const { tweets = [] } = useGetAllTweets();

    const { mutate } = useCreateTweet();

    const handleGoogleOAuth = useCallback(
        async (cred: CredentialResponse) => {
            try {
                const googleToken = cred.credential;
                if (!googleToken) {
                    toast.error("Google token not found");
                    return;
                }

                const { verifyGoogleToken }: any = await graphQlClient.request(
                    verifyGoogleTokenQuery,
                    {
                        token: googleToken,
                    }
                );

                toast.success("Verification Success!");
                if (verifyGoogleToken) {
                    window.localStorage.setItem(
                        "__twitter_token",
                        verifyGoogleToken
                    );
                }
                queryClient.invalidateQueries(["current-user"]);
            } catch (error) {
                console.log(error, "error");
            }
        },
        [queryClient]
    );

    const handleSelectImage = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
    }, []);

    const handleCreateTweet = useCallback(() => {
        mutate({
            content,
        });
    }, [content, mutate]);

    return (
        <div>
            <TwitterLayout>
                <>
                    <div>
                        <div className="border border-r-0 border-l-0 border-b-0 border-gray-500 p-4 hover:bg-slate-800 transition-all cursor-pointer">
                            <div className="grid grid-cols-12">
                                <div className="col-span-1">
                                    {user?.profileImageURL && (
                                        <Image
                                            src={user?.profileImageURL}
                                            alt=""
                                            height={50}
                                            width={50}
                                            className="rounded-full"
                                        />
                                    )}
                                </div>
                                <div className="col-span-11">
                                    <textarea
                                        className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                                        rows={3}
                                        placeholder="What's happning?"
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                    ></textarea>
                                    <div className="mt-2 flex justify-between items-center">
                                        <BiImages
                                            onClick={() => handleSelectImage()}
                                            className="text-xl"
                                        />
                                        <button
                                            className="bg-[#1d9bf0] py-2 px-4 rounded-full"
                                            onClick={handleCreateTweet}
                                        >
                                            Tweet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {tweets.length > 0 &&
                        tweets.map((tweet: Tweet) =>
                            tweet ? (
                                <FeedCard key={tweet.id} data={tweet} />
                            ) : (
                                <></>
                            )
                        )}
                </>
            </TwitterLayout>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
    const tweets = await graphQlClient.request(getAllTweetsQuery);
    return {
        props: { tweets: tweets?.getAllTweets as Tweet[] },
    };
};
