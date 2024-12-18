import { Suspense } from 'react';
import MainVideoPage from './Main';
import getUrl from "@/lib/geturl";

async function getVideoData(url, video_id) {
  if (!url || !video_id) return null;

  const response = await fetch(`${url}/api/video?video_id=${video_id}`);
  if (!response.ok) return null;

  const data = await response.json();
  if (!data || data.length <= 0) return null;

  return data.data;
}

export async function generateMetadata({ searchParams }) {
  const videoId = (await searchParams).id;

  const baseUrl = await getUrl();
  const canonicalUrl = `${baseUrl}/video?id=${videoId}`;

  const temp_data = await getVideoData(baseUrl, videoId);

  if (temp_data === null) {
    return {
    title: "Video Not Found",
    description: "Video not found",
    }
  }

  const videoData = temp_data[0];

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

  const url = await getUrl();
  const id = (await searchParams).id;
  const video_data = await getVideoData(url, id);

  if (process.env.NODE_ENV !== "development") {
    await fetch(`${url}/api/video/views?id=${id}`, { method: "post" });
  }

  let data = {};

  if (video_data !== null) {
    const temp_data = video_data[0];
    const res = await fetch(`${url}/api/profile?username=${temp_data.Account.username}`);
    
    if (res.ok) {
      const user_profile = await res.json();
      data = {
        ...temp_data,
        uploaderPic: user_profile.profile.avatar_url,
      }
    }
  }

  return (
    <Suspense fallback={<div>loading video display...</div>}>
      <MainVideoPage VideoData={data} />
    </Suspense>
  );
}