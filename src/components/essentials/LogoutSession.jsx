"use client"

import { cookieStore } from "@/tools/cookieStore"
import { useEffect } from "react";

export default function LogoutSession({loggedOut}) {
    useEffect(() => {
        if (loggedOut === false) {
            return null;
        }

        const user_token = cookieStore.get("user");

        if (user_token !== null ) {
            cookieStore.remove("user");
            localStorage.removeItem("user");
        }

    }, [loggedOut]);

    return null;
}