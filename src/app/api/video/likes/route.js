import { NextResponse } from "next/server";
import Supabase from "@/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export function GET() {
    return new NextResponse("ok");
}

export async function POST(request) {
    noStore();
    const searchParams = request.nextUrl.searchParams;

    try {
        const supa_client = Supabase();
        const { account_id } = await request.json();
        
        const requestToLike = searchParams.get("liked");
        const requestToDislike = searchParams.get("disliked");
        const video_id = searchParams.get("id");

        if (!requestToLike && !requestToDislike) throw "Must Have One Parameter";
        if (requestToLike && requestToDislike) throw "Cant Have Both Parameters";
        if (!video_id) throw "Must Have Video";

        const video_likes_db = supa_client.from("Video Likes");
        const video_db = supa_client.from("Video");

        if (!account_id) throw "Account Must be provided";

        const {data: likeData, error: LikeFetchError} = await video_likes_db.select().eq("video_id", video_id).eq("account_id", account_id);
        if (LikeFetchError) throw "Server Error";

        // Updating the Video Total Likes and Dislikes;
        const { data: updateLikedData, error: TotalLikedFetch } = await video_db.select("likes, dislikes").eq("video_id", video_id).single();
        if (TotalLikedFetch) throw "Server Error";

        // For First Time Users Only
        if (likeData.length === 0) {
            await video_likes_db.insert({
                account_id: account_id,
                video_id: video_id,
                liked: requestToLike ? true : false,
                disliked: requestToDislike ? true : false,
            }).eq("account_id", account_id).eq("video_id", video_id);

            await video_db.update({
                likes: requestToLike ? (updateLikedData.likes <= 0 ? 1 : updateLikedData.likes + 1 ) : requestToDislike ? (updateLikedData.likes <= 0 ? 0 : updateLikedData.likes - 1 ) : updateLikedData.likes,
                dislikes: requestToDislike ? (updateLikedData.dislikes <= 0 ? 1 : updateLikedData.dislikes + 1 ) : requestToLike ? (updateLikedData.dislikes <= 0 ? 0 : updateLikedData.dislikes - 1 ) : updateLikedData.dislikes,
            }).eq("video_id", video_id);

        } else {
            // Update if user exsists!
            await video_likes_db.update({
                liked: requestToLike ? true : false,
                disliked: requestToDislike ? true : false,
            }).eq("video_id", video_id).eq("account_id", account_id);

            await video_db.update({
                likes: requestToLike ? (updateLikedData.likes <= 0 ? 1 : updateLikedData.likes + 1 ) : requestToDislike ? (updateLikedData.likes <= 0 ? 0 : updateLikedData.likes - 1 ) : updateLikedData.likes,
                dislikes: requestToDislike ? (updateLikedData.dislikes <= 0 ? 1 : updateLikedData.dislikes + 1 ) : requestToLike ? (updateLikedData.dislikes <= 0 ? 0 : updateLikedData.dislikes - 1 ) : updateLikedData.dislikes,
            }).eq("video_id", video_id);
        }

        
        
        

        console.log(data);

        return NextResponse.json({
            success: true,
            message: 'Success Liked/Disliked'
        })

    }  catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }

}