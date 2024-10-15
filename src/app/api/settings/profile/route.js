import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";

export async function GET() {
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
                `${account_id}/profile_pic.${file_extension}`
            );

            if (ProfilePicError) { throw "Updating Profile Picture Error" };
        }

        const { data: ProfileDataStorage} = await Profile_Storage.list(`${account_id}`);
        const ProfilePicFile = ProfileDataStorage.find(file => file.name.startsWith("profile_pic"));
        const ProfilePicPath = `${account_id}${ProfilePicFile.name}`;

        AccountDB.update({
            aboutme: account_data.aboutme,
            avatar_url: Profile_Storage.getPublicUrl(ProfilePicPath).data.publicUrl,
            social_links: account_data.socialLinks,
        }).eq("account_id", account_data.account_id);

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