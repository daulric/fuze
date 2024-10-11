"use client";

import { Suspense, useEffect, useState, useMemo } from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import SupabaseClient from "@/supabase/client";
import store from "@/tools/cookieStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const cookieStore = store();

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

async function Logout() {
  const user_token = cookieStore.get("user");
  const user_data = localStorage.getItem("user");

  if (user_token !== null || user_data !== null) {
    cookieStore.remove("user");
    localStorage.removeItem("user");
  }

  window.location.reload();
}

const AccountProfileBar = ({ avatarSrc, logoSrc="" }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const currentPathName = usePathname();

  // Wrap this inside a Suspense boundary
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountProfileContent 
        avatarSrc={avatarSrc} 
        logoSrc={logoSrc}
        user={user} 
        setUser={setUser} 
        currentPathName={currentPathName} 
        router={router} 
      />
    </Suspense>
  );
};

const AccountProfileContent = ({ avatarSrc, user, setUser, currentPathName, router }) => {
  const searchParams = useSearchParams();

  // Memoize allQueryParams to prevent recalculation on every render
  const allQueryParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  // Memoize queryParams to prevent recalculation on every render
  const queryParams = useMemo(() => {
    let temp_string = "";
    for (const [key, value] of Object.entries(allQueryParams)) {
      if (key !== "p") {
        temp_string += `&${key}=${value}`;
      }
    }
    return temp_string;
  }, [allQueryParams]);

  useEffect(() => {
    const fetch_profile = async () => {
      const user_token = cookieStore.get("user");
      const user_data = localStorage.getItem("user");

      if (!user_token) {
        localStorage.removeItem("user");

        if (currentPathName === "/auth" && allQueryParams) return;
        return (window.location.href = `/auth?p=${currentPathName}${queryParams}`);
      }

      if (user_data) {
        const converted_data = JSON.parse(user_data);
        setUser(converted_data);
      } else {
        const supa_client = SupabaseClient();
        const accounts_db = supa_client.from("Account");
        const { data: account_data, error: checkError } = await accounts_db.select().eq("account_id", user_token).single();

        if (checkError) {
          return (window.location.href = `/auth?p=${currentPathName}?${queryParams}`);
        }

        if (account_data) {
          const string_data = JSON.stringify(account_data);
          localStorage.setItem("user", string_data);
          setUser(account_data);
        }
      }
    };

    fetch_profile();
  }, [currentPathName, queryParams, allQueryParams, setUser]);

  return (
    <div className="flex items-center justify-between space-x-4 bg-gray-800 p-4 w-full fixed top-0 z-50 h-16">
      {/* Logo and text */}
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.svg" alt="Logo" className="h-5 w-5" width={20} height={20} />
        <span className="text-white text-lg font-semibold">zTube</span>
      </Link>
      
      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={avatarSrc} alt={user?.username} />
              <AvatarFallback className='text-gray-800'>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-700 border-gray-700" align="end" forceMount>
          <DropdownMenuItem className="flex items-center bg-gray-700 text-gray-50" onClick={() => window.location.href = "/profile"}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center bg-gray-700 text-gray-50">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          {user !== null && (
            <DropdownMenuItem className="flex items-center text-red-500 bg-gray-700" onClick={() => Logout(router)}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccountProfileBar;