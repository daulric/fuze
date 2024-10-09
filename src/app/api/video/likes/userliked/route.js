import { NextResponse } from "next/server";
import Supabase from "@/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request) {
    noStore();

    try {
        const searchParams = request.nextUrl.searchParams;
        const account_id = searchParams.get("account_id");
        const video_id = searchParams.get("video_id");
        
        if (!account_id || !video_id) throw "Provide Correct Details";

        const supa_client = Supabase();
        const video_likes_db = supa_client.from("Video Likes");

        const { data: liked_data, error: LikedError } = await video_likes_db.select("liked").eq("account_id", account_id).eq("video_id", video_id);
        
        if (LikedError) throw "Liked Record Error"

        return NextResponse.json({
            success: true,
            liked: liked_data[0].liked,
        })

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err
        })
    }
}