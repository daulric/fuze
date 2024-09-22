import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers";

function doNothing(e) {
    return e
}

export default function SupabaseServer() {
    const supabase_url = process.env.NEXT_PUBLIC_supabase_url;
    const anon_key = process.env.NEXT_PUBLIC_supabase_anon_key;

    const cookieStore = cookies();

    return createServerClient(supabase_url, anon_key, {
        cookies: {
            get(name) {
                return cookieStore.get(name)?.value;
            },

            set(name, value, options) {
                try {
                    cookieStore.set({name, value, options});
                } catch (e) {
                    doNothing(e)
                }
            },

            remove(name, options) {
                try {
                    cookieStore.set({name, value: "", options: options})
                } catch (e) {
                    doNothing(e)
                }
            }
        }
    })
    
}