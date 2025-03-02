import { NextResponse } from "next/server";
import Supabase from "@/supabase/server";

export function GET() {
    return new NextResponse("ok");
}

export async function POST(request) {
    try {
        const { post_id } = await request.json();

        if (!post_id) throw "no id";

        const supa_client = Supabase();
        const PostsDB = supa_client.from("Posts");

        const { data: views_data, error: ViewError } = await PostsDB.select("views")
        .eq("post_id", post_id)
        .single();

        if (ViewError) throw "Server Error";

        const { error: UpdateError } = await PostsDB.update({
            views: (views_data.views + 1)
        }).eq("post_id", post_id);

        if (UpdateError) throw "Serer Error";

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