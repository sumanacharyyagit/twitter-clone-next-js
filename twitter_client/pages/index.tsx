import React, { useCallback } from "react";
import Image from "next/image";
import { BsTwitter, BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import { BiHomeAlt, BiHash, BiUser, BiMoney } from "react-icons/bi";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

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
    const handleGoogleOAuth = useCallback((cred: CredentialResponse) => {}, []);

    return (
        <div>
            <div className="grid grid-cols-12 h-screen w-screen px-56 gap-3">
                <div className="col-span-3  pt-1 ml-28">
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
                </div>
                <div className="col-span-5 border-r-[0.2px] border-l-[0.2px] h-screen overflow-scroll border-gray-600">
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
                    <div className="p-5 bg-slate-700 rounded-2xl text-center">
                        <h1 className="my-2 text-2xl">New to Twitter?</h1>
                        <GoogleLogin
                            onSuccess={(cred: CredentialResponse) =>
                                console.log("Credentials: >>> ", cred)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
