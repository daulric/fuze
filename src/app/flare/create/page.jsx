import PostCreator from "./PostCreator"
import { notFound } from "next/navigation";

import { cookies } from "next/headers";

export const metadata = {
  title: "create a flare"
}

export default async function CreatePostPage() { 
  
  const user = (await cookies()).get("user");

  if (!user) {
    return notFound();
  }
  
  return (
    <>
      <PostCreator />
    </>
  )
}