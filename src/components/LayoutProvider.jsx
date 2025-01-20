"use client"

import { usePathname } from "next/navigation";
import NavbarLayout from "@/components/navbar/LayoutClient"

export default function LayoutProvider({children}) {

    const excluded_paths = ["dashboar"];
    const paths = usePathname();
    const pathName = paths.split("/")[1];

    if (excluded_paths.includes(pathName)) {
        return <>{children}</>;
    }

    return (
        <NavbarLayout>
          {children}
        </NavbarLayout>
    )
}