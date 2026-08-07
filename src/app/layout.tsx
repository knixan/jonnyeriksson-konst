import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Baskerville } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

const heading = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Libre_Baskerville({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Jonny Eriksson | Konst & Prints",
  description:
    "Originalkonstverk och prints av konstnär Jonny Eriksson, Hallsberg.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
        <SanityLive />
      </body>
    </html>
  );
}
