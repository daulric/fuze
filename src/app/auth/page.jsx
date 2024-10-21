import { Suspense } from "react"
import AuthPage from "./auth"

export const metadata = {
    title: "Authentication"
}

export default function PAGE() {
    return (
        <Suspense>
            <AuthPage />
        </Suspense>
    )
}