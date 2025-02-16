"use client";

export function usePathInfo() {
  const pathname = typeof globalThis !== "undefined" ? globalThis.location.pathname : "";

  // Get query parameters as an object
  const getQueryParams = () => {
    if (typeof globalThis === "undefined") return {};
    const searchParams = new URLSearchParams(globalThis.location.search);
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