import { Suspense } from "react"
import AuthPage from "./auth"

export const metadata = {
    title: "zTube - Authorization"
}

export default function PAGE() {
    return (
        <Suspense>
            <AuthPage />
        </Suspense>
    )
}