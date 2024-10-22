import { Suspense } from 'react';
import MainVideoPage from './Main';
import { headers } from 'next/headers';

export async function generateMetadata({ searchParams }) {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const videoId = (await searchParams).id;

  const baseUrl = `${protocol}://${host}`;
  const canonicalUrl = `${baseUrl}/video?id=${videoId}`;

  if (!videoId) {
    return {
      title: 'Video Not Found',
      description: 'No video ID provided',
    };
  }

  const videoData = await fetch(`${baseUrl}/api/video?video_id=${videoId}`, {
    cache: 'no-store' 
  }).then(async (response) => {
    if (response.ok)  {
      const jsonData = await response.json();
      return jsonData.data[0]
    }

    return [];
  });
  
  if (!videoData || videoData.length === 0) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found',
    };
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

export default function PAGE() {
  return (
    <Suspense>
      <MainVideoPage />
    </Suspense>
  );
}
