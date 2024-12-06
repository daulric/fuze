import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-100">Account Settings</h2>
      <Card className="bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="awesome_creator" className="bg-gray-700 text-gray-100 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="creator@example.com" className="bg-gray-700 text-gray-100 border-gray-600" />
            </div>
            <Button type="submit" className="bg-gray-700 text-gray-100 hover:bg-gray-600">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" className="bg-gray-700 text-gray-100 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" className="bg-gray-700 text-gray-100 border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" className="bg-gray-700 text-gray-100 border-gray-600" />
            </div>
            <Button type="submit" className="bg-gray-700 text-gray-100 hover:bg-gray-600">Change Password</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch id="sms-notifications" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}