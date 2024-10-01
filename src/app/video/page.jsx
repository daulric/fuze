import { Suspense } from "react"
import MainVideoPage from "./Main"

export default function PAGE() {
    return (
        <Suspense>
            <MainVideoPage />
        </Suspense>
    )
}