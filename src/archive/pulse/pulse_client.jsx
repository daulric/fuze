'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { ChevronUp, ChevronDown, Heart, MessageCircle, Share2, X, Send, Volume2, VolumeX } from 'lucide-react'
import { VideoContainer } from './VideoContainer'
import { CommentsSection } from './CommentSection'
import waitFor from "@/lib/waitFor"

const PulseShorts = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [isMuted, setIsMuted] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [likePosition, setLikePosition] = useState({ x: 0, y: 0 });
  const lastTapTime = useRef(0);
  const doubleTapDelay = 300; // milliseconds
  const videoRefs = useRef([]);
  const [videos, setVideos] = useState(null);
  
  useEffect(() => {
    const shuffleArrayAsync = async (array) => {
      return array.map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }, index) => ({ id: index, ...value }));
    };

    async function getVideosFromSrc() {
      if (videos) return;
      const res = await fetch(`/api/video`);
      if (!res.ok) return;
      
      const { data } = await res.json();

      if (data) {
        const temp_data = await shuffleArrayAsync([...data]);
        setVideos(temp_data);
      }
    
    }
    
    getVideosFromSrc();
  }, [])
  
  useEffect(() => {
    
    let currentVideo;
    
    waitFor(() => videoRefs.current.length !== 0).then(() => {
      if (videoRefs.current.length === 0) return;
      currentVideo = videoRefs.current[currentVideoIndex];
  
      if (currentVideo) {
        if (currentVideo.paused) {
          currentVideo.currentTime = 0;
          currentVideo.play();
        }
      }
    });
    
    
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
          {videos ? videos.map((video, index) => (
            <VideoContainer
              key={video.video_id}
              video={video}
              index={index}
              currentVideoIndex={currentVideoIndex}
              videoRef={(el) => {
                if (el) {
                  videoRefs.current[video.id] = el;
                  
                  if (currentVideoIndex !== video.id && el.readyState < 3) {
                    el.load();
                  }
                  
                }
              }}
              isMuted={isMuted}
              toggleMute={toggleMute}
              handleLike={handleLike}
              toggleComments={toggleComments}
              handleVideoClick={handleVideoClick}
              showLikeAnimation={showLikeAnimation}
              likePosition={likePosition}
              setShowLikeAnimation={setShowLikeAnimation}
            />
          )): (<div>pulses are loading</div>)}
        </div>

        {/* Navigation Indicators */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 flex flex-col gap-4">
          <ChevronUp className={`w-6 h-6 ${currentVideoIndex === 0 ? 'opacity-30' : 'opacity-40'}`} />
          <ChevronDown className={`w-6 h-6 ${currentVideoIndex === (videos && videos.length - 1) ? 'opacity-30' : 'opacity-40'}`} />
        </div>

        {/* Comments Section */}
        {showComments && (
          <Suspense fallback={<div>loading comments</div>} >
            <CommentsSection
              video={videos[currentVideoIndex]}
              toggleComments={toggleComments}
              newComment={newComment}
              setNewComment={setNewComment}
              handleCommentSubmit={handleCommentSubmit}
            />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default PulseShorts