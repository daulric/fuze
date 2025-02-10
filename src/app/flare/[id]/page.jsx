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
    content: "Artificial Intelligence (AI) is the simulation of human intelligence in machines, enabling them to learn, reason, and solve problems. AI is widely used in applications such as natural language processing, computer vision, robotics, and automation. Machine learning, a subset of AI, allows systems to improve through experience without explicit programming. AI powers virtual assistants, recommendation systems, autonomous vehicles, and medical diagnostics. While AI enhances efficiency and decision-making, concerns about ethics, bias, and job displacement remain. As AI continues to evolve, responsible development and regulation are crucial to ensuring its benefits outweigh its risks in society.",
    timestamp: "2024-02-09T11:45:00Z",
    images: [
      "/logo.svg",
      "/logo.svg",
      "/logo.svg",
      "/logo.svg",
    ],
  },
]

export const metadata = {
  title: "Flare",
  description: "Flare Content"
}

export default async function PostPage({ params }) {
  const id = (await params).id
  const post = posts.find((p) => p.id === id)

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
          <h1 className="text-lg font-semibold">Flare</h1>
        </div>
      </header>
      {/*<main className=""> */}
        <PostView post={post} />
      {/*</main>*/}
    </div>
  )
}