"use client"

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const YouTubeStylePlayer = () => {
  const [likeCount, setLikeCount] = useState(100); // Starting with some initial counts
  const [dislikeCount, setDislikeCount] = useState(20);
  const [userChoice, setUserChoice] = useState(null); // null, 'like', or 'dislike'
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
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto bg-gray-900 text-white p-4 rounded-lg">
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-700 flex items-center justify-center">
            <p className="text-gray-400">Video Player Placeholder</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between w-full mt-4">
        <h2 className="text-xl font-bold">Video Title</h2>
        <div className="flex space-x-2">
          <Button 
            variant={userChoice === 'like' ? 'default' : 'outline'}
            size="sm" 
            className={`flex items-center space-x-1 ${
              userChoice === 'like' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
            }`}
            onClick={handleLike}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{likeCount}</span>
          </Button>
          <Button 
            variant={userChoice === 'dislike' ? 'default' : 'outline'}
            size="sm" 
            className={`flex items-center space-x-1 ${
              userChoice === 'dislike' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
            }`}
            onClick={handleDislike}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{dislikeCount}</span>
          </Button>
        </div>
      </div>

      <div className="w-full mt-4 bg-gray-800 rounded-lg p-4">
        <Button
          variant="ghost"
          className="w-full justify-between text-left font-semibold mb-2"
          onClick={toggleDescription}
        >
          Description
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        {expanded && (
          <p className="text-gray-300 text-sm mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default YouTubeStylePlayer;