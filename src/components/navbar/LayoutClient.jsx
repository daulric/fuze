"use client"

import { useState, useEffect } from 'react';
import ProfileBar from "@/components/navbar/Profilebar";
import Sidebar from "@/components/navbar/Sidebar";

const ClientWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsHidden(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = (newState) => {
    if (isMobile) {
      if (typeof newState === 'boolean') {
        setIsHidden(newState);
      } else {
        setIsHidden(prev => !prev);
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <ProfileBar
        toggleSidebar={toggleSidebar}
        isSidebarHidden={isHidden}
        isMobile={isMobile}
      />
      <div className="flex h-screen">
        <Sidebar
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          isMobile={isMobile}
        />
        <main className="flex-1 h-[calc(100vh-64px)] mt-16 overflow-y-auto overscroll-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientWrapper;