"use client"

import React, { useEffect,  useState } from 'react';
import { Play } from 'lucide-react';
import Image from "next/image"
import { notFound } from 'next/navigation';

import { useSearchParams } from "next/navigation"
import Link from "next/link";

function timeAgo(dateStr) {
  const dateObj = new Date(dateStr);
  const now = new Date();
  const diff = now - dateObj; // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

const VideoCard = ({ title, Account, views, upload_at, thumbnail, video_id, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      className="flex flex-col md:flex-row gap-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 w-full mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      href={{pathname: "/pulse", query:{ id: video_id }}}
    >
      <div className="relative w-full md:w-64 h-48 md:h-36">
        <Image loading='eager' src={thumbnail} alt={title} className="w-full h-full object-cover" height={100} width={100} quality={100}/>
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Play className="text-white" size={48} />
        </div>
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-bold text-lg mb-1 text-white">{title}</h3>
        <p className="text-sm text-gray-400 mb-1">{views} views • {timeAgo(upload_at)}</p>
        <p className="text-sm text-gray-400 mb-2">{Account.username}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
};

const SearchResults = () => {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [searched_videos, setSearchedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      const searchQuery = searchParams.get("query") || "";
      setSearchQuery(searchQuery); // Keep input in sync with URL
      
      const getData = async () => {

        if (!searchQuery) {
          setSearchedVideos([]);
          return;
        }
        
        if (searched_videos.length > 0) return;
        setIsLoading(true);

        try {
          const response = await fetch(`/api/video?search=${searchQuery}`);
          if (!response.ok) throw "error fetching query";

          const data = await response.json();

          setSearchedVideos(data ? data.data : []);
        } catch (error) {
          console.error("Error fetching videos:", error);
          setSearchedVideos([]);
        } finally {
          setIsLoading(false);
        }
      };
  
      getData();
    }, [searchParams]);

    if (!searchParams.get("query")) {
      return notFound();
    }

    return (
      <div className="bg-gray-900 min-h-screen p-4">

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          {searchQuery && (
            <p className="text-gray-400 mb-4">
                {isLoading === false ? `Found ${searched_videos.length} results for "${searchQuery}"` : "waiting..."}
            </p>
          )}
          <div className="flex flex-col gap-4">
            {searched_videos.map((video, index) => (
                <VideoCard key={index} {...video} />
            ))}
          </div>
          {searchQuery && searched_videos.length === 0 && (
            <div className="text-center text-gray-400 py-8">
                {isLoading === false ? `No videos found for ${searchQuery}` : "..."}
            </div>
          )}
        </div>
      </div>
    );
};

export default SearchResults;