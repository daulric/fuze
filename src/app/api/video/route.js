import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server"
import { unstable_noStore as noStore } from "next/cache";

async function DatabaseQuery(supa_client, {video_id, ...query}) {
    const videos_db = supa_client.from("Video");
    const video_storage = supa_client.storage.from("Videos")
    const thumbnail_storage = supa_client.storage.from("Video_Images");

    if (query || video_id) {
        const {data: video_data, error: VideoCollectionError} = await videos_db.select("*,  Account (username)").eq("video_id", video_id).single();
        if (VideoCollectionError) throw "Server Error";

        const {data: videoFiles, error: VideoFetchError} = await video_storage.list();
        if (VideoFetchError) throw "Server Error";

        const {data: thumbnail_data, error: ThumbnailFetchError} = await thumbnail_storage.list();
        if (ThumbnailFetchError) throw "Server Error";

        const video_file = videoFiles.filter(videoFile => videoFile.name.split('.')[0] === video_id)[0];
        const thumb_file = thumbnail_data.filter(thumb_file => thumb_file.name.split('.')[0] === video_id)[0];

        const thumb_url = thumbnail_storage.getPublicUrl(thumb_file?.name).data.publicUrl;
        const video_url = video_storage.getPublicUrl(video_file.name).data.publicUrl;

        const temp_data = {
            ...video_data,
            video: video_url,
            thumbnail: thumb_file ? thumb_url : "/logo.svg",
        }

        return NextResponse.json({
            success: true,
            data: [temp_data],
        })
    }

}

async function GetFullData(supa_client) {
    const Public_Data = [];
    const videos_db = supa_client.from("Video");
    const video_storage = supa_client.storage.from("Videos")
    const thumbnail_storage = supa_client.storage.from("Video_Images");

    const {data: video_data, error: VideoCollectionError} = await videos_db.select("*,  Account (username)");
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

    const Updated_Data = Public_Data.map(({account_id, ...rest}) => {
        if  (!account_id) {}; 
        return rest;
    });

    return NextResponse.json({
        success: true,
        data: Updated_Data,
    });
}

export async function GET(request) {
    noStore();

    const searchParams = request.nextUrl.searchParams;
    const video_id = searchParams.get("video_id");

    const queries = {
        ...Object.fromEntries(searchParams.entries()),
    } 

    try {
        const supa_client = SupabaseServer();

        if (video_id) {
            return DatabaseQuery(supa_client, queries);
        }

        return GetFullData(supa_client);
        
    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }

}