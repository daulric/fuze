import SUPABASE_SERVER from "@/supabase/server"
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const post_id = request.nextUrl?.searchParams.get("post_id");
        const account_id = (await cookies()).get("user");

        if (!post_id) throw "No Post ID Provided";

        const supabase = SUPABASE_SERVER();
        const PostsLikesDB = supabase.from("PostsLikes");

        const {data, error} = await PostsLikesDB.select("*")
            .eq("post_id", post_id);

            if (error) throw error;

            let user_data;

            if (account_id) {
                user_data = data.filter(i => i.account_id === account_id.value)[0];
            }

            const all_data = data.map(({account_id, ...rest}) => {
                if (account_id) return rest;
            });

            return NextResponse.json({
                success: true,
                user_data,
                all_data,
            });

    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e
        })
    }
}

async function insert_new_record(db, post_id, account_id, {liked}) {
    await db.insert({
        is_like: liked,
        account_id,
        post_id,
    });
}


export async function POST(request) {
    try {
        const { post_id, liked } = await request.json(); 
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
            insert_new_record(PostLikesDB, post_id, account_id.value, {liked});
        } else if (record_exisit) {
            await PostLikesDB.update({
                is_like: liked,
            })
            .eq("post_id", post_id)
            .eq("account_id", account_id.value);
        }

        return NextResponse.json({
            success: true,
        });

    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        });
    };
}