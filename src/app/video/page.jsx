import { Suspense } from 'react';
import MainVideoPage from './VideoDisplay';
import getUrl from "@/lib/geturl";
import { notFound } from 'next/navigation';

async function getVideoData(url, video_id) {
  if (!url || !video_id) return null;

  const response = await fetch(`${url}/api/video?video_id=${video_id}`, {
    next: { revalidate: 4 },
  });

  if (!response.ok) return null;

  const data = await response.json();
  if (!data || data.data.length === 0) return null;

  return data.data[0];
}

export async function generateMetadata({ searchParams }) {
  const start = performance.now();
  const videoId = (await searchParams).id;

  const baseUrl = await getUrl();
  const canonicalUrl = `${baseUrl}/video?id=${videoId}`;
  const videoData = await getVideoData(baseUrl, videoId);

  if (videoData === null) {
    return {
    title: "Video Not Found",
    description: "Video not found",
    }
  }

  console.log("Ended in:", performance.now() - start)
  return {
    title: videoData.title || 'Video',
    description: videoData.description || 'No description available',
    openGraph: {
      title: videoData.title || 'Video',
      description: videoData.description || 'No description available',
      url: canonicalUrl,
      type: 'video.other',
    },
  };
}

export default async function PAGE({searchParams}) {
  const start = performance.now();
  const url = await getUrl();
  const id = (await searchParams).id;
  const video_data = await getVideoData(url, id);

  if (process.env.NODE_ENV !== "development") {
    await fetch(`${url}/api/video/views?id=${id}`, { method: "post" });
  }

  const data = [];

  if (video_data !== null) {
    const res = await fetch(`${url}/api/profile?username=${video_data.Account.username}`, {
      next: { revalidate: 4 }
    });
    
    if (res.ok) {
      const user_profile = await res.json();
      data.push({
        ...video_data,
        uploaderPic: user_profile.profile.avatar_url || "/logo.svg",
      })
    }
  } else {
    notFound();
  }

  console.log("Ended in:", performance.now() - start)
  return (
    <Suspense fallback={<div>wait ah lil while...</div>}>
      <MainVideoPage VideoData={data[data.length - 1]} />
    </Suspense>
  );
}