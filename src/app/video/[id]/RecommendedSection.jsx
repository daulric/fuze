"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import Link from "next/link";

const RecommendedVideoCard = ({ title, views, thumbnail, link, ...otherData }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={link} className="block">
      <div
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img
            src={thumbnail} 
            alt={title} 
            className="w-full h-24 sm:h-32 object-cover" 
            loading='eager'
          />
          <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Play className="text-white" size={32} />
          </div>
        </div>
        <div className="p-2 sm:p-3">
          <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-2 text-white">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-400">{otherData.Account.username}</p>
          <p className="text-xs text-gray-500">{views} views</p>
        </div>
      </div>
    </Link>
  );
};

const RecommendedVideos = ({ videos }) => {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-2">Recommended Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {videos && videos.map((video, index) => (
            <RecommendedVideoCard key={index} link={`/video?id=${video.video_id}`} { ...video} />
            ))}
        </div>
      </div>
    );
};

export default RecommendedVideos;