import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicEye — See It. Report It. Fix It.",
  description:
    "CivicEye empowers citizens to report public issues instantly while enabling municipalities to manage, prioritize, and resolve complaints through an intelligent, transparent platform.",
  keywords: [
    "civic tech",
    "issue reporting",
    "municipality",
    "pothole reporting",
    "citizen complaints",
    "smart city",
  ],
  openGraph: {
    title: "CivicEye — See It. Report It. Fix It.",
    description:
      "Transforming citizen reports into real civic action with AI-assisted reporting.",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(dmSans.variable, geistMono.variable)}>
      <body className="min-h-screen bg-ink text-white antialiased">{children}</body>
    </html>
  );
}