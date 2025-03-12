"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Home, Upload, LayoutDashboardIcon, History, Heart, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from "next/link";
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/lib/UserContext";
import { HiddenSignal } from './NavbarSignal';

const SidebarItem = ({ icon: Icon, label, collapsed, href="#" }) => (
  <Link href={href} >
    <Button variant="ghost" className={`w-full justify-start ${collapsed ? 'px-2' : ''}`} asChild>
      <span className="flex items-center">
        <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
        {!collapsed && <span>{label}</span>}
      </span>
    </Button>
  </Link>
);

const Sidebar = ({ defaultCollapsed = false, isHidden, isMobile }) => {
  const user = useUser();
  const sidebarRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const controller = new AbortController();
    
    const handleOutsideClick = (event) => {
      if (isMobile && !isHidden && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        HiddenSignal.value = !HiddenSignal.value;
      }
    };

    document.addEventListener('mousedown', handleOutsideClick, { signal: controller.signal });
    document.addEventListener('touchstart', handleOutsideClick, { signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [isMobile, isHidden, HiddenSignal]);

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
      HiddenSignal.value = true;
    } else if (isRightSwipe) {
      HiddenSignal.value = false;
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`bg-gray-800 text-white h-[calc(100vh-4rem)] fixed top-16 left-0 transition-all duration-300
        ${isMobile ? (isHidden ? '-translate-x-full' : 'translate-x-0 w-64') : (defaultCollapsed ? 'w-16' : 'w-64')}
        ${isMobile ? 'z-40 shadow-lg' : 'relative'}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ScrollArea className="h-full">
        <div className={`p-4 space-y-4 ${defaultCollapsed && !isMobile ? 'items-center' : ''}`}>
          <SidebarItem icon={Home} label="Home" collapsed={defaultCollapsed && !isMobile} href='/' />

          {user && (
            <SidebarItem icon={Heart} label="Liked Videos" collapsed={defaultCollapsed && !isMobile} href="/feed/liked" />
          )}
          
          <SidebarItem icon={History} label="Watch History" collapsed={defaultCollapsed && !isMobile} href="/feed/history" />
  
          {(!defaultCollapsed || isMobile) && <Separator className="my-2 border-gray-700 bg-gray-700" />}
          {user && (
            <>
              <SidebarItem icon={Upload} label="Upload" collapsed={defaultCollapsed && !isMobile} href="/upload" />
              <SidebarItem icon={Pencil} label="Create Flare" collapsed={defaultCollapsed && !isMobile} href="/flare/create" />
              <SidebarItem icon={LayoutDashboardIcon} label="Dashboard" collapsed={defaultCollapsed && !isMobile} href="/dashboard" />
            </>
          )}

          {(!defaultCollapsed || isMobile) && (
            <></>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;