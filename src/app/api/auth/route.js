import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";
//import { encrypt, decrypt } from "@/tools/encryption"

import { cookies } from "next/headers";

export async function GET() {
    return new NextResponse("ok");
}

export async function POST(request) {
    // Sign up

    try {
        const { loginType, username, email, password } = await request.json();

        if (!loginType || !username || !email || !password) {
            throw new Error("Missing Fields Required!")
        }

        const supabase_client = SupabaseServer();
        const accounts_db = supabase_client.from("Account")
        const cookieStore = cookies();

        if (loginType !== "signup") { throw new Error("Invalid Login Type for Method!") }
        const { data: exsisting_accounts, error: checkError } = await accounts_db.select().or(`username.eq.${username},email.eq.${email}`);

        if (checkError) { throw checkError }

        if (exsisting_accounts && exsisting_accounts.length > 0) {
            const isDuplicateUsername = existing_accounts.some(account => account.username === username);
            const isDuplicateEmail = existing_accounts.some(account => account.email === email);

            let message = "";

            if (isDuplicateUsername && isDuplicateEmail) {
                message = "Username and Email already exsists!";
            } else if (isDuplicateUsername) {
                message = "Username already exists!";
            } else if (isDuplicateEmail) {
                message = "Email already exists!";
            }

            throw new Error(message);
        }

        const { data: account_data, error: insertError } = await accounts_db.insert({
            username: username,
            email: email,
            password: password,
        }).select().single();

        if (insertError) { throw insertError; }
        cookieStore.set("user", account_data.user_id);

        return NextResponse.json({
            success: true,
            message: "Success"
        }, { status: 200})
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err,
        }, { status: 400 })
    }

}

export async function PUT() {
    // Login
    try {

    } catch (e) {
        return NextResponse.json({
            sucess: false,
            message: e,
        }, { status: 400 })
    }
}

export async function DELETE() {
    // Logout
}