'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown, Heart, MessageCircle, Share2, X, Send, Volume2, VolumeX } from 'lucide-react'
import { VideoContainer } from './VideoContainer'
import { CommentsSection } from './CommentSection'

const PulseShorts = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [likePosition, setLikePosition] = useState({ x: 0, y: 0 });
  const lastTapTime = useRef(0);
  const doubleTapDelay = 300; // milliseconds
  const videoRefs = useRef([])

  const videos = [
    {
      id: 1,
      username: "@creator1",
      description: "Amazing sunset timelapse #nature #sunset",
      videoUrl: "/videos/sunset.mp4",
      likes: 1234,
      comments: [
        { id: 1, username: "@user1", text: "This is beautiful!", timestamp: "2h ago" },
        { id: 2, username: "@user2", text: "Perfect lighting!", timestamp: "1h ago" }
      ],
      shares: 45,
      isLiked: false
    },
    {
      id: 2,
      username: "@creator2",
      description: "Quick recipe tutorial #cooking #food",
      videoUrl: "/videos/recipe.mp4",
      likes: 2345,
      comments: [
        { id: 3, username: "@user3", text: "Trying this tonight!", timestamp: "30m ago" },
        { id: 4, username: "@user4", text: "Love this recipe!", timestamp: "15m ago" }
      ],
      shares: 89,
      isLiked: false
    },
    {
      id: 3,
      username: "@creator3",
      description: "Dance challenge #trending #dance",
      videoUrl: "/videos/dance.mp4",
      likes: 5678,
      comments: [
        { id: 5, username: "@user5", text: "Nailed it! 🔥", timestamp: "5m ago" },
        { id: 6, username: "@user6", text: "Great moves!", timestamp: "1m ago" }
      ],
      shares: 167,
      isLiked: false
    }
  ];

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex]
    if (currentVideo) {
      currentVideo.play()
    }
    return () => {
      if (currentVideo) {
        currentVideo.pause()
      }
    }
  }, [currentVideoIndex])

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  const handleLike = () => {
    const updatedVideos = [...videos]
    updatedVideos[currentVideoIndex].isLiked = !updatedVideos[currentVideoIndex].isLiked
    updatedVideos[currentVideoIndex].likes += updatedVideos[currentVideoIndex].isLiked ? 1 : -1
    // Update the videos state here
  }

  const toggleComments = (show) => {
    setShowComments(show)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const updatedVideos = [...videos]
      updatedVideos[currentVideoIndex].comments.unshift({
        id: Date.now(),
        username: '@currentuser',
        text: newComment.trim(),
        timestamp: 'Just now'
      })
      // Update the videos state here
      setNewComment('')
    }
  }

  const handleTouchStart = (e) => {
    if (showComments) return
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e) => {
    if (showComments) return
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (showComments) return
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isUpSwipe = distance > 50
    const isDownSwipe = distance < -50

    if (isUpSwipe) {
      handleNext()
    } else if (isDownSwipe) {
      handlePrevious()
    }
  }

  const handleVideoClick = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.current;
    
    if (tapLength < doubleTapDelay && tapLength > 0) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 50; // 50 is half the heart size
      const y = e.clientY - rect.top - 50;
      
      setLikePosition({ x, y });
      setShowLikeAnimation(true);
      
      // Like the video if not already liked
      if (!videos[currentVideoIndex].isLiked) {
        handleLike();
      }

      // Reset animation after it plays
      setTimeout(() => {
        setShowLikeAnimation(false);
      }, 1000);
    }
    
    lastTapTime.current = currentTime;
  };

  return (
    <div className="h-[calc(100vh-var(--navbar-height))] md:h-screen w-full max-w-md mx-auto bg-black relative overflow-hidden overscroll-none">
      <style jsx global>{`
        :root {
          --navbar-height: 56px;
        }
      `}</style>
      <style jsx>{`
        @keyframes likeAnimation {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          25% {
            opacity: 1;
            transform: scale(1.2);
          }
          50% {
            transform: scale(0.9);
          }
          75% {
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }
      `}</style>

      <div 
        className="h-full w-full relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full w-full relative">
          {videos.map((video, index) => (
            <VideoContainer
              key={video.id}
              video={video}
              index={index}
              currentVideoIndex={currentVideoIndex}
              videoRef={el => videoRefs.current[index] = el}
              isMuted={isMuted}
              toggleMute={toggleMute}
              handleLike={handleLike}
              toggleComments={toggleComments}
              handleVideoClick={handleVideoClick}
              showLikeAnimation={showLikeAnimation}
              likePosition={likePosition}
              setShowLikeAnimation={setShowLikeAnimation}
            />
          ))}
        </div>

        {/* Navigation Indicators */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 flex flex-col gap-4">
          <ChevronUp className={`w-6 h-6 ${currentVideoIndex === 0 ? 'opacity-30' : 'opacity-100'}`} />
          <ChevronDown className={`w-6 h-6 ${currentVideoIndex === videos.length - 1 ? 'opacity-30' : 'opacity-100'}`} />
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentsSection
            video={videos[currentVideoIndex]}
            toggleComments={toggleComments}
            newComment={newComment}
            setNewComment={setNewComment}
            handleCommentSubmit={handleCommentSubmit}
          />
        )}
      </div>
    </div>
  )
}

export default PulseShorts