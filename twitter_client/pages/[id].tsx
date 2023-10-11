import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

const UserProfilePage: NextPage = () => {
    const { user } = useCurrentUser();
    const router = useRouter();

    console.log(router.query?.id, "router.query"); // TODO: Fetch the user by ID

    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className=" flex items-center gap-3 py-3 px-3">
                        <BsArrowLeft className="text-4xl" />
                        <div>
                            <h1 className="text-2xl font-bold">
                                Suman Acharyya
                            </h1>
                            <h1 className="text-md font-bold text-slate-500">
                                100 tweets
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
                            Suman Acharyya
                        </h1>
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

export default UserProfilePage;
