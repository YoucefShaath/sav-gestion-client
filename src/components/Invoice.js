"use client";

import { useRef } from "react";
import {
  formatDate,
  formatCurrency,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
} from "@/lib/utils";
import Icon from "@/components/Icons";

/**
 * Professional Invoice Component
 * Renders a printable invoice for a ticket.
 */
export default function Invoice({ ticket, onClose }) {
  const invoiceRef = useRef(null);

  function handlePrint() {
    const content = invoiceRef.current;
    const win = window.open("", "_blank", "width=800,height=1000");
    win.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Facture ${ticket.ticket_id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: white; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
          .invoice { max-width: 800px; margin: 0 auto; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #1e40af; }
          .logo-section { display: flex; align-items: center; gap: 16px; }
          .logo-section img { height: 100px; width: auto; object-fit: contain; }
          .company-info { font-size: 11px; color: #6b7280; line-height: 1.6; }
          .invoice-title { text-align: right; }
          .invoice-title h1 { font-size: 28px; color: #1e40af; font-weight: 800; letter-spacing: 2px; }
          .invoice-title .invoice-num { font-size: 13px; color: #6b7280; margin-top: 4px; }
          .invoice-title .invoice-date { font-size: 12px; color: #9ca3af; margin-top: 2px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 11px; font-weight: 700; color: #1e40af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .info-box { background: #f9fafb; border-radius: 8px; padding: 16px; }
          .info-box h3 { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .info-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
          .info-row .label { color: #6b7280; }
          .info-row .value { font-weight: 600; color: #1a1a1a; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          thead th { background: #1e40af; color: white; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
          thead th:last-child { text-align: right; }
          tbody td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
          tbody td:last-child { text-align: right; font-weight: 600; }
          .totals { margin-top: 16px; display: flex; justify-content: flex-end; }
          .totals-box { width: 280px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
          .total-row .label { color: #6b7280; }
          .total-row .value { font-weight: 600; }
          .total-row.grand { font-size: 16px; font-weight: 800; color: #1e40af; border-bottom: none; border-top: 2px solid #1e40af; padding-top: 12px; margin-top: 4px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; line-height: 1.8; }
          .notes { background: #eff6ff; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 12px; color: #1e40af; line-height: 1.6; }
          .stamp { margin-top: 30px; display: flex; justify-content: space-between; }
          .stamp-box { width: 200px; text-align: center; font-size: 11px; color: #6b7280; }
          .stamp-box .line { border-top: 1px solid #d1d5db; margin-top: 50px; padding-top: 6px; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  }

  const invoiceNumber = `FAC-${ticket.ticket_id?.replace("SAV-", "")}`;
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const estimatedCost = parseFloat(ticket.estimated_cost) || 0;
  const finalCost = parseFloat(ticket.final_cost) || 0;
  const total = finalCost || estimatedCost;
  const tva = total * 0.19;
  const totalTTC = total + tva;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[850px] w-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 no-print">
          <h2 className="text-lg font-bold text-gray-900">
            Aperçu de la facture
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div
          ref={invoiceRef}
          style={{
            padding: "40px",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: "#1a1a1a",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 40,
              paddingBottom: 20,
              borderBottom: "3px solid #1e40af",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img
                src="/logo.jpg"
                alt="Logo"
                style={{ height: 200, width: "auto", objectFit: "contain" }}
              />
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
                <strong
                  style={{ fontSize: 14, color: "#1a1a1a", display: "block" }}
                >
                  Informatica Company
                </strong>
                12, chemin Sidi Yahia, locale 14
                <br />
                Bir Mourad Raïs, Alger, Algérie
                <br />
                0793 27 23 79
                <br />
                contact@informaticacompany.com
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1
                style={{
                  fontSize: 28,
                  color: "#1e40af",
                  fontWeight: 800,
                  letterSpacing: 2,
                }}
              >
                FACTURE
              </h1>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                {invoiceNumber}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                Date : {today}
              </div>
            </div>
          </div>

          {/* Client + Ticket info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div
              style={{ background: "#f9fafb", borderRadius: 8, padding: 16 }}
            >
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Client
              </h3>
              <div style={{ fontSize: 13 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  {ticket.client_name}
                </div>
                <div style={{ color: "#6b7280" }}> {ticket.client_phone}</div>
                {ticket.client_email && (
                  <div style={{ color: "#6b7280" }}>{ticket.client_email}</div>
                )}
              </div>
            </div>
            <div
              style={{ background: "#f9fafb", borderRadius: 8, padding: 16 }}
            >
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Informations ticket
              </h3>
              <div style={{ fontSize: 13 }}>
                <Row l="N° Ticket" v={ticket.ticket_id} />
                <Row l="Date création" v={formatDate(ticket.created_at)} />
                <Row l="Priorité" v={ticket.priority} />
              </div>
            </div>
          </div>

          {/* Service Table */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1e40af",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 12,
                paddingBottom: 6,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Détails de la prestation
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      background: "#1e40af",
                      color: "white",
                      padding: "10px 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      textAlign: "left",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      background: "#1e40af",
                      color: "white",
                      padding: "10px 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      textAlign: "left",
                    }}
                  >
                    Matériel
                  </th>
                  <th
                    style={{
                      background: "#1e40af",
                      color: "white",
                      padding: "10px 14px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      textAlign: "right",
                    }}
                  >
                    Montant HT
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      borderBottom: "1px solid #e5e7eb",
                      verticalAlign: "top",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginRight: 8,
                        }}
                      >
                        <Icon
                          name={CATEGORY_ICONS[ticket.hardware_category]}
                          className="w-5 h-5 text-slate-600"
                        />
                      </span>
                      Réparation / Maintenance
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        lineHeight: 1.5,
                      }}
                    >
                      {ticket.problem_description}
                    </div>
                    {ticket.diagnostic_notes && (
                      <div
                        style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}
                      >
                        Diagnostic : {ticket.diagnostic_notes}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      borderBottom: "1px solid #e5e7eb",
                      verticalAlign: "top",
                    }}
                  >
                    <div>
                      {CATEGORY_LABELS[ticket.hardware_category] ||
                        ticket.hardware_category}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {[ticket.brand, ticket.model].filter(Boolean).join(" ") ||
                        "—"}
                    </div>
                    {ticket.serial_number && (
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        S/N: {ticket.serial_number}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      borderBottom: "1px solid #e5e7eb",
                      textAlign: "right",
                      fontWeight: 600,
                      verticalAlign: "top",
                    }}
                  >
                    {total > 0 ? `${total.toLocaleString("fr-DZ")} DA` : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          {total > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 24,
              }}
            >
              <div style={{ width: 280 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: 13,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>Total HT</span>
                  <span style={{ fontWeight: 600 }}>
                    {total.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: 13,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>TVA (19%)</span>
                  <span style={{ fontWeight: 600 }}>
                    {tva.toLocaleString("fr-DZ", { minimumFractionDigits: 2 })}{" "}
                    DA
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#1e40af",
                    borderTop: "2px solid #1e40af",
                    marginTop: 4,
                  }}
                >
                  <span>Total TTC</span>
                  <span>
                    {totalTTC.toLocaleString("fr-DZ", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    DA
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {ticket.technician_notes && (
            <div
              style={{
                background: "#eff6ff",
                borderRadius: 8,
                padding: 16,
                fontSize: 12,
                color: "#1e40af",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              <strong>Notes :</strong> {ticket.technician_notes}
            </div>
          )}

          {/* Signature */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: 200,
                textAlign: "center",
                fontSize: 11,
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  borderTop: "1px solid #d1d5db",
                  marginTop: 60,
                  paddingTop: 6,
                }}
              >
                Cachet et signature
                <br />
                de l&apos;entreprise
              </div>
            </div>
            <div
              style={{
                width: 200,
                textAlign: "center",
                fontSize: 11,
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  borderTop: "1px solid #d1d5db",
                  marginTop: 60,
                  paddingTop: 6,
                }}
              >
                Signature du client
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 20,
              borderTop: "1px solid #e5e7eb",
              textAlign: "center",
              fontSize: 11,
              color: "#9ca3af",
              lineHeight: 1.8,
            }}
          >
            Informatica Company — 12, chemin Sidi Yahia, locale 14, Bir Mourad
            Raïs, Alger, Algérie
            <br />
            0793 27 23 79 — contact@informaticacompany.com
            <br />
            Merci pour votre confiance !
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ l, v }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "3px 0",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#6b7280" }}>{l}</span>
      <span style={{ fontWeight: 600 }}>{v}</span>
    </div>
  );
}
