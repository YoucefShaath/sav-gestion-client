"use client";

import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/6 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <a
            href="tel:+213793272379"
            className="group inline-flex items-center gap-3"
          >
            <FiPhone className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-800 transition-colors">
              0793 27 23 79
            </span>
          </a>

          <a
            href="mailto:contact@informaticacompany.com"
            className="group inline-flex items-center gap-3"
          >
            <FiMail className="w-5 h-5 text-sky-600 group-hover:text-sky-700 transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-800 transition-colors">
              contact@informaticacompany.com
            </span>
          </a>

          <div className="inline-flex items-center gap-3 text-center sm:text-left">
            <FiMapPin className="w-5 h-5 text-slate-500" />
            <span>
              12, chemin Sidi Yahia, locale 14, Bir Mourad Raïs, Alger, Algérie
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
