"use client"

import React, { useState, useEffect } from 'react';
import { Home, Menu, X, Upload, User } from 'lucide-react';
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
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          className="fixed top-20 left-4 z-50 p-2 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      
      <div 
        className={`bg-gray-800 text-white h-[calc(100vh-4rem)] fixed top-16 left-0 transition-all duration-300 
          ${isMobile ? (isHidden ? '-translate-x-full' : 'translate-x-0 w-64') : (collapsed ? 'w-16' : 'w-64')} 
          ${isMobile ? 'z-40 shadow-lg' : 'relative'}`}
      >
        <div className="relative">
          <Button 
            variant="ghost" 
            className={`absolute top-4 p-2 transition-all duration-300
              ${(isMobile && !isHidden) || (!isMobile && !collapsed)
                ? 'right-2 translate-x-1 translate-y-1 shadow-md' 
                : 'left-2 -translate-x-0.5 -translate-y-0.5 shadow-inner'}
              ${isMobile ? 'md:hidden' : ''}`}
            onClick={toggleSidebar}
          >
            {(isMobile && !isHidden) || (!isMobile && !collapsed) ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem-40px)] mt-14">
          <div className={`p-2 space-y-2 ${collapsed && !isMobile ? 'items-center' : ''}`}>
            <SidebarItem icon={Home} label="Home" collapsed={collapsed && !isMobile} href='/' />
            <SidebarItem icon={User} label="Profile" collapsed={collapsed && !isMobile} href='#' />
            <SidebarItem icon={Upload} label="Upload" collapsed={collapsed && !isMobile} href="/upload" />
            
            {(!collapsed || isMobile) && <hr className="my-4 border-gray-700" />}
            
            {(!collapsed || isMobile) && (
              <></>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;