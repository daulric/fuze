import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";

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
    try {
        const videos_db = supa_client.from("Video");
        const video_storage = supa_client.storage.from("Videos");
        const thumbnail_storage = supa_client.storage.from("Video_Images");

        const [videoData, videoFiles, thumbnailFiles] = await Promise.all([
            videos_db.select("*, Account (username)"),
            video_storage.list(),
            thumbnail_storage.list()
        ]);

        if (videoData.error || videoFiles.error || thumbnailFiles.error) {
            throw new Error("Failed to fetch data from Supabase");
        }

        const processedData = videoData.data.map((videoData) => {
            const video_file = videoFiles.data.find((item) => item?.name?.split(".")[0] === videoData.video_id);
            const videoUrl = video_file ? video_storage.getPublicUrl(video_file.name).data.publicUrl : null;
            
            const video_thumbnail = thumbnailFiles.data.find((item) => item?.name?.split('.')[0] === videoData.video_id);
            const thumbnailUrl = video_thumbnail ? thumbnail_storage.getPublicUrl(video_thumbnail.name).data.publicUrl : "/logo.svg";

            return {
                ...videoData,
                video: videoUrl,
                thumbnail: thumbnailUrl,

            };
        });

        return processedData;
    } catch (error) {
        console.error('Error processing video data:', error);
        return []
    }
}

async function GetSearchData(supa_client, search_query) {
    const Data = await GetFullData(supa_client);

    if (Data.length === 0) return NextResponse.json({ success: true, data: []});

    const searched_data = Data.filter(item => {
        const search_query_lower = search_query.toLowerCase();
        return (
            (
                item.Account.username.toLowerCase().includes(search_query_lower) ||
                item.title.toLowerCase().includes(search_query_lower) ||
                item.description.toLowerCase().includes(search_query_lower)
            ) &&
            item.is_private === false
        )
    })

    return NextResponse.json({
        success: true,
        data: searched_data,
    });

}

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;

    const queries = {
        ...Object.fromEntries(searchParams.entries()),
    }

    try {
        const supa_client = SupabaseServer();

        if (Object.keys(queries).length !== 0) {

            if (queries.search) {
                return GetSearchData(supa_client, queries.search);
            }

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