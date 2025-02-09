"use client"

import { useEffect, useState } from "react";
import HomePage from "./home";
import { Result } from "postcss";

interface VideoItem {
  title: string;
  views: number;
  video_id: string | number;
  upload_at: string;
  Account: { username: string };
  thumbnail: string;
  video: string;
}

type CachedVideos = {
  data: unknown;
  expires: number;
}

function timeAgo(dateStr: string): string {
  const diff =  Date.now() - new Date(dateStr).getTime(); // Difference in milliseconds

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

function format_views(views: number) {
  if (views >= 1e6) {
    return (views / 1e6).toFixed(1) + 'M'; // Format in millions
  } else if (views >= 1e3) {
    return (views / 1e3).toFixed(1) + 'K'; // Format in thousands
  } else {
    return views.toString(); // Return as is for lower values
  }
}

export default function Home() {
  const [data, setData] = useState<unknown | null>(null);

  useEffect(() => {
    async function getRandomVideos() {
      try {
        if (data) return;
        if (!sessionStorage.getItem("home_page_video_cache")) throw "new";
  
        const store: string = sessionStorage.getItem("home_page_video_cache") || "{}";
        const cached_videos: CachedVideos = JSON.parse(store);
        
        if (!cached_videos.expires || !cached_videos.data) throw "new";
      
        const expired_time = (Date.now() - cached_videos.expires) / 1000;
        if (expired_time > 15) throw "new";
        
        setData(cached_videos.data);
      } catch (e) {

        if (e === "new") {
          if (data) return;
          
          const response = await fetch(`/api/video/recommend`, {
            body: JSON.stringify({ limit: 16 }),
            method: "POST",
          });
        
          if (!response.ok) return;
          const {success, data: new_data} = await response.json();
          console.log(success, new_data);
          if (!success) return;
          
          if (new_data.length === 0) return;

          const temp_data = new_data.map((i: VideoItem) => {
            return {
              title: i.title,
              views: format_views(i.views),
              link: `/pulse?id=${i.video_id}`,
              uploadTime: timeAgo(i.upload_at),
              channel: i.Account.username,
              thumbnail: i.thumbnail,
              video: i.video
            };
          });
          
          const new_cached_data: CachedVideos = {
            data: temp_data,
            expires: Date.now(),
          }
          
          sessionStorage.setItem("home_page_video_cache", JSON.stringify(new_cached_data));
          setData(temp_data);
        }

      }
    }
    
    getRandomVideos();
  }, []);

  return (
    <>
      <HomePage VideoData={data}/>
    </>
  );
}