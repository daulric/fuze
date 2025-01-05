import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";

export async function POST(request) {
  try {
    
    const user_token = (await cookies()).get("user");
    if (!user_token) throw "Account is Needed";
    
    const { group as groupData } = await request.json();
    
    const supa_client = SupabaseServer();
    const data = await supa_client.from("Video").select("*").then((data, error) => {
      if (error) throw error;
      
      return data.map((video) => groupData.includes(video.video_id));
    });
    
    if (data.length === 0) throw "No Group Data to Display";
    
    return NextResponse.json({
      success: true,
      data,
    });
    
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: e,
    });
  }
}