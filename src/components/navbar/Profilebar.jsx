"use client"

import { useEffect, useState } from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import SupabaseClient from "@/supabase/client";
import { cookieStore } from "@/tools/cookieStore";
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

async function Logout() {

  const user_token = cookieStore.get("user");
  const user_data = localStorage.getItem("user");

  if (user_token !== null || user_data !== null ) {
    cookieStore.remove("user");
    localStorage.removeItem("user");
  }

  window.location.reload();
}

const AccountProfileBar = ({ avatarSrc }) => {

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetch_profile = async () => {
      // This function will be used in a useEffec function;
      const user_token = cookieStore.get("user");
      const user_data = localStorage.getItem("user");
      
      if (user_token === null || user_token === "") {
        localStorage.removeItem("user");
        return router.push("/auth");
      }

      if (user_data) {
        const converted_data = JSON.parse(user_data);
        setUser(converted_data);
      } else {
        const supa_client = SupabaseClient();
        const accounts_db = supa_client.from("Account");
        const {data: account_data, error: checkError} =  await accounts_db.select().eq("account_id", user_token).single();

        if (checkError) {
          return router.push("/auth");
        }

        if (account_data !== null) {
          const string_data = JSON.stringify(account_data);
          localStorage.setItem("user", string_data);
          setUser(account_data);
        }

      }
    }

    fetch_profile();
  }, [setUser, router])

  return (
    <div className="flex items-center justify-end space-x-4 bg-gray-800 p-4 w-full fixed top-0 z-50 h-16">
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
          <DropdownMenuItem className="flex items-center bg-gray-700 text-gray-50">
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