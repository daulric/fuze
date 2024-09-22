import type { Metadata } from "next";
import "./globals.css";

import ProfileBar from "@/components/navbar/Profilebar";

export const metadata: Metadata = {
  title: "Video App",
  description: "Share any Video",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">

      <body>
        <ProfileBar username={"ulric"} avatarSrc={null} />
        {children}
      </body>
        
    </html>
  );
}
