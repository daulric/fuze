import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for blogs
const blogs = [
  { id: 1, title: 'Getting Started with Next.js', description: 'Learn the basics of Next.js and start building amazing web applications.', date: '2024-10-15' },
  { id: 2, title: 'Mastering React Hooks', description: 'Dive deep into React Hooks and level up your React skills.', date: '2024-10-14' },
  { id: 3, title: 'The Power of TypeScript', description: 'Discover how TypeScript can improve your JavaScript development experience.', date: '2024-10-13' },
];

const BlogList = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Latest Blog Posts</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Card key={blog.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">{blog.title}</CardTitle>
                <CardDescription className="text-gray-400">{new Date(blog.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{blog.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${blog.id}`} passHref>
                  <Button variant="secondary" className="bg-gray-700 text-gray-100 hover:bg-gray-600">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;