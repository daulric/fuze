import {NextResponse} from 'next/server';
import SupabaseServer from '@/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
      
      const { filter } = await request.json();
      const AccountID = (await cookies()).get("user");
      
      if (!AccountID) throw "Account ID is Required";
      if (!filter) throw "Filter is Required!";
      
      const supa_client = SupabaseServer();
      const FileStorage = supa_client.storage.from("Uploads");
      
      const data = await supa_client.from("VideoLikes")
        .select(filter)
        .eq("account_id", AccountID.value)
        .eq("is_like", true)
        .order("id", {ascending: false})
        .then(({data, error}) => {
          if (error) throw error;
          return data.map(({account_id, ...rest}) => {
            if (account_id) return rest;
          });
      });
      
      const handler_data = await Promise.all(data.map(async (videoData) => {
        try {
          const { data, error } = await FileStorage.list(videoData.video_id);
          if (error) throw error;
      
          const thumbnailFile = data.find((file) => file.name.includes("thumbnail"));
      
          const [signed_thumbnail] = await Promise.all([
            thumbnailFile ? FileStorage.createSignedUrl(`${videoData.video_id}/${thumbnailFile.name}`, 30) : null,
          ]);
      
          return {
            ...videoData,
            thumbnail: signed_thumbnail?.data?.signedUrl || "/logo.svg",
          };
        } catch (err) {
          if (err) {
            return {
              ...videoData,
              video: null,
              thumbnail: "/logo.svg",
            };
          }
        }
      }));
      
      return NextResponse.json({
        success: true,
        data : handler_data,
      })
      
    } catch(e) {
      return NextResponse.json({
        success: false,
        message: e,
      })
    }
}