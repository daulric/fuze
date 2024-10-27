import UploadPage from "./upload";
import { Suspense } from "react";

export const metadata = {
    title: "Upload",
    description: "Share a video with the world."
}

export default function PAGE() {
    return (
        <Suspense fallback={<div>loading upload page...</div>} >
            <UploadPage />
        </Suspense>
    )
}