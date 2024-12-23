import Dashboard from "./dashboard";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
    title: "Dashboard",
    description: "Dashboard to handle content",
}

export default async function PAGE() {
    const user_token = (await cookies()).get("user")
    
    if (!user_token) {
        return notFound();
    }

    return (
        <>
            <Dashboard />
        </>
    )
}