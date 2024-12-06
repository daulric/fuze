'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Jan', views: 4000, subscribers: 2400, revenue: 2400 },
  { name: 'Feb', views: 3000, subscribers: 1398, revenue: 2210 },
  { name: 'Mar', views: 2000, subscribers: 9800, revenue: 2290 },
  { name: 'Apr', views: 2780, subscribers: 3908, revenue: 2000 },
  { name: 'May', views: 1890, subscribers: 4800, revenue: 2181 },
  { name: 'Jun', views: 2390, subscribers: 3800, revenue: 2500 },
  { name: 'Jul', views: 3490, subscribers: 4300, revenue: 2100 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-100">Analytics</h2>
      <Card className="bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#8884d8" />
              <Line type="monotone" dataKey="subscribers" stroke="#82ca9d" />
              <Line type="monotone" dataKey="revenue" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Top Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>1. How to Build a React App - 50,000 views</li>
              <li>2. 10 JavaScript Tips and Tricks - 45,000 views</li>
              <li>3. Introduction to Machine Learning - 40,000 views</li>
              <li>4. Building a REST API with Node.js - 35,000 views</li>
              <li>5. CSS Grid Layout Tutorial - 30,000 views</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Age 18-24: 30%</li>
              <li>Age 25-34: 45%</li>
              <li>Age 35-44: 15%</li>
              <li>Age 45-54: 7%</li>
              <li>Age 55+: 3%</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}