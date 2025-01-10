import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";

export function GET() {
    return new NextResponse("ok");
}

export async function POST(request) { 
    try {
        const video_upload_data = await request.formData();
        const supa_client = SupabaseServer();

        const video_data = JSON.parse(video_upload_data.get("data"));

        if ( !video_data.account_id ) { throw "Account Needed!"; }
        if ( !video_data.title, !video_data.description || video_data.title === "" || video_data.description === "" ) { throw "Missing Fields Required"; }

        const video_db = supa_client.from("Video");

        const { data: final_video_data, error: data_error } = await video_db.insert({
            title: video_data.title,
            description: video_data.description,
            account_id: video_data.account_id,
            is_private: video_data.is_private,
            age_18: video_data.age_18,
        }).select().single();

        if (data_error) { throw `Server Error : ${data_error}` }

        return NextResponse.json({
            success: true,
            message: "Video Uploaded Successfully",
            video_id: final_video_data.video_id,
        });

    } catch (e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }
}