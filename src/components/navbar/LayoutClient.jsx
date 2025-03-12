"use client"

import { useEffect } from "react"
import ProfileBar from "@/components/navbar/Profilebar"
import Sidebar from "@/components/navbar/Sidebar"
import { usePathname } from "next/navigation"
import BottomMenu from "@/components/navbar/BottomMenu";
import GetMobile from "@/lib/isMobileDevice";
import { HiddenSignal, MobileSignal, PWASignal } from "./NavbarSignal";
import { useComputed } from "@preact/signals-react"

const ClientWrapper = ({ children }) => {
  const pathName = usePathname();
  const controller = new AbortController();

  const PathNameList = ["video", "pulse"];
  
  function getPathName() {
    const splited = pathName.split("/")[1]
    return PathNameList.includes(splited)
  }

  useEffect(() => {

    const checkMobile = () => {
      const is_pwa = globalThis.navigator.standalone || globalThis.matchMedia('(display-mode: standalone)').matches;
      const pathExcluded = getPathName();
      const mobile = globalThis.innerWidth < 1080;

      if (is_pwa && GetMobile()) {
        PWASignal.value = true;
      } else {
        PWASignal.value = false;
      }

      HiddenSignal.value = pathExcluded ? true : mobile;
      MobileSignal.value = pathExcluded ? true : mobile;
    }

    checkMobile();
    globalThis.addEventListener("resize", checkMobile, { signal: controller.signal })
    return () => controller.abort()
  }, [pathName])

  const toggleSidebar = (newState) => {
    if (MobileSignal.value) {
      if (typeof newState === "boolean") {
        HiddenSignal.value = newState;
      } else {
        HiddenSignal.value = !HiddenSignal.value;
      }
    }
  }

  const ProfilebarComputed = useComputed(() => (
    <ProfileBar toggleSidebar={toggleSidebar} isSidebarHidden={HiddenSignal.value} isMobile={MobileSignal.value} isPWA={PWASignal.value} />
  ));

  const SidebarComputed = useComputed(() => (
    (!MobileSignal.value || !PWASignal.value) && <Sidebar isHidden={HiddenSignal.value} isMobile={PWASignal.value ? PWASignal.value : MobileSignal.value} isPWA={ PWASignal.value } />
  ));

  const BottomMenuComputed = useComputed(() => (PWASignal.value && PWASignal.value) && <BottomMenu />)

  const MainClassNameComputed = useComputed(() => `
    flex-1 h-[calc(100vh-64px)] mt-16 
    ${pathName === "/pulse" ? "overflow-none" : "overflow-auto"} 
    ${MobileSignal.value ? "mb-16" : ""}
  `)

  return (
    <div className="relative h-screen overflow-hidden overscroll-none">
      <div className="flex h-screen">
        { ProfilebarComputed }        
        { SidebarComputed }
        <main
          className={ MainClassNameComputed }
        >
          {children}
        </main>
        { BottomMenuComputed }
      </div>
    </div>
  )
}

export default ClientWrapper