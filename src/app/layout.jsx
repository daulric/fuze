import "./globals.css";
import LayoutProvider from "@/components/LayoutProvider"

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
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
};

export default RootLayout;