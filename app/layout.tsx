import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import "@radix-ui/themes/styles.css";
import RedirectWatcher from "@/components/RedirectWatcher/RedirectWatcher";
import AuthInitializer from "@/components/auth/AuthInitializer";
import LocationInitializer from "@/components/RedirectWatcher/LocationInitializer";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pharmyst - Find Medicines Nearby",
  description:
    "Find nearby pharmacies that stock specific medicines with real-time availability",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <AuthInitializer />
        <RedirectWatcher />
        <LocationInitializer />
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
