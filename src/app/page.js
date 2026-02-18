"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import Footer from "@/components/Footer";

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();

  // If already logged in as technician, go to dashboard
  useEffect(() => {
    if (user) router.replace(user.role === "admin" ? "/dashboard" : "/tickets");
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center">
          {/* Logo */}
          <div className="mb-10">
            <img
              src="/logo.jpg"
              alt="Informatica Logo"
              className="w-16 h-16 rounded-2xl object-cover bg-white mx-auto mb-4 shadow-lg shadow-blue-600/30"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Informatica
            </h1>
            <p className="text-blue-300 text-sm sm:text-base">
              Solutions informatiques & gestion du service
            </p>
          </div>

          {/* Three choice cards */}
          <div className="grid sm:grid-cols-3 gap-5">
            {/* Client Card */}
            <button
              onClick={() => router.push("/user/new-ticket")}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 text-left hover:bg-white/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/30 transition-colors">
                <svg
                  className="w-7 h-7 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Client</h2>
              <p className="text-sm text-blue-200 leading-relaxed">
                Déposer un appareil en réparation ou suivre l&apos;état de votre
                ticket.
              </p>
              <div className="mt-5 flex items-center text-emerald-400 text-sm font-medium">
                Accéder
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            {/* Entreprise Card */}
            <button
              onClick={() => router.push("/entreprise")}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 text-left hover:bg-white/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-5 group-hover:bg-purple-500/30 transition-colors">
                <svg
                  className="w-7 h-7 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Entreprise</h2>
              <p className="text-sm text-blue-200 leading-relaxed">
                Demande d&apos;achat de matériel ou demande de prestation
                technique.
              </p>
              <div className="mt-5 flex items-center text-purple-400 text-sm font-medium">
                Accéder
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            {/* Technician Card */}
            <button
              onClick={() => router.push("/login")}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7 text-left hover:bg-white/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/30 transition-colors">
                <svg
                  className="w-7 h-7 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Technicien</h2>
              <p className="text-sm text-blue-200 leading-relaxed">
                Accéder au tableau de bord, gérer les tickets et les
                réparations.
              </p>
              <div className="mt-5 flex items-center text-blue-400 text-sm font-medium">
                Se connecter
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
