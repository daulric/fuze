"use client";

import { useState, Suspense, useEffect, Fragment, useRef, useCallback } from 'react';
import { User, ChevronDown, ChevronUp, Calendar, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import VideoPlayer from "./VideoPlayer";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { notFound } from 'next/navigation';
import CommentSection from './CommentSection';
import SupabaseServer from '@/supabase/server';

const YouTubeStylePlayer = ({ VideoData }) => {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(VideoData?.likes || 0);
  const [dislikes, setDislikes] = useState(VideoData?.dislikes || 0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [viewCount, setViewCount] = useState(VideoData?.views || 0);
  const videoContainerRef = useRef(null);
  const searchParams = useSearchParams();
  const video_id = searchParams.get("id");
  const [isCommenting, setIsCommenting] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = SupabaseServer();

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

  async function sendLikes({liked, disliked}) {
    await fetch(`/api/video/likes?video_id=${VideoData.video_id}`, {
      method: "POST",
      body: JSON.stringify({
        video_id: VideoData.video_id,
        liked: liked,
        disliked: disliked,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  const handleLike = async () => {
    if (userLiked) {
      await sendLikes({liked: true, disliked: true});
    } else {
      await sendLikes({liked: true, disliked: false});
    }
  };

  const handleDislike = async () => {
    if (userDisliked) {
      await sendLikes({liked: true, disliked: true});
    } else {
      await sendLikes({liked: false, disliked: true});
    }
  };

  const is_private_video = useCallback(() => {
    const user_client = JSON.parse(localStorage.getItem("user"));

    if (VideoData.is_private === true) {
      if (user_client.username !== VideoData.Account.username) {
        notFound();
      }
    }
  }, [VideoData]);

  //Fetch Video
  useEffect(() => {

    async function getVideoLikes() {
      const response = await fetch(`/api/video/likes?video_id=${VideoData.video_id}`);

      if (!response.ok) return;

      const {user_data, all_data} = await response.json();

      if (all_data) {
        const liked_data = all_data.filter((i) => i.is_like === true)
        const disliked_data = all_data.filter((i) => i.is_like === false);

        setLikes(liked_data.length);
        setDislikes(disliked_data.length);
      }

      if (user_data) {
        switch(user_data.is_like) {
          case true:
            setUserLiked(true);
            break;
          
          case false:
            setUserDisliked(true);

          default:
            break;
        }
      }
    }

    let user_data = localStorage.getItem("user");
    
    if (user_data) {
      setUser(JSON.parse(user_data));
    }

    getVideoLikes();

  }, [VideoData]);

  // Realtime Database For Data
  useEffect(() => {
    is_private_video();

    const realtime_likes = supabase.channel(`VideoLikes-${VideoData.video_id}`)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "VideoLikes"
    }, async (payload) => {

      switch(payload.eventType) {
        
        case "INSERT":
          if (payload.new.video_id === VideoData.video_id) {
            let temp_data = payload.new;

            if (temp_data.is_like === true) {
              setUserLiked(() => {
                setUserDisliked(false);
                setLikes(likes + 1);
                return true;
              });
            } else if (temp_data.is_like === false) {
              setUserDisliked(() => {
                setUserLiked(false);
                setDislikes(dislikes+1);
                return true
              });
            }
          }

          break;

        case "UPDATE":
          if (payload.new.video_id === VideoData.video_id) {
            let temp_data = payload.new;

            if (temp_data.is_like === true) {
              setUserLiked(() => {
                setLikes(likes + 1);
                setUserDisliked(false);
                setDislikes(Math.max(0, dislikes - 1));
                return true;
              });
            } else if (temp_data.is_like === false) {
              setUserDisliked(() => {
                setDislikes(dislikes+1);
                setUserLiked(false);
                setLikes(Math.max(0, likes - 1));
                return true;
              });
            }
          }

          break;

        case "DELETE":
          if (payload.old.video_id === VideoData.video_id) {
            setUserLiked(() => {
              setUserDisliked(false);

              setLikes(Math.max(0, likes - 1));
              setDislikes(Math.max(0, dislikes - 1));

              return false;
            });
          }

          break;

        default:
          break;
      }
    })
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "Video"
    }, async (payload) => {
      switch(payload.eventType) {
        case "UPDATE":
          if  (payload.new.video_id === VideoData.video_id) {
            if (payload.new.is_private === true && user.username !== VideoData.Account.username) {
              window.location.reload();
            }
          }

          break;
        default: 
          break;
      }
    })
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "Video"
    }, async (payload) => {
      switch(payload.eventType) {

        case "UPDATE":
          if (payload.new.video_id === VideoData.video_id) {
            if (payload.new.views > viewCount) {
              setViewCount(payload.new.views);
            }
          }
          
          break;

        default:
          break;
      }
    })
    .subscribe();

    return () => {
      supabase.removeChannel(realtime_likes);
    }

  }, [VideoData, dislikes, is_private_video, likes, supabase, user, viewCount]);

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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Eye className="h-5 w-5" />
              <span>{viewCount || 0} views</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={user === null ? true : false}
                    className={`flex items-center space-x-2 ${userLiked ? 'text-blue-500' : 'text-gray-400'}`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>{likes}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={user === null ? true : false}
                    size="sm"
                    className={`flex items-center space-x-2 ${userDisliked ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={handleDislike}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span>{dislikes}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dislike</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

        <Suspense fallback={<div>loading comments...</div>} >
          <CommentSection videoId={VideoData.video_id} setIsTyping={setIsCommenting} />
        </Suspense>
      </div>
    </div>
  );
};

export default YouTubeStylePlayer;