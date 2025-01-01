import SupabaseServer from "@/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {

    try {

        const { limit } = await request.json();

        if (!limit) throw "Limit Not Provided!";

        const supabase = SupabaseServer();
        const VideoDB = supabase.from("Video");
        const VideoStorage = supabase.storage.from("Uploads");

        const {data, error} = await VideoDB.select("*, Account(username, is_verified)")
        .then(({data, error}) => {
            if (error) return { data: null, error };

            return data.filter(i => i.is_private !== true);
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
            const { data, error } = await VideoStorage.list(videoData.video_id, { limit: 1000 });
        
            if (error) {
                console.error("Error fetching files:", error);
                return {
                    ...videoData,
                    video: null,
                    thumbnail: "/logo.svg", // Default fallback in case of an error
                };
            }
        
            // Assuming you're getting file names or paths for video and thumbnail
            const videoFile = data.find(file => file.name.includes("video")); // Adjust this according to your file structure
            const thumbnailFile = data.find(file => file.name.includes("thumbnail")); // Adjust this as well
            
            // Getting Signed Url for these data;
            const [signed_video, signed_thumbnail] = await Promise.all([
                VideoStorage.createSignedUrl(`${videoData.video_id}/${videoFile.name}`, 30),
                VideoStorage.createSignedUrl(`${videoData.video_id}/${thumbnailFile.name}`, 30),
            ]);

            const videoUrl = videoFile ? signed_video.data.signedUrl : null;
            const thumbnailUrl = thumbnailFile ? signed_thumbnail.data.signedUrl : "/logo.svg";
        
            return {
                ...videoData,
                video: videoUrl,
                thumbnail: thumbnailUrl,
            };
        }));

        return NextResponse.json({
            success: true,
            data: handler_data,
        });


    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }

}