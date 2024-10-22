"use client"

import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import Image from "next/image"
import { notFound } from 'next/navigation';

import { useSearchParams } from "next/navigation"

const VideoCard = ({ title, channel, views, uploadTime, thumbnail, link, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={link} 
      className="flex flex-col md:flex-row gap-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 w-full mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full md:w-64 h-48 md:h-36">
        <Image src={thumbnail} alt={title} className="w-full h-full object-cover" height={100} width={100}/>
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Play className="text-white" size={48} />
        </div>
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-bold text-lg mb-1 text-white">{title}</h3>
        <p className="text-sm text-gray-400 mb-1">{views} views • {uploadTime}</p>
        <p className="text-sm text-gray-400 mb-2">{channel}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </a>
  );
};

const SearchResults = () => {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        const search_results = searchParams.get("query") || "";
        setSearchQuery(search_results);
    }, [setSearchQuery, searchParams]);

    if (!searchParams.get("query")) {
      return notFound();
    }


  // Sample video data array
    const allVideos = [
        {
        title: "Learn React in 30 minutes",
        channel: "CodeMaster",
        views: "1.2M",
        uploadTime: "2 weeks ago",
        thumbnail: "/logo.svg",
        link: "#",
        description: "A comprehensive guide to learning React basics, hooks, and state management in just 30 minutes. Perfect for beginners!"
        },
        {
        title: "10 JavaScript tricks you didn't know",
        channel: "JS Ninja",
        views: "800K",
        uploadTime: "3 days ago",
        thumbnail: "/logo.svg",
        link: "#",
        description: "Discover advanced JavaScript techniques that will improve your coding skills. Learn about closures, promises, and more."
        },
        {
        title: "Building a fullstack app with NextJS",
        channel: "WebDev Pro",
        views: "500K",
        uploadTime: "1 month ago",
        thumbnail: "/logo.svg",
        link: "#",
        description: "Step-by-step tutorial on building a complete web application using Next.js, React, and a backend API."
        },
        {
        title: "CSS Grid explained",
        channel: "FrontEnd Guru",
        views: "1.5M",
        uploadTime: "2 months ago",
        thumbnail: "/logo.svg",
        link: "#",
        description: "Master CSS Grid layout with practical examples. Learn how to create responsive layouts easily."
        }
    ];

    // Filter videos based on search query
    const filteredVideos = allVideos.filter(video => {
        const searchTerms = searchQuery.toLowerCase();
        return (
        video.title.toLowerCase().includes(searchTerms) ||
        video.channel.toLowerCase().includes(searchTerms) ||
        video.description.toLowerCase().includes(searchTerms)
        );
    });

    return (
        <div className="bg-gray-900 min-h-screen p-4">

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
            {searchQuery && (
            <p className="text-gray-400 mb-4">
                {`Found ${filteredVideos.length} results for "${searchQuery}"`}
            </p>
            )}
            <div className="flex flex-col gap-4">
            {filteredVideos.map((video, index) => (
                <VideoCard key={index} {...video} />
            ))}
            </div>
            {searchQuery && filteredVideos.length === 0 && (
            <div className="text-center text-gray-400 py-8">
                {`No videos found for ${searchQuery}`}
            </div>
            )}
        </div>
        </div>
    );
};

export default SearchResults;