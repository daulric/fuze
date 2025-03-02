"use client";

import { Suspense } from "react";
import { Settings, LogOut, LogIn, User, Menu, X, Info } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import store from "@/tools/cookieStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchBar from "./Searchbar";
import { usePathInfo } from "@/lib/getPathname";
import { useUser } from "@/lib/UserContext"

const cookieStore = store();

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function Logout() {
  const user_token = cookieStore.get("user");
  const user_data = sessionStorage.getItem("user");

  if (user_token !== null || user_data !== null) {
    cookieStore.remove("user");
    sessionStorage.removeItem("user")
  }

  globalThis.location.reload();
}

const AccountProfileBar = ({ toggleSidebar, isSidebarHidden, isMobile, isPWA }) => {
  const user = useUser();
  const router = useRouter();
  
  return (
    <Suspense>
      <div className="flex items-center justify-between space-x-4 bg-gray-800 p-4 w-full fixed top-0 z-50 h-16">
        <div className="flex items-center space-x-4">
          {(isPWA ? false : isMobile) && (
            <Button
              variant="ghost"
              className="p-2 hover:bg-gray-700"
              onClick={() => toggleSidebar((prev) => !prev)}
            >
              {isSidebarHidden ? (
                <Menu className="h-6 w-6 text-white" />
              ) : (
                <X className="h-6 w-6 text-white" />
              )}
            </Button>
          )}
  
          <Button onClick={() => router.push("/")} className="bg-transparent flex items-center space-x-2">
            <Image
              loading="eager"
              src="/logo.svg"
              priority
              alt="Logo"
              className="h-5 w-5"
              width={20}
              height={20}
            />
            <span className="text-white text-lg font-semibold">fuze</span>
          </Button>
        </div>
  
        {/* Centered search bar */}
        <div className="flex-grow flex justify-center max-w-2xl">
          <SearchBar />
        </div>
  
        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user?.avatar_url} alt={user?.username} />
                <AvatarFallback className="text-gray-800">
                  {user?.username.charAt(0).toUpperCase() || "G"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-gray-700 border-gray-700"
            align="end"
            forceMount
          >
            {user && (
              <>
                <DropdownMenuItem
                  className="flex items-center bg-gray-700 text-gray-50"
                  onClick={() => router.push("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center bg-gray-700 text-gray-50"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </>
            )}
            {!user && (
              <DropdownMenuItem
                className="flex items-center bg-gray-700 text-gray-50"
                onClick={() =>  router.push(`/auth?${usePathInfo()}`)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                <span>Login</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="flex items-center bg-gray-700 text-gray-50"
              onClick={() => router.push("/policy")}
            >
              <Info className="mr-2 h-4 w-4" />
              <span>Policy</span>
            </DropdownMenuItem>
  
            {user && <DropdownMenuSeparator className="bg-gray-400" />}
  
            {user !== null && (
              <DropdownMenuItem
                className="flex items-center text-red-500 bg-gray-700"
                onClick={() => Logout(router)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Suspense>
  );
};

export default AccountProfileBar;