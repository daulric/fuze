"use client"

import { useEffect, useState } from "react";
import HomePage from "./home";
import { useUser } from "@/lib/UserContext";
import CheckAge from "@/lib/checkdob";
import { useSignal, computed, useComputed } from "@preact/signals-react"

function timeAgo(dateStr) {
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

function format_views(views) {
  if (views >= 1e6) {
    return (views / 1e6).toFixed(1) + 'M'; // Format in millions
  } else if (views >= 1e3) {
    return (views / 1e3).toFixed(1) + 'K'; // Format in thousands
  } else {
    return views.toString(); // Return as is for lower values
  }
}

export default function Home() {
  const user = useUser();
  const posts = useSignal(null);
  const data = useSignal(null);

  const HomePageCompute = useComputed(() => ( <HomePage VideoData={data.value} PostsData={posts.value} />  ))

  useEffect(() => {
    async function getRandomVideos() {
      if (data.value) return;
  
      try {
        if (!sessionStorage.getItem("home_page_video_cache")) throw "new";
  
        const store = sessionStorage.getItem("home_page_video_cache") || "{}";
        const cached_videos = JSON.parse(store);
        
        if (!cached_videos.expires || !cached_videos.data) throw "new";
      
        const expired_time = (Date.now() - cached_videos.expires) / 1000;
        if (expired_time > 60) throw "new";
        
        data.value = cached_videos.data;
      } catch (e) {
        if (e === "new") {

          const allow_age_18 = CheckAge(user?.dob) || false;

          const response = await fetch(`/api/video/recommend`, {
            body: JSON.stringify({ limit: 16, length: 60, allow_age_18 }),
            method: "POST",
          }).catch((e) => {
            if (e) return;
          });
        
          if (!response.ok) return;
          const {success, data: new_data} = await response.json();

          if (!success) return;
          
          if (new_data.length === 0) return;

          const temp_data = new_data.map((i) => {
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
          
          const new_cached_data = {
            data: temp_data,
            expires: Date.now(),
          }
          
          sessionStorage.setItem("home_page_video_cache", JSON.stringify(new_cached_data));
          data.value = temp_data;
        }

      }
    }
    
    async function getRandomPosts() {
      if (posts.value) return;

      try {
        if (!sessionStorage.getItem("home_page_posts_cache")) throw "new";

        const store = sessionStorage.getItem("home_page_posts_cache") || "{}";
        const cached_posts = JSON.parse(store);

        if (!cached_posts.expires || !cached_posts.data) throw "new";
      
        const expired_time = (Date.now() - cached_posts.expires) / 1000;
        if (expired_time > 60) throw "new";
        
        posts.value = cached_posts.data;

      } catch (e) {
        if (e === "new") {
          if (posts.value) return;

          const allow_age_18 = CheckAge(user?.dob) || false;

          const response = await fetch(`/api/post/recommend`, {
            body: JSON.stringify({ limit: 16, length: 60, allow_age_18 }),
            method: "POST",
          }).catch((e) => {
            if (e) return;
          });

          if (!response.ok) return;
          const {success, data: new_data} = await response.json();

          if (!success) return;
          if (new_data.length === 0) return;

          const new_cached_data = {
            data: new_data,
            expires: Date.now(),
          }
          
          sessionStorage.setItem("home_page_posts_cache", JSON.stringify(new_cached_data));
          posts.value = new_data;
        }

      }
    }

    getRandomVideos();
    getRandomPosts();
    
    return () => {
      posts.value = null;
      data.value = null;
    }
  }, []);

  return (<>{HomePageCompute}</>);
}