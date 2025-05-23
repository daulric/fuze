import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import supa_client from "@/supabase/server";

export async function POST(request) {
  try {
    
    const user_token = (await cookies()).get("user");
    if (!user_token) throw "Account is Needed";
    
    const { group, length = 30 } = await request.json();
    if (!group ||  group.length === 0) throw "Group Data is Needed";

    const VideoStorage = supa_client.storage.from("Uploads");
    
    const data = await supa_client.from("Video").select("*, Account(username)").then(({data, error}) => {
      if (error) throw error;
      const filteredData = data.map(({account_id, ...rest}) => {
        if (account_id) return rest;
      }).filter((video) =>  group.includes(video.video_id));

      return filteredData;
    });

    if (data.length === 0) throw "No Group Data to Display";
    
    const handler_data = await Promise.all(data.map(async (videoData) => {
      try {
        const { data, error } = await VideoStorage.list(videoData.video_id);
        if (error) throw error;
    
        const videoFile = data.find((file) => file.name.includes("video"));
        const thumbnailFile = data.find((file) => file.name.includes("thumbnail"));
    
        const [signed_video, signed_thumbnail] = await Promise.all([
          videoFile ? VideoStorage.createSignedUrl(`${videoData.video_id}/${videoFile.name}`, length) : null,
          thumbnailFile ? VideoStorage.createSignedUrl(`${videoData.video_id}/${thumbnailFile.name}`, length) : null,
        ]);
    
        return {
          ...videoData,
          video: signed_video?.data?.signedUrl || null,
          thumbnail: signed_thumbnail?.data?.signedUrl || "/logo.svg",
          meta: {
            video: videoFile,
            thumbnail: thumbnailFile,
          }
        };
      } catch (err) {
        if (err) {
          return {
            ...videoData,
            video: null,
            thumbnail: "/logo.svg",
          };
        }
      }
    }));
    
    return NextResponse.json({
      success: true,
      data: handler_data,
    });
    
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: e,
    });
  }
}