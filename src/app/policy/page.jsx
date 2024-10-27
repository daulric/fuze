import { Suspense } from "react"
import PolicyPage from "./policy"

export const metadata = {
    title: "Policy",
    description: "Website Policy"
}

export default function PAGE() {
    return (
        <Suspense fallback={<div>loading policy...</div>} >
            <PolicyPage />
        </Suspense>
    )
}