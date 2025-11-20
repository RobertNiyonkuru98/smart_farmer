import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Farmer - RIATS",
  description: "Rwanda Intelligent Agriculture Transformation System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white dark:bg-dark-bg text-light-text dark:text-dark-text`}
      >
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
