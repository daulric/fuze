"use client"

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, FileText, Eye, User, BadgeCheck } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import waitFor from '@/lib/waitFor';
import { useComputed, useSignal } from '@preact/signals-react';

const CardMark = ({message}) => {
  return (
    <Card className="bg-gray-800 shadow-lg border border-gray-700">
      <CardContent className="p-6 flex items-center justify-center h-40">
        <p className="text-gray-400 text-center">{message}</p>
      </CardContent>
    </Card>
  )
}

const UserProfilePage = ({ username }) => {
  const [activeTab, setActiveTab] = useState('videos');
  const [profile, setProfileInfo] = useState(null);
  const videos = useSignal(null);
  const posts = useSignal(null);

  const videos_computed = useComputed(() => {
    if (!videos.value) return (<CardMark message={`...`}/>);
    if (videos.value.length === 0) return (<CardMark message={`no videos from ${profile.username }`}/>)
    return videos.value.map((video) => (
      <Link href={`/pulse?id=${video.video_id}`} key={video.video_id} className="block">
        <Card className="overflow-hidden bg-gray-800 shadow-lg transition-shadow hover:shadow-xl hover:bg-gray-700 border border-gray-700">
          <CardHeader className="p-0">
            <Image
              src={video.thumbnail} 
              alt={video.title} 
              width={300} 
              height={200} 
              className="w-full h-40 object-cover"
              loading='eager'
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="flex items-center text-lg mb-2 text-white">
              <Video className="mr-2 h-5 w-5 text-blue-400" />
              {video.title}
            </CardTitle>
            <div className="flex justify-between text-sm text-gray-400">
              <span className="flex items-center">
                <Eye className="mr-1 h-4 w-4" /> {video.views}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))
  });

  const posts_computed = useComputed(() => {
    if (!posts.value) return (<CardMark message={"..."} />);
    if (posts.value.length === 0) return (<CardMark message={`no posts from ${profile?.username}`} />)

    return posts.value.map((post) => (
      <Link href={`/flare?id=${post.post_id}`} key={post.post_id} className="block">
        <Card className="bg-gray-800 shadow-lg transition-shadow hover:shadow-xl hover:bg-gray-700 border border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FileText className="mr-2 text-green-400" />
              {`${post.content.split(' ').slice(0, 10).join(' ')}...`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Date: {new Date(post.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </Link>
    ));
  });

  const getProfile = useCallback(async () => {
    if (!username) {
      waitFor(() => sessionStorage.getItem("user"), 100).then(() => {
        const item = JSON.parse(sessionStorage.getItem("user"));
        setProfileInfo(item);
      });
    } else {
      try {
        const response = await fetch(`/api/profile?username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        if (data.success) {
          setProfileInfo(data.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

  }, [username]);
  
  const getVideos = useCallback(async () => {
    if (!profile) return;

    const query = new URLSearchParams({
      username: profile.username,
    });

    try {
      const response = await fetch(`/api/video?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const {  success, data} = await response.json();
      if (success) {
        videos.value = data;
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }, [profile]);

  const getPosts = useCallback(async () => {
    if (!profile) return;

    const query = new URLSearchParams({
      username: profile.username,
    });

    try {
      const response = await fetch(`/api/post?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const { success, data} = await response.json();
      if (success) {
        console.log(data);
        posts.value = data;
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }, [profile]);
  
  useEffect(() => {
    getProfile();
    
    return () => {
      setProfileInfo(null);
    }
  }, [getProfile]);
  
  useEffect(() => {
    if (profile) {
      getVideos();
      getPosts();
    }
    
    return () => {
      videos.value = null;
    }
  }, [getVideos, profile]);

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <Card className="mb-6 bg-gray-800 shadow-md border border-gray-700">
        <CardContent className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
          <Avatar className="h-24 w-24 ring-2 ring-gray-700">
            <AvatarImage src={profile?.avatar_url} alt={profile?.username || "nah g. he doh exist"} />
            <AvatarFallback className="bg-gray-700 text-gray-300">
              <User className="h-20 w-20"/>
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start">
              {profile ? profile.username : "nah g. he doh exist"}
              {profile?.is_verified && (
                <BadgeCheck className="ml-2 h-5 w-5 text-blue-400" />
              )}
            </h1>
            <p className="text-gray-400 mt-2">{profile?.aboutme}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
          <TabsTrigger 
            value="videos" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
          >
            Pulse
          </TabsTrigger>
          <TabsTrigger 
            value="blogs"
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
          >
            Flare
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            { videos_computed }
          </div>
        </TabsContent>
        <TabsContent value="blogs">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            { posts_computed }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;