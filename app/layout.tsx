import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { PHProvider } from "./providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Nice Fkin Tools",
  description: "NFTs for NFTs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <head>
        <meta name="apple-mobile-web-app-title" content="NFTS" />
      </head>
      <body>
        <PHProvider>
          {children}
        </PHProvider>
      </body>
    </html>
  );
}