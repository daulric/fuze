import { notFound } from "next/navigation"
import PostView from "./PostViewer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cache } from "react";
import getUrl from "@/lib/geturl";

const cached_post = cache(async (url, post_id) => {
  
  const respose = await fetch(`${url}/api/post?post_id=${post_id}`, {
    cache: "no-store",
  });
  
  if (!respose.ok) return null;
  const { data } = await respose.json();
  if (!data || data.length === 0) return null;
  return data[0];
});


export async function generateMetadata({params}) {
  const id = (await params).id
  const url = await getUrl();
  const post = await cached_post(url, id);
  const canonicalUrl = `${url}/flare?id=${id}`;
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "Post not found",
    }
  }
  
  return {
    title: `${post.Account.username} using Flare`,
    description: `${post.Account.username} post a flare`,
    openGraph: {
      title: `${post.Account.username} using Flare`,
      description: `${post.Account.username} post a flare`,
      url: canonicalUrl,
    },
  }
  
}

export default async function PostPage({ params }) {
  const id = (await params).id
  const url = await getUrl();
  const post = await cached_post(url, id);

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="sticky top-0 z-20 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container flex h-14 max-w-3xl items-center px-4">
          <Button variant="ghost" size="icon" asChild className="mr-4 text-gray-300 hover:text-gray-100">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Flare</h1>
        </div>
      </header>
      <main className="">
        <PostView post={post} />
      </main>
    </div>
  )
}