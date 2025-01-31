import { Suspense, cache } from 'react';
import MainVideoPage from './VideoDisplay';
import getUrl from "@/lib/geturl";
import { notFound } from 'next/navigation';

// Use cache to memoize the result of getVideoData
const cachedGetVideoData = cache(async (url, video_id) => {
  if (!url || !video_id) return null;

  const response = await fetch(`${url}/api/video?video_id=${video_id}`, {
    cache: "no-store"
  });

  if (!response.ok) return null;

  const data = await response.json();
  if (!data || data.data.length === 0) return null;

  return data.data[0];
});

export async function generateMetadata({ params }) {
  const videoId = (await params).id;
  const baseUrl = await getUrl();
  const canonicalUrl = `${baseUrl}/video?id=${videoId}`;

  const videoData = await cachedGetVideoData(baseUrl, videoId);

  if (!videoData) {
    return {
      title: "Video Not Found",
      description: "Video not found",
    }
  }

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

export default async function PAGE({ params }) {
  const url = await getUrl();
  const id = (await params).id;
  const video_data = await cachedGetVideoData(url, id);

  if (process.env.NODE_ENV !== "development") {
    await fetch(`${url}/api/video/views?id=${id}`, { method: "post" });
  }

  const data = [];

  if (video_data) {
    const res = await fetch(`${url}/api/profile?username=${video_data.Account.username}`, {
      next: { revalidate: 4 }
    });

    if (res.ok) {
      const user_profile = await res.json();
      data.push({
        ...video_data,
        uploaderPic: user_profile.profile.avatar_url,
      });
    }
  } else {
    notFound();
  }

  return (
    <Suspense fallback={<div>wait ah lil while...</div>}>
      <MainVideoPage VideoData={data[0]} />
    </Suspense>
  );
}