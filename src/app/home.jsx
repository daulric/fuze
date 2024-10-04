"use client"

import React, { useState } from 'react';
import { Play } from 'lucide-react';

const VideoCard = ({ title, channel, views, uploadTime, thumbnail, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={link} 
      className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img src={thumbnail} alt={title} className="w-full h-40 object-cover" />
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

// Example usage
const ExampleVideoGrid = () => {
  const sampleVideos = [
    { title: "Learn React in 30 minutes", channel: "CodeMaster", views: "1.2M", uploadTime: "2 weeks ago", thumbnail: "/api/placeholder/320/180", link: "#" },
    { title: "10 JavaScript tricks you didn't know", channel: "JS Ninja", views: "800K", uploadTime: "3 days ago", thumbnail: "/api/placeholder/320/180", link: "#" },
    { title: "Building a fullstack app with NextJS", channel: "WebDev Pro", views: "500K", uploadTime: "1 month ago", thumbnail: "/api/placeholder/320/180", link: "#" },
    { title: "CSS Grid explained", channel: "FrontEnd Guru", views: "1.5M", uploadTime: "2 months ago", thumbnail: "/api/placeholder/320/180", link: "#" },
    { title: "TypeScript basics for beginners", channel: "TypeMaster", views: "300K", uploadTime: "1 week ago", thumbnail: "/api/placeholder/320/180", link: "#" },
    { title: "Docker for developers", channel: "DevOps Daily", views: "900K", uploadTime: "3 weeks ago", thumbnail: "/api/placeholder/320/180", link: "#" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <VideoGrid videos={sampleVideos} />
    </div>
  );
};

export default ExampleVideoGrid;