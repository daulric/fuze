import { Suspense } from "react"
import AuthPage from "./auth"

export default function PAGE() {
    return (
        <Suspense>
            <AuthPage />
        </Suspense>
    )
}