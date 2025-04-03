"use client"
import supabase from "@/supabase/server"

async function getBlob(VideoData) {
  const meta = VideoData.meta;

  const [thumb_url, video_url] = await Promise.all([
    supabase.storage.from("Uploads").download(`${VideoData.video_id}/${meta.thumbnail.name}`).then(({ data, error }) => {
      if (error) return null;
      return URL.createObjectURL(data);
    }),
    
    supabase.storage.from("Uploads").download(`${VideoData.video_id}/${meta.video.name}`).then(({ data, error }) => {
      if (error) return null;
      return URL.createObjectURL(data);
    }),
    
  ]);
  
  return {
    thumb_url,
    video_url,
  }
}

export default getBlob;