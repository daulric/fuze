'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContentPage() {
  const [title, setTitle] = useState("My Awesome Video")
  const [description, setDescription] = useState("This is a description of my awesome video.")
  const [tags, setTags] = useState("react, javascript, tutorial")

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-100">Content Management</h2>
      <Tabs defaultValue="video" className="text-gray-100">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="video" className="data-[state=active]:bg-gray-700">Video</TabsTrigger>
          <TabsTrigger value="blog" className="data-[state=active]:bg-gray-700">Blog</TabsTrigger>
        </TabsList>
        <TabsContent value="video">
          <Card className="bg-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Edit Video Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-700 text-gray-100 border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-700 text-gray-100 border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-gray-700 text-gray-100 border-gray-600"
                  />
                </div>
                <Button type="submit" className="bg-gray-700 text-gray-100 hover:bg-gray-600">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blog">
          <Card className="bg-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Edit Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-title">Title</Label>
                  <Input id="blog-title" className="bg-gray-700 text-gray-100 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-content">Content</Label>
                  <Textarea id="blog-content" className="bg-gray-700 text-gray-100 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-tags">Tags</Label>
                  <Input id="blog-tags" className="bg-gray-700 text-gray-100 border-gray-600" />
                </div>
                <Button type="submit" className="bg-gray-700 text-gray-100 hover:bg-gray-600">Publish Post</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}