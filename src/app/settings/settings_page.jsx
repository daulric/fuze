"use client"

import React from 'react';
import { Save, Trash2, User, Lock, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-950 border border-gray-800 rounded-lg p-1">
            <TabsTrigger 
              value="account" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:bg-gray-900 transition-colors duration-200"
            >
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:bg-gray-900 transition-colors duration-200"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:bg-gray-900 transition-colors duration-200"
            >
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:bg-gray-900 transition-colors duration-200"
            >
              Privacy
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
                <CardDescription className="text-gray-400">Manage your account details and security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-200">Username</Label>
                  <Input id="username" className="bg-gray-800 text-white border-gray-700" icon={<User className="text-gray-400" />} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <Input id="password" type="password" className="bg-gray-800 text-white border-gray-700" icon={<Lock className="text-gray-400" />} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input id="email" type="email" className="bg-gray-800 text-white border-gray-700" icon={<Globe className="text-gray-400" />} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="appearance">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Appearance</CardTitle>
                <CardDescription className="text-gray-400">Customize how Acme looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-200">Dark mode</Label>
                    <p className="text-sm text-gray-400">
                      Turn on dark mode to reduce eye strain and save battery.
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator className="bg-gray-800" />
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-gray-200">Language</Label>
                  <Select>
                    <SelectTrigger id="language" className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="content">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Content Preferences</CardTitle>
                <CardDescription className="text-gray-400">Manage your content viewing experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categories" className="text-gray-200">Favorite Categories</Label>
                  <Select>
                    <SelectTrigger id="categories" className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-200">Auto-play videos</Label>
                    <p className="text-sm text-gray-400">
                      Automatically play videos as you scroll.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="privacy">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
                <CardDescription className="text-gray-400">Manage your privacy and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-200">Public Profile</Label>
                    <p className="text-sm text-gray-400">
                      Allow others to see your profile.
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-200">Online Status</Label>
                    <p className="text-sm text-gray-400">
                      Show when you are active on the platform.
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator className="bg-gray-800" />
                <div className="pt-4">
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;