import supabase_client from "@/supabase/server";

export default async function directUpload(video_id, video_file, video_thumbnail) {
    try {
        if (!video_id) throw "No Video Id Provided For Direct Upload";
        if (!video_file) throw "No Video File Provided";
        if (!video_thumbnail) throw "No Thumbnail Provided"

        const supa_client = supabase_client();
        const Uploads_Storage = supa_client.storage.from("Uploads");

        if (video_id) {
            const video_last_index =  video_file.name.lastIndexOf(".");
            const video_file_extension = video_last_index !== -1 ? video_file.name.slice(video_last_index + 1) : '';

            const img_last_index =  video_thumbnail.name.lastIndexOf(".");
            const img_file_extension = img_last_index !== -1 ? video_thumbnail.name.slice(img_last_index + 1) : '';

            const [{error: videoUploadError}, { error: ImageUploadError }] = await Promise.all([
                Uploads_Storage.upload(
                    `${video_id}/video.${video_file_extension}`, 
                    video_file
                ),

                Uploads_Storage.upload(
                    `${video_id}/thumbnail.${img_file_extension}`,
                    video_thumbnail
                ),
            ]);

            if (videoUploadError) { throw "Error Uploading Video" };
            if (ImageUploadError) { throw "Error Uploading Thumbnail" };

            console.log("Video Uploaded Successfully");

            return {
                success: true,
                message: "Video Uploaded Successfully",
                video_id: video_id,
            };
        } else {
            throw "Error Uploading Video";
        }

    } catch(e) {
        return {
            success: false,
            message: e,
        }
    }
}