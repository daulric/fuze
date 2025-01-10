"use client"

import { useState, Suspense } from 'react';
import { Play } from 'lucide-react';
import Image from "next/image";

const VideoCard = ({ title, channel, views, uploadTime, thumbnail, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      href={link}
    >
      <div className="relative">
        <Image loading='eager' src={thumbnail} alt={title} className="w-full h-40 object-cover" width={150} height={100}/>
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Play className="text-white" size={48} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate text-white">{title}</h3>
        <p className="text-sm text-gray-400">{channel}</p>
        <p className="text-xs text-gray-500">{views} views • {uploadTime}</p>
      </div>
    </a>
  );
};

const VideoGrid = ({ videos }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {videos.map((video, index) => (
      <VideoCard key={index} {...video} />
    ))}
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