import SUPABASE_SERVER from "@/supabase/server"
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

async function insert_new_record(db, post_id, account_id, {liked, disliked}) {
    let is_like;

    if (liked === true && disliked === false) {
        is_like = true;
    } else if (liked === false && disliked === true) {
        is_like = false;
    }

    await db.insert({
        is_like: is_like,
        account_id,
        post_id,
    });
}

export async function POST(request) {
    try {
        const { post_id, liked, disliked } = await request.json(); 
        const account_id = (await cookies()).get("user");

        if (!account_id) throw "account needed";
        if (!post_id) throw "no post id provided";

        const supabase = SUPABASE_SERVER();
        const PostLikesDB = supabase.from("PostsLikes");

        const { data: record_exisit, error: record_notfound } = await PostLikesDB.select("*")
        .eq("post_id", post_id)
        .eq("account_id", account_id.value)
        .single();

        if (record_notfound) {
            insert_new_record(PostLikesDB, post_id, account_id.value, {liked, disliked});
        } else if (record_exisit) {
            if (liked === disliked) {
                const {error} = await PostLikesDB.delete()
                .eq("post_id", post_id)
                .eq("account_id", account_id.value);

                if (error) throw error.message;
            } else if (liked === true && disliked === false) {
                await PostLikesDB.update({
                    is_like: true,
                })
                .eq("post_id", post_id)
                .eq("account_id", account_id.value);
            } else if (liked === false && disliked === true) {
                await PostLikesDB.update({
                    is_like: false,
                })
                .eq("post_id", post_id)
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