import { Suspense } from 'react';
import MainVideoPage from './Main';
import { headers } from 'next/headers';

export async function generateMetadata({ searchParams }) {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  
  const domain = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.VERCEL_BRANCH_URL
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : `${protocol}://${host}`;
  
  console.log('Domain:', domain);
  console.log('Search Params:', searchParams);
  
  const video_id = searchParams.id;
  console.log('Video ID:', video_id);

  const apiUrl = `${domain}/api/video`;
  console.log('API URL:', apiUrl);

  try {
    const response = await fetch(apiUrl);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const video_data = JSON.parse(responseText);
    console.log('Parsed video data:', video_data);

    const item = video_data?.data?.filter((i) => i.video_id === video_id)[0];
    console.log('Filtered item:', item);

    return {
      title: `${item ? item.title : 'Video not found'} - zTube`,
      description: `${item ? item.description : 'Video description not available'}`
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'Error fetching video - zTube',
      description: 'An error occurred while fetching video data'
    };
  }
}

export default function PAGE() {
  return (
    <Suspense>
      <MainVideoPage />
    </Suspense>
  );
}
