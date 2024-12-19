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
        if ( !video_file || !video_thumbnail ) { throw "Missing Files"};
        if ( !video_data.title, !video_data.description || video_data.title === "" || video_data.description === "" ) { throw "Missing Fields Required"; }

        const video_db = supa_client.from("Video");
        const Uploads_Storage = supa_client.storage.from("Uploads");
        //const video_storage = supa_client.storage.from("Videos");
        //const video_thumbnail_storage = supa_client.storage.from("Video_Images");

        const { data: final_video_data, error: data_error } = await video_db.insert({
            title: video_data.title,
            description: video_data.description,
            account_id: video_data.account_id,
            is_private: video_data.is_private,
            age_18: video_data.age_18,
        }).select().single();

        if (data_error) { throw "Server Error" }
        console.log("Video Info Uploaded!")

        if (final_video_data.video_id) {
            const video_last_index =  video_file.name.lastIndexOf(".");
            const video_file_extension = video_last_index !== -1 ? video_file.name.slice(video_last_index + 1) : '';

            const img_last_index =  video_thumbnail.name.lastIndexOf(".");
            const img_file_extension = img_last_index !== -1 ? video_thumbnail.name.slice(img_last_index + 1) : '';

            const [{error: videoUploadError}, { error: ImageUploadError }] = await Promise.all([
                Uploads_Storage.upload(
                    `${final_video_data.video_id}/video.${video_file_extension}`, 
                    video_file
                ),

                Uploads_Storage.upload(
                    `${final_video_data.video_id}/thumbnail.${img_file_extension}`,
                    video_thumbnail
                ),
            ]);

            if (videoUploadError) { throw "Error Uploading Video" };
            if (ImageUploadError) { throw "Error Uploading Thumbnail" };

            console.log("Video Uploaded Successfully");

            return NextResponse.json({
                success: true,
                message: "Video Uploaded Successfully",
                video_id: final_video_data.video_id,
            });
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