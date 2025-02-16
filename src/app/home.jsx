"use client"

import { useState, Suspense, useRef, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const VideoCard = ({ title, channel, views, uploadTime, thumbnail, link, video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef();
  const timeoutRef = useRef();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.muted = true; // Ensure the video is muted for autoplay
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      timeoutRef.current = setTimeout(() => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Link
      className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
      href={link}
    >
      <div className="relative">
        <div
          className="aspect-video w-full relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Transparent background */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
            style={{
              backgroundImage: `url(${thumbnail})`,
            }}
          ></div>

          {/* Main Image */}
          <Image
            src={thumbnail}
            height={100}
            width={300}
            alt=""
            className={`absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-500 ${
              isHovered ? "opacity-20" : "opacity-100"
            }`}
            loading='eager'
          />

          {/* Video Element */}
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
  );
};

export function PostCard({ post_id, username, avatar, created_at, images }) {
  return (
    <Link href={`/flare/${post_id}`}>
      <Card className="hover:bg-gray-800/50 transition-colors">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{username}</p>
            <p className="text-sm text-muted-foreground">{new Date(created_at).toLocaleDateString()}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{post.content}</p>
          {images && images.length > 0 && (
            <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
              <img
                src={images[0] || "/logo.svg"}
                alt="Post preview"
                className="object-cover w-full h-full"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-xs backdrop-blur">
                  +{images.length - 1} more
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

const VideoGrid = ({ videos }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {videos ? videos.map((video, index) => (
      <VideoCard key={index} {...video} />
    )) : (
      <div>tryna find something u like</div>
    )}
  </div>
);

const VideosGrid = ({VideoData}) => {
  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <Suspense fallback={<div>loading some vids...</div>} >
        <VideoGrid videos={VideoData} />
      </Suspense>
    </div>
  );
};

export default VideosGrid;