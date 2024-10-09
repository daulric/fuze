"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VideoPlayer from "./VideoPlayer";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Supabase from "@/supabase/client";

const YouTubeStylePlayer = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const video_id = searchParams.get("id");
  
  const getVideo = useCallback(async () => {
    if (!video_id) return;
    try {
      const response = await fetch("/api/video", {
        timeout: 5000,
      });

      const data = await response.json();

      if (!data || data.success === false) return;
      const videos_data = data.data;
      const filtered_data = videos_data.filter(item => item.video_id === video_id);
      if (filtered_data.length === 0) return;
      setVideoData(filtered_data[0]);
      setLikeCount(filtered_data[0].likes);

      // Updating the View Count
      /*await axios.post("/api/video/views", {}, {
        params: {
          id: video_id,
        }
      });*/
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  }, [video_id]);

  const getUser = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user, typeof user);
      setUser(user);
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }, []);

  const userLikedTheVideo = useCallback(async () => {
    if (!user || !user.account_id) return;
    try {
      const supa_client = Supabase();
      const { data, error } = await supa_client
        .from("Video Likes")
        .select("liked")
        .eq("account_id", user.account_id)
        .eq("video_id", video_id)
        .single();
      
      if (error) throw error;
      console.log(data, "liked data");
    } catch (error) {
      console.error("Error checking if user liked the video:", error);
    }
  }, [user, video_id]);

  useEffect(() => {
    getUser();
    userLikedTheVideo();
    getVideo();
  }, [getUser, getVideo, userLikedTheVideo]);

  const handleLike = async () => {

    if (userChoice === null || userChoice === false) {
      await axios.post("api/video/likes", {
        account_id: user.account_id,
      }, {
        params: {
          liked: true,
          id: video_id,
        }
      })

      setLikeCount(prev => prev + 1);
      setUserChoice(true);
    } else if (userChoice === true) {

      await axios.post("api/video/likes", {
        account_id: user.account_id,
      }, {
        params: {
          disliked: true,
          id: video_id,
        }
      })

      setLikeCount(prev => prev - 1);
      setUserChoice(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gray-900 text-white shadow-xl border-gray-800 rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="relative pt-[56.25%] bg-gray-800">
          <div className="absolute inset-0">
            {videoData ? (
              <Suspense fallback={<p className="text-gray-400 flex items-center justify-center h-full">Loading video...</p>}>
                <VideoPlayer videoSrc={videoData.video} />
              </Suspense>
            ) : (
              <p className="text-gray-400 flex items-center justify-center h-full">No video available</p>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 line-clamp-2">{videoData ? videoData.title : "Video Title"}</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={videoData?.uploaderAvatar} alt="Uploader" />
                <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{videoData?.Account?.username || "Anonymous"}</p>
                <p className="text-sm text-gray-400">{new Date(videoData?.upload_at).toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) || "unknown"}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={userChoice === 'like' ? 'default' : 'outline'}
                size="sm" 
                className={`p-2 ${
                  userChoice === true
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                <span>{likeCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeStylePlayer;