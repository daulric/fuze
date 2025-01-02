import HistoyClient from "./client"

export const metadata= {
  title: 'Watch History',
  description: 'View your watch history',
}

// Mock data for watch history
const watchHistory = [
  {
    id: '1',
    title: 'Amazing Landscape Photography Tips',
    thumbnail: '/placeholder.svg?height=180&width=320',
    channel: 'Nature Captures',
    views: '1.2M',
    watchedAt: '2 hours ago',
    duration: '10:30',
    link: '/watch?id=1'
  },
  {
    id: '2',
    title: 'Quick and Easy Pasta Recipes for Beginners',
    thumbnail: '/placeholder.svg?height=180&width=320',
    channel: 'Cooking with Chef John',
    views: '800K',
    watchedAt: 'Yesterday',
    duration: '15:45',
    link: '/watch?id=2'
  },
  {
    id: '3',
    title: 'Top 10 Tourist Attractions in Paris',
    thumbnail: '/placeholder.svg?height=180&width=320',
    channel: 'Travel Guides',
    views: '2.5M',
    watchedAt: '3 days ago',
    duration: '20:15',
    link: '/watch?id=3'
  },
  {
    id: '4',
    title: 'Beginner\'s Guide to Oil Painting',
    thumbnail: '/placeholder.svg?height=180&width=320',
    channel: 'Art Studio',
    views: '500K',
    watchedAt: 'Last week',
    duration: '25:00',
    link: '/watch?id=4'
  },
  {
    id: '5',
    title: 'Home Workout: Full Body No Equipment Routine',
    thumbnail: '/placeholder.svg?height=180&width=320',
    channel: 'Fitness First',
    views: '3.7M',
    watchedAt: '2 weeks ago',
    duration: '30:00',
    link: '/watch?id=5'
  }
];

export default function PAGE() {
    return (
        <HistoyClient history={watchHistory} />
    )
}