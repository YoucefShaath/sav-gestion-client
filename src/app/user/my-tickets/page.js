"use client";

import { useState } from "react";
import { lookupTicketsByPhone } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { CATEGORY_ICONS, CATEGORY_LABELS, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function MyTicketsPage() {
  const [phone, setPhone] = useState("");
  const [tickets, setTickets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Veuillez entrer votre numéro de téléphone");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await lookupTicketsByPhone(phone.trim());
      setTickets(result);
      setSearched(true);
    } catch (err) {
      setError(err.message || "Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes tickets</h1>
        <p className="text-sm text-gray-500 mt-1">
          Retrouvez vos tickets en entrant votre numéro de téléphone
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-6 mb-6"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </label>
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            placeholder="Ex: 0555 12 34 56"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Recherche...
              </>
            ) : (
              <>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>{" "}
                Rechercher
              </>
            )}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      {/* Results */}
      {loading && <LoadingSpinner />}

      {!loading && searched && tickets && tickets.length === 0 && (
        <EmptyState
          icon="📭"
          title="Aucun ticket trouvé"
          description="Aucun ticket n'a été trouvé pour ce numéro de téléphone."
        />
      )}

      {!loading && tickets && tickets.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 font-medium">
            {tickets.length} ticket(s) trouvé(s)
          </p>
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/track/${ticket.ticket_id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-blue-600">
                      {ticket.ticket_id}
                    </span>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>{CATEGORY_ICONS[ticket.hardware_category]}</span>
                    <span>{CATEGORY_LABELS[ticket.hardware_category]}</span>
                    {ticket.brand && (
                      <span className="text-gray-400">
                        • {ticket.brand} {ticket.model}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {ticket.problem_description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Créé le {formatDate(ticket.created_at)}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1"
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
            </Link>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-sm">
            Entrez votre numéro de téléphone pour retrouver vos tickets
          </p>
        </div>
      )}
    </div>
  );
}
