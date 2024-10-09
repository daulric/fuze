import ProfileDisplay from "./ProfileDisplay"
import { useRouter } from "next/router"

export const metadata = {
    title: "Profile",
}

export default function PAGE() {
    const router = useRouter();
    const username = router.query.username;
    return <ProfileDisplay username={username} />
}