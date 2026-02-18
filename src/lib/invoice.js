import { formatDate, CATEGORY_LABELS } from "@/lib/utils";

// Render a self-contained invoice HTML string for use in emails/attachments.
export function renderInvoiceHtml(
  ticket,
  baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:3000`,
) {
  const invoiceNumber = `FAC-${(ticket.ticket_id || "").replace("SAV-", "")}`;
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const estimatedCost = parseFloat(ticket.estimated_cost) || 0;
  const finalCost = parseFloat(ticket.final_cost) || 0;
  const total = finalCost || estimatedCost || 0;
  const tva = total * 0.19;
  const totalTTC = total + tva;

  const logoUrl = `${baseUrl.replace(/\/$/, "")}/logo.jpg`;

  return `<!doctype html>
  <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Facture ${invoiceNumber}</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #111827; background: #fff; }
        .invoice { max-width:800px; margin:0 auto; padding:28px; }
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;border-bottom:3px solid #1e40af;padding-bottom:12px}
        .company{font-size:12px;color:#6b7280}
        h1{color:#1e40af;margin:0;font-size:28px}
        .section{margin-bottom:18px}
        .box{background:#f9fafb;border-radius:8px;padding:12px}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        thead th{background:#1e40af;color:#fff;padding:8px 10px;font-size:11px;text-transform:uppercase}
        tbody td{padding:10px 10px;border-bottom:1px solid #e5e7eb}
        .totals{display:flex;justify-content:flex-end;margin-top:12px}
        .totals-box{width:260px}
        .total-row{display:flex;justify-content:space-between;padding:8px 0;color:#374151}
        .grand{font-weight:800;color:#1e40af;border-top:2px solid #1e40af;padding-top:10px}
        .footer{margin-top:24px;color:#9ca3af;font-size:12px;text-align:center}
        @media print{ .no-print{display:none} }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div style="display:flex;gap:16px;align-items:center">
            <img src="${logoUrl}" alt="logo" style="height:80px;object-fit:contain" />
            <div class="company">
              <strong style="color:#111827;display:block">Informatica Company</strong>
              12, chemin Sidi Yahia, locale 14<br/>Bir Mourad Raïs, Alger<br/>0793 27 23 79<br/>contact@informaticacompany.com
            </div>
          </div>
          <div style="text-align:right">
            <h1>FACTURE</h1>
            <div style="color:#6b7280;margin-top:6px">${invoiceNumber}</div>
            <div style="color:#9ca3af;margin-top:4px">Date : ${today}</div>
          </div>
        </div>

        <div class="section" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px">
          <div class="box">
            <strong>Client</strong>
            <div style="margin-top:6px">${ticket.client_name || "-"}</div>
            <div style="color:#6b7280;margin-top:4px">${ticket.client_phone || "-"}</div>
            ${ticket.client_email ? `<div style="color:#6b7280;margin-top:4px">${ticket.client_email}</div>` : ""}
          </div>
          <div class="box">
            <strong>Informations ticket</strong>
            <div style="margin-top:8px">N° Ticket: <strong>${ticket.ticket_id || "-"}</strong></div>
            <div>Date création: ${formatDate(ticket.created_at)}</div>
            <div>Priorité: ${ticket.priority || "-"}</div>
          </div>
        </div>

        <div class="section">
          <div style="font-size:11px;color:#1e40af;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Détails de la prestation</div>
          <table>
            <thead>
              <tr><th>Description</th><th>Matériel</th><th style="text-align:right">Montant HT</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style="vertical-align:top">
                  <div style="font-weight:600;margin-bottom:6px">Réparation / Maintenance</div>
                  <div style="color:#6b7280">${(ticket.problem_description || "-").replace(/\n/g, "<br/>")}</div>
                  ${ticket.diagnostic_notes ? `<div style="margin-top:8px;color:#9ca3af">Diagnostic: ${ticket.diagnostic_notes}</div>` : ""}
                </td>
                <td style="vertical-align:top">
                  <div>${CATEGORY_LABELS[ticket.hardware_category] || ticket.hardware_category || "-"}</div>
                  <div style="color:#6b7280">${[ticket.brand, ticket.model].filter(Boolean).join(" ") || "—"}</div>
                  ${ticket.serial_number ? `<div style="color:#9ca3af;margin-top:6px">S/N: ${ticket.serial_number}</div>` : ""}
                </td>
                <td style="text-align:right;vertical-align:top;font-weight:600">${total > 0 ? `${total.toLocaleString("fr-DZ")} DA` : "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${
          total > 0
            ? `
          <div class="totals">
            <div class="totals-box">
              <div class="total-row"><span>Total HT</span><span>${total.toLocaleString("fr-DZ")} DA</span></div>
              <div class="total-row"><span>TVA (19%)</span><span>${tva.toLocaleString("fr-DZ", { minimumFractionDigits: 2 })} DA</span></div>
              <div class="total-row grand"><span>Total TTC</span><span>${totalTTC.toLocaleString("fr-DZ", { minimumFractionDigits: 2 })} DA</span></div>
            </div>
          </div>
        `
            : ""
        }

        ${ticket.technician_notes ? `<div style="background:#eff6ff;border-radius:8px;padding:12px;margin-top:12px;color:#1e40af"> <strong>Notes :</strong> ${ticket.technician_notes}</div>` : ""}

        <div class="footer">Informatica Company — 12, chemin Sidi Yahia, locale 14 — contact@informaticacompany.com</div>
      </div>
    </body>
  </html>`;
}
