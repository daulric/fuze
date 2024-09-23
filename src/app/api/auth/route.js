import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";
import { encrypt, decrypt } from "@/tools/encryption"

export async function GET() {
    return new NextResponse("ok");
}

export async function POST() {
    // Sign up

    try {
        const supabase_client = SupabaseServer();
        const accounts_db = supabase_client.from("Account")

    } catch (err) {
        return NextResponse.json({
            sucess: false,
            message: err,
        }, { status: 200 })
    }

}

export async function PUT() {
    // Login
}

export async function DELETE() {
    // Logout
}