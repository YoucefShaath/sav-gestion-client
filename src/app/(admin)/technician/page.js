"use client";

import { useEffect, useState, useCallback } from "react";
import { getTickets, updateTicketStatus } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUSES,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  TRANSITIONS,
  formatDate,
} from "@/lib/utils";

export default function TechnicianPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("");
  const [updating, setUpdating] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter) params.status = activeFilter;
      const data = await getTickets(params);
      setTickets(data.data || []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleQuickStatusChange(ticketId, newStatus, extraData = {}) {
    setUpdating(ticketId);
    try {
      await updateTicketStatus(ticketId, { status: newStatus, ...extraData });
      load();
    } catch (err) {
      alert(err.data?.error || err.message);
    } finally {
      setUpdating(null);
    }
  }

  // Status filter tabs (only active statuses)
  const filterStatuses = STATUSES.filter((s) => s !== "Delivered");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vue technicien</h1>
        <p className="text-sm text-gray-500 mt-1">
          Interface rapide pour mettre à jour les tickets
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveFilter("")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${!activeFilter ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
        >
          Tous
        </button>
        {filterStatuses.map((s) => {
          const colors = STATUS_COLORS[s];
          return (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${
                  activeFilter === s
                    ? `${colors.bg} ${colors.text}`
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {STATUS_LABELS[s]}
            </button>
          );
        })}
      </div>

      {/* Ticket cards - optimized for touch */}
      {loading ? (
        <LoadingSpinner />
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🔧</p>
          <p className="text-sm">Aucun ticket à afficher</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const isExpanded = expandedId === t.ticket_id;
            const nextStatuses = TRANSITIONS[t.status] || [];
            const isUpdating = updating === t.ticket_id;

            return (
              <div
                key={t.ticket_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Ticket header - clickable */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : t.ticket_id)}
                  className="w-full p-4 text-left focus:outline-none"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl mt-0.5">
                        {CATEGORY_ICONS[t.hardware_category]}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-mono font-bold text-gray-900">
                            {t.ticket_id}
                          </span>
                          <PriorityBadge priority={t.priority} />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">
                          {t.client_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.brand} {t.model} · {t.location || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                      <StatusBadge status={t.status} />
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

                {/* Expanded section */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                    {/* Problem description */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Problème
                      </p>
                      <p className="text-sm text-gray-700">
                        {t.problem_description}
                      </p>
                    </div>

                    {/* Notes */}
                    {t.diagnostic_notes && (
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-amber-600 uppercase mb-1">
                          Diagnostic
                        </p>
                        <p className="text-sm text-gray-700">
                          {t.diagnostic_notes}
                        </p>
                      </div>
                    )}
                    {t.technician_notes && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
                          Notes technicien
                        </p>
                        <p className="text-sm text-gray-700">
                          {t.technician_notes}
                        </p>
                      </div>
                    )}

                    {/* Quick info */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>📞 {t.client_phone}</span>
                      <span>📅 {formatDate(t.created_at)}</span>
                      {t.estimated_cost && (
                        <span>💰 {t.estimated_cost} DA</span>
                      )}
                    </div>

                    {/* Status change buttons - large touch targets */}
                    {nextStatuses.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Changer le statut :
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {nextStatuses.map((s) => {
                            const colors = STATUS_COLORS[s];
                            return (
                              <button
                                key={s}
                                onClick={() =>
                                  handleQuickStatusChange(t.ticket_id, s)
                                }
                                disabled={isUpdating}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all
                                  ${colors.bg} ${colors.text} hover:shadow-md
                                  active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                  border-2 border-transparent hover:border-current`}
                              >
                                {isUpdating ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                    Mise à jour...
                                  </span>
                                ) : (
                                  `→ ${STATUS_LABELS[s]}`
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
