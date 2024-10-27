import { NextResponse } from "next/server"
//import SupabaseServer from "@/supabase/server";

export async function GET() {
    return new NextResponse("ok");
}

// Make updates to the user account details.
export async function POST(request) {

    try {
        const { username, password, account_id} = await request.body();

        if (!account_id) {
            throw "Must have Account ID";
        }

        if (!username || !password) {
            throw "Can't Get Required Fields";
        }

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err
        })
    }

}