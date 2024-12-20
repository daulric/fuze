"use client";

import { useState, Suspense, useEffect, Fragment, useRef } from 'react';
import { User, ChevronDown, ChevronUp, Calendar, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from "./VideoPlayer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { notFound } from 'next/navigation';
import CommentSection from './CommentSection';

const YouTubeStylePlayer = ({ VideoData }) => {
  const [expanded, setExpanded] = useState(false);
  const videoContainerRef = useRef(null);
  const searchParams = useSearchParams();
  const video_id = searchParams.get("id");
  const [isCommenting, setIsCommenting] = useState(false);

  const truncateDescription = (text, limit = 150) => {
    if (!text) return "No description available.";
    const flatText = text.replace(/(\r\n|\n|\r)/gm, " ");
    if (flatText.length <= limit) return text;
    const truncated = flatText.slice(0, limit).trim() + '...';
    return truncated;
  };

  const formatDescription = (text) => {
    if (!text) return "No description available.";
    return text.split(/\r\n|\n|\r/).map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  useEffect(() => {
    const user_client = JSON.parse(localStorage.getItem("user"));

    if (VideoData.is_private === true) {
      if (user_client.username !== VideoData.Account.username) {
        notFound();
      }
    }
  }, [VideoData]);

  if (!video_id) {
    return notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 text-white">
      <br/>
      <div ref={videoContainerRef} className="relative bg-black rounded-lg overflow-hidden shadow-lg mb-6">
        <div style={{ paddingTop: '56.25%' }} className="relative">
          {VideoData ? (
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <Skeleton className="w-full h-full" />
              </div>
            }>
              <div className="absolute inset-0">
                <VideoPlayer 
                  videoSrc={VideoData.video} 
                  poster={VideoData.thumbnail}
                  isCommenting={isCommenting}
                />
              </div>
            </Suspense>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <Skeleton className="w-full h-full" />
            </div>
          )}
        </div>
      </div>

      <div className="px-4 space-y-4">
        <h1 className="text-2xl font-bold leading-tight">{VideoData ? VideoData.title : <Skeleton className="h-8 w-3/4" />}</h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Link href={`/profile/${VideoData?.Account?.username}`} className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={VideoData?.uploaderPic} alt={VideoData?.Account?.username} />
                <AvatarFallback className='bg-gray-600'><User className="h-6 w-6" /></AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{VideoData?.Account?.username || <Skeleton className="h-6 w-24" />}</p>
                <p className="text-sm text-gray-400">
                  {VideoData?.upload_at ? (
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(VideoData.upload_at).toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  ) : (
                    <Skeleton className="h-4 w-32" />
                  )}
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Eye className="h-5 w-5" />
            <span>{VideoData?.views || 0} views</span>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-300 whitespace-pre-wrap">
              {VideoData?.description ? (
                <>
                  {expanded 
                    ? formatDescription(VideoData.description)
                    : truncateDescription(VideoData.description)
                  }
                  {VideoData.description.length > 150 && (
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
                </>
              ) : (
                <Skeleton className="h-20 w-full" />
              )}
            </div>
          </CardContent>
        </Card>

            <Suspense fallback={<div>loading comments</div>} >
            <CommentSection videoId={VideoData.video_id} setIsTyping={setIsCommenting} />
            </Suspense>
      </div>
    </div>
  );
};

export default YouTubeStylePlayer;