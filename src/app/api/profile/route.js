import { NextResponse } from "next/server";
import Supabase from "@/supabase/server";

async function GetUserProfiles() {
    const supa_client = Supabase();
    const accounts_db = supa_client.from("Account");
    const ProfileStorage = supa_client.storage.from("Profiles");

    const {data, error} = await accounts_db.select(`
        account_id,
        username,
        is_verified,
        social_links,
        time_created,
        aboutme
    `);

    if (error) {
      return `Error Fetching Profiles : ${error}`
    }

    const all_users = await Promise.all(
        data.map(async (user) => {
            const { data: ProfilePic } = await ProfileStorage.list(`${user.account_id}`);
            const findPic = ProfilePic?.find(item => item?.name?.split(".")[0] === "profile_pic");
            user.avatar_url = findPic
                ? ProfileStorage.getPublicUrl(`${user.account_id}/${findPic.name}`).data.publicUrl
                : null;
            
            delete user.account_id;
            return user;
        })
    );

    return all_users;
}

export async function GET(request) {
    try {
        const username = request.nextUrl?.searchParams.get("username");
        const account_id = request.nextUrl?.searchParams.get("account_id");
        const allowId = request.nextUrl?.searchParams.get("allowId");
        const all_users = request.nextUrl?.searchParams.get("all");

        if (all_users) {
            const get_all_users = await GetUserProfiles();

            return NextResponse.json({
                success: true,
                profiles: get_all_users,
            });
        };

        if (!username && !account_id) { throw "No Valid Params" };
       
        const supa_client = Supabase();
        const account_db = supa_client.from("Account");
        const ProfileDB = supa_client.storage.from("Profiles");

        let query = account_db.select(`
            account_id,
            username,
            is_verified,
            social_links,
            time_created,
            aboutme,
            Video (video_id, title, views),
            Posts (post_id)
        `);

        if (account_id) {
            query = query.eq('account_id', account_id);
        }
        
        if (username) {
            query = query.eq('username', username);
        }

        const { data: user_data, error: UserProfileFetchError } = await query;

        if (UserProfileFetchError) throw `Server Error: ${UserProfileFetchError.message}`;
        
        if (user_data.length === 0) throw "User Doesn't Exist";
        
        const user = user_data[0];
        
        const { data: ProfilePic} = await ProfileDB.list(`${user.account_id}`);
        const findPic = ProfilePic.find(item => item?.name?.split(".")[0] === "profile_pic");
        user.avatar_url = findPic ? ProfileDB.getPublicUrl(`${user.account_id}/${findPic.name}`).data.publicUrl : null;
        
        const user_profile = { ...user };
        
        if ((!allowId && !account_id) || !account_id || !allowId) {
            delete user_profile.account_id;
        }

        return NextResponse.json({
            success: true,
            profile: user_profile,
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: e,
        })
    }
}