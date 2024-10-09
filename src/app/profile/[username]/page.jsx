import ProfileDisplay from "../ProfileDisplay"

export const metadata = {
    title: "Profile",
}

export default function PAGE({params}) {
    return <ProfileDisplay username={params?.username} />
}