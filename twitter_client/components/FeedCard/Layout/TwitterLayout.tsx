import React, { useCallback, useMemo, useState } from "react";

import { graphQlClient } from "@/clients/api";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { BiHash, BiHomeAlt, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import Link from "next/link";

interface ITwitterSidebarButton {
    title: string;
    icon: React.ReactNode;
    link: string;
}

interface TwitterLayoutProps {
    children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = ({ children }) => {
    const [content, setContent] = useState("");

    const queryClient = useQueryClient();

    const { user } = useCurrentUser();
    const { tweets = [] } = useGetAllTweets();

    const { mutate } = useCreateTweet();

    const sidebarMenuItems: ITwitterSidebarButton[] = useMemo(
        () => [
            {
                title: "Home",
                icon: <BiHomeAlt />,
                link: "/",
            },
            {
                title: "Explore",
                icon: <BiHash />,
                link: "/",
            },
            {
                title: "Notifications",
                icon: <BsBell />,
                link: "/",
                link: "/",
            },
            {
                title: "Messages",
                icon: <BsEnvelope />,
                link: "/",
            },
            {
                title: "Bookmarks",
                icon: <BsBookmark />,
                link: "/",
            },
            {
                title: "Twitter Blue",
                icon: <BiMoney />,
                link: "/",
            },
            {
                title: "Profile",
                icon: <BiUser />,
                link: `/${user?.id}`,
            },
            {
                title: "More",
                icon: <HiOutlineDotsCircleHorizontal />,
                link: "/",
            },
        ],
        [user?.id]
    );

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
            <div className="grid grid-cols-12 h-screen w-screen sm:px-56 gap-3">
                <div className="col-span-2 sm:col-span-3  pt-1 flex sm:justify-end pr-4 relative">
                    <div>
                        <div className="text-3xl h-fit w-fit hover:bg-slate-600 rounded-full p-4 cursor-pointer transition-all">
                            <BsTwitter />
                        </div>
                        <div className="mt-2 text-xl pr-4">
                            <ul>
                                {sidebarMenuItems.length &&
                                    sidebarMenuItems.map((item) => (
                                        <li key={item.title}>
                                            <Link
                                                href={item?.link}
                                                className="flex justify-start items-center gap-4 hover:bg-slate-600 rounded-full px-5 py-3 w-fit cursor-pointer mt-4"
                                            >
                                                <span className="text-3xl">
                                                    {item.icon}
                                                </span>
                                                <span className="hidden sm:inline">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                            <div className="px-5 mt-5">
                                <button className="hidden sm:block bg-[#1d9bf0] py-3 px-4 rounded-full w-full">
                                    Tweet
                                </button>
                                <button className="block sm:hidden bg-[#1d9bf0] py-3 px-4 rounded-full w-full">
                                    <BsTwitter />
                                </button>
                            </div>
                        </div>
                    </div>
                    {user && (
                        <div className="absolute flex gap-2 bottom-5 items-center bg-slate-700 p-3 rounded-3xl">
                            {user && user?.profileImageURL && (
                                <Image
                                    className="rounded-full"
                                    src={user?.profileImageURL}
                                    alt="user-image"
                                    height={50}
                                    width={50}
                                />
                            )}
                            <div className="hidden sm:flex flex-col overflow-hidden">
                                <Link
                                    href={`/${user.id}`}
                                    className="cursor-pointer"
                                >
                                    <div>
                                        <h3 className="text-l md:text-xl">
                                            {user?.firstName} {user?.lastName}
                                        </h3>
                                    </div>
                                    <div>
                                        <h3 className="text-l md:text-xl">
                                            {user?.email}
                                        </h3>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-span-10 md:col-span-5 sm:col-span-9 border-r-[0.2px] border-l-[0.2px] h-screen overflow-scroll border-gray-600">
                    {children}
                </div>
                <div className="hidden md:block col-span-3 p-5">
                    {!user && (
                        <div className="p-5 bg-slate-700 rounded-2xl text-center">
                            <h1 className="my-2 md:text-2xl text-xl ">
                                New to Twitter?
                            </h1>
                            <GoogleLogin
                                onSuccess={(cred: CredentialResponse) =>
                                    handleGoogleOAuth(cred)
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwitterLayout;
