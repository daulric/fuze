"use client"

import Image from 'next/image'
import { Play, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useEffect } from 'react'
import Link from "next/link";
import { useComputed, useSignal } from '@preact/signals-react'

const HistoryVideoCard = ({ title, views, thumbnail, link, ...otherData }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 group">
      <Link href={link} className="block">
        <div className="relative">
          <Image 
            src={thumbnail} 
            alt={title} 
            className="w-full h-48 object-cover" 
            width={320} 
            height={180} 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="text-white" size={48} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 text-white">{title}</h3>
          <p className="text-sm text-gray-400">{otherData.Account.username}</p>
          <p className="text-xs text-gray-500">{views} views</p>
        </div>
      </Link>
    </div>
  );
};
  
export default function HistoryPage() {
  const histories = useSignal(null);

  const HistoryComponents = useComputed(() => {
    if (!histories.value || histories.value.length === 0) return ( <div>u ent have a history yet</div> );  

    return histories.value.map((video) => (
      <HistoryVideoCard key={video.video_id} link={`/pulse?id=${video.video_id}`} {...video} /> 
    ));
  });

  useEffect(() => {

    async function fetchHistory() {
      const history_data = JSON.parse(localStorage.getItem('watchHistory'));

      if (!history_data) return;
      if (histories.value) return;

      const response = await fetch("/api/video/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({group: history_data, length: 300}),
      });
      
      if (!response.ok) return;
      
      const { success, data } = await response.json();
      
      if (success === true) {
        const perma_data = data.sort((a, b) => {
          const indexA = history_data.indexOf(a.video_id);
          const indexB = history_data.indexOf(b.video_id);
          
          return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
        });
        
        histories.value = perma_data;
      }
    }
    
    fetchHistory();

    return () => {
      histories.value = [];
    }

  }, []);

  function clearHistory() {
    histories.value = [];
    if (!localStorage.getItem('watchHistory')) return;
    localStorage.removeItem('watchHistory');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Wah You Was Watching??</h1>
        <Button onClick={clearHistory} variant="destructive" size="sm" className="flex items-center">
          <Trash2 size={16} className="mr-2" />
          Clear All History
        </Button>
      </div>
      <br/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        { HistoryComponents }
      </div>
    </div>
  );
}