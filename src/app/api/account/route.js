import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const user_token = cookieStore.get("user");

    if (!user_token) throw "No User Exists";
    
    const { username, aboutme } = await request.json();

    const supa_client = SupabaseServer();
    const AccountDB = supa_client.from("Account");

    let query = ``;

    if (username) {
        if (query.length === 0) {
            query += `username.eq.${username}`;
        } else {
            query += `username.eq.${username},`;
        }
    }

    const check_exsisting = await AccountDB.select().or(query);

    if (check_exsisting && check_exsisting.length > 0) throw "Try a different Username";

    const {data: new_data, error: checkError} = await AccountDB.update({
      ...(username && { username }),
      ...(aboutme && { aboutme }),
    }).eq("account_id", user_token.value);

    if (checkError){console.log(checkError); throw "Server Error"};
    console.log(new_data);

    return NextResponse.json({
        success: true,
    });


  } catch(e) {
    return NextResponse.json({
        success: false,
        message: e,
    })
  }
}