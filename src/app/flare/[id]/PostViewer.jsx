"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function PostView({ post }) {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gray-800 text-gray-100 min-h-[calc(100vh-2rem)]">
        <CardHeader className="flex flex-row items-center gap-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="bg-gray-600">{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-sm text-gray-400">{new Date(post.timestamp).toLocaleDateString()}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
          <p>{post.content}</p>
          {post.images && (
            <div
              className={cn(
                "grid gap-2",
                post.images.length === 1 && "grid-cols-1",
                post.images.length === 2 && "grid-cols-2",
                post.images.length >= 3 && "grid-cols-2",
              )}
            >
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded-lg",
                    "aspect-[4/3]",
                    post.images.length >= 3 && index === 0 && "row-span-2",
                  )}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-gray-800 border-gray-700">
          <DialogTitle className="sr-only">Full size image</DialogTitle>
          {selectedImage && (
            <div className="relative w-full h-full">
              <Image src={selectedImage || "/placeholder.svg"} alt="Full size image" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}