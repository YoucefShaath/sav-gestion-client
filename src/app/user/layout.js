"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function UserLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple top header */}
      <header className="bg-[#0f172a] text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Informatica Logo"
              className="w-8 h-8 rounded-lg object-cover bg-white"
            />
            <div>
              <h1 className="text-sm font-bold leading-tight">Informatica</h1>
              <p className="text-[10px] text-blue-300">Espace client</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/user/new-ticket"
              className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname === "/user/new-ticket"
                    ? "bg-blue-600 text-white"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}
            >
              Nouveau ticket
            </Link>
            <Link
              href="/user/my-tickets"
              className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname === "/user/my-tickets"
                    ? "bg-blue-600 text-white"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}
            >
              Mes tickets
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
