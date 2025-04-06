import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";

const inter = Inter({
  weight: "400", // Added required weight property
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "DeepSeek",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <ConvexClientProvider>{children}</ConvexClientProvider>

        </body>
      </html>

    </ClerkProvider>
  );
}
