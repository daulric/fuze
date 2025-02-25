"use client"

import { useState, Suspense, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const VideoCard = ({ title, channel, views, uploadTime, thumbnail, link, video }) => {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef()
  const timeoutRef = useRef()

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsHovered(true)
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error)
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      timeoutRef.current = setTimeout(() => {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }, 100)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Link
      className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
      href={link}
    >
      <div className="relative">
        <div className="aspect-video w-full relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div
            className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
            style={{
              backgroundImage: `url(${thumbnail})`,
            }}
          ></div>

          <Image
            src={thumbnail || "/placeholder.svg"}
            height={100}
            width={300}
            alt=""
            className={`absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-500 ${
              isHovered ? "opacity-20" : "opacity-100"
            }`}
            unoptimized
          />

          <video
            ref={videoRef}
            src={video}
            className={`absolute inset-0 w-full h-full object-contain z-20 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            preload="auto"
            muted
            playsInline
            crossOrigin="anonymous"
            controlsList="nodownload"
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate text-white">{title}</h3>
        <p className="text-sm text-gray-400">{channel}</p>
        <p className="text-xs text-gray-500">
          {views} views • {uploadTime}
        </p>
      </div>
    </Link>
  )
}

const PostCard = ({ post_id, username, avatar, created_at, images, content }) => {
  return (
    <Link
      className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
      href={`/flare/${post_id}`}
    >
      <div className="relative">
        <div className="aspect-video w-full relative">
          {images && images.length > 0 ? (
            <>
              <Image
                src={images[0] || "/placeholder.svg"}
                height={100}
                width={300}
                alt="Post preview"
                className="absolute inset-0 w-full h-full object-cover z-10"
                unoptimized
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-xs backdrop-blur z-20">
                  +{images.length - 1} more
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center p-4">
              <p className="text-gray-200 text-sm line-clamp-6 overflow-hidden">{content}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-2">
          <Avatar className="w-8 h-8 mr-2 text-gray-500">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg truncate text-white">{username}</h3>
            <p className="text-xs text-gray-500">{new Date(created_at).toLocaleDateString()}</p>
          </div>
        </div>
        {images && images.length > 0 && <p className="text-sm text-gray-400 line-clamp-2">{content}</p>}
      </div>
    </Link>
  )
}

const MixedContentGrid = ({ videoData, postData }) => {
  const combinedContent = [...videoData, ...postData].sort(() => Math.random() - 0.5)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {combinedContent.map((item, index) => (
        <div key={index}>{item.hasOwnProperty("video") ? <VideoCard {...item} /> : <PostCard username={item.Account.username} {...item} />}</div>
      ))}
    </div>
  )
}

const MixedContentPage = ({ VideoData, PostsData }) => {

  if (!VideoData || !PostsData) {
    return (
      <>looooking at my algorithm</>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <Suspense fallback={<div>Loading content...</div>}>
        <MixedContentGrid videoData={VideoData} postData={PostsData} />
      </Suspense>
    </div>
  )
}

export default MixedContentPage