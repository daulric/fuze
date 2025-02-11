import supabase_client from "@/supabase/server";

export default async function directUpload(post_id, files) {
  try {
    
    if (!post_id) throw "No Post Id Provided For Direct Upload";
    
    const supa_client = supabase_client();
    const Uploads_Storage = supa_client.storage.from("PostImages");
    
    if (post_id) {
      
      for (const [index, file] of files) {
        
        const last_index =  file.name.lastIndexOf(".");
        const file_extension = last_index !== -1 ? file.name.slice(last_index + 1) : '';
        
        const { error } = await Uploads_Storage.upload(
          `${post_id}/${index+1}.${file_extension}`,
          file
        );
        
        if (error) { throw "Error Uploading Image" };
      }
    }
    
  } catch(e) {
    return {
      success: false,
      message: e,
    }
  }
}