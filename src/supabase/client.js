import { createClient } from "@supabase/ssr";

export default function SupabaseClient() {
    const supabase_url =  process.env.NEXT_PUBLIC_supabase_url;
    const anon_key = process.env.NEXT_PUBLIC_supabase_anon_key

    return createClient(supabase_url, anon_key);
}