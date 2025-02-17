import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";
import crypto from "crypto"

export function GET() {
  return new NextResponse("ok");
}

export async function POST(request) {

  try {
    const updated_profile_data = await request.formData();
    const supa_client = SupabaseServer();

    const { account_id, ...account_data} = JSON.parse(updated_profile_data.get("account_data"));
    const profile_picture = updated_profile_data.get("profile_picture");

    if (!account_id) { throw "Account ID Needed" };
    const AccountDB = supa_client.from("Account");
    const Profile_Storage = supa_client.storage.from("Profiles");

    if (profile_picture) {
      const last_index =  profile_picture.name.lastIndexOf(".");
      const file_extension = last_index !== -1 ? profile_picture.name.slice(last_index + 1) : '';

      const { error: ProfilePicError } = await Profile_Storage.upload(
        `${account_id}/profile_pic-${crypto.randomBytes(10).toString('hex').slice(0, 10)}.${file_extension}`,
        profile_picture, {
          upsert: true
        }
      );

      if (ProfilePicError) { throw "Updating Profile Picture Error" };
    }

    await AccountDB.update({
      aboutme: account_data.aboutme,
      social_links: account_data.social_links,
    }).eq("account_id", account_id);

    return NextResponse.json({
        success: true,
        message: "Profile Updated",
    })

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err
    })
  }
}