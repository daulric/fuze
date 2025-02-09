import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from 'lucide-react'

export const VideoContainer = ({ video, index, currentVideoIndex, videoRef, isMuted, toggleMute, handleLike, toggleComments }) => {
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)
  const [likePosition, setLikePosition] = useState({ x: 0, y: 0 })
  const lastTapTime = useRef(0)
  const doubleTapDelay = 300 // milliseconds

  const handleVideoClick = (e) => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTapTime.current
    
    if (tapLength < doubleTapDelay && tapLength > 0) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left - 50 // 50 is half the heart size
      const y = e.clientY - rect.top - 50
      
      setLikePosition({ x, y })
      setShowLikeAnimation(true)
      
      // Like the video if not already liked
      if (!video.isLiked) {
        handleLike()
      }

      // Reset animation after it plays
      setTimeout(() => {
        setShowLikeAnimation(false)
      }, 1000)
    }
    
    lastTapTime.current = currentTime
  }

  return (
    <div
      className={`absolute top-0 left-0 h-full w-full bg-gray-900 transition-opacity duration-300 ${
        index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      <div 
        className="relative h-full w-full"
        onClick={handleVideoClick}
      >
        <video
          src={video.video}
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          loop
          muted={isMuted}
          poster={video.thumbnail}
          />

        {/* Double Tap Like Animation */}
        {showLikeAnimation && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${likePosition.x}px`,
              top: `${likePosition.y}px`,
              animation: 'likeAnimation 1s ease-out forwards'
            }}
          >
            <Heart className="w-24 h-24 text-red-500 fill-current" />
          </div>
        )}

        {/* Volume Control */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleMute()
          }}
          className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {/* Video Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="text-white">
            <p className="font-bold text-lg">@{video.Account.username}</p>
            <p className="text-sm mt-1">{video.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col gap-6">
          <button 
            className="flex flex-col items-center text-white"
            onClick={(e) => {
              e.stopPropagation()
              handleLike()
            }}
          >
            <div className={`bg-black/50 p-2 rounded-full ${video.isLiked ? 'text-red-500' : ''}`}>
              <Heart className={`w-6 h-6 ${video.isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-sm mt-1">{video.likes}</span>
          </button>

          <button 
            className="flex flex-col items-center text-white"
            onClick={(e) => {
              e.stopPropagation()
              toggleComments(true)
            }}
          >
            <div className="bg-black/50 p-2 rounded-full">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-sm mt-1">{video.comments ? video.comments.length : 0}</span>
          </button>

          <button 
            className="flex flex-col items-center text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/50 p-2 rounded-full">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-sm mt-1">{video.shares}</span>
          </button>
        </div>
      </div>
    </div>
  )
}