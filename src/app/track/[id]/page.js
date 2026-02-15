"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicStatus } from "@/lib/api";
import StatusTimeline from "@/components/StatusTimeline";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  STATUS_LABELS,
  formatDate,
} from "@/lib/utils";

export default function TrackTicketPage() {
  const params = useParams();
  const ticketId = params.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublicStatus(ticketId);
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Chargement de votre ticket..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ticket introuvable
          </h2>
          <p className="text-gray-500 text-sm">
            Le ticket{" "}
            <span className="font-mono font-semibold">{ticketId}</span> n'existe
            pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header bar */}
      <header className="bg-[#0f172a] text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold">SAV Manager</h1>
            <p className="text-xs text-blue-300">Suivi de réparation</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-5">
          {/* Ticket ID & Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Ticket
            </p>
            <h2 className="text-2xl font-bold font-mono text-gray-900 mb-3">
              {ticket.ticket_id}
            </h2>
            <StatusBadge status={ticket.status} size="lg" />

            {ticket.archived && (
              <p className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5 inline-block">
                📦 Ce ticket a été archivé
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Progression
            </h3>
            <StatusTimeline currentStatus={ticket.status} />
          </div>

          {/* Device info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Votre appareil
            </h3>
            <div className="space-y-2.5">
              <InfoRow
                label="Catégorie"
                value={
                  <span className="flex items-center gap-1.5">
                    {CATEGORY_ICONS[ticket.hardware_category]}
                    {CATEGORY_LABELS[ticket.hardware_category]}
                  </span>
                }
              />
              {ticket.brand && <InfoRow label="Marque" value={ticket.brand} />}
              {ticket.model && <InfoRow label="Modèle" value={ticket.model} />}
              <InfoRow label="Client" value={ticket.client_name} />
              <InfoRow label="Reçu le" value={formatDate(ticket.created_at)} />
              {ticket.estimated_cost && (
                <InfoRow
                  label="Coût estimé"
                  value={`${ticket.estimated_cost} DA`}
                />
              )}
              {ticket.delivered_at && (
                <InfoRow
                  label="Livré le"
                  value={formatDate(ticket.delivered_at)}
                />
              )}
            </div>
          </div>

          {/* History */}
          {ticket.history && ticket.history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Historique
              </h3>
              <div className="space-y-3">
                {ticket.history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {STATUS_LABELS[h.new_status] || h.new_status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(h.changed_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 py-4">
            SAV Manager · Suivi en temps réel de votre réparation
          </p>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
