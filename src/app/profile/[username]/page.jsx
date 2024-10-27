import { Suspense } from "react";
import ProfileDisplay from "../ProfileDisplay"

export async function generateMetadata({params}) {
    const isparams = await params
    return {
        title: `${isparams?.username} Profile`,
        description: `Profile about ${isparams.username} and all their information.`
    }
}

export default async function PAGE({params}) {
    const isparams = await params;
    return (
        <Suspense fallback={<div>loading user profile...</div>} >
            <ProfileDisplay username={isparams?.username} />
        </Suspense>
    )
}