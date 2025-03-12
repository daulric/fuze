import { NextResponse } from "next/server";
import SupabaseServer from "@/supabase/server";
import { cookies } from "next/headers";

async function GetFullData(supa_client) {
  try {
    const posts_db = supa_client.from("Posts");
    const Uploads_Storage = supa_client.storage.from("PostsImages");

    const {data: Vid_Data, error: dbError} = await posts_db.select("*, Account(username, is_verified)");
    
    if (dbError) throw dbError;

    const handler_data = await Promise.all(Vid_Data.map(async (postData) => {
        // Add retry logic for file listing
        const getFilesList = async (retries = 3) => {
          for (let i = 0; i < retries; i++) {
              try {
                  const { data, error } = await Uploads_Storage.list(postData.post_id);
                  if (error) throw error;
                  return data;
              } catch (error) {
                  if (i === retries - 1) throw error;
                  // Exponential backoff
                  await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
              }
          }
        };

        // Add retry logic for signed URLs
        const getSignedUrl = async (path, length = 30, retries = 3) => {
          for (let i = 0; i < retries; i++) {
            try {
              const { data, error } = await Uploads_Storage.createSignedUrl(path, length);
              if (error) throw error;
              return data.signedUrl;
            } catch (error) {
              if (i === retries - 1) throw error;
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
          }
        };

        try {
          const files = await getFilesList();
          
          if (files) {

            const signed_urls = await Promise.all(
              files.map((file) => getSignedUrl(`${postData.post_id}/${file.name}`, 300))
            );
          
            return {
              ...postData,
              images: signed_urls,
            };
          }
          
          return postData;

        } catch (error) {
            return {
              ...postData,
              images: null,
              error: error.message
            };
        }
    }));

    // Filter out failed items if needed
    return handler_data.filter(Boolean);
  } catch (error) {
    throw error; // Propagate error for proper handling in GET route
  }
}

async function DatabaseQuery(supa_client, query) {
    const Data = await GetFullData(supa_client);

    if (Data.length === 0) return NextResponse.json({ success: true, data: [] });

    const isMatch = (item, query) => {
        return Object.entries(query).every(([key, value]) => {

            if (item.Account && item.Account[key] === value) {
              return (value === "true" ? true : value === "false" ? false : value)
            }

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // If the value is an object, check if the corresponding item property matches
              return item.hasOwnProperty(key) && isMatch(
                  item[key], 
                  (value === "true" ? true : value === "false" ? false : value)
              );
            } else {
              // For non-object values, do a simple equality check
              return item.hasOwnProperty(key) && item[key] === (value === "true" ? true : value === "false" ? false : value);
            }
        });
    };

    const Filtered_Data = Data.filter((item) => {
      const result = isMatch(item, query);
      return result;
    });

    const Public_Data = Filtered_Data.map(({account_id, ...rest}) => {
      if (account_id) return rest;
    });

    return NextResponse.json({
      success: true,
      data: Public_Data,
    });
}

async function GetSearchData(supa_client, search_query) {
    const Data = await GetFullData(supa_client);

    if (Data.length === 0) return NextResponse.json({ success: true, data: []});

    const searched_data = Data.filter(item => {
        const search_query_lower = search_query.toLowerCase();
        return (
          (
            item.Account.username.toLowerCase().includes(search_query_lower) ||
            item.content.toLowerCase().includes(search_query_lower)
          ) &&
          item.is_private === false
        )
    })

    return NextResponse.json({
      success: true,
      data: searched_data,
    });
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const queries = Object.fromEntries(searchParams.entries());

  try {
    const supa_client = SupabaseServer();
    
    if (Object.keys(queries).length !== 0) {
      
      if (queries.search) {
        return GetSearchData(supa_client, queries.search);
      }
      
      if (queries.is_private) {
        const is_user = (await cookies()).get("user");

        if (!is_user) {
          return NextResponse.json({
            success: false,
            message: "Authentication required"
          }, { status: 401 });
        }
        
        return DatabaseQuery(supa_client, {...queries, account_id: is_user.value});
      }
      
      if (queries.all) {
        const is_user = (await cookies()).get("user");
        if (!is_user) {
            return NextResponse.json({
              success: false,
              message: "Authentication required"
            }, { status: 401 });
        }
        return DatabaseQuery(supa_client, {account_id: is_user.value});
      }
      
      return DatabaseQuery(supa_client, {...queries, is_private: false});
    }
    
    return DatabaseQuery(supa_client, { is_private: false });
  } catch(e) {

    return NextResponse.json({
      success: false,
      message: e.message || "Internal server error",
      code: e.code || 'UNKNOWN_ERROR'
    }, { status: e.status || 500 });
    
  }
}

export async function POST(request) {
  try {
    const supa_client = SupabaseServer();
    const requested_data = await request.json();
    
    const user = (await cookies()).get("user");
    
    if (!user) throw "no user";
    
    const posts_db = supa_client.from("Posts");
    const account_id = user.value;
    
    const {data, error} = await posts_db.insert({
      content: requested_data.content,
      account_id,
      is_private: false,
    }).select().single();

    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      post_id: data.post_id,
    });

  } catch(e) {
    return NextResponse.json({
      success: false,
      message: e.message || e || "Internal server error",
      code: e.code || 'UNKNOWN_ERROR'
    }, { status: e.status || 500 });
  }
}