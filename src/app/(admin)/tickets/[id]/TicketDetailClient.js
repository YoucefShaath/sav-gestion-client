"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTicket,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
  archiveTicket,
} from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import StatusTimeline from "@/components/StatusTimeline";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import Invoice from "@/components/Invoice";
import { useAuth } from "@/components/AuthProvider";
import Icon from "@/components/Icons";
import { useToast, useConfirm } from "@/components/ToastProvider";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  STATUS_LABELS,
  TRANSITIONS,
  formatDate,
  formatCurrency,
  CATEGORIES,
  PRIORITIES,
  PRIORITY_LABELS,
  validatePhone,
} from "@/lib/utils";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { user } = useAuth();

  const showToast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  async function loadTicket() {
    setLoading(true);
    try {
      const data = await getTicket(ticketId);
      setTicket(data);
      setEditForm(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      const result = await updateTicketStatus(ticketId, { status: newStatus });
      setTicket(result);
    } catch (err) {
      showToast({ type: "error", message: err.data?.error || err.message });
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateTicket(ticketId, editForm);
      setTicket(result);
      setEditing(false);
      showToast({ type: "success", message: "Modifications enregistrées." });
    } catch (err) {
      showToast({
        type: "error",
        message: err.data?.errors?.join("\n") || err.message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !(await confirm({
        title: "Supprimer le ticket",
        message: "Êtes-vous sûr de vouloir supprimer ce ticket ?",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        danger: true,
      }))
    )
      return;
    try {
      await deleteTicket(ticketId);
      showToast({ type: "success", message: "Ticket supprimé." });
      router.push("/tickets");
    } catch (err) {
      showToast({
        type: "error",
        message: err.message || "Erreur lors de la suppression",
      });
    }
  }

  async function handleArchive() {
    if (
      !(await confirm({
        title: "Archiver le ticket",
        message: "Archiver ce ticket ?",
        confirmText: "Archiver",
        cancelText: "Annuler",
      }))
    )
      return;
    try {
      await archiveTicket(ticketId);
      showToast({ type: "success", message: "Ticket archivé." });
      router.push("/tickets");
    } catch (err) {
      showToast({
        type: "error",
        message: err.message || "Erreur lors de l'archivage",
      });
    }
  }

  if (loading) return <LoadingSpinner message="Chargement du ticket..." />;
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/tickets" className="text-blue-600 hover:underline text-sm">
          ← Retour aux tickets
        </Link>
      </div>
    );
  }

  const nextStatuses = TRANSITIONS[ticket.status] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showInvoice && (
        <Invoice ticket={ticket} onClose={() => setShowInvoice(false)} />
      )}
      {/* Back + Header */}
      <div>
        <Link
          href="/tickets"
          className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-3"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour aux tickets
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 font-mono">
              {ticket.ticket_id}
            </h1>
            <StatusBadge status={ticket.status} size="lg" />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <>
                {user?.role === "admin" && (
                  <button
                    onClick={() => setShowInvoice(true)}
                    className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium"
                  >
                    🧾 Facture
                  </button>
                )}
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium inline-flex items-center gap-2"
                >
                  <Icon name="pencil" className="w-4 h-4 text-gray-600" />
                  Modifier
                </button>
              </>
            )}
            {ticket.status === "Delivered" && !ticket.archived && (
              <button
                onClick={handleArchive}
                className="px-3 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-medium"
              >
                🗄️ Archiver
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium inline-flex items-center gap-2"
            >
              <Icon name="trash" className="w-4 h-4 text-red-600" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Progression
        </h3>
        <StatusTimeline currentStatus={ticket.status} />

        {/* Quick status change */}
        {nextStatuses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2 self-center">
              Passer à :
            </span>
            {nextStatuses.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  s === "Completed" && ticket.status === "Diagnostic"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {STATUS_LABELS[s]}
                {s === "Completed" && ticket.status === "Diagnostic" && " ⚡"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content: details + QR code */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            /* Edit Form */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">
                Modifier le ticket
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Nom client *
                  </label>
                  <input
                    value={editForm.client_name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, client_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Téléphone *
                  </label>
                  <input
                    value={editForm.client_phone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, client_phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Email
                </label>
                <input
                  value={editForm.client_email || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, client_email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={editForm.hardware_category || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        hardware_category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Marque
                  </label>
                  <input
                    value={editForm.brand || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Modèle
                  </label>
                  <input
                    value={editForm.model || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, model: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Description du problème *
                </label>
                <textarea
                  value={editForm.problem_description || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      problem_description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Notes diagnostic
                </label>
                <textarea
                  value={editForm.diagnostic_notes || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      diagnostic_notes: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Notes technicien
                </label>
                <textarea
                  value={editForm.technician_notes || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      technician_notes: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Coût estimé
                  </label>
                  <input
                    type="number"
                    value={editForm.estimated_cost || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        estimated_cost: e.target.value || null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Coût final
                  </label>
                  <input
                    type="number"
                    value={editForm.final_cost || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        final_cost: e.target.value || null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Priorité
                  </label>
                  <select
                    value={editForm.priority || "Normal"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {PRIORITY_LABELS[p]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Emplacement
                </label>
                <input
                  value={editForm.location || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditForm(ticket);
                  }}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            /* Read-only Details */
            <>
              {/* Client info */}
              <DetailCard title="Informations client">
                <DetailRow label="Nom" value={ticket.client_name} />
                <DetailRow label="Téléphone" value={ticket.client_phone} />
                <DetailRow label="Email" value={ticket.client_email || "—"} />
              </DetailCard>

              {/* Hardware info */}
              <DetailCard title="Matériel">
                <DetailRow
                  label="Catégorie"
                  value={
                    <span className="flex items-center gap-2">
                      <Icon
                        name={CATEGORY_ICONS[ticket.hardware_category]}
                        className="w-5 h-5 text-slate-600"
                      />
                      <span>{CATEGORY_LABELS[ticket.hardware_category]}</span>
                    </span>
                  }
                />
                <DetailRow label="Marque" value={ticket.brand || "—"} />
                <DetailRow label="Modèle" value={ticket.model || "—"} />
                <DetailRow
                  label="N° de série"
                  value={ticket.serial_number || "—"}
                />
                <DetailRow label="Emplacement" value={ticket.location || "—"} />
              </DetailCard>

              {/* Problem / Notes */}
              <DetailCard title="Problème & Notes">
                <DetailRow
                  label="Description"
                  value={ticket.problem_description}
                />
                <DetailRow
                  label="Diagnostic"
                  value={ticket.diagnostic_notes || "—"}
                />
                <DetailRow
                  label="Notes technicien"
                  value={ticket.technician_notes || "—"}
                />
              </DetailCard>

              {/* Costs & Dates */}
              <DetailCard title="Coûts & Dates">
                <DetailRow
                  label="Coût estimé"
                  value={formatCurrency(ticket.estimated_cost)}
                />
                <DetailRow
                  label="Coût final"
                  value={formatCurrency(ticket.final_cost)}
                />
                <DetailRow
                  label="Créé le"
                  value={formatDate(ticket.created_at)}
                />
                <DetailRow
                  label="Mis à jour"
                  value={formatDate(ticket.updated_at)}
                />
                {ticket.delivered_at && (
                  <DetailRow
                    label="Livré le"
                    value={formatDate(ticket.delivered_at)}
                  />
                )}
              </DetailCard>
            </>
          )}
        </div>

        {/* Right column: QR + History */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              QR Code
            </h3>
            <QRCodeDisplay ticketId={ticket.ticket_id} size={140} />
            <p className="text-xs text-gray-400 mt-3 text-center">
              Le client peut scanner ce code pour suivre sa réparation
            </p>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Historique
            </h3>
            {ticket.history && ticket.history.length > 0 ? (
              <div className="space-y-3">
                {ticket.history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5" />
                      {i < ticket.history.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {h.old_status && (
                          <>
                            <span className="text-xs text-gray-400">
                              {STATUS_LABELS[h.old_status] || h.old_status}
                            </span>
                            <span className="text-xs text-gray-300">→</span>
                          </>
                        )}
                        <StatusBadge status={h.new_status} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(h.changed_at)}
                      </p>
                      {h.notes && (
                        <p className="text-xs text-gray-500 mt-1">{h.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                Aucun historique
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-sm font-medium text-gray-500 sm:w-32 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-900 flex-1 whitespace-pre-wrap">
        {value}
      </span>
    </div>
  );
}
