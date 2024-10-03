import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";

export async function GET() {
    return new NextResponse("ok");
}

export async function POST(request) { 
    try {
        const video_upload_data = await request.formData();
        const supa_client = SupabaseServer();

        const video_file = video_upload_data.get("video_file");
        const video_thumbnail = video_upload_data.get("video_thumbnail");
        const video_data = JSON.parse(video_upload_data.get("data"));

        if ( !video_data.account_id ) { throw "Account Needed!"; }
        if ( !video_data.title, !video_data.description ) { throw "Missing Fields Required"; }

        const video_db = supa_client.from("Video");
        const video_storage = supa_client.storage.from("Videos");
        const video_thumbnail_storage = supa_client.storage.from("Video_Images");

        const { data: final_video_data, error: data_error } = await video_db.insert({
            title: video_data.title,
            description: video_data.description,
            account_id: video_data.account_id,
        }).select().single();

        if (data_error) { throw "Server Error" }

        if (final_video_data.video_id) {
            const last_index =  video_file.name.lastIndexOf(".");
            const file_extension = last_index !== -1 ? video_file.name.slice(last_index + 1) : '';

            const { error: videoUploadError } = await video_storage.upload(
                `${final_video_data.video_id}.${file_extension}`, 
                video_file
            );

            if (videoUploadError) { throw "Error Uploading Video" };

            if (video_thumbnail) {
                const last_index =  video_thumbnail.name.lastIndexOf(".");
                const file_extension = last_index !== -1 ? video_thumbnail.name.slice(last_index + 1) : '';

                const { error: ImageUploadError } = await video_thumbnail_storage.upload(
                    `${final_video_data.video_id}.${file_extension}`,
                    video_thumbnail
                )

                if (ImageUploadError) {throw "Error Uploading Thumbnail"};
            }

            return NextResponse.json({
                success: true,
                message: "Video Uploaded Successfully",
                video_id: final_video_data.video_id,
            })

        } else {
            throw "Error Uploading Video";
        }

    } catch (e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }
}