"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

import { usePathInfo } from "@/lib/getPathname";

export default function NotFound() {
  const path = usePathInfo();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Account Needed</h2>
      <p className="text-white mb-4">nah g doh try that. u need to make an account</p>
      <Button className="bg-gray-600">
        <Link href={`/auth?${path}`}>Create Account</Link>
      </Button>
    </div>
  )
}