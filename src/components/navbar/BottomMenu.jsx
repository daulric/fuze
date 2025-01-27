"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Home, Upload, Heart, History, MoreHorizontal, LucideLayoutDashboard } from "lucide-react"
import waitFor from "@/lib/waitFor"

const MenuButton = ({ text, Icon, onClick, isActive, buttonRef }) => (
  <button
    ref={buttonRef}
    onClick={onClick}
    className={`flex flex-col items-center ${isActive ? "text-blue-500" : "text-white"} relative z-10`}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs">{text}</span>
  </button>
)

const StandaloneButton = ({ text, Icon, href }) => (
  <Link href={href} className="flex flex-col items-center text-white">
    <Icon className="h-6 w-6" />
    <span className="text-xs">{text}</span>
  </Link>
)

const SubMenuItem = ({ link, text, Icon, onClick }) => (
  <Link href={link} className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 text-white" onClick={onClick}>
    <Icon className="h-5 w-5" />
    <span className="text-sm">{text}</span>
  </Link>
)

const BottomMenu = () => {
  const [user, setUser] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [submenuPosition, setSubmenuPosition] = useState({ left: 0, width: 0 })
  const menuRefs = useRef({});
  const navRef = useRef(null)

  useEffect(() => {
    waitFor(() => sessionStorage.getItem("user"), 500).then(() => {
      const userData = JSON.parse(sessionStorage.getItem("user"))
      if (userData) {
        setUser(userData)
      }
    })
  }, [])

  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null)
    } else {
      setActiveMenu(menuName)
      const buttonRect = menuRefs.current[menuName].getBoundingClientRect()
      const navRect = navRef.current.getBoundingClientRect()
      const leftPosition = buttonRect.left - navRect.left
      const rightSpace = navRect.width - (leftPosition + buttonRect.width)
      const submenuWidth = Math.max(buttonRect.width, 150) // Minimum width of 150px

      let adjustedLeft = leftPosition
      if (rightSpace < submenuWidth - buttonRect.width) {
        // Adjust left position if there's not enough space on the right
        adjustedLeft = Math.max(0, leftPosition - (submenuWidth - buttonRect.width))
      }

      setSubmenuPosition({
        left: adjustedLeft,
        width: submenuWidth,
      })
    }
  }

  const closeMenu = () => {
    setActiveMenu(null)
  }
  
  const GetActiveMenu =() => (
    <>
    {activeMenu === "more_item" && (
      <div className="py-2">
        {user && (<SubMenuItem link="/feed/liked" text="Liked Videos" Icon={Heart} onClick={closeMenu} />)}
        <SubMenuItem link="/feed/history" text="History" Icon={History} onClick={closeMenu} />
        {user && (<SubMenuItem link="/dashboard" text="Dashboard" Icon={LucideLayoutDashboard} onClick={closeMenu} />)}
      </div>
    )}
    </>
  );

  return (
    <nav ref={navRef} className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 z-50 h-[4.4rem]">
      {activeMenu && (
        <div
          className="absolute bg-gray-800 border-t border-gray-700 shadow-lg"
          style={{
            bottom: "100%",
            left: `${submenuPosition.left}px`,
            width: `${submenuPosition.width}px`,
          }}
        >
          <GetActiveMenu />
        </div>
      )}
      <div className="flex justify-around items-center h-16">
        <StandaloneButton text="Home" Icon={Home} href="/" />
        {user && (<StandaloneButton text="Upload" href="/upload" Icon={Upload} />)}
        <MenuButton
          text="More"
          Icon={MoreHorizontal}
          onClick={() => toggleMenu("more_item")}
          isActive={activeMenu === "more_item"}
          buttonRef={el => menuRefs.current.more_item = el}
        />
      </div>
    </nav>
  )
}

export default BottomMenu;