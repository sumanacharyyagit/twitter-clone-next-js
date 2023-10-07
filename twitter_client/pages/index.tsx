import React, { use, useCallback } from "react";
import Image from "next/image";
import { BsTwitter, BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import { BiHomeAlt, BiHash, BiUser, BiMoney, BiImages } from "react-icons/bi";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { graphQlClient } from "@/clients/api";
import { verifyGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
interface ITwitterSidebarButton {
    title: string;
    icon: React.ReactNode;
}

const sidebarMenuItems: ITwitterSidebarButton[] = [
    {
        title: "Home",
        icon: <BiHomeAlt />,
    },
    {
        title: "Explore",
        icon: <BiHash />,
    },
    {
        title: "Notifications",
        icon: <BsBell />,
    },
    {
        title: "Messages",
        icon: <BsEnvelope />,
    },
    {
        title: "Bookmarks",
        icon: <BsBookmark />,
    },
    {
        title: "Twitter Blue",
        icon: <BiMoney />,
    },
    {
        title: "Profile",
        icon: <BiUser />,
    },
    {
        title: "More",
        icon: <HiOutlineDotsCircleHorizontal />,
    },
];

export default function Home() {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

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

    return (
        <div>
            <div className="grid grid-cols-12 h-screen w-screen px-56 gap-3">
                <div className="col-span-3  pt-1 ml-28 relative">
                    <div className="text-3xl h-fit w-fit hover:bg-slate-600 rounded-full p-4 cursor-pointer transition-all">
                        <BsTwitter />
                    </div>
                    <div className="mt-2 text-xl pr-4">
                        <ul>
                            {sidebarMenuItems.length &&
                                sidebarMenuItems.map((item) => (
                                    <li
                                        className="flex justify-start items-center gap-4 hover:bg-slate-600 rounded-full px-5 py-3 w-fit cursor-pointer mt-4"
                                        key={item.title}
                                    >
                                        <span className="text-3xl">
                                            {item.icon}
                                        </span>
                                        <span>{item.title}</span>
                                    </li>
                                ))}
                        </ul>
                        <div className="px-5 mt-5">
                            <button className="bg-[#1d9bf0] py-3 px-4 rounded-full w-full">
                                Tweet
                            </button>
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
                            <div className="flex flex-col overflow-hidden">
                                <div>
                                    <h3 className="text-xl">
                                        {user?.firstName} {user?.lastName}
                                    </h3>
                                </div>
                                <div>
                                    <h3 className="text-xl">{user?.email}</h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-span-5 border-r-[0.2px] border-l-[0.2px] h-screen overflow-scroll border-gray-600">
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
                                    ></textarea>
                                    <div className="mt-2 flex justify-between items-center">
                                        <BiImages
                                            onClick={() => handleSelectImage()}
                                            className="text-xl"
                                        />
                                        <button className="bg-[#1d9bf0] py-2 px-4 rounded-full">
                                            Tweet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                </div>
                <div className="col-span-3 p-5">
                    {!user && (
                        <div className="p-5 bg-slate-700 rounded-2xl text-center">
                            <h1 className="my-2 text-2xl">New to Twitter?</h1>
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
}
