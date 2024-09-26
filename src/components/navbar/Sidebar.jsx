"use client"

import React, { useState, useEffect } from 'react';
import { Home, Clock, ThumbsUp, PlaySquare, Film, Bookmark, History, Menu, X } from 'lucide-react';
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
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsHidden(mobile);
      setCollapsed(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsHidden(!isHidden);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        className={`fixed top-20 left-4 z-50 p-2 ${isMobile ? '' : 'md:hidden'}`}
        onClick={toggleSidebar}
      >
        {(isMobile && !isHidden) || (!isMobile && !collapsed) ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
      <div 
        className={`bg-gray-900 text-white h-[calc(100vh-4rem)] fixed top-16 left-0 transition-all duration-300 
          ${isMobile ? (isHidden ? '-translate-x-full' : 'translate-x-0 w-64') : (collapsed ? 'w-16' : 'w-64')} 
          ${isMobile ? 'z-40 shadow-lg' : 'relative'}`}
      >
        {!isMobile && (
          <Button variant="ghost" className="w-full p-2" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <ScrollArea className="h-[calc(100vh-4rem-40px)]">
          <div className={`p-2 space-y-2 ${collapsed && !isMobile ? 'items-center' : ''}`}>
            <SidebarItem icon={Home} label="Home" collapsed={collapsed && !isMobile} href='/' />
            <SidebarItem icon={PlaySquare} label="Videos" collapsed={collapsed && !isMobile} href='/video' />
            <SidebarItem icon={Film} label="Subscriptions" collapsed={collapsed && !isMobile} />
            
            {(!collapsed || isMobile) && <hr className="my-4 border-gray-700" />}
            
            {(!collapsed || isMobile) && <h2 className="font-semibold mb-2">Library</h2>}
            <SidebarItem icon={History} label="History" collapsed={collapsed && !isMobile} />
            <SidebarItem icon={Clock} label="Watch Later" collapsed={collapsed && !isMobile} />
            <SidebarItem icon={ThumbsUp} label="Liked Videos" collapsed={collapsed && !isMobile} />
            <SidebarItem icon={Bookmark} label="Playlists" collapsed={collapsed && !isMobile} />
            
            {(!collapsed || isMobile) && (
              <>
                <hr className="my-4 border-gray-700" />
                <h2 className="font-semibold mb-2">Subscriptions</h2>
                <SidebarItem icon={Film} label="Channel 1" collapsed={collapsed && !isMobile} />
                <SidebarItem icon={Film} label="Channel 2" collapsed={collapsed && !isMobile} />
                <SidebarItem icon={Film} label="Channel 3" collapsed={collapsed && !isMobile} />
                
                <hr className="my-4 border-gray-700" />
                <h2 className="font-semibold mb-2">Explore</h2>
                <SidebarItem icon={Home} label="Trending" collapsed={collapsed && !isMobile} />
                <SidebarItem icon={Home} label="Music" collapsed={collapsed && !isMobile} />
                <SidebarItem icon={Home} label="Gaming" collapsed={collapsed && !isMobile} />
                <SidebarItem icon={Home} label="News" collapsed={collapsed && !isMobile} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;