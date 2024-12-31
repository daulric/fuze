import HomePage from "./home"
import getURL from "@/lib/geturl";

interface VideoItem {
  title: string;
  views: number;
  video_id: string | number;
  upload_at: string;
  Account: { username: string };
  thumbnail: string;
}

function timeAgo(dateStr: string): string {
  const diff =  Date.now() - new Date(dateStr).getTime(); // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

function format_views(views: number) {
  if (views >= 1e6) {
    return (views / 1e6).toFixed(1) + 'M'; // Format in millions
  } else if (views >= 1e3) {
    return (views / 1e3).toFixed(1) + 'K'; // Format in thousands
  } else {
    return views.toString(); // Return as is for lower values
  }
}

export default async function Home() {
  const data: unknown[] = [];

  const url = await getURL();

  const response = await fetch(`${url}/api/video/recommend`, {
    cache: "no-store",
    body: JSON.stringify({limit: 16}),
    method: "POST",
  });

  if (response.ok) {
    const res = await response.json();
    res.data.map((i: VideoItem) => {
      data.push({
        title: i.title,
        views: format_views(i.views),
        link: `/video?id=${i.video_id}`,
        uploadTime: timeAgo(i.upload_at),
        channel: i.Account.username,
        thumbnail: i.thumbnail,
      });
    });
  }

  for (let i = data.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [data[i], data[randomIndex]] = [data[randomIndex], data[i]];
  }

  return (
    <>
      <HomePage VideoData={data}/>
    </>
  );
}