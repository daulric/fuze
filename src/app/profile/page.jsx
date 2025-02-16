import ProfileDisplay from "./ProfileDisplay"
import { Suspense } from "react"
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
  title: "My Profile",
}

export default async function PAGE() {
  // Fetch username here
  const user_token = (await cookies()).get("user")
  
  if (!user_token) {
    return notFound();
  }

  return (
    <Suspense fallback={<div>loading profile...</div>} >
      <ProfileDisplay />
    </Suspense>
  )
}