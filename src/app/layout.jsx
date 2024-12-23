import "./globals.css";
import LayoutProvider from "@/components/LayoutProvider"

export const metadata = {
  title: "Home",
  description: "A Temu Version Social Media",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="overflow-y-hidden">
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
};

export default RootLayout;