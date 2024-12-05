import "./globals.css";
import LayoutClient from "@/components/navbar/LayoutClient";

export const metadata = {
  title: "Home",
  description: "A Temu Version Social Media",
  icons: {
    icon: "/logo2.svg",
    apple: "/logo2.svg",
  },
  manifest: "/manifest.json",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
};

export default RootLayout;