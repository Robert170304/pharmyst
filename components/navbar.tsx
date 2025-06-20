"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();
  console.log("🚀 ~ Navbar ~ pathName:", pathName);
  if (pathName.includes("dashboard")) {
    return null;
  }
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Pharmyst
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-600 hover:text-gray-900">
              Search Medicines
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Pharmacy Login
            </Link>
            <Button asChild>
              <Link href="/auth/register">Register Pharmacy</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/search"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Search Medicines
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Pharmacy Login
              </Link>
              <Button asChild className="w-fit">
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Pharmacy
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
