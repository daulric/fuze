import SettingsPage from "./settings_page"
import { Suspense } from "react"

export const metadata = {
    title: "Settings",
    description: "Configure your account",
}

export default function PAGE() {
    return (
        <Suspense fallback={<div>loading settings...</div>} >
            <SettingsPage />
        </Suspense>
    )
}