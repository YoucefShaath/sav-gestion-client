"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  const { user, checked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (checked && !user) {
      router.replace("/login");
    }
  }, [checked, user, router]);

  // While checking auth state, show nothing (avoid flash)
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 sm:p-6 sm:pt-16 lg:p-8 lg:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
