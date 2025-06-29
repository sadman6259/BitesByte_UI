"use client";
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Navbar from "./components/Navbar";
import { usePathname, useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const isPortfolioRoute = pathname.startsWith("/portfolio");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect logged-in users away from public pages (like "/" or "/login")
    const publicPages = ["/", "/login"];
    if (token && publicPages.includes(pathname)) {
      router.replace("/portfolio");
      return;
    }

    // Redirect logged-out users away from private pages (anything under /portfolio)
    if (!token && pathname.startsWith("/portfolio")) {
      router.replace("/login"); // or "/"
      return;
    }
  }, [pathname, router]);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-customBeige`}
      >
        {!isPortfolioRoute && <Navbar />}
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
