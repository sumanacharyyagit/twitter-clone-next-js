import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import type { NextPage } from "next";

const UserProfilePage: NextPage = () => {
    return (
        <div>
            <TwitterLayout>
                <h1>Profile Page</h1>
            </TwitterLayout>
        </div>
    );
};

export default UserProfilePage;
