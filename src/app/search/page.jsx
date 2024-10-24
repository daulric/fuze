import SearchPage from "./searchPage"

export async function generateMetadata({searchParams}) {

  const query = (await searchParams).query || "";

  if (!query) {
    return {
      title: "No Search Query",
      description: "No search results query has been specified",
    }
  }

  return {
    title: `Search Results for "${query}"`,
    description: `Search results for "${query}"`,
  }

}

export default function PAGE() {
  return (
    <>
    <SearchPage />
    </>
  )
}