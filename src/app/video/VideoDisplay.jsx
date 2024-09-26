"use client"

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const YouTubeStylePlayer = () => {
  const [likeCount, setLikeCount] = useState(100);
  const [dislikeCount, setDislikeCount] = useState(20);
  const [userChoice, setUserChoice] = useState(null);
  const [expanded, setExpanded] = useState(false);

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

  const toggleDescription = () => setExpanded(prev => !prev);

  const description = "This is a sample video description. It can contain multiple lines of text explaining the content of the video, providing context, or including additional information such as timestamps, links, or credits.";

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 text-white shadow-lg border-gray-700 rounded-sm">
      <CardContent className="p-0">
        <div className="relative pt-[56.25%] bg-gray-700">
          <div className="absolute inset-0 flex items-center justify-center rounded-sm">
            <p className="text-gray-400">Video Player Placeholder</p>
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold truncate">Video Title</h2>
            <div className="flex space-x-2">
              <Button 
                variant={userChoice === 'like' ? 'default' : 'ghost'}
                size="sm" 
                className={`p-1 ${userChoice === 'like' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'}`}
                onClick={handleLike}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="ml-1 text-xs">{likeCount}</span>
              </Button>
              <Button 
                variant={userChoice === 'dislike' ? 'default' : 'ghost'}
                size="sm" 
                className={`p-1 ${userChoice === 'dislike' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'}`}
                onClick={handleDislike}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="ml-1 text-xs">{dislikeCount}</span>
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-left text-sm font-medium text-gray-300 hover:bg-gray-700"
            onClick={toggleDescription}
          >
            Description
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expanded && (
            <p className="text-gray-300 text-xs mt-2 max-h-20 overflow-y-auto">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeStylePlayer;