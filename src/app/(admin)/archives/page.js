"use client";

import { useEffect, useState, useCallback } from "react";
import { getArchives } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORIES,
  formatDate,
  formatCurrency,
} from "@/lib/utils";

export default function ArchivesPage() {
  const [archives, setArchives] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;

      const data = await getArchives(params);
      setArchives(data.data || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setArchives([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategory]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Archives</h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} ticket{total !== 1 ? "s" : ""} archivé{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher dans les archives..."
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 bg-white"
          >
            <option value="">Toutes catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : archives.length === 0 ? (
        <EmptyState
          icon="🗄️"
          title="Aucune archive"
          message="Les tickets livrés et archivés apparaîtront ici."
        />
      ) : (
        <>
          <div className="space-y-3">
            {archives.map((a) => {
              const isExpanded = expandedId === a.ticket_id;
              return (
                <div
                  key={a.ticket_id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : a.ticket_id)
                    }
                    className="w-full p-4 text-left focus:outline-none"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-xl mt-0.5">
                          {CATEGORY_ICONS[a.hardware_category]}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-gray-700">
                              {a.ticket_id}
                            </span>
                            <StatusBadge status={a.status} />
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {a.client_name} · {a.client_phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                        <span className="text-xs text-gray-400">
                          Archivé le
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(a.archived_at)}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Catégorie :</span>{" "}
                          <span className="text-gray-900">
                            {CATEGORY_LABELS[a.hardware_category]}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Marque :</span>{" "}
                          <span className="text-gray-900">
                            {a.brand || "—"} {a.model || ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Créé le :</span>{" "}
                          <span className="text-gray-900">
                            {formatDate(a.created_at)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Livré le :</span>{" "}
                          <span className="text-gray-900">
                            {formatDate(a.delivered_at)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Coût estimé :</span>{" "}
                          <span className="text-gray-900">
                            {formatCurrency(a.estimated_cost)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Coût final :</span>{" "}
                          <span className="text-gray-900">
                            {formatCurrency(a.final_cost)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Problème
                        </p>
                        <p className="text-sm text-gray-700">
                          {a.problem_description}
                        </p>
                      </div>

                      {a.diagnostic_notes && (
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-amber-600 uppercase mb-1">
                            Diagnostic
                          </p>
                          <p className="text-sm text-gray-700">
                            {a.diagnostic_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                ← Précédent
              </button>
              <span className="text-sm text-gray-600">
                Page {page} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
