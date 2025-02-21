import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";

export async function POST(request) {
    try {

        const { limit, length = 30 } = await request.json();
        if (!limit) throw "No Limit Provided";

        const supabase = SupabaseServer();
        const PostsDB = supabase.from("Posts");
        const PostsStorage = supabase.storage.from("PostsImages");

        const { data, error } = await PostsDB.select("*, Account(username, is_verified)")
        .then(({data, error}) => {
            if (error) return { data: null, error };
            return data.filter(i => i.is_private !== true);
        }).then((data) => {
            const shuffled = [...data];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i+1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            return { data: shuffled.slice(0, limit) };
        });

        if (error) throw `API Error: ${error.details}`;

        const handler_data = await Promise.all(data.map(async (postData) => {
            const { data: files, error } = await PostsStorage.list(postData.post_id);

            if (error) {
                console.error("Error fetching files:", error);
                return null;
            }

            const images = await Promise.all(files.map(async (file) => {
                const { data: signedUrlData, error: signedUrlError } = await PostsStorage.createSignedUrl(`${postData.post_id}/${file.name}`, length);

                if (signedUrlError) {
                    console.error(`Error getting signed URL for ${file.name}:`, signedUrlError);
                    return null;
                }

                return signedUrlData.signedUrl;
            }));

            delete postData.account_id;

            return {
                ...postData,
                images,
            }

        }));

        return NextResponse.json({
            success: true,
            data: handler_data.filter(Boolean),
        });
        

    } catch(e) {
        return NextResponse.json({
            success: false,
            message: e,
        });
    }
}