import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  metadataBase: new URL("https://atlasq.local"),
  title: {
    default: "AtlasQ",
    template: "%s | AtlasQ",
  },
  description:
    "A simple college project for asking questions, answering, voting, and viewing student profiles.",
  openGraph: {
    title: "AtlasQ",
    description: "A clean student Q&A application.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "flex min-h-screen flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased")}>
        <Header />
        <div className="flex flex-1 flex-col justify-center">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
