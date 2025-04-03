import { NextResponse } from "next/server";
import supa_client from "@/supabase/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const user_token = cookieStore.get("user");

    if (!user_token) throw "No User Exists";
    
    const { username, aboutme } = await request.json();

    const AccountDB = supa_client.from("Account");
    
    const { data: existingData } = await AccountDB.select('*');
    
    if (!existingData) throw "No info on giving acount";

    if (username) {
      const existingUser = existingData.filter(i => i.username === username);
      const currentUser = existingData.filter(i => i.account_id === user_token.value);
    
      // Check username availability
      if (existingUser && existingUser.length > 0 ) {
        if (existingUser[0].username !== currentUser[0].username) throw "Username Already Exists"
      };
    }

    const updated_data = {
      ...(username && { username }),
      ...(aboutme && { aboutme }),
    }
    
    const { error: checkError } = await AccountDB.update(updated_data)
      .eq("account_id", user_token.value);

    if (checkError) throw "Server Error";
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