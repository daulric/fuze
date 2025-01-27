"use client"

import { useState, useEffect } from "react"
import ProfileBar from "@/components/navbar/Profilebar"
import Sidebar from "@/components/navbar/Sidebar"
import { usePathname } from "next/navigation"
import BottomMenu from "@/components/navbar/BottomMenu";
import GetMobile from "@/lib/isMobileDevice"

const ClientWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const pathName = usePathname();

  const PathNameList = ["video", "pulse"];

  function getPathName() {
    const splited = pathName.split("/")[1]
    return PathNameList.includes(splited)
  }

  useEffect(() => {
    const controller = new AbortController();

    const checkMobile = () => {
      const is_pwa = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;const pathExcluded = getPathName();
      const mobile = window.innerWidth < 1080;
      
      setIsMobile(() => {
        
        if (is_pwa && GetMobile()) {
          setIsPWA(true);
        } else {
          setIsPWA(false);
        }
        
        setIsHidden(pathExcluded ? true : mobile);
        return pathExcluded ? true : mobile;
      })

    }

    checkMobile();
    window.addEventListener("resize", checkMobile, { signal: controller.signal })
    return () => controller.abort()
  }, [pathName])

  const toggleSidebar = (newState) => {
    if (isMobile) {
      if (typeof newState === "boolean") {
        setIsHidden(newState)
      } else {
        setIsHidden((prev) => !prev)
      }
    }
  }

  return (
    <div className="relative h-screen overflow-hidden overscroll-none">
      <div className="flex h-screen">
        <ProfileBar toggleSidebar={toggleSidebar} isSidebarHidden={isHidden} isMobile={isMobile} isPWA={isPWA} />
        {(!isMobile || !isPWA) && <Sidebar isHidden={isHidden} setIsHidden={setIsHidden} isMobile={isPWA ? isPWA : isMobile} isPWA={isPWA} />}
        <main
          className={`flex-1 h-[calc(100vh-${(isPWA && isMobile) ? "128px" : "64px" })] 
            mt-16 ${pathName === "/pulse" ? "overflow-none" : "overflow-auto"} 
            ${isPWA && isMobile ? "mb-16" : ""
          }`}
        >
          {children}
        </main>
        {(isPWA && isMobile) && <BottomMenu />}
      </div>
    </div>
  )
}

export default ClientWrapper