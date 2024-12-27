"use client"

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, ImageIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import directUpload from "./directUpload";

import store from "@/tools/cookieStore";
const cookieStore = store();

const VideoUploadPage = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    description: "",
    is_private: false,
    age_18: false
  });

  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setVideoPreviewUrl(url);
    }
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setThumbnail(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setThumbnailPreviewUrl(url);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type.startsWith('video/')) {
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setVideoPreviewUrl(url);
    }
  };

  const removeFile = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setFile(null);
    setVideoPreviewUrl('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeThumbnail = () => {
    if (thumbnailPreviewUrl) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }
    setThumbnail(null);
    setThumbnailPreviewUrl('');
  };

  const handleDetailsChange = (field, value) => {
    setVideoDetails(prevDetails => ({
      ...prevDetails,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    console.log(msg);

    try {

      const form_data = new FormData();
      const account_id = cookieStore.get("user");

      if (!account_id) {
        throw "Please log in to upload videos";
      }

      const updatedVideoDetails = {
        ...videoDetails,
        account_id: account_id
      };

      const video_file_size = file.size / (1024 * 1024);
      const thumbnail_file_size = thumbnail ? thumbnail.size / (1024 * 1024) : 0;

      if (video_file_size > 50 ) {
        throw "Video file must be less than 50MB";
      }
  
      if (thumbnail_file_size > 50 ) {
        throw "Thumbnail file must be less than 50MB";
      }
    
      form_data.set("data", JSON.stringify(updatedVideoDetails));

      const data = await uploadWithProgress("/api/video/upload", form_data, (progress) => {
        setUploadProgress(progress);
      })
      .catch((err) => {
        throw err;
      });

      if (data.success === true) {
        console.log("Video Uploaded Successfully!", data.video_id);
        window.location.href = `/video?id=${data.video_id}`;
      } else {
        setMsg(data);
      }
    } catch (error) {
      console.log(error);
      setMsg({ 
        success: false,
        message: error.response?.data?.message || error || "Error uploading video",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadWithProgress = async (url, formData, onUploadProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
  
      // Open the request
      xhr.open("POST", url);
  
      // Set headers
      xhr.setRequestHeader("Accept", "application/json");
  
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(percentCompleted);
        }
      };
  
      // Handle successful response
      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);

          if (!data.success) reject(data.message);
          
          if (data.video_id) {
            const uploaded_content = await directUpload(data.video_id, file, thumbnail);
            resolve(uploaded_content);
          }
          
        } else {
          reject(new Error(`Error: ${xhr.status} ${xhr.statusText}`));
        }
      };
  
      // Handle network errors
      xhr.onerror = () => reject(new Error("Network error"));
  
      // Send the request with formData
      xhr.send(formData);
    });
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    };
  }, [thumbnailPreviewUrl, videoPreviewUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <Card className="max-w-4xl mx-auto bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dropzone-file" className="block">Video File</Label>
                <div 
                  className="relative"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <label 
                    htmlFor="dropzone-file" 
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      dragActive 
                        ? 'border-blue-500 bg-gray-700/60' 
                        : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {!file && (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">MP4, WebM or OGG (MAX. 800MB)</p>
                      </div>
                    )}
                    <input 
                      ref={inputRef}
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange} 
                      accept="video/*"
                    />
                  </label>
                  {file && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <video 
                        src={videoPreviewUrl} 
                        className="w-full h-full object-cover"
                        controls
                      />
                      <button 
                        onClick={removeFile}
                        className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full hover:bg-gray-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="block">Thumbnail</Label>
                <div className="relative w-full h-64">
                  <label 
                    htmlFor="thumbnail" 
                    className={`absolute inset-0 flex flex-col items-center justify-center border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors ${
                      thumbnail ? 'opacity-0 hover:opacity-100' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                    </div>
                    <input 
                      id="thumbnail" 
                      type="file" 
                      className="hidden" 
                      onChange={handleThumbnailChange} 
                      accept="image/*"
                    />
                  </label>
                  {thumbnail && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <Image 
                        src={thumbnailPreviewUrl}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading='eager'
                      />
                      <button 
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full hover:bg-gray-900 z-10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter video title"
                  className="bg-gray-700 border-gray-600 focus:border-blue-500"
                  value={videoDetails.title}
                  onChange={(e) => handleDetailsChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter video description"
                  className="h-32 bg-gray-700 border-gray-600 focus:border-blue-500"
                  value={videoDetails.description}
                  onChange={(e) => handleDetailsChange('description', e.target.value)}
                />
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPrivate" 
                    checked={videoDetails.is_private}
                    onCheckedChange={(checked) => handleDetailsChange('is_private', checked)}
                  />
                  <Label htmlFor="isPrivate">Private Video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAgeLimit" 
                    checked={videoDetails.age_18}
                    onCheckedChange={(checked) => handleDetailsChange('age_18', checked)}
                  />
                  <Label htmlFor="hasAgeLimit">Age Restricted</Label>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-gray-400 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {msg && (
                <Alert variant={msg.success ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {typeof msg.message === "string" ? msg.message : `Server Error : ${msg.message}`}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                disabled={isUploading || !file} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                onClick={handleSubmit}
              >
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUploadPage;