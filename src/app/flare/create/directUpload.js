import supabase_client from "@/supabase/server";

export default async function directUpload(post_id, files) {
  try {
    
    if (!post_id) throw "No Post Id Provided For Direct Upload";
    
    const supa_client = supabase_client();
    const Uploads_Storage = supa_client.storage.from("PostsImages");
    
    if (post_id) {
      
      const uploadPromises = files.map(async (file, index) => {
        const last_index = file.name.lastIndexOf(".");
        const file_extension = last_index !== -1 ? file.name.slice(last_index + 1) : "";
  
        const { error } = await Uploads_Storage.upload(
          `${post_id}/${index}.${file_extension}`,
          file
        );
  
        if (error) throw new Error(error.message || "Error Uploading Image");
    });
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      return {
        success: true,
      }
    }
    
  } catch(e) {
    return {
      success: false,
      message: e,
    }
  }
}