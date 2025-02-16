"use client"

import { useState, useEffect, use } from "react"
import ProfileBar from "@/components/navbar/Profilebar"
import Sidebar from "@/components/navbar/Sidebar"
import { usePathname } from "next/navigation"
import BottomMenu from "@/components/navbar/BottomMenu";
import GetMobile from "@/lib/isMobileDevice";
import { UserContext } from "@/lib/UserContext"
import store from "@/tools/cookieStore";

const cookieStore = store();

const ClientWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [user, setUser] = useState(null);
  const pathName = usePathname();
  const controller = new AbortController();

  const PathNameList = ["video", "pulse"];
  
  controller.signal.addEventListener("abort", () => {
    setUser(null);
  });
  
  function getPathName() {
    const splited = pathName.split("/")[1]
    return PathNameList.includes(splited)
  }

  useEffect(() => {

    const checkMobile = () => {
      const is_pwa = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
      const pathExcluded = getPathName();
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
    
    async function getUser() {
      const user_token = cookieStore.get("user");
      
      if (!user_token) return;
      
      const query = new URLSearchParams({
        account_id: user_token,
        allowId: true,
      });
      
      const res = await fetch(`/api/profile?${query.toString()}`, {
        cache: "no-cache",
      });
      
      if (!res.ok) return
      const { profile } = await res.json();
      
      if (profile) {
        delete profile.Video;
        delete profile.Posts;
        sessionStorage.setItem("user", JSON.stringify(profile));
        setUser(profile);
      }
      
      console.log("getting user from LAYOUTCLIENT");
    }
    
    getUser();

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
    <UserContext.Provider value={user}>
      <div className="relative h-screen overflow-hidden overscroll-none">
        <div className="flex h-screen">
          <ProfileBar toggleSidebar={toggleSidebar} isSidebarHidden={isHidden} isMobile={isMobile} isPWA={isPWA} />
          {(!isMobile || !isPWA) && <Sidebar isHidden={isHidden} setIsHidden={setIsHidden} isMobile={isPWA ? isPWA : isMobile} isPWA={isPWA} />}
          <main
            className={`flex-1 h-[calc(100vh-64px)] mt-16 
              ${pathName === "/pulse" ? "overflow-none" : "overflow-auto"} 
              ${isMobile ? "mb-16" : ""}`
            }
          >
            {children}
          </main>
          {(isPWA && isMobile) && <BottomMenu />}
        </div>
      </div>
    </UserContext.Provider>
  )
}

export default ClientWrapper