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
  
  const video_id = searchParams.id;
  const apiUrl = `${domain}/api/video`;

  try {
    const response = await fetch(`${apiUrl}?video_id=${video_id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

     const video_data = await response.json();
     const item = video_data.data[0];

    return {
      title: `${item ? item.title : 'Video not found'}`,
      description: `${item ? item.description : 'Video description not available'}`
    };
  } catch (error) {

    console.error('Error in generateMetadata:', error);
    return {
      title: 'Server Error',
      description: 'This Error Occurs when internet connection is slow or a server error'
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
