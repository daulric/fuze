import { headers } from "next/headers";

async function getURL() {
    const headersList = await headers();
    let host = headersList.get('host') || process.env.VERCEL_URL;
    let protocol = headersList.get('x-forwarded-proto') || 'https';

    if (!host) {
        host = "localhost:3000"
    }

    if (host?.startsWith("192.168.") || host?.startsWith("10.") || host?.startsWith("172.")) {
        protocol = "http"
    }

    const url = `${protocol}://${host}`;
    console.log(url);
    return url;
};

export default getURL;