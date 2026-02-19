"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import {
  FiHome,
  FiList,
  FiPlusCircle,
  FiTool,
  FiArchive,
  FiMail,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: FiHome,
    adminOnly: true,
  },
  { href: "/tickets", label: "Tickets", icon: FiList },
  { href: "/new-ticket", label: "Nouveau ticket", icon: FiPlusCircle },
  { href: "/technician", label: "Vue technicien", icon: FiTool },
  { href: "/archives", label: "Archives", icon: FiArchive },
  { href: "/demandes", label: "Demandes", icon: FiMail, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sidebar-collapsed");
      if (stored) setCollapsed(stored === "true");
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    } catch (e) {}
  }, [collapsed]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Ouvrir le menu"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (desktop + mobile) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-slate-900/95 to-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out
          ${mobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"} lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:flex-shrink-0 ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Logo / Brand */}
        <div
          className={`flex items-center gap-3 px-4 py-4 ${collapsed ? "justify-center" : "justify-start"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src="/logo.jpg"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold leading-tight">Informatica</h1>
                <p className="text-xs text-slate-300">
                  Solutions informatiques
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.filter(
            (item) => !item.adminOnly || user?.role === "admin",
          ).map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium overflow-hidden
                  ${isActive ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/80 shadow-md" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                title={item.label}
              >
                {/* Active indicator */}
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-tr-md rounded-br-md transition-all ${isActive ? "bg-blue-400" : "opacity-0"}`}
                />

                {/* Icon */}
                <span
                  className={`flex items-center justify-center shrink-0 ${collapsed ? "w-full" : "w-8 h-8"} text-lg rounded-md transition-colors ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                >
                  <Icon className={`${collapsed ? "mx-auto" : ""} w-5 h-5`} />
                </span>

                {/* Label (hidden when collapsed) */}
                <span className={`${collapsed ? "hidden" : "truncate"}`}>
                  {item.label}
                </span>

                {/* subtle arrow for active */}
                {!collapsed && isActive && (
                  <svg
                    className="ml-auto w-4 h-4 text-white/60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: user + collapse */}
        <div
          className={`px-3 py-3 border-t border-white/6 flex items-center gap-3 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {user ? (
            <div
              className={`flex items-center gap-3 ${collapsed ? "flex-col" : "flex-row"}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-semibold uppercase shadow-inner">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  : (user.username || "U").slice(0, 2).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {user.name || user.username}
                  </div>
                  <div className="text-xs text-slate-400">{user.role}</div>
                </div>
              )}
            </div>
          ) : (
            !collapsed && (
              <div className="text-xs text-slate-400">Bienvenue</div>
            )
          )}

          <div className="flex items-center gap-2">
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-slate-300 hover:text-red-400"
                title="Se déconnecter"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setCollapsed((v) => !v)}
              className="p-2 rounded-md bg-white/3 text-slate-200 hover:bg-white/6 transition-colors hidden md:block"
              title={collapsed ? "Développer la barre" : "Réduire la barre"}
            >
              {collapsed ? (
                <FiChevronRight className="w-4 h-4" />
              ) : (
                <FiChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
