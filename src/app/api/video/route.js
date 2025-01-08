import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";
import { cookies } from "next/headers";

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
        if (account_id) return rest;
    });

    return NextResponse.json({
        success: true,
        data: Public_Data,
    });
}

async function GetFullData(supa_client) {
    try {
        const videos_db = supa_client.from("Video");
        const Uploads_Storage = supa_client.storage.from("Uploads");

        const {data: Vid_Data} = await videos_db.select("*, Account(username, is_verified)");

        const handler_data = await Promise.all(Vid_Data.map(async (videoData) => {

            // List files asynchronously
            const { data, error } = await Uploads_Storage.list(videoData.video_id, { limit: 1000 });
        
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
                Uploads_Storage.createSignedUrl(`${videoData.video_id}/${videoFile.name}`, 30),
                Uploads_Storage.createSignedUrl(`${videoData.video_id}/${thumbnailFile.name}`, 30),
            ]);

            const videoUrl = videoFile ? signed_video.data.signedUrl : null;
            const thumbnailUrl = thumbnailFile ? signed_thumbnail.data.signedUrl : "/logo.svg";
        
            return {
                ...videoData,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                meta: {
                  video: videoFile,
                  thumbnail: thumbnailFile,
                }
            };
        }));

        return handler_data;
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

            if (queries.is_private) {
                const is_user = (await cookies()).get("user");
                if (is_user) {
                    return DatabaseQuery(supa_client, {...queries, account_id: is_user.value})
                } else throw "must be logged in to use this api query";
            }
            
            if (queries.all) {
                const is_user = (await cookies()).get("user");
                if (is_user) {
                    return DatabaseQuery(supa_client, {account_id: is_user.value});
                } else throw "must be logged in to use this api query";
            }

            return DatabaseQuery(supa_client, {...queries, is_private: false});

        }

        return DatabaseQuery(supa_client, {is_private: false});
    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }

}

export async function PUT(request) {
    try {
        
        const {video_id, ...data} = await request.json();

        if (!video_id) throw "Video ID Not Provided";
        console.log(video_id);

        const supa_client = SupabaseServer();
        const video_db = supa_client.from("Video");

        await video_db.update({
            title: data.title,
            description: data.description,
            is_private: data.is_private,
        }).eq("video_id", video_id);

        return NextResponse.json({
            success: true,
        });

    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e
        });
    }

}