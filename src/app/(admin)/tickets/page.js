"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTickets, deleteTicket, archiveTicket } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import {
  STATUSES,
  STATUS_LABELS,
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  formatDate,
} from "@/lib/utils";
import Icon from "@/components/Icons";
import { useToast, useConfirm } from "@/components/ToastProvider";

export default function TicketsPageWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TicketsPage />
    </Suspense>
  );
}

function TicketsPage() {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("status") || "",
  );
  const [filterCategory, setFilterCategory] = useState("");
  const [search, setSearch] = useState("");

  const showToast = useToast();
  const confirm = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category = filterCategory;
      if (search) params.search = search;

      const data = await getTickets(params);
      setTickets(data.data || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterCategory, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (
      !(await confirm({
        title: "Supprimer le ticket",
        message: `Supprimer le ticket ${id} ?`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        danger: true,
      }))
    )
      return;
    try {
      await deleteTicket(id);
      showToast({ type: "success", message: `Ticket ${id} supprimé.` });
      load();
    } catch (err) {
      showToast({
        type: "error",
        message: err.message || "Erreur lors de la suppression",
      });
    }
  }

  async function handleArchive(id) {
    if (
      !(await confirm({
        title: "Archiver le ticket",
        message: `Archiver le ticket ${id} ?`,
        confirmText: "Archiver",
        cancelText: "Annuler",
      }))
    )
      return;
    try {
      await archiveTicket(id);
      showToast({ type: "success", message: `Ticket ${id} archivé.` });
      load();
    } catch (err) {
      showToast({
        type: "error",
        message: err.message || "Erreur lors de l'archivage",
      });
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} ticket{total !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          href="/new-ticket"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouveau ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher par nom, téléphone ou ID..."
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 bg-white"
          >
            <option value="">Tous les statuts</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          {/* Category filter */}
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

      {/* Table / Cards */}
      {loading ? (
        <LoadingSpinner />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon="🎫"
          title="Aucun ticket trouvé"
          message="Modifiez vos filtres ou créez un nouveau ticket."
          action={
            <Link
              href="/new-ticket"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Créer un ticket
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Matériel
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((t) => (
                  <tr
                    key={t.ticket_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/tickets/${t.ticket_id}`}
                        className="text-sm font-mono font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {t.ticket_id}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-medium text-gray-900">
                        {t.client_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.client_phone}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <span className="text-slate-600">
                          <Icon
                            name={CATEGORY_ICONS[t.hardware_category]}
                            className="w-5 h-5"
                          />
                        </span>
                        {t.brand || CATEGORY_LABELS[t.hardware_category]}
                        {t.model && (
                          <span className="text-gray-400">· {t.model}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {formatDate(t.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/tickets/${t.ticket_id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                          title="Voir"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                        {t.status === "Delivered" && (
                          <button
                            onClick={() => handleArchive(t.ticket_id)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 rounded-md hover:bg-amber-50"
                            title="Archiver"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(t.ticket_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                          title="Supprimer"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {tickets.map((t) => (
              <Link
                key={t.ticket_id}
                href={`/tickets/${t.ticket_id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-mono font-semibold text-blue-600">
                      {t.ticket_id}
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {t.client_name}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <Icon
                      name={CATEGORY_ICONS[t.hardware_category]}
                      className="w-5 h-5 text-slate-600"
                    />
                    <span className="truncate">
                      {t.brand || CATEGORY_LABELS[t.hardware_category]}
                    </span>
                  </span>
                  <PriorityBadge priority={t.priority} />
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
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
