import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import NavbarLayout from "@/components/navbar/LayoutClient";
import { UserContextProvider } from "@/lib/UserContext";

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
        <UserContextProvider>
          <NextTopLoader showSpinner={false} />
          <NavbarLayout>
            {children}
          </NavbarLayout>
        </UserContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;