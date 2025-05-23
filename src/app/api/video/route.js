import { NextResponse } from "next/server";
import supa_client from "@/supabase/server";
import { cookies } from "next/headers";

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

async function GetFullData(supa_client) {
    try {
      const videos_db = supa_client.from("Video");
      const Uploads_Storage = supa_client.storage.from("Uploads");

      const {data: Vid_Data, error: dbError} = await videos_db.select("*, Account(username, is_verified)");
      
      if (dbError) throw dbError;

      const handler_data = await Promise.all(Vid_Data.map(async (videoData) => {
          // Add retry logic for file listing
          const getFilesList = async (retries = 3) => {
              for (let i = 0; i < retries; i++) {
                  try {
                      const { data, error } = await Uploads_Storage.list(videoData.video_id);
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
            
            if (!files || files.length === 0) {
              return null;
            }

            const videoFile = files.find(file => file.name.includes("video"));
            
            if (videoFile) {
              const thumbnailFile = files.find(file => file.name.includes("thumbnail"));

              const [videoUrl, thumbnailUrl] = await Promise.all([
                  videoFile ? getSignedUrl(`${videoData.video_id}/${videoFile.name}`, 300) : Promise.resolve(null),
                  thumbnailFile ? getSignedUrl(`${videoData.video_id}/${thumbnailFile.name}`, 300) : Promise.resolve("/logo.svg")
              ]);
              
            
              return {
                  ...videoData,
                  video: videoUrl,
                  thumbnail: thumbnailUrl,
                  meta: {
                      video: videoFile,
                      thumbnail: thumbnailFile,
                  }
              };
            }

          } catch (error) {
              return {
                  ...videoData,
                  video: null,
                  thumbnail: "/logo.svg",
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

async function GetSearchData(supa_client, search_query) {
    const Data = await GetFullData(supa_client);

    if (Data.length === 0) return NextResponse.json({ success: true, data: []});

    const searched_data = Data.filter(item => {
        const search_query_lower = search_query.toLowerCase();
        return (
            (
              item.Account.username.toLowerCase().includes(search_query_lower) ||
              item.title.toLowerCase().includes(search_query_lower) ||
              item.description.toLowerCase().includes(search_query_lower)
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

          if (queries.allow_age_18) {
            return DatabaseQuery(supa_client, {...queries, is_private: false, age_18: true})
          }

          return DatabaseQuery(supa_client, {...queries, is_private: false, age_18: false});
      }

      return DatabaseQuery(supa_client, {is_private: false});
    } catch(error) {
      return NextResponse.json({
          success: false,
          message: error.message || "Internal server error",
          code: error.code || 'UNKNOWN_ERROR'
      }, { 
          status: error.status || 500 
      });
    }
}

export async function PUT(request) {
  try {

    const {video_id, ...data} = await request.json();

    if (!video_id) throw "Video ID Not Provided";

    const video_db = supa_client.from("Video");

    await video_db.update({
      title: data.title,
      description: data.description,
      is_private: data.is_private,
    }).eq("video_id", video_id);

    return NextResponse.json({
        success: true,
    });

  } catch(e) {
    return NextResponse.json({
        success: false,
        message: e
    });
  }
}