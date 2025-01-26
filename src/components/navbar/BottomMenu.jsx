"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Home, Upload, User, Video, LayoutDashboard } from "lucide-react";
import waitFor from "@/lib/waitFor";

const MenuButton = ({link, text, Icon}) => (
  <Link href={link} className="flex flex-col items-center">
    <Icon className="h-6 w-6" />
    <span className="text-xs">{text}</span>
  </Link>
);

const BottomMenu = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    waitFor(() => sessionStorage.getItem("user"), 500).then(() => {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      if (userData) {
        setUser(userData);
      }
    })
  }, [setUser]);
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white z-50">
      <div className="flex justify-around items-center h-16">
        <MenuButton link="/" text="Home" Icon={Home} />
        {(user && user.is_verified) && (
          <MenuButton link="/pulse" text="Pulse" Icon={Video} />
        )}
        {user && (
          <>
          <MenuButton link="/upload" text="Upload" Icon={Upload} />
          <MenuButton link="/dashboard" text="Dashboard" Icon={LayoutDashboard} />
          </>
        )}
      </div>
    </nav>
  )
}

export default BottomMenu