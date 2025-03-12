"use client"

import { useEffect, useState } from "react"
import { Play } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useComputed, useSignal } from "@preact/signals-react"

function timeAgo(dateStr) {
  const dateObj = new Date(dateStr)
  const now = new Date()
  const diff = now - dateObj // Difference in milliseconds

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  return "just now"
}

const VideoCard = ({ title, Account, views, upload_at, thumbnail, video_id, description }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      className="flex flex-col md:flex-row gap-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 w-full mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      href={{ pathname: "/pulse", query: { id: video_id } }}
    >
      <div className="relative w-full md:w-64 h-48 md:h-36">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          height={100}
          width={100}
          quality={100}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <Play className="text-white" size={48} />
        </div>
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-bold text-lg mb-1 text-white">{title}</h3>
        <p className="text-sm text-gray-400 mb-1">
          {views} views • {timeAgo(upload_at)}
        </p>
        <p className="text-sm text-gray-400 mb-2">{Account.username}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </Link>
  )
}

const PostCard = ({ post_id, Account, views, created_at, images, content }) => {

  return (
    <Link
      className="flex flex-col md:flex-row gap-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 w-full mb-4"
      href={`/flare/${post_id}`}
    >
      {images && images.length > 0 ? (
        <div className="relative w-full md:w-64 h-48 md:h-36">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt="Post image"
            className="w-full h-full object-cover"
            height={100}
            width={100}
            quality={100}
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-xs backdrop-blur">
              +{images.length - 1} more
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full md:w-64 h-48 md:h-36 bg-gray-700 flex items-center justify-center p-4">
          <p className="text-gray-200 line-clamp-6 overflow-hidden text-lg">{content}</p>
        </div>
      )}
      <div className="p-4 flex-1">
        <h3 className="font-bold text-lg mb-1 text-white">{Account.username}</h3>
        <p className="text-sm text-gray-400 mb-1">
          {views || 0} views • {timeAgo(created_at)}
        </p>
        {images && images.length > 0 ? (
          <p className="text-sm text-gray-500 line-clamp-2">{content}</p>
        ) : (
          <p className="text-sm text-gray-400 hidden md:block">Text Post</p>
        )}
      </div>
    </Link>
  )
}

const MixedSearchResults = () => {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  // Search data signals
  const searched_videos = useSignal([])
  const searched_posts = useSignal([])

  const totalResultsCount = useComputed(() => searched_videos.value.length + searched_posts.value.length)

  const isLoading = useSignal(false)

  // Computed values for UI display
  const results_found = useComputed(() => {
    return (
      searchQuery && (
        <p className="text-gray-400 mb-4">
          {isLoading.value === false && `Found ${totalResultsCount.value} results for "${searchQuery}"`}
        </p>
      )
    )
  })

  const searchStatus = useComputed(() => {
    return (
      searchQuery &&
      totalResultsCount.value === 0 && (
        <div className="text-center text-gray-400 py-8">
          {isLoading.value === false ? `No results found for "${searchQuery}"` : "Searching... please wait"}
        </div>
      )
    )
  })

  // Combined search results
  const combinedResults = useComputed(() => {
    // Combine videos and posts
    const combined = [
      ...searched_videos.value.map((video) => ({ ...video, type: "video" })),
      ...searched_posts.value.map((post) => ({ ...post, type: "post" })),
    ]

    // Sort by date (newest first)
    combined.sort((a, b) => {
      const dateA = new Date(a.type === "video" ? a.upload_at : a.created_at)
      const dateB = new Date(b.type === "video" ? b.upload_at : b.created_at)
      return dateB - dateA
    })

    return combined.map((item, index) =>
      item.type === "video" ? (
        <VideoCard key={`video-${index}`} {...item} />
      ) : (
        <PostCard key={`post-${index}`} {...item} />
      ),
    )
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery || searchQuery.length === 0) return

      // Reset results when search query changes
      searched_videos.value = []
      searched_posts.value = []
      isLoading.value = true

      try {
        // Fetch videos
        const videoResponse = await fetch(`/api/video?search=${searchQuery}`)
        if (videoResponse.ok) {
          const { data: videoData } = await videoResponse.json()
          searched_videos.value = videoData || []
        }

        // Fetch posts
        const postResponse = await fetch(`/api/post?search=${searchQuery}`)
        if (postResponse.ok) {
          const { data: postData } = await postResponse.json()
          searched_posts.value = postData || []
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        isLoading.value = false
      }
    }

    fetchData()

    return () => {
      searched_videos.value = []
      searched_posts.value = []
    }
  }, [searchParams, searchQuery])

  if (!searchParams.get("query")) {
    return notFound()
  }

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {results_found}

        <div className="flex flex-col gap-4">
          {combinedResults}
        </div>

        {searchStatus}
      </div>
    </div>
  )
}

export default MixedSearchResults