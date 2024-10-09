import { Suspense } from 'react';
import MainVideoPage from './Main';
import { headers } from 'next/headers';

export async function generateMetadata({ searchParams }) {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const domain = `${protocol}://${host}`;

  const video_id = searchParams.id;

  const response = await fetch(`${domain}/api/video`);
  const video_data = await response.json();
  const item = video_data.data.filter((i) => i.video_id === video_id)[0];

  return {
    title: `${item ? item.title : 'Video'} - zTube`,
    description: `${item ? item.description : 'Video description'}`
  };
}

export default function PAGE() {
  return (
    <Suspense>
      <MainVideoPage />
    </Suspense>
  );
}