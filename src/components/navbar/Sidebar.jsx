"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Home, Upload, LayoutDashboardIcon, History, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from "next/link";
import { Separator } from "@/components/ui/separator"

const SidebarItem = ({ icon: Icon, label, collapsed, href="#" }) => (
  <Link href={href}>
    <Button variant="ghost" className={`w-full justify-start ${collapsed ? 'px-2' : ''}`} asChild>
      <span className="flex items-center">
        <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
        {!collapsed && <span>{label}</span>}
      </span>
    </Button>
  </Link>
);

const Sidebar = ({ defaultCollapsed = false, isHidden, setIsHidden, isMobile }) => {
  const [collapsed] = useState(defaultCollapsed);
  const [user, setUser] = useState(null);
  const sidebarRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const checkStorage = () => {
      const item = localStorage.getItem("user");
      if (item !== null) {
          setUser(JSON.parse(item));
      } else {
        setTimeout(checkStorage, 3);
      }
    };

    checkStorage()
  }, [setUser]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isMobile && !isHidden && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsHidden(prev => !prev);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMobile, isHidden, setIsHidden]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setIsHidden(true);
    } else if (isRightSwipe) {
      setIsHidden(false);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`bg-gray-800 text-white h-[calc(100vh-4rem)] fixed top-16 left-0 transition-all duration-300
        ${isMobile ? (isHidden ? '-translate-x-full' : 'translate-x-0 w-64') : (collapsed ? 'w-16' : 'w-64')}
        ${isMobile ? 'z-40 shadow-lg' : 'relative'}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ScrollArea className="h-full">
        <div className={`p-4 space-y-4 ${collapsed && !isMobile ? 'items-center' : ''}`}>
          <SidebarItem icon={Home} label="Home" collapsed={collapsed && !isMobile} href='/' />

          {(!collapsed || isMobile) && <Separator className="my-2 border-gray-700 bg-gray-700" />}
          {user && (
            <SidebarItem icon={Heart} label="Liked Videos" collapsed={collapsed && !isMobile} href="/#" />
          )}
          
          <SidebarItem icon={History} label="Watch History" collapsed={collapsed && !isMobile} href="/feed/history" />
  
          {(!collapsed || isMobile) && <Separator className="my-2 border-gray-700 bg-gray-700" />}
          {user && (
            <>
              <SidebarItem icon={Upload} label="Upload" collapsed={collapsed && !isMobile} href="/upload" />
              <SidebarItem icon={LayoutDashboardIcon} label="Dashboard" collapsed={collapsed && !isMobile} href="/dashboard" />
            </>
          )}

          {(!collapsed || isMobile) && (
            <></>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;