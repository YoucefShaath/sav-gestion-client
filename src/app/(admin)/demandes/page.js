"use client";

import { useEffect, useState, useCallback } from "react";
import { getDemandes, deleteDemande } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { useToast, useConfirm } from "@/components/ToastProvider";

export default function DemandesPageWrapper() {
  return <DemandesPage />;
}

function DemandesPage() {
  const [type, setType] = useState("achat");
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const showToast = useToast();
  const confirm = useConfirm();

  async function handleCopy(text, label = "Texte") {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      showToast({
        type: "success",
        message: `${label} copié${label ? "" : ""}`,
      });
    } catch (err) {
      showToast({
        type: "error",
        message: `Impossible de copier ${label.toLowerCase()}`,
      });
    }
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDemandes({ type, page, limit: 50 });
      setDemandes(data.data || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  }, [type, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (
      !(await confirm({
        title: "Supprimer la demande",
        message: `Supprimer la demande #${id} ?`,
        confirmText: "Supprimer",
        cancelText: "Annuler",
        danger: true,
      }))
    )
      return;
    try {
      await deleteDemande(id);
      showToast({ type: "success", message: "Demande supprimée." });
      load();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Erreur" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Demandes d'achat / prestations
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setType("achat");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${type === "achat" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
          >
            Demande d'achat
          </button>
          <button
            onClick={() => {
              setType("prestation");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${type === "prestation" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
          >
            Prestation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {total} demande{total !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : demandes.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Aucune demande"
          message={`Aucune demande de type ${type === "achat" ? "d'achat" : "prestation"} pour le moment.`}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Urgence
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demandes.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-gray-700">{d.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium text-gray-900">
                      {d.company_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {d.contact_email}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">
                    {d.contact_phone}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 capitalize">
                    {d.urgency || "normal"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 truncate max-w-[40ch]">
                    {d.description}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopy(d.description, "Description")}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700"
                        title="Copier la description"
                      >
                        Copier
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="px-2 py-1 text-xs bg-red-50 rounded-md text-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
