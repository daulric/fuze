import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";
import { decrypt } from "@/tools/encryption"

import { cookies } from "next/headers";

export async function GET() {
    return new NextResponse("ok");
}

export async function POST(request) {
    // Sign up
    try {
        const { loginType, username, email, password, dob } = await request.json();

        if (!loginType || !username || !email || !password || !dob) {
            throw "Missing Fields Required!";
        }

        const supabase_client = SupabaseServer();
        const accounts_db = supabase_client.from("Account")
        const cookieStore = cookies();

        if (loginType !== "signup") { throw "Invalid Login Type!"; }
        const { data: exsisting_accounts, error: checkError } = await accounts_db.select().or(`username.eq.${username},email.eq.${email}`);

        if (checkError) { throw "Server Error" }

        if (exsisting_accounts && exsisting_accounts.length > 0) {
            console.log("idk probally here!")
            const isDuplicateUsername = exsisting_accounts.some(account => account.username === username);
            const isDuplicateEmail = exsisting_accounts.some(account => account.email === email);

            let message;

            if (isDuplicateUsername && isDuplicateEmail) {
                message = "Username and Email already exsists";
            } else if (isDuplicateUsername) {
                message = "Username already exists";
            } else if (isDuplicateEmail) {
                message = "Email already exists";
            }

            throw message;
        }

        const { data: account_data, error: insertError } = await accounts_db.insert({
            username: username,
            email: email,
            password:  password,
            dob: dob,
        }).select().single();

        if (insertError) { throw "Server Error"; }
        cookieStore.set("user", account_data.account_id);

        return NextResponse.json({
            success: true,
            message: "Success",
            user_data: account_data,
        }, { status: 200})
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err,
        }, { status: 200 })
    }

}

export async function PUT(request) {
    // Login
    try {
        const { loginType, email, password } = await request.json();

        if (!loginType || !email || !password) {
            throw "Missing Fields Required!";
        }

        const supa_client = SupabaseServer();
        const accounts_db = supa_client.from("Account");
        const cookieStore = cookies();

        if (loginType !== "login") { throw "Invalid Login Type for Method!"; }
        const { data: exsisting_accounts, error: checkError } = await accounts_db.select().or(`email.eq.${email}`)

        if (checkError) {  throw "Server Error" }

        if (exsisting_accounts && exsisting_accounts.length === 0) {
            throw "Account Doesn't Exsist!";
        }

        const isValidAccount = exsisting_accounts.some(account => (
           account.email === email && decrypt(account.password, "passcode") === password
        ));

        if (isValidAccount !== true) {
            throw "Invalid Credentials!";
        }

        const account_data = exsisting_accounts[0];
        cookieStore.set("user", account_data.account_id);

        return NextResponse.json({
            success: true,
            message: "Logged In Successful",
            user_data: account_data,
        }, { status: 200})

    } catch (e) {
        return NextResponse.json({
            success: false,
            message: e,
        }, { status: 200 })
    }
}

export async function DELETE() {
    const cookieStore = cookies();

    const user_token = cookieStore.get("user");

    try {

        if (user_token === null || user_token.value === null || user_token.value === "") {
            throw "Already Logged Out";
        }

        cookieStore.delete("user");
        return NextResponse.json({
            success: true,
            message: "Logged Out"
        }, { status: 200 })

    } catch (e) {
        return NextResponse.json({
            success: false,
            message: e,
        }, { status: 200 })
    }

}