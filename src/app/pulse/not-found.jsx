"use client"

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto flex items-center justify-center mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">nah g. you too fasss. go home</h1>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home size={20} />
          Return Home
        </Link>
      </div>
    </div>
  );
}