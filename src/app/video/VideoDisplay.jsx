"use client";

import { useState, Suspense, useEffect, Fragment } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import VideoPlayer from "./VideoPlayer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { notFound } from 'next/navigation';

function createProtectedBuffer(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.open("GET", url);
    xhr.send();
  });
}

const YouTubeStylePlayer = ({VideoData}) => {
  const [expanded, setExpanded] = useState(false);
  const [protectedSrc, setProtectedSrc] = useState(null);
  const searchParams = useSearchParams();
  const video_id = searchParams.get("id");

  const truncateDescription = (text, limit = 150) => {
    if (!text) return "No description available.";
    
    // Replace newline characters with spaces for truncation
    const flatText = text.replace(/(\r\n|\n|\r)/gm, " ");
    
    if (flatText.length <= limit) return text;
    
    // Truncate the flattened text
    const truncated = flatText.slice(0, limit).trim() + '...';
    
    return truncated;
  };

  const formatDescription = (text) => {
    if (!text) return "No description available.";
    
    // Replace newline characters with <br /> for proper HTML rendering
    return text.split(/\r\n|\n|\r/).map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  useEffect( () => {

    async function getProtectedItems() {
      const [vid_url, thumb_url] = await Promise.all([
        createProtectedBuffer(VideoData.video),
        createProtectedBuffer(VideoData.thumbnail),
      ]);
      
      console.log("protected items created!");
  
      setProtectedSrc({
        thumbnail: URL.createObjectURL(new Blob([thumb_url])),
        video: URL.createObjectURL(new Blob([vid_url])),
      });
    }

    const user_client = JSON.parse(localStorage.getItem("user"));

    if (!user_client) {
      notFound();
    }

    if (user_client.username !== VideoData.Account.username) {
      notFound();
    }

    getProtectedItems();
  }, [VideoData]);

  if (!video_id) {
    return notFound();
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-900 text-white">
      <Card className="shadow-xl border-gray-800 rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="relative pt-[56.25%] bg-gray-800">
            <div className="absolute inset-0">
              {protectedSrc ? (
                <Suspense fallback={<p className="text-gray-400 flex items-center justify-center h-full">Loading video...</p>}>
                  <VideoPlayer videoSrc={protectedSrc.video} poster={protectedSrc.thumbnail} />
                </Suspense>
              ) : (
                <p className="text-gray-400 flex items-center justify-center h-full">No video available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4">
        <h2 className="text-xl font-bold mb-2">{VideoData ? VideoData.title : ""}</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link href={`/profile/${VideoData?.Account?.username}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={VideoData?.uploaderPic} alt="Uploader" />
                <AvatarFallback className='bg-gray-600'><User className="h-6 w-6" /></AvatarFallback>
              </Avatar>
            </Link>
            <Link href={`/profile/${VideoData?.Account?.username}`} >
              <p className="font-semibold">{VideoData?.Account?.username || ""}</p>
              <p className="text-sm text-gray-400">{VideoData?.upload_at ? new Date(VideoData.upload_at).toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : ""}</p>
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-300 whitespace-pre-wrap">
            {expanded 
              ? formatDescription(VideoData?.description)
              : truncateDescription(VideoData?.description)
            }
          </div>
          {VideoData?.description && VideoData.description.length > 150 && (
            <Button 
              variant="ghost" 
              className="mt-2 text-blue-400 hover:text-blue-300 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeStylePlayer;
