import React from "react";
import Image from "next/image";

import image from "../../assets/male-user-avatar-icon.png";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";

const FeedCard: React.FC = () => {
    return (
        <div className="border border-r-0 border-l-0 border-b-0 border-gray-500 p-4 hover:bg-slate-800 transition-all cursor-pointer">
            <div className="grid grid-cols-12">
                <div className="col-span-1">
                    <Image src={image} alt="" height={50} width={50} />
                </div>
                <div className="col-span-11 px-2">
                    <h5>Suman Acharyya</h5>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Optio aliquid repudiandae asperiores recusandae
                        facere, deserunt, temporibus rerum molestias nesciunt
                        voluptate reprehenderit. Cumque, maiores!
                    </p>
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
