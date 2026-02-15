"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CATEGORY_ICONS, CATEGORY_LABELS, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <LoadingSpinner message="Chargement du tableau de bord..." />;

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">Erreur: {error}</p>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const statusCards = [
    {
      key: "Received",
      label: "Reçus",
      color: "border-red-500",
      bg: "bg-red-50",
      icon: "📥",
    },
    {
      key: "Diagnostic",
      label: "Diagnostic",
      color: "border-amber-500",
      bg: "bg-amber-50",
      icon: "🔍",
    },
    {
      key: "In Progress",
      label: "En cours",
      color: "border-blue-500",
      bg: "bg-blue-50",
      icon: "🔧",
    },
    {
      key: "Completed",
      label: "Terminés",
      color: "border-green-500",
      bg: "bg-green-50",
      icon: "✅",
    },
    {
      key: "Delivered",
      label: "Livrés",
      color: "border-gray-400",
      bg: "bg-gray-50",
      icon: "📦",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vue d&apos;ensemble de l&apos;activité SAV
          </p>
        </div>
        <Link
          href="/new-ticket"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total actifs"
          value={stats.total_active}
          icon="📊"
          color="bg-blue-600"
        />
        <SummaryCard
          title="Aujourd'hui"
          value={stats.today}
          icon="📅"
          color="bg-emerald-600"
        />
        <SummaryCard
          title="Urgents"
          value={stats.by_priority?.Urgent || 0}
          icon="🚨"
          color="bg-red-600"
        />
        <SummaryCard
          title="Archivés"
          value={stats.total_archived}
          icon="🗄️"
          color="bg-gray-600"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusCards.map((card) => (
          <Link
            key={card.key}
            href={`/tickets?status=${encodeURIComponent(card.key)}`}
            className={`${card.bg} rounded-xl p-4 border-l-4 ${card.color} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {card.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.by_status?.[card.key] || 0}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Tickets récents</h2>
            <Link
              href="/tickets"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recent?.length > 0 ? (
              stats.recent.map((ticket) => (
                <Link
                  key={ticket.ticket_id}
                  href={`/tickets/${ticket.ticket_id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl">
                    {CATEGORY_ICONS[ticket.hardware_category] || "🔧"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {ticket.ticket_id}
                      </span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {ticket.client_name}
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <PriorityBadge priority={ticket.priority} />
                    <span className="text-xs text-gray-400">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">
                Aucun ticket pour le moment
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Par catégorie</h2>
          </div>
          <div className="p-5 space-y-3">
            {stats.by_category?.length > 0 ? (
              stats.by_category.map((cat) => {
                const pct =
                  stats.total_active > 0
                    ? Math.round((cat.count / stats.total_active) * 100)
                    : 0;
                return (
                  <div key={cat.hardware_category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 flex items-center gap-2">
                        <span>
                          {CATEGORY_ICONS[cat.hardware_category] || "🔧"}
                        </span>
                        {CATEGORY_LABELS[cat.hardware_category] ||
                          cat.hardware_category}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {cat.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">
                Pas de données
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div
          className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white text-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
