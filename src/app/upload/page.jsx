import UploadPage from "./upload";
import { Suspense } from "react";

export const metadata = {
    title: "zTube - Video Upload",
    description: "Share a video with the world."
}

export default function PAGE() {
    return (
        <Suspense>
            <UploadPage />
        </Suspense>
    )
}