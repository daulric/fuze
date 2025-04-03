import { NextResponse } from "next/server";
import supa_client from "@/supabase/server";

export function GET() {
    return new NextResponse("ok");
}

export async function POST(request) {

    const searchParams = request.nextUrl.searchParams

    try {

        const video_db = supa_client.from("Video");
        const video_id = searchParams.get("id");

        const {data: views_data, error: ViewError} = await video_db.select("views").eq("video_id", video_id).single();
        if (ViewError) throw "Server Error";

        const { error: UpdateError} = await video_db.update({views: (views_data.views + 1)}).eq("video_id", video_id);
        if (UpdateError) throw "Server Error";

        return NextResponse.json({
            success: true,
            message: "Success Updated View Count"
        })

    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }
}