"use client"

import React, { useState, useEffect } from 'react';
import { Home, Clock, ThumbsUp, PlaySquare, Film, Bookmark, History, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import Link from "next/link"

const SidebarItem = ({ icon: Icon, label, collapsed, href="#" }) => (
  <Link href={href} passHref>
    <Button variant="ghost" className={`w-full justify-start ${collapsed ? 'px-2' : ''}`} asChild>
      <span className="flex items-center">
        <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
        {!collapsed && <span>{label}</span>}
      </span>
    </Button>
  </Link>
);

const Sidebar = ({ defaultCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setCollapsed(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className={`bg-gray-900 text-white h-[calc(100vh-4rem)] fixed top-16 left-0 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } ${isMobile ? 'absolute z-10' : 'relative'}`}>
      <Button variant="ghost" className="w-full p-2" onClick={toggleSidebar}>
        <Menu className="h-6 w-6" />
      </Button>
      <ScrollArea className="h-[calc(100vh-64px-40px)]">
        <div className={`p-2 space-y-2 ${collapsed ? 'items-center' : ''}`}>
          <SidebarItem icon={Home} label="Home" collapsed={collapsed} href='/' />
          <SidebarItem icon={PlaySquare} label="Videos" collapsed={collapsed} href='/video' />
          <SidebarItem icon={Film} label="Subscriptions" collapsed={collapsed} />
          
          {!collapsed && <hr className="my-4 border-gray-700" />}
          
          {!collapsed && <h2 className="font-semibold mb-2">Library</h2>}
          <SidebarItem icon={History} label="History" collapsed={collapsed} />
          <SidebarItem icon={Clock} label="Watch Later" collapsed={collapsed} />
          <SidebarItem icon={ThumbsUp} label="Liked Videos" collapsed={collapsed} />
          <SidebarItem icon={Bookmark} label="Playlists" collapsed={collapsed} />
          
          {!collapsed && (
            <>
              <hr className="my-4 border-gray-700" />
              <h2 className="font-semibold mb-2">Subscriptions</h2>
              <SidebarItem icon={Film} label="Channel 1" collapsed={collapsed} />
              <SidebarItem icon={Film} label="Channel 2" collapsed={collapsed} />
              <SidebarItem icon={Film} label="Channel 3" collapsed={collapsed} />
              
              <hr className="my-4 border-gray-700" />
              <h2 className="font-semibold mb-2">Explore</h2>
              <SidebarItem icon={Home} label="Trending" collapsed={collapsed} />
              <SidebarItem icon={Home} label="Music" collapsed={collapsed} />
              <SidebarItem icon={Home} label="Gaming" collapsed={collapsed} />
              <SidebarItem icon={Home} label="News" collapsed={collapsed} />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;