import "./globals.css";

import ProfileBar from "@/components/navbar/Profilebar";
import Sidebar from "@/components/navbar/Sidebar";

export const metadata = {
  title: "zTube",
  description: "A Temu Version Social Media",
  icons: {
    icon: "/logo.svg"
  }
};

const Layout = ({ children }) => {
  return (
    <html lang="es">
      <body className="relative h-screen overflow-hidden">
        <ProfileBar />

        <div className="flex h-screen">
          <Sidebar />

          <main className="flex-1 h-[calc(100vh-64px)] mt-16 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
};

export default Layout;