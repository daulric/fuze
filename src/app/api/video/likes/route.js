import supabase from "@/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//  Fetching Total Likes and if user like the video.
export async function GET(request) {
    try {
        const video_id = request.nextUrl?.searchParams.get("video_id");
        const account_id = (await cookies()).get("user");

        if (!video_id) throw "No Video ID Provided!";

        const VideoLikesDB = supabase.from("VideoLikes");

        const {data, error} = await VideoLikesDB.select("*")
        .eq("video_id", video_id);

        if (error) throw error;
        let user_data;

        if (account_id) {
            user_data = data.filter(i => i.account_id === account_id.value)[0];
        }

        const all_data = data.map(({account_id, ...rest}) => {
            if (account_id) return rest
        });

        return NextResponse.json({
            success: true,
            user_data,
            all_data,
        });

    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }

}

async function insert_new_record(db, video_id, account_id, {liked, disliked}) {
    let is_like;

    if (liked === true && disliked === false) {
        is_like = true;
    } else if (liked === false && disliked === true) {
        is_like = false;
    }

    await db.insert({
        is_like: is_like,
        account_id,
        video_id,
    });
}

export async function POST(request) {
    try {
        const {video_id, liked, disliked} = await request.json();
        const account_id = (await cookies()).get("user");

        if (!account_id) throw "account needed";
        if (!video_id) throw "No Video ID Provided";

        const VideoLikesDB = supabase.from("VideoLikes");

        const {data: record_exisit, error: record_notfound} = await VideoLikesDB.select("*")
            .eq("video_id", video_id)
            .eq("account_id", account_id.value)
            .single();

        if (record_notfound) {
            insert_new_record(VideoLikesDB, video_id, account_id.value, {liked, disliked});
        } else if (record_exisit) {
            if (liked === disliked) {
                const {error} = await VideoLikesDB.delete()
                    .eq("video_id", video_id)
                    .eq("account_id", account_id.value);
    
                if (error) throw error.message;
            } else if (liked === true && disliked === false) {
                await VideoLikesDB.update({
                    is_like: true,
                })
                .eq("video_id", video_id)
                .eq("account_id", account_id.value);
            } else if (liked === false && disliked === true) {
                await VideoLikesDB.update({
                    is_like: false,
                })
                .eq("video_id", video_id)
                .eq("account_id", account_id.value);
            }

        }

        return NextResponse.json({
            success: true,
        });
    
    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        });
    }

}