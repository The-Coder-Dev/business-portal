import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "Business Portal — India's #1 Business Listing Platform",
    template: "%s | Business Portal",
  },
  description:
    "Discover and list local businesses across India. Connect with thousands of verified businesses in your city.",
  keywords: ["business listing", "local business", "India", "business directory"],
  authors: [{ name: "Business Portal" }],
  creator: "Business Portal",
  metadataBase: new URL(
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        outfit.className
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

