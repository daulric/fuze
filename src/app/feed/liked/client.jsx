"use client"

import Image from 'next/image';
import { Play, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { useComputed, useSignal } from '@preact/signals-react';
import DeepComparison from "@/lib/DeepComparison"
import { notFound } from 'next/navigation';

const LikedVideoCard = ({ title, views,thumbnail, link, Account }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 group">
      <Link href={link} className="block">
        <div className="relative">
          <Image
            src={thumbnail} 
            alt={title} 
            className="w-full h-48 object-cover" 
            width={320} 
            height={180}
            loading='eager'
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="text-white" size={48} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 text-white">{title}</h3>
          <p className="text-sm text-gray-400">{Account.username}</p>
          <p className="text-xs text-gray-500">{views} views</p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <ThumbsUp size={14} className="mr-1" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function LikedVideosPage() {
  const [loggedOut, setisLoggedOut] = useState(false);

  const likedVideos = useSignal([]);
  const likedVideo_Length = useComputed(() => likedVideos.value.length);
  const LikedVideoComponents = useComputed(() => likedVideos.value.map((video) => (
    <LikedVideoCard key={video.video_id} link={`/pulse?id=${video.video_id}`} thumbnail={video.thumbnail} {...video.Video}/>
  )))
  
  useEffect(() => {
    
    async function getLikedVideos() {

      if (likedVideo_Length.value > 0) return;

      const user_liked_history = JSON.parse(localStorage.getItem("user_liked_history"));
      if (user_liked_history) likedVideos.value = user_liked_history;

      const response = await fetch('/api/video/likes/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: '*, Video(*,  Account(username))',
        }),
      });
        
      const {success, data} = await response.json();
      
      if (success && !DeepComparison(user_liked_history, data)) {
        likedVideos.value = data;
        localStorage.setItem("user_liked_history", JSON.stringify(data));
      }
    }
    
    getLikedVideos();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    globalThis.addEventListener("client_side_logout_state", () => setisLoggedOut(true), { signal: controller.signal });
    return () => controller.abort();
  }, []);

  if (loggedOut) notFound();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Liked Videos</h1>
        <div variant="outline" size="sm" className="flex items-center bg-transparent text-gray-50">
          <ThumbsUp size={16} className="mr-2" />
          {likedVideo_Length} videos
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        { LikedVideoComponents }
      </div>
    </div>
  );
}