'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Upload } from 'lucide-react';

// Mock data - replace with your actual image sources
const initialVideos = [
  { 
    id: '1', 
    title: 'My First Video', 
    description: 'An exciting introduction to my content', 
    thumbnail: '/placeholder-video-1.jpg' 
  },
  { 
    id: '2', 
    title: 'Tutorial Series Part 1', 
    description: 'Learning something new', 
    thumbnail: '/placeholder-video-2.jpg' 
  }
];

const initialBlogs = [
  { 
    id: '1', 
    title: 'My Coding Journey', 
    description: 'Reflections on becoming a developer', 
    thumbnail: '/placeholder-blog-1.jpg' 
  },
  { 
    id: '2', 
    title: 'Top 10 Programming Tips', 
    description: 'Insights for new programmers', 
    thumbnail: '/placeholder-blog-2.jpg' 
  }
];

export default function CreatorDashboard() {
  const [videos, setVideos] = useState(initialVideos);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [userProfile, setUserProfile] = useState({
    name: 'Creator Name',
    email: 'creator@example.com',
    bio: 'Content creator passionate about sharing knowledge'
  });

  const handleVideoEdit = (id, updatedVideo) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, ...updatedVideo } : video
    ));
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
    <Card className="mb-4 bg-gray-800 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800 bg-gray-800">
        <CardTitle className="text-white">{item.title}</CardTitle>
        <div className="flex space-x-2">
          <EditContentDialog 
            item={item} 
            type={type} 
            onEdit={onEdit} 
          />
        </div>
      </CardHeader>
      <CardContent className="bg-gray-800">
        <div className="relative w-full h-48">
          <Image 
            src={item.thumbnail} 
            alt={`${item.title} thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-md text-gray-100"
            priority={false}
          />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );

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

    const handleSubmit = () => {
      handleProfileUpdate(profileData);
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
              value={profileData.name}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input 
              placeholder="Bio"
              value={profileData.bio}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              onChange={(e) => handleChange('bio', e.target.value)}
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
              <CardTitle className="text-white">{userProfile.name}</CardTitle>
              <p className="text-gray-400">{userProfile.email}</p>
              <p className="text-sm mt-2 text-gray-500">{userProfile.bio}</p>
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
            {videos.map(video => (
              <ContentCard 
                key={video.id} 
                item={video} 
                type="Video" 
                onEdit={handleVideoEdit} 
              />
            ))}
          </TabsContent>
          <TabsContent value="blogs">
            {blogs.map(blog => (
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