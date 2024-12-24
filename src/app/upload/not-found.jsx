"use client"

import Uinotfound from "@/components/notfound";
import {usePathInfo} from "@/lib/getPathname"

export default function NotFound() {
    const path = usePathInfo();
    return (
        <Uinotfound title="Login" desc="Account Needed" link={`/auth?${path}`}/>
    )
};