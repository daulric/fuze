import HistoyClient from "./client"

export const metadata= {
  title: 'Watch History',
  description: 'View your watch history',
}

export default function PAGE() {
    return (
        <HistoyClient />
    )
}