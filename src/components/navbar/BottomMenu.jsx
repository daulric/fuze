"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { Home, Upload, Heart, History, MoreHorizontal, LucideLayoutDashboard, Pencil, CircleUser } from "lucide-react"
import { cn } from "@/lib/utils"
import waitFor from "@/lib/waitFor"
import Link from "next/link";
import {usePathInfo} from "@/lib/getPathname"

const MenuItem = ({ href, icon: Icon, label, isActive, onClick, buttonRef }) => {
  const Content = (
    <>
      <Icon className={cn("h-6 w-6 mb-1", isActive ? "text-white" : "text-gray-400")} />
      <span className={cn("text-xs", isActive ? "text-white" : "text-gray-400")}>{label}</span>
      {isActive && <div className="absolute -bottom-2.5 w-1 h-1 rounded-full bg-blue-500" />}
    </>
  )

  if (onClick) {
    return (
      <button ref={buttonRef} onClick={onClick} className="flex flex-col items-center justify-center relative">
        {Content}
      </button>
    )
  }

  return (
    <Link href={href} className="flex flex-col items-center justify-center relative">
      {Content}
    </Link>
  )
}

const SubMenuItem = ({ link, text, Icon, onClick }) => (
  <Link
    href={link}
    className="flex items-center space-x-2 px-4 py-3 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm">{text}</span>
  </Link>
)

export default function BottomNav() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [submenuPosition, setSubmenuPosition] = useState({ left: 0, width: 0 })
  const menuRefs = useRef({})
  const navRef = useRef(null)
  const touchStartRef = useRef(null);
  const Controller = new AbortController();
  
  const excluded_paths = ["/upload", "/policy", "/settings"];

  useEffect(() => {
    waitFor(() => sessionStorage.getItem("user"), 200).then(() => {
      const userData = JSON.parse(sessionStorage.getItem("user"))
      if (userData) {
        setUser(userData)
      }
    })
  }, [])

  const toggleMenu = useCallback(
    (menuName) => {
      if (activeMenu === menuName) {
        setActiveMenu(null)
      } else {
        setActiveMenu(menuName)
        const buttonRect = menuRefs.current[menuName].getBoundingClientRect()
        const navRect = navRef.current.getBoundingClientRect()
        const leftPosition = buttonRect.left - navRect.left
        const rightSpace = navRect.width - (leftPosition + buttonRect.width)
        const submenuWidth = Math.max(buttonRect.width, 200)

        let adjustedLeft = leftPosition
        if (rightSpace < submenuWidth - buttonRect.width) {
          adjustedLeft = Math.max(0, leftPosition - (submenuWidth - buttonRect.width))
        }

        setSubmenuPosition({
          left: adjustedLeft,
          width: submenuWidth,
        })
      }
    },
    [activeMenu],
  )

  const closeMenu = useCallback(() => {
    setActiveMenu(null)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && activeMenu) {
        closeMenu()
      }
    }

    const handleTouchStart = (event) => {
      touchStartRef.current = event.touches[0].clientY
    }

    const handleTouchMove = (event) => {
      if (touchStartRef.current !== null) {
        const touchEnd = event.touches[0].clientY
        const diff = touchStartRef.current - touchEnd

        if (Math.abs(diff) > 5) {
          // Threshold for considering it a swipe
          closeMenu()
          touchStartRef.current = null
        }
      }
    }

    document.addEventListener("click", handleOutsideClick, { signal: Controller.signal })
    document.addEventListener("touchstart", handleTouchStart, { signal: Controller.signal })
    document.addEventListener("touchmove", handleTouchMove, { signal: Controller.signal })

    return () => {
      Controller.abort();
    }
  }, [activeMenu, closeMenu]);
  
  const GetActiveMenu = () => (
    <>
      {activeMenu === "more_item" && (
        <>
          {user && <SubMenuItem link="/feed/liked" text="Liked Videos" Icon={Heart} onClick={closeMenu} />}
          <SubMenuItem link="/feed/history" text="History" Icon={History} onClick={closeMenu} />
          {user && <SubMenuItem link="/dashboard" text="Dashboard" Icon={LucideLayoutDashboard} onClick={closeMenu} />}
        </>
      )}
      {/* We can add more trigger actions here */}
    </>
  );

  return (
    <div className={`${excluded_paths.includes(pathname) ? "invisible" : ""} fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden`}>
      {activeMenu && (
        <div
          className="absolute bottom-[calc(100%+1rem)] bg-black/90 backdrop-blur-md rounded-lg border border-white/10 shadow-lg overflow-hidden"
          style={{
            left: `${submenuPosition.left}px`,
            width: `${submenuPosition.width}px`,
          }}
        >
          <div className="py-1">
            <GetActiveMenu />
          </div>
        </div>
      )}
      <nav
        ref={navRef}
        className="flex items-center bg-gray-95000 justify-between gap-8 px-8 py-4 bg-black/80 backdrop-blur-md rounded-full border border-transparent"
      >
        <MenuItem href="/" icon={Home} label="Home" isActive={pathname === "/"} />
        {user && <MenuItem href="/upload" icon={Upload} label="Upload" isActive={pathname === "/upload"} />}
        {user && <MenuItem href="/flare/create" icon={Pencil} label="Flare" isActive={pathname === "/flare/create"} />}
        <MenuItem
          icon={MoreHorizontal}
          label="More"
          isActive={activeMenu === "more_item"}
          onClick={() => toggleMenu("more_item")}
          buttonRef={(el) => (menuRefs.current.more_item = el)}
        />
        {!user && <MenuItem href={`/auth?p=${usePathInfo()}`} icon={CircleUser} label="Account" isActive={pathname === "/auth"} />}
      </nav>
    </div>
  )
}