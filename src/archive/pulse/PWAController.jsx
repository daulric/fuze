"use client"

import NotFound from "./not-found"
import PulseClient from "./pulse_client"
import { useEffect, useState, Suspense } from "react";
import isMobile from "@/lib/isMobileDevice";

export default function PULSE_CLIENT_PWA() {
  const [isPwa, setIsPwa] = useState(false);
  
  useEffect(() => {
    const isPWA = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isPWA && isMobile()) {
      setIsPwa(true);
    }
    
    return () => setIsPwa(false);
  }, []);
  
  return (
    <div className="overscroll-none" >
      { isPwa ? (
        <Suspense fallback={<div>loading pulses</div>} >
          <PulseClient />
        </Suspense>
      ) : <NotFound/> }
    </div>
  )
}