"use client"

import { useState, Suspense, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

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
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className={`absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-500 ${
              isHovered ? "opacity-20" : "opacity-100"
            }`}
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

const VideoGrid = ({ videos }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {videos.length !== 0 ? videos.map((video, index) => (
      <VideoCard key={index} {...video} />
    )) : (
      <div>wait im loading my ram</div>
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