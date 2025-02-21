import "./globals.css";
import LayoutProvider from "@/components/LayoutProvider"
import NextTopLoader from 'nextjs-toploader';

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
      <body>
        <NextTopLoader showSpinner={false} />
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
};

export default RootLayout;