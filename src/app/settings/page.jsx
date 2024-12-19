import SettingsPage from "./settings_page"
import { Suspense } from "react"
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
    title: "Settings",
    description: "Configure your account",
}

export default async function PAGE() {

    const user_token = (await cookies()).get("user")
    
    if (!user_token) {
        return notFound();
    }

    return (
        <Suspense fallback={<div>loading settings...</div>} >
            <SettingsPage />
        </Suspense>
    )
}