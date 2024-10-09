"use client"

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, FileText, Eye, Clock } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

// Mock data for demonstration
const userData = {
  name: 'John Doe',
  avatar: null,
  videos: [],
  blogs: [],
};

const UserProfilePage = ({username}) => {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <Card className="mb-6 bg-gray-800 shadow-md border border-gray-700">
        <CardContent className="flex items-center space-x-4 pt-6">
          <Avatar className="h-24 w-24 ring-2 ring-gray-700">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-gray-700 text-gray-300">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
            <p className="text-gray-400">Content Creator</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
          <TabsTrigger 
            value="videos" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger 
            value="blogs" 
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
          >
            Blogs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userData.videos.map((video) => (
              <Link href={video.url} key={video.id} className="block">
                <Card className="overflow-hidden bg-gray-800 shadow-lg transition-shadow hover:shadow-xl hover:bg-gray-700 border border-gray-700">
                  <CardHeader className="p-0">
                    <Image 
                      src={video.thumbnail} 
                      alt={video.title} 
                      width={300} 
                      height={200} 
                      className="w-full h-40 object-cover"
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
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" /> {video.duration}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="blogs">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userData.blogs.map((blog) => (
              <Link href={blog.url} key={blog.id} className="block">
                <Card className="bg-gray-800 shadow-lg transition-shadow hover:shadow-xl hover:bg-gray-700 border border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <FileText className="mr-2 text-green-400" />
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Date: {blog.date}</p>
                    <p className="text-gray-400">Read time: {blog.readTime}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;