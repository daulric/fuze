import ProfileDisplay from "./ProfileDisplay"
import { Suspense } from "react"

export const metadata = {
    title: "My Profile",
}

export default function PAGE() {
    // Fetch username here
    return (
        <Suspense fallback={<div>loading profile...</div>} >
            <ProfileDisplay />
        </Suspense>
    )
}