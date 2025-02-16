'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import waitFor from '@/lib/waitFor';
import { useUser } from "@/lib/UserContext";

export default function CreatorDashboard() {
  const [videos, setVideos] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const user = useUser();
  const [userProfile, setUserProfile] = useState(user);

  useEffect(() => {
    async function fetch_videos() {
      if (!userProfile) return;
      if (videos) return;
      const response = await fetch(`/api/video?all=true`);

      if (!response.ok) return;

      const {success, data } = await response.json();
      if (success) {
        const sort_recently_updated = data.sort((a, b) => new Date(b.upload_at) - new Date(a.upload_at));
        setVideos(sort_recently_updated)
      }
    }

    fetch_videos();
  }, [userProfile]);

  const handleVideoEdit = async (_, updatedVideo) => {

    const response = await fetch("/api/video", {
      method: "PUT",
      body: JSON.stringify(updatedVideo),
    });

    if (!response.ok) return;
    const {success} = await response.json();

    if (success) {
      setVideos(videos.map(video => 
        video.video_id === updatedVideo.video_id ? { ...video, ...updatedVideo } : video
      ));
    }

  };

  const handleBlogEdit = (id, updatedBlog) => {
    setBlogs(blogs.map(blog => 
      blog.id === id ? { ...blog, ...updatedBlog } : blog
    ));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile({ ...userProfile, ...updatedProfile });
  };

  const ContentCard = ({ item, type, onEdit }) => (
    <Card className="mb-4 bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700 bg-gray-800">
        <CardTitle className="text-white">{item.title}</CardTitle>
        <div className="flex space-x-2">
          <EditContentDialog item={item} type={type} onEdit={onEdit} />
        </div>
      </CardHeader>
      <CardContent className="bg-gray-800 pt-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/3 h-48 md:h-auto">
            <Suspense fallback={<div className="w-full h-full bg-gray-700 animate-pulse rounded-md"></div>}>
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                alt={`${item.title} thumbnail`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                className="object-contain rounded-md"
                priority={false}
                loading="eager"
              />
            </Suspense>
          </div>
          <div className="flex-1 space-y-4">
            <p className="text-lg text-gray-300">{item.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Views: {item.views}</span>
              <span>Date: {new Date(item.upload_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Privacy:</span>
              <span
                className={`px-2 py-1 rounded ${item.is_private ? "bg-red-900 text-red-200" : "bg-green-900 text-green-200"}`}
              >
                {item.is_private ? "Private" : "Public"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EditContentDialog = ({ item, type, onEdit }) => {
    const [formData, setFormData] = useState(item);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    const handleChange = (field, value) => {
      setFormData({ ...formData, [field]: value });
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setThumbnailFile(file);
        setFormData({
          ...formData, 
          thumbnail: URL.createObjectURL(file)
        });
      }
    };

    const handleSubmit = () => {
      // In a real app, you'd upload the file here
      onEdit(item.id, formData);
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-gray-800 text-gray-200 hover:bg-gray-700">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit {type}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Title" 
              value={formData.title}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <Switch
              className="data-[state=checked]:bg-gray-600"
              id="private"
              checked={formData.is_private}
              onCheckedChange={(checked) => handleChange('is_private', checked)}
            />
            <Label htmlFor="private" className="text-white align-text-top text-lg">Private Video</Label>
            <div>
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer text-gray-400 hover:bg-gray-800">
                <Upload className="mr-2" />
                Change Thumbnail
                <input 
                  type="file"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              {formData.thumbnail && (
                <div className="relative w-full h-48 mt-4">
                  <Image 
                    src={formData.thumbnail} 
                    alt="New thumbnail preview"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-md"
                    loading='eager'
                  />
                </div>
              )}
            </div>
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-blue-900 text-gray-100 hover:bg-blue-800"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const ProfileEditDialog = () => {
    const [profileData, setProfileData] = useState(userProfile);

    const handleChange = (field, value) => {
      setProfileData({ ...profileData, [field]: value });
    };

    const handleSubmit = async () => {
      const res = await fetch("api/account", {
        method: "POST",
        body: JSON.stringify(profileData),
      })

      if (!res.ok) return;

      const { success, message } = await res.json();

      if (success) {
        handleProfileUpdate(profileData);
      } else {
        console.log(message)
      }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gray-900 text-gray-200 hover:bg-gray-700">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Name"
              value={profileData?.username}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              onChange={(e) => handleChange('username', e.target.value)}
            />
            <Input 
              placeholder="Bio"
              value={profileData?.aboutme}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              onChange={(e) => handleChange('aboutme', e.target.value)}
            />
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-blue-900 text-gray-100 hover:bg-blue-800"
            >
              Update Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8 bg-gray-800 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800">
            <div>
              <CardTitle className="text-white">{userProfile?.username}</CardTitle>
              <p className="text-gray-400">{userProfile?.aboutme}</p>
            </div>
            <ProfileEditDialog />
          </CardHeader>
        </Card>

        <Tabs defaultValue="videos">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger 
              value="videos" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger 
              value="blogs" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
            >
              Blogs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="videos">
            {videos && videos.map(video => (
              <ContentCard 
                key={video.video_id} 
                item={video} 
                type="Video" 
                onEdit={handleVideoEdit} 
              />
            ))}
          </TabsContent>
          <TabsContent value="blogs">
            {blogs && blogs.map(blog => (
              <ContentCard
                key={blog.id} 
                item={blog} 
                type="Blog" 
                onEdit={handleBlogEdit} 
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}