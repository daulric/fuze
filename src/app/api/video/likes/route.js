import SupabaseServer from "@/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//  Fetching Total Likes and if user like the video.
export async function GET(request) {
    try {
        const video_id = request.nextUrl?.searchParams.get("video_id");
        const account_id = (await cookies()).get("user");

        if (!account_id) throw "Account Needed";
        if (!video_id) throw "No Video ID Provided!";


        const supabase = SupabaseServer();
        const VideoLikesDB = supabase.from("VideoLikes");

        const {data, error} = await VideoLikesDB.select("*")
        .eq("video_id", video_id);

        if (error) throw error;

        const user_data = data.filter(i => i.account_id === account_id.value)[0];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const all_data = data.map(({account_id, ...rest}) => rest);

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

export async function POST(request) {
    try {
        const {video_id, liked, disliked} = await request.json();
        const account_id = (await cookies()).get("user");

        if (!account_id) throw "account needed";
        if (!video_id) throw "No Video ID Provided";

        const supabase = SupabaseServer();
        const VideoLikesDB = supabase.from("VideoLikes");

        if (liked === disliked) {
            const {error} = await VideoLikesDB.delete()
                .eq("video_id", video_id)
                .eq("account_id", account_id.value);

            if (error) throw error.message;
        }

        if (liked === true && disliked === false) {
            const {error} = await VideoLikesDB.update({
                is_like: true,
            })
            .eq("video_id", video_id)
            .eq("account_id", account_id.value);
        }

    
    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        });
    }

}