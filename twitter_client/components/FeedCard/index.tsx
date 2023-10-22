import React from "react";
import Image from "next/image";

import image from "../../assets/male-user-avatar-icon.png";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedcardProps {
    data: Tweet;
}

const FeedCard: React.FC<FeedcardProps> = ({ data }) => {
    return (
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-500 p-4 hover:bg-slate-800 transition-all cursor-pointer">
            <div className="grid grid-cols-12">
                <div className="col-span-1">
                    {data?.author?.profileImageURL && (
                        <Image
                            src={data?.author?.profileImageURL}
                            alt={data?.author?.firstName}
                            height={50}
                            width={50}
                            className="rounded-full"
                        />
                    )}
                </div>
                <div className="col-span-11 px-2">
                    <h5>
                        <Link
                            href={`/${data?.author?.id}`}
                            className="cursor-pointer"
                        >
                            {data?.author?.firstName} {data?.author?.lastName}
                        </Link>
                    </h5>
                    <p>{data?.content}</p>
                    {data?.imageURL && (
                        <Image
                            src={data?.imageURL}
                            alt="tweet-image"
                            width={700}
                            height={700}
                        />
                    )}
                    <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            <AiOutlineRetweet />
                        </div>
                        <div>
                            <AiOutlineHeart />
                        </div>
                        <div>
                            <BiUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedCard;
