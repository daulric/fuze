import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Loader, TrendingUp, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-100">Welcome back, Creator!</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234,567</div>
            <p className="text-xs text-gray-400">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watch Time (hours)</CardTitle>
            <Loader className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-gray-400">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98,765</div>
            <p className="text-xs text-gray-400">+5.7% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <p className="text-xs text-gray-400">+10.3% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>How to Build a React App</li>
              <li>10 JavaScript Tips and Tricks</li>
              <li>Introduction to Machine Learning</li>
            </ul>
            <Button className="w-full mt-4 bg-gray-700 text-gray-100 hover:bg-gray-600">View All Videos</Button>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>5 Ways to Improve Your Coding Skills</li>
              <li>The Future of Web Development</li>
              <li>Building Scalable Applications</li>
            </ul>
            <Button className="w-full mt-4 bg-gray-700 text-gray-100 hover:bg-gray-600">View Analytics</Button>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>{"Great video, very helpful!"}</li>
              <li>{"Can you make a tutorial on Vue.js?"}</li>
              <li>{"Thanks for the amazing content!"}</li>
            </ul>
            <Button className="w-full mt-4 bg-gray-700 text-gray-100 hover:bg-gray-600">View All Comments</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}