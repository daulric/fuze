"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VideoPlayer from "./VideoPlayer";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const YouTubeStylePlayer = () => {
  const [likeCount, setLikeCount] = useState(100);
  const [dislikeCount, setDislikeCount] = useState(20);
  const [userChoice, setUserChoice] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const searchParams = useSearchParams();
  const video_id = searchParams.get("id");
  
  useEffect(() => {
    async function getVideo() {
      if (!video_id) return;
      const { data } = await axios.get("/api/video/all");
      if (!data || data.success === false) return;
      const videos_data = data.data;
      const filtered_data = videos_data.filter(item => item.video_id === video_id);
      if (filtered_data.length === 0) return;
      setVideoData(filtered_data[0]);
    }
    getVideo();
  }, [video_id]);

  const handleLike = () => {
    if (userChoice === null) {
      setLikeCount(prev => prev + 1);
      setUserChoice('like');
    } else if (userChoice === 'dislike') {
      setLikeCount(prev => prev + 1);
      setDislikeCount(prev => prev - 1);
      setUserChoice('like');
    }
  };

  const handleDislike = () => {
    if (userChoice === null) {
      setDislikeCount(prev => prev + 1);
      setUserChoice('dislike');
    } else if (userChoice === 'like') {
      setDislikeCount(prev => prev + 1);
      setLikeCount(prev => prev - 1);
      setUserChoice('dislike');
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
                  userChoice === 'like'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                <span>{likeCount}</span>
              </Button>
              <Button
                variant={userChoice === 'dislike' ? 'default' : 'outline'}
                size="sm" 
                className={`p-2 ${
                  userChoice === 'dislike'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                onClick={handleDislike}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                <span>{dislikeCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeStylePlayer;