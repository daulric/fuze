import { Suspense } from "react"
import MainVideoPage from "./Main"

export const metadata = {
    title: "zTube - Video",
    description: "Watch a video"
}

export default function PAGE() {
    return (
        <Suspense>
            <MainVideoPage />
        </Suspense>
    )
}