"use client";

export function usePathInfo() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  // Get query parameters as an object
  const getQueryParams = () => {
    if (typeof window === "undefined") return {};
    const searchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(searchParams.entries());
  };

  // Build the query string excluding "p"
  const buildQueryParamsString = () => {
    const params = getQueryParams();
    let queryString = "";
    for (const [key, value] of Object.entries(params)) {
      if (key !== "p") {
        queryString += `&${key}=${value}`;
      }
    }
    return queryString;
  };

  const fullPath = `p=${pathname}${buildQueryParamsString()}`;
  return fullPath;
}