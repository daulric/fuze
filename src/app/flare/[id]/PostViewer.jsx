"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import NextImage from "next/image"
import { useSwipeable } from "react-swipeable"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useComputed, useSignal } from "@preact/signals-react"
import { useUser } from "@/lib/UserContext"

export default function PostView({ post }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [authorAvatar, setAuthorAvatar] = useState(null)
  const [dialogLastTap, setDialogLastTap] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const user = useUser()

  const likesCount = useSignal(null)
  const viewsCount = useSignal(post.views || 0)
  const showLikeAnimation = useSignal(false)
  const likeAnimationTimeoutRef = useRef(null)

  const openImageView = (index) => {
    setSelectedImageIndex(index)
  }

  const closeImageView = () => {
    setSelectedImageIndex(null)
  }

  const goToNextImage = () => {
    setSwipeDirection("left")
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % post.images.length)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 150)
  }

  const goToPreviousImage = () => {
    setSwipeDirection("right")
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 150)
  }

  const toggleLike = useCallback(async () => {
    await fetch(`/api/post/likes`, {
      method: "POST",
      body: JSON.stringify({
        liked: !isLiked,
        post_id: post.post_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.ok && res.json())
      .then(({ success }) => {
        if (success) {
          setIsLiked((prev) => !prev)
          likesCount.value = likesCount.value + (isLiked ? -1 : 1)
        }
      })
  }, [isLiked, post.post_id, likesCount])

  const handleDialogTap = useCallback(() => {
    const now = Date.now()
    if (now - dialogLastTap < 200) {

      if (!isLiked) {
        toggleLike()
      }

      showLikeAnimation.value = true;

      if (likeAnimationTimeoutRef.current) {
        clearTimeout(likeAnimationTimeoutRef.current)
      }

      likeAnimationTimeoutRef.current = setTimeout(() => {
        showLikeAnimation.value = false
        likeAnimationTimeoutRef.current = null
      }, 800);
    }

    setDialogLastTap(now)
  }, [dialogLastTap, isLiked, toggleLike])

  useEffect(() => {
    async function fetchAuthorAvatar() {
      const response = await fetch(`/api/profile?username=${post.Account.username}`, {
        cache: "no-store",
      })

      if (!response.ok) return
      const { profile } = await response.json()
      if (profile.avatar_url === null) return
      setAuthorAvatar(profile.avatar_url)
    }

    async function getLikes() {
      if (likesCount.value) return
      const response = await fetch(`/api/post/likes?post_id=${post.post_id}`)

      if (!response.ok) return

      const { success, user_data, all_data } = await response.json()

      if (!success) return

      if (all_data) {
        const liked_data = all_data.filter((i) => i.is_like === true)
        likesCount.value = liked_data.length
        if (user_data) {
          setIsLiked(user_data.is_like)
        }
      }
    }

    fetchAuthorAvatar()
    getLikes()

    // Cleanup function to clear the timeout when the component unmounts
    return () => {
      if (likeAnimationTimeoutRef.current) {
        clearTimeout(likeAnimationTimeoutRef.current)
      }
    }
  }, [post.Account.username, likesCount, post.post_id])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextImage,
    onSwipedRight: goToPreviousImage,
    //onTap: handleDialogTap,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
    delta: 10,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  })

  const showLikeAnimation_Computed = useComputed(() => {
    if (showLikeAnimation.value === true) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart fill="red" className="text-transparent bg-transparent h-24 w-24 animate-ping" />
        </div>
      )
    }
  })

  return (
    <div className="bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gray-800 text-gray-100 border-transparent flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-col sm:flex-row items-start gap-2 border-b border-gray-700 bg-gray-800 z-10 py-3 rounded">
          <div className="flex items-center gap-4 flex-grow">
            <Avatar>
              <AvatarImage src={authorAvatar} alt={post?.Account?.username || "/logo.svg"} />
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
                disabled={!user}
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
                  <NextImage
                    src={image}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={image}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedImageIndex !== null} onOpenChange={closeImageView}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-gray-800 border-gray-700">
          <DialogTitle className="sr-only" />
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full min-h-[300px]" {...swipeHandlers} onTouchStart={() => handleDialogTap()} >
              <div
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out ${
                  isTransitioning
                    ? swipeDirection === "left"
                      ? "translate-x-[-100px] opacity-0"
                      : "translate-x-[100px] opacity-0"
                    : ""
                }`}
              >
                <NextImage
                  src={post.images[selectedImageIndex]}
                  alt=""
                  className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                    isTransitioning ? "scale-95" : "scale-100"
                  }`}
                  width={1200}
                  height={800}
                  priority={selectedImageIndex === 0}
                  unoptimized
                  placeholder="blur"
                  blurDataURL={post.images[selectedImageIndex]}
                />

                { showLikeAnimation_Computed }

                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {selectedImageIndex + 1} / {post.images.length}
                </div>
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