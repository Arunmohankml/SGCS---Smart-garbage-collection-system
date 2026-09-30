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
  title: "SGCS — Smart Garbage Collection System",
  description:
    "SGCS empowers citizens to request on-demand doorstep waste pickup while enabling municipal authorities across Tamil Nadu to manage and dispatch sanitation crews through an intelligent platform.",
  keywords: [
    "SGCS",
    "smart garbage collection",
    "doorstep waste pickup",
    "municipality sanitation",
    "solid waste management",
    "Tamil Nadu municipalities",
  ],
  openGraph: {
    title: "SGCS — Smart Garbage Collection System",
    description:
      "Transforming municipal waste collection with on-demand doorstep requests and intelligent sanitation dispatch.",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(dmSans.variable, geistMono.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}