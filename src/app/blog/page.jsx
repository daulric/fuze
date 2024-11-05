import React from 'react';
import { Search, Menu, Bell, Video, User, ThumbsUp, Share2, MessageSquare } from 'lucide-react';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "Getting Started with React Development",
      author: "React Master",
      views: "125K",
      timestamp: "2 days ago",
      thumbnail: "/api/placeholder/320/180",
      avatar: "/api/placeholder/40/40",
      likes: "15K",
      comments: "1.2K"
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      author: "TypeScript Guru",
      views: "89K",
      timestamp: "5 days ago",
      thumbnail: "/api/placeholder/320/180",
      avatar: "/api/placeholder/40/40",
      likes: "10K",
      comments: "800"
    }
  ];

  const suggestedPosts = [
    {
      id: 3,
      title: "CSS Grid Layout Tutorial",
      author: "CSS Wizard",
      views: "50K",
      timestamp: "1 week ago",
      thumbnail: "/api/placeholder/120/68",
    },
    {
      id: 4,
      title: "JavaScript ES6+ Features",
      author: "JS Expert",
      views: "75K",
      timestamp: "3 days ago",
      thumbnail: "/api/placeholder/120/68",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Menu className="h-6 w-6 text-gray-600" />
            <h1 className="text-xl font-bold text-red-600">DevTube Blog</h1>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Video className="h-6 w-6 text-gray-600" />
            <Bell className="h-6 w-6 text-gray-600" />
            <User className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 flex">
        {/* Main Feed */}
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow">
                <div className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="rounded-lg w-80 h-45 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h2 className="text-xl font-semibold">{post.title}</h2>
                          <p className="text-gray-600 text-sm">
                            {post.author} • {post.views} views • {post.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-6">
                        <button className="flex items-center gap-2 text-gray-600">
                          <ThumbsUp className="h-5 w-5" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-2 text-gray-600">
                          <MessageSquare className="h-5 w-5" />
                          {post.comments}
                        </button>
                        <button className="flex items-center gap-2 text-gray-600">
                          <Share2 className="h-5 w-5" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 p-6">
          <h3 className="font-semibold mb-4">Suggested Posts</h3>
          <div className="space-y-4">
            {suggestedPosts.map(post => (
              <div key={post.id} className="flex gap-2">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-30 h-17 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-sm">{post.title}</h4>
                  <p className="text-gray-600 text-xs">{post.author}</p>
                  <p className="text-gray-600 text-xs">
                    {post.views} views • {post.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;