import { graphQlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { getUserByIdQuery } from "@/graphql/query/user";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";

interface ServerProps {
    user?: User;
}

const UserProfilePage: NextPage<ServerProps> = ({ user }) => {
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
