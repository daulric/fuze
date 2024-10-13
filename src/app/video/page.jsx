import { Suspense } from 'react';
import MainVideoPage from './Main';
import { headers } from 'next/headers';



export default function PAGE() {
  return (
    <Suspense>
      <MainVideoPage />
    </Suspense>
  );
}
