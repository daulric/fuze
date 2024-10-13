import { NextResponse } from "next/server";
import Supabase from "@/supabase/server";
import { unstable_noStore } from "next/cache";

export async function GET(request) {
    try {
        unstable_noStore();
        const username = request.nextUrl?.searchParams.get("username");
        if (!username) throw "No Username Provided";
        
        const supa_client = Supabase();
        const account_db = supa_client.from("Account");

        const { data: user_data, error: UserProfileFetchError } = await account_db.select(
            `
            username, 
            time_created, 
            Video (video_id, title, views),
            Blogs (blog_id)
            `
        ).eq("username", username);

        if (UserProfileFetchError) throw `Server Error: ${UserProfileFetchError.message}`;
        if (user_data.length === 0) throw "User Doesn't Exist";

        const user_profile = user_data[0];

        return NextResponse.json({
            success: true,
            profile: user_profile,
        })

    } catch (e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }
}