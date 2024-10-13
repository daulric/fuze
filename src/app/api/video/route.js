import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server"
import { unstable_noStore as noStore } from "next/cache";

async function DatabaseQuery(supa_client, query) {
    const Data = await GetFullData(supa_client);

    if (Data.length === 0) return NextResponse.json({ success: true, data: [] });

    const isMatch = (item, query) => {
        return Object.entries(query).every(([key, value]) => {

            if (item.Account && item.Account[key] === value) {
                return (value === "true" ? true : value === "false" ? false : value)
            }

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // If the value is an object, check if the corresponding item property matches
                return item.hasOwnProperty(key) && isMatch(
                    item[key], 
                    (value === "true" ? true : value === "false" ? false : value)
                );
            } else {
                // For non-object values, do a simple equality check
                return item.hasOwnProperty(key) && item[key] === (value === "true" ? true : value === "false" ? false : value);
            }
        });
    };

    const Filtered_Data = Data.filter((item) => {
        const result = isMatch(item, query);
        return result;
    });

    const Public_Data = Filtered_Data.map(({account_id, ...rest}) => {
        if (account_id) {} // Omit account_id for security purposes
        return rest;
    });

    return NextResponse.json({
        success: true,
        data: Public_Data,
    });
}

async function GetFullData(supa_client) {
    const Private_Data = [];
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

        Private_Data.push(temp_data);
    })

    return Private_Data;
}

export async function GET(request) {
    noStore();
    const searchParams = request.nextUrl.searchParams;

    const queries = {
        ...Object.fromEntries(searchParams.entries()),
    } 

    try {
        const supa_client = SupabaseServer();

        if (Object.keys(queries).length !== 0) {
            return DatabaseQuery(supa_client, queries);
        }

        return DatabaseQuery(supa_client, {});
    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }

}