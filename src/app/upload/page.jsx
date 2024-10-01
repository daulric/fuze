"use client"

import React, { useState } from 'react';
import { Upload, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import axios from "axios";
import { cookieStore } from "@/tools/cookieStore"

const VideoUploadPage = () => {
  const [file, setFile] = useState(null);
  const [videoDetails, setVideoDetails] = useState({
    title: null,
    description: null,
    is_private: false,
    age_18: false
  });

  const [ isUploading, setIsUploading ] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDetailsChange = (field, value) => {
    setVideoDetails(prevDetails => ({
      ...prevDetails,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form_data = new FormData();

    const account_id = cookieStore.get("user");

    if (!account_id) {
      return;
    }

    const updatedVideoDetails = {
      ...videoDetails,
      account_id: account_id
    }
  
    form_data.set("video_file", file);
    form_data.set("data", JSON.stringify(updatedVideoDetails));
  
    const { data } = await axios.post("/api/video/upload", form_data, {
      headers: {
        "Content-Type": "multipart/form-data",  // Specify the content type
      },
    });

    if (data.success === true) {
      console.log("Video Uploaded Successfully!", data.video_id);
      window.location.href = `/video?id=${data.video_id}`;
    }

  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <Card className="max-w-2xl mx-auto bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dropzone-file" className="block">Video File</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">MP4, WebM or OGG (MAX. 800MB)</p>
                  </div>
                  <input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept="video/*" 
                  />
                </label>
              </div>
              {file && (
                <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2">
                  <FileVideo className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="block">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter video title"
                className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                value={videoDetails.title}
                onChange={(e) => handleDetailsChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="block">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter video description"
                className="w-full h-32 bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500"
                value={videoDetails.description}
                onChange={(e) => handleDetailsChange('description', e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  className="bg-gray-50"
                  id="isPrivate" 
                  checked={videoDetails.isPrivate}
                  onCheckedChange={(checked) => handleDetailsChange('is_private', checked)}
                />
                <Label htmlFor="isPrivate">Private Video</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-gray-50"
                  id="hasAgeLimit" 
                  checked={videoDetails.age_18}
                  onCheckedChange={(checked) => handleDetailsChange('age_18', checked)}
                />
                <Label htmlFor="hasAgeLimit">Age Restricted</Label>
              </div>
            </div>
            
            <Button type="submit" 
            disabled={isUploading} 
            className="w-full hover:bg-gray-700" 
            onClick={(e) => {
              setIsUploading(true);
              handleSubmit(e);
            }} >
              Upload Video
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUploadPage;