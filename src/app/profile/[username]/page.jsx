import ProfileDisplay from "../ProfileDisplay"

export async function generateMetadata({params}) {
    return {
        title: `${params.username} Profile`,
        description: `Profile about ${params.username} and all their information.`
    }
}

export default function PAGE({params}) {
    return <ProfileDisplay username={params?.username} />
}