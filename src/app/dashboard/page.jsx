"use client"

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Edit2,
  PlayCircle, 
  FileText, 
  User
} from 'lucide-react';

// Mock data - in a real application, this would come from an API or state management
const initialVideos = [
  { 
    id: 1, 
    title: "React Tutorial", 
    views: 5420, 
    likes: 342, 
    date: "2024-02-15" 
  },
  { 
    id: 2, 
    title: "Advanced JavaScript Techniques", 
    views: 3210, 
    likes: 215, 
    date: "2024-03-01" 
  }
];

const initialBlogs = [
  { 
    id: 1, 
    title: "Building Scalable Web Applications", 
    reads: 1230, 
    comments: 45, 
    date: "2024-01-20" 
  },
  { 
    id: 2, 
    title: "State Management in Modern React", 
    reads: 980, 
    comments: 32, 
    date: "2024-02-10" 
  }
];

const ContentCreatorDashboard = () => {
  const [videos] = useState(initialVideos);
  const [blogs] = useState(initialBlogs);
  const [accountInfo, setAccountInfo] = useState({
    username: "johndoe",
    email: "john.doe@example.com",
    displayName: "John Doe"
  });

  useEffect(() => {
    let user_data = JSON.parse(localStorage.getItem("user"));

    if (!user_data) return;
    setAccountInfo(user_data);
  }, [setAccountInfo]);

  const handleAccountInfoChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="dark bg-gray-900 text-foreground min-h-screen p-6">
      <Tabs defaultValue="videos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos">
            <PlayCircle className="mr-2 h-4 w-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="blogs">
            <FileText className="mr-2 h-4 w-4" /> Blogs
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" /> Account
          </TabsTrigger>
        </TabsList>

        {/* Videos Section */}
        <TabsContent value="videos">
          <Card>
            <CardHeader className="bg-gray-800">
              <CardTitle>My Videos</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>{video.title}</TableCell>
                      <TableCell>{video.views}</TableCell>
                      <TableCell>{video.likes}</TableCell>
                      <TableCell>{video.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blogs Section */}
        <TabsContent value="blogs">
          <Card>
            <CardHeader className="bg-gray-800">
              <CardTitle>My Blogs</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Reads</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.reads}</TableCell>
                      <TableCell>{blog.comments}</TableCell>
                      <TableCell>{blog.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Section */}
        <TabsContent value="account">
          <Card>
            <CardHeader className="bg-gray-800">
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-800">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={accountInfo.username}
                    onChange={handleAccountInfoChange}
                    className="col-span-3 bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={accountInfo.email}
                    onChange={handleAccountInfoChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="displayName" className="text-right">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={accountInfo.displayName}
                    onChange={handleAccountInfoChange}
                    className="col-span-3"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentCreatorDashboard;