"use client"

import { useState, useEffect } from 'react';
import ProfileBar from "@/components/navbar/Profilebar";
import Sidebar from "@/components/navbar/Sidebar";
import { usePathname } from 'next/navigation';

const ClientWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathName = usePathname();
  
  const PathNameList = ["video", "pulse"];
  
  function getPathName() {
    const splited = pathName.split("/")[1];
    return PathNameList.includes(splited);
  }

  useEffect(() => {
    const checkMobile = () => {
      const pathExcluded = getPathName();
      const mobile = window.innerWidth < 1080;
      setIsMobile(pathExcluded ? true : mobile);
      setIsHidden(pathExcluded ? true : mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [pathName]);

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
    <div className="relative h-screen overflow-hidden overscroll-none">
      <div className="flex h-screen">
      <ProfileBar
        toggleSidebar={toggleSidebar}
        isSidebarHidden={isHidden}
        isMobile={isMobile}
      />
        <Sidebar
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          isMobile={isMobile}
        />
        <main className={`flex-1 h-[calc(100vh-64px)] mt-16 ${pathName === "/pulse" ? "overflow-none" : "overflow-auto"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientWrapper;