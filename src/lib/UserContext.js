"use client"

import { useContext, createContext, useState, useEffect } from "react";
import DeepComparison from "@/lib/DeepComparison";
import store from "@/tools/cookieStore";

const cookieStore = store();

export const UserContext = createContext(undefined);

export const useUser = () => {
  const user = useContext(UserContext);
  
  if (user === undefined) {
    return null;
  }
  
  return user;
}

export function UserContextProvider({children}) {
  const [user, setUser] = useState(null);
  const controller = new AbortController();
  
  controller.signal.addEventListener("abort", () => {
    setUser(null)
  });

  useEffect(() => {
    async function getUser() {
      try {
        if (user) return;
        const user_token = cookieStore.get("user");
        if (!user_token) { localStorage.removeItem("user"); return };
  
        const user_data = JSON.parse(localStorage.getItem("user"));

        if (user_data) {
          setUser(user_data);
        }
        
        const query = new URLSearchParams({
          account_id: user_token,
          allowId: true,
        });
        
        const res = await fetch(`/api/profile?${query.toString()}`, {
          signal: controller.signal,
        }).catch((e) => {
          if (e) return;
        });
        
        if (!res.ok) return
        const { profile } = await res.json();
        
        if (profile) {
          delete profile.Video;
          delete profile.Posts;
          
          if (!DeepComparison(user_data, profile)) {
            localStorage.setItem("user", JSON.stringify(profile));
            setUser(profile);
          }
        }
      } catch (e) {
        if (e) console.log("hmm lights cut out...");
      }
    }

    globalThis.addEventListener("client_side_logout_state", () => {
      const user_token = cookieStore.get("user");
      const user_data = localStorage.getItem("user");

      if (user_token !== null || user_data !== null) {
        cookieStore.remove("user");
        localStorage.removeItem("user")
      }

      setUser(null);
    }, { signal: controller.signal });

    getUser();

    return () => controller.abort();
  }, []);
  
  return (
    <UserContext.Provider value={user}>
      { children }
    </UserContext.Provider>
  );
}