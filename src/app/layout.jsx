import "./globals.css";

import ProfileBar from "@/components/navbar/Profilebar";
import Sidebar from "@/components/navbar/Sidebar"

export const metadata = {
  title: "Video App",
  description: "Share any Video",
};

const Layout = ({ children }) => {
  return (
    <html>
      <body className="relative h-screen overflow-hidden">
        <ProfileBar username={"ulric"} />

        <div className="flex h-screen">
          <Sidebar />

          <main className="flex-1 h-[calc(100vh-64px)] ml-16 mt-16 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
};

export default Layout;