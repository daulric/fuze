import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Flare Not Found</h2>
      <p className="text-white mb-4">Sorry, we couldn't find the post you're looking for.</p>
      <Button className="bg-gray-600">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}