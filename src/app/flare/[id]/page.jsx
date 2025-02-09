import { notFound } from "next/navigation"
import PostView from "./PostViewer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const posts = [
  {
    id: "1",
    author: {
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/logo.svg?height=40&width=40",
    },
    content: "Just finished setting up my new workspace! 🖥️ #WorkFromHome #Setup",
    timestamp: "2024-02-09T13:00:00Z",
    images: ["/logo.svg?height=600&width=800"],
  },
  {
    id: "2",
    author: {
      name: "Sarah Wilson",
      username: "sarahw",
      avatar: "/logo.svg?height=40&width=40",
    },
    content: "Beautiful sunset views from today's hike 🌅 #Nature #Hiking",
    timestamp: "2024-02-09T12:30:00Z",
    images: ["/logo.svg?height=600&width=800", "/logo.svg?height=600&width=800"],
  },
  {
    id: "3",
    author: {
      name: "Mike Chen",
      username: "mikec",
      avatar: "/logo.svg?height=40&width=40",
    },
    content: "Some highlights from our team building event! 🎉 #TeamBuilding #WorkCulture",
    timestamp: "2024-02-09T11:45:00Z",
    images: [
      "/logo.svg?height=800&width=600",
      "/logo.svg?height=400&width=600",
      "/logo.svg?height=400&width=600",
      "/logo.svg?height=400&width=600",
    ],
  },
]

export default async function PostPage({ params }) {
  const post = posts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="sticky top-0 z-20 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-14 max-w-3xl items-center px-4">
          <Button variant="ghost" size="icon" asChild className="mr-4 text-gray-300 hover:text-gray-100">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Post</h1>
        </div>
      </header>
      <main className="flex-grow">
        <PostView post={post} />
      </main>
    </div>
  )
}