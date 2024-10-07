import { NextResponse } from "next/server";

import SupabaseServer from "@/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {

    try {
        noStore();
        const Public_Data = [];
        const supa_client = SupabaseServer();
        const videos_db = supa_client.from("Video");
        const video_storage = supa_client.storage.from("Videos")
        const thumbnail_storage = supa_client.storage.from("Video_Images");

        const {data: video_data, error: VideoCollectionError} = await videos_db.select("*, Account (username)")
        if (VideoCollectionError) throw "Server Error";

        const {data: videoFiles, error: VideoFetchError} = await video_storage.list();
        if (VideoFetchError) throw "Server Error";

        const {data: thumbnail_data, error: ThumbnailFetchError} = await thumbnail_storage.list();
        if (ThumbnailFetchError) throw "Server Error";

        video_data.map(videoData => {
            const video_file = videoFiles.filter((item) => item.name.split('.')[0] === videoData.video_id);
            const video_thumbnail = thumbnail_data.filter((item) => item.name.split('.')[0] === videoData.video_id);

            const temp_data = {
                ...videoData,
                video: video_storage.getPublicUrl(video_file[0].name).data.publicUrl,
                thumbnail: video_thumbnail.length !== 0 ? thumbnail_storage.getPublicUrl(video_thumbnail[0].name).data.publicUrl : "/logo.svg",
            };

            Public_Data.push(temp_data);
        })

        return NextResponse.json(Public_Data);
    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }

}