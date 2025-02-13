"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, Eye, Share2 } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function PostView({ post }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes || 0)
  const [viewsCount, setViewsCount] = useState(post.views || 0)
  const [authorAvatar, setAuthorAvatar] = useState(null);

  const openImageView = (index) => {
    setSelectedImageIndex(index)
  }

  const closeImageView = () => {
    setSelectedImageIndex(null)
  }

  const goToNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  }

  const goToPreviousImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length)
  }

  const toggleLike = () => {
    setIsLiked((prev) => !prev)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }
  
  useEffect(() => {
    
    async function fetchAuthorAvatar() {
      const response = await fetch(`/api/profile?username=${post.Account.username}`, {
        cache: "no-store",
      });
      
      if (!response.ok) return;
      const { profile } = await response.json();
      if (profile.avatar_url === null) return;
      setAuthorAvatar(profile.avatar_url);
    }
    
    fetchAuthorAvatar();
    
  }, []);

  return (
    <div className="bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gray-800 text-gray-100 border-transparent flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-col sm:flex-row items-start gap-2 border-b border-gray-700 bg-gray-800 z-10 py-3 rounded">
          <div className="flex items-center gap-4 flex-grow">
            <Avatar>
              <AvatarImage src={authorAvatar} alt={post?.Account?.username || "/logo.svg" } />
              <AvatarFallback className="bg-gray-600">{post?.Account?.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post?.Account?.username}</p>
              <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex">
            <div className="flex items-center">
              <Button size="sm" className="bg-transparent hover:bg-transparent">
                <Eye className="h-5 w-5 mr-1 hover:bg-gray-50" />
                <span className="text-sm">{viewsCount}</span>
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={cn("hover:text-red-500", isLiked && "text-red-500", "rounded-full", "hover:bg-gray-600")}
                onClick={toggleLike}
              >
                <Heart className="h-5 w-5 mr-1" />
                <span className="text-sm">{likesCount}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto space-y-4 py-4">
          <p className="text-sm">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className={cn("grid gap-2", post.images.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded-lg",
                    "aspect-square",
                    post.images.length === 3 && index === 0 && "col-span-2 aspect-[2/1]",
                  )}
                  onClick={() => openImageView(index)}
                >
                  <Image
                    src={image || "/logo.svg"}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedImageIndex !== null} onOpenChange={closeImageView}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-gray-800 border-gray-700">
          <DialogTitle className="sr-only">Full size image</DialogTitle>
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full min-h-[300px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={post.images[selectedImageIndex] || "/logo.svg"}
                  alt={`Full size image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  width={1200}
                  height={800}
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {selectedImageIndex + 1} / {post.images.length}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2"
                onClick={goToPreviousImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                onClick={goToNextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
