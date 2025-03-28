import { notFound } from "next/navigation";
import LikedVideosPage from "./client"
import { cookies } from "next/headers";

export const metadata = {
  title: 'Liked Videos',
  description: 'View your liked videos',
}

export default async function PAGE() {

  const cookie = (await cookies());
  const user = cookie.get("user")

  if (!user) notFound();

  return (
    <LikedVideosPage />
  );
}