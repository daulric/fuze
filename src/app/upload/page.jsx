import UploadPage from "./upload";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
    title: "Upload",
    description: "Share a video with the world."
}

export default async function PAGE() {

    const user_token = (await cookies()).get("user")

    if (!user_token) {
        return notFound();
    }

    return (
        <Suspense fallback={<div>loading upload page...</div>} >
            <UploadPage />
        </Suspense>
    )
}