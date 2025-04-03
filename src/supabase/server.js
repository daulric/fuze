import { createBrowserClient } from "@supabase/ssr"

const supabase_url = process.env.NEXT_PUBLIC_supabase_url || "example";
const anon_key = process.env.NEXT_PUBLIC_supabase_anon_key || "example";

const supabase = createBrowserClient(supabase_url, anon_key, {realtime: true});

export default supabase;
export const auth = supabase.auth;