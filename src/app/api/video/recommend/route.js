import supabase from "@/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {

  try {
    const { limit, length = 30, allow_age_18 = false } = await request.json();
    if (!limit) throw "Limit Not Provided!";

    const VideoDB = supabase.from("Video");
    const VideoStorage = supabase.storage.from("Uploads");
    
    const {data, error} = await VideoDB.select("*, Account(username, is_verified)")
    .then(({data, error}) => {
        if (error) return { data: null, error };
        return data.filter(i => (i.is_private !== true && i.age_18 === allow_age_18 ));
    }).then((data) => {
        const shuffled = [...data];

        for (let i =  shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return { data: shuffled.slice(0, limit)};
    });

    if (error) throw `API Error: ${error.details}`;
    
    const handler_data = await Promise.all(data.map(async (videoData) => {

      // List files asynchronously
      const { data, error } = await VideoStorage.list(videoData.video_id);
    
      if (error) {
        return null;
      }

      // Assuming you're getting file names or paths for video and thumbnail
      const videoFile = data.find(file => file.name.includes("video")); // Adjust this according to your file structure
      
      if (videoFile) {
        const thumbnailFile = data.find(file => file.name.includes("thumbnail")); // Adjust this as well
        
        // Getting Signed Url for these data;
        const [signed_video, signed_thumbnail] = await Promise.all([
          videoFile && VideoStorage.createSignedUrl(`${videoData.video_id}/${videoFile.name}`, length),
          thumbnailFile && VideoStorage.createSignedUrl(`${videoData.video_id}/${thumbnailFile.name}`, length),
        ]);
  
        const videoUrl = videoFile ? signed_video.data.signedUrl : null;
        const thumbnailUrl = thumbnailFile ? signed_thumbnail.data.signedUrl : "/logo.svg";
        
        delete videoData.account_id;

        return {
          ...videoData,
          video: videoUrl,
          thumbnail: thumbnailUrl,
        };
      };
      
    }));
    
    return NextResponse.json({
      success: true,
      data: handler_data.filter(Boolean),
    });

  } catch(e) {
    return NextResponse.json({
      success: false,
      message: e,
    })
  }
  
}