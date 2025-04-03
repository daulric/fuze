import { NextResponse } from "next/server"
import supa_client from "@/supabase/server";
import { encrypt } from "@/tools/encryption"

export function GET() {
    return new NextResponse("ok");
}

// Make updates to the user account details.
export async function POST(request) {

    try {
        const { username, password, account_id} = await request.body();

        // All of this is to check for validation.
        if (!account_id) {
            throw "Must have Account ID";
        }

        if (!username || !password) {
            throw "Missing Required Fields";
        }

        const account_db = supa_client.from("Account");

        const { data: isValid, error: CheckError } = await account_db.select().eq("username", username);
        if (CheckError) throw "Error Checking For Existing Account";

        // Since this returns a array with accounts with the same username (should be 1 btw);
        // We check to see if the account array length is 0 so we can continue the process of changing the username;
        if (isValid && isValid.length > 0) throw "Username Already Exists";

        await account_db.update({
            username: username,
            password: encrypt(password, "passcode"),
        }).eq("account_id", account_id);

        return NextResponse.json({
            success: true,
            message: "Success"
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err
        })
    }

}