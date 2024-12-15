"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  X, 
  Image, 
  Tag, 
  AlignLeft, 
  Globe, 
  Lock 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import Img from "next/image";

const VideoEditPage = ({ video, onClose, onSave }) => {
  const [editedVideo, setEditedVideo] = useState({
    title: video.title || '',
    description: video.description || '',
    visibility: video.visibility || 'public',
    tags: video.tags ? video.tags.join(', ') : '',
    thumbnail: video.thumbnail || null,
    allowComments: video.allowComments !== undefined ? video.allowComments : true,
    allowRatings: video.allowRatings !== undefined ? video.allowRatings : true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedVideo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (field, checked) => {
    setEditedVideo(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedVideo(prev => ({
          ...prev,
          thumbnail: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Prepare data for submission
    const submissionData = {
      ...editedVideo,
      tags: editedVideo.tags.split(',').map(tag => tag.trim())
    };
    onSave(submissionData);
  };

  return (
    <div className="dark bg-gray-900 text-foreground min-h-screen p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Video Details</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Thumbnail Section */}
            <div>
              <Label className="flex items-center mb-2">
                <Image className="mr-2 h-4 w-4" />
                Thumbnail
              </Label>
              <div className="flex items-center space-x-4">
                {editedVideo.thumbnail && (
                  <Img 
                    src={editedVideo.thumbnail} 
                    alt="Video Thumbnail" 
                    className="w-48 h-32 object-cover rounded-md"
                    height={100}
                    width={100}
                  />
                )}
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="max-w-sm"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="flex items-center mb-2">
                <Tag className="mr-2 h-4 w-4" /> 
                Title
              </Label>
              <Input 
                id="title"
                name="title"
                value={editedVideo.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="flex items-center mb-2">
                <AlignLeft className="mr-2 h-4 w-4" /> 
                Description
              </Label>
              <Textarea 
                id="description"
                name="description"
                value={editedVideo.description}
                onChange={handleInputChange}
                placeholder="Describe your video"
                rows={4}
              />
            </div>

            {/* Visibility */}
            <div>
              <Label className="flex items-center mb-2">
                <Globe className="mr-2 h-4 w-4" /> 
                Visibility
              </Label>
              <Select 
                value={editedVideo.visibility} 
                onValueChange={(value) => setEditedVideo(prev => ({
                  ...prev, 
                  visibility: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="flex items-center mb-2">
                <Tag className="mr-2 h-4 w-4" /> 
                Tags
              </Label>
              <Input 
                id="tags"
                name="tags"
                value={editedVideo.tags}
                onChange={handleInputChange}
                placeholder="Enter tags, separated by commas"
              />
            </div>

            {/* Interaction Settings */}
            <div>
              <Label className="flex items-center mb-4">
                <Lock className="mr-2 h-4 w-4" /> 
                Interaction Settings
              </Label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="allowComments"
                    checked={editedVideo.allowComments}
                    onCheckedChange={(checked) => handleSwitchChange('allowComments', checked)}
                  />
                  <Label htmlFor="allowComments">Allow Comments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="allowRatings"
                    checked={editedVideo.allowRatings}
                    onCheckedChange={(checked) => handleSwitchChange('allowRatings', checked)}
                  />
                  <Label htmlFor="allowRatings">Allow Ratings</Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoEditPage;