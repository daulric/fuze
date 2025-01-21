"use client"
import { notFound } from "next/navigation";

import {computed, signal  } from "@preact/signals-react"

export default function PAGE() {
  const clicks = signal(0);
  
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    
    <button
      onClick={() => {clicks.value++, console.log("clicking currrent was:", clicks.value);  }}
    >
      Clicks { computed(() => clicks.value) }
    </button>
  )
}