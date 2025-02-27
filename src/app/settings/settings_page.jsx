"use client"

import { useEffect, useState } from 'react';
import { Save, Trash2, User, Lock, Camera, Link, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from "@/lib/UserContext";
import { TrimEdges } from "@/lib/ImageManager"

const SettingsPage = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [aboutMe, setAboutMe] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    linkedin: "",
    github: ""
  });
  const [ProfileSaving, setProfileSaving] = useState(false);

  const user = useUser();
  const [copied, setCopied] = useState(false);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const trimed_img = await TrimEdges(file, 400, 400);
      const blob = new Blob([trimed_img], { type: "image/webp" });

      if (!blob) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePicture({
          result: reader.result,
          picture: blob,
        });
      };

      console.log(URL.createObjectURL(blob));
      reader.readAsDataURL(blob);
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleCopyUserId = () => {
    if (user && user.account_id) {
      navigator.clipboard.writeText(user.account_id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    setAboutMe(user.aboutme)
    setSocialLinks(user.social_links);
  }, [user]);

  const HandleAccountSubmission = async () => {
    setProfileSaving(true);
    const { account_id } = user;

    const form_data = new FormData();
    form_data.set("account_data", JSON.stringify({
      account_id: account_id,
      social_links: socialLinks,
      aboutme: aboutMe,
    }))

    if (profilePicture?.picture) {
      form_data.set("profile_picture", profilePicture?.picture);
    }

    const response = await fetch("/api/settings/profile", {
      method: "post",
      body: form_data,
    });

    if (!response.ok) {
      return;
    };

    const data = await response.json();

    if (data.success === false) { setProfileSaving(false); return;}
    return globalThis.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-950 border border-gray-800 rounded-lg p-1">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:bg-gray-900 transition-colors duration-200"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:bg-gray-900 transition-colors duration-200"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="privacy" 
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400 hover:bg-gray-900 transition-colors duration-200"
            >
              Privacy
            </TabsTrigger>
          </TabsList>
          <ProfileTab
            profilePicture={profilePicture}
            handleProfilePictureChange={handleProfilePictureChange}
            aboutMe={aboutMe}
            setAboutMe={setAboutMe}
            socialLinks={socialLinks}
            handleSocialLinkChange={handleSocialLinkChange}
            HandleAccountSubmission={HandleAccountSubmission}
            ProfileSaving={ProfileSaving}
            user={user}
          />
          <AccountTab user={user} handleCopyUserId={handleCopyUserId} copied={copied} />
          <PrivacyTab />
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;

function PrivacyTab() {
  return (
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
  )
}

function AccountTab({user, handleCopyUserId, copied}) {
  return (
    <TabsContent value="account">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
          <CardDescription className="text-gray-400">Manage your account details and security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" type="text" className="text-gray-200">Username</Label>
            <Input id="username" autoComplete='off' className="bg-gray-800 text-white border-gray-700" icon={<User className="text-gray-400" />} value={user?.username} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">Password</Label>
            <Input id="password" autoComplete='off' type="password" className="bg-gray-800 text-white border-gray-700" icon={<Lock className="text-gray-400" />} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userid" className="text-gray-200">{"Account ID <API USE> Dont Share!"}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="userid"
                type="password"
                readOnly
                value={user?.account_id || 'No user ID available'}
                className="bg-gray-800 text-white border-gray-700 flex-grow" />
              <div className="relative">
                <Button
                  onClick={handleCopyUserId}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!user?.account_id}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                {copied && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-1 px-2 rounded text-sm whitespace-nowrap opacity-100 transition-opacity duration-300">
                    ID copied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

function ProfileTab({profilePicture, handleProfilePictureChange, aboutMe, setAboutMe, socialLinks, handleSocialLinkChange, HandleAccountSubmission, ProfileSaving, user}) {
  return (
    <TabsContent value="profile">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Profile Settings</CardTitle>
          <CardDescription className="text-gray-400">Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePicture?.result || user?.avatar_url} alt="Profile picture" />
              <AvatarFallback>
                <User className="h-12 w-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="picture" className="text-gray-200 cursor-pointer">
                <div className="flex items-center space-x-2 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <span>Change Picture</span>
                </div>
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="about-me" className="text-gray-200">About Me</Label>
            <Textarea
              id="about-me"
              placeholder="Tell us about yourself..."
              className="bg-gray-800 text-white border-gray-700 h-32"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)} />
          </div>
          <div className="space-y-4">
            <Label className="text-gray-200">Social Links</Label>
            <div className="space-y-2">
              <Input
                placeholder="Twitter"
                className="bg-gray-800 text-white border-gray-700"
                icon={<Link className="text-gray-400" />}
                value={socialLinks?.twitter}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)} />
              <Input
                placeholder="LinkedIn"
                className="bg-gray-800 text-white border-gray-700"
                icon={<Link className="text-gray-400" />}
                value={socialLinks?.linkedin}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)} />
              <Input
                placeholder="GitHub"
                className="bg-gray-800 text-white border-gray-700"
                icon={<Link className="text-gray-400" />}
                value={socialLinks?.github}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={ProfileSaving} onClick={HandleAccountSubmission}>
            <Save className="mr-2 h-4 w-4" /> Save Profile
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}