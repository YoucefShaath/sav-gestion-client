import { formatDate, CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/utils";

// Render a self-contained invoice HTML string for use in emails/attachments.
export function renderInvoiceHtml(
  ticket,
  baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:3000`,
  logoSrc, // optional override (e.g. `cid:logo@informaticacompany.com`)
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

  const logo = logoSrc || `${baseUrl.replace(/\/$/, "")}/logo.jpg`;
  const categoryLabel =
    CATEGORY_LABELS[ticket.hardware_category] ||
    ticket.hardware_category ||
    "-";

  return `
  <!doctype html>
  <html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Facture ${invoiceNumber}</title>
  </head>
  <body style="font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color:#1f2937; background:#fff;">
    <div style="max-width:820px;margin:0 auto;padding:28px;">
      <!-- Header -->
      <table width="100%" style="border-collapse:collapse;margin-bottom:18px;">
        <tr>
          <td style="vertical-align:top;width:240px;">
            <img src="${logo}" alt="logo" style="height:96px;object-fit:contain;display:block;margin-bottom:8px" />
            <div style="font-size:12px;color:#6b7280;line-height:1.4">
              <strong style="color:#111827;display:block">Informatica Company</strong>
              12, chemin Sidi Yahia, locale 14<br/>Bir Mourad Raïs, Alger, Algérie<br/>0793 27 23 79<br/><a href="mailto:contact@informaticacompany.com" style="color:#6b7280;text-decoration:none">contact@informaticacompany.com</a>
            </div>
          </td>
          <td style="vertical-align:top;text-align:right;padding-left:18px;">
            <div style="text-align:right;color:#1e3a8a;font-weight:800;font-size:36px;letter-spacing:2px">FACTURE</div>
            <div style="margin-top:8px;color:#6b7280;font-size:12px">${invoiceNumber}</div>
            <div style="color:#6b7280;font-size:12px">Date : ${today}</div>
          </td>
        </tr>
      </table>

      <!-- Blue divider -->
      <div style="height:4px;background:#1e40af;border-radius:2px;margin-bottom:20px"></div>

      <!-- Info boxes -->
      <table width="100%" style="border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="background:#f8fafc;border-radius:8px;padding:18px;vertical-align:top;width:50%;padding-right:12px;">
            <div style="font-size:11px;color:#1e3a8a;font-weight:700;margin-bottom:10px;letter-spacing:1px;text-transform:uppercase">Client</div>
            <div style="font-weight:700;color:#111827">${ticket.client_name || "—"}</div>
            <div style="margin-top:6px;color:#6b7280">${ticket.client_phone || "—"}</div>
            <div style="color:#6b7280">${ticket.client_email || ""}</div>
          </td>
          <td style="background:#f8fafc;border-radius:8px;padding:18px;vertical-align:top;width:50%;padding-left:12px;">
            <div style="font-size:11px;color:#1e3a8a;font-weight:700;margin-bottom:10px;letter-spacing:1px;text-transform:uppercase">Informations ticket</div>
            <div style="display:flex;justify-content:space-between;gap:12px;color:#6b7280;font-size:13px">
              <div style="min-width:120px">N° Ticket<br/><strong style="color:#111827">${ticket.ticket_id}</strong></div>
              <div style="min-width:120px">Date création<br/><strong style="color:#111827">${formatDate(ticket.created_at)}</strong></div>
              <div style="min-width:90px">Priorité<br/><strong style="color:#111827">${ticket.priority ? PRIORITY_LABELS?.[ticket.priority] || ticket.priority : "—"}</strong></div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Section title -->
      <div style="color:#1e40af;font-weight:700;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase;font-size:12px">Détails de la prestation</div>

      <!-- Invoice table -->
      <table width="100%" style="border-collapse:collapse;margin-bottom:26px;">
        <thead>
          <tr>
            <th style="background:#1e40af;color:#fff;padding:10px 12px;text-align:left;font-weight:700;font-size:13px;border-top-left-radius:6px">Description</th>
            <th style="background:#1e40af;color:#fff;padding:10px 12px;text-align:left;font-weight:700;font-size:13px">Matériel</th>
            <th style="background:#1e40af;color:#fff;padding:10px 12px;text-align:right;font-weight:700;font-size:13px;border-top-right-radius:6px">Montant HT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:18px 12px;border-bottom:1px solid #eef2ff;vertical-align:top">
              <div style="display:flex;gap:12px;align-items:flex-start">
                <div style="font-size:20px;color:#0ea5a4;line-height:1">💻</div>
                <div>
                  <div style="font-weight:700;color:#111827">Réparation / Maintenance</div>
                  <div style="color:#6b7280;margin-top:6px">${ticket.problem_description || "—"}</div>
                </div>
              </div>
            </td>
            <td style="padding:18px 12px;border-bottom:1px solid #eef2ff;vertical-align:top">
              <div style="font-weight:700;color:#111827">${CATEGORY_LABELS[ticket.hardware_category] || ticket.hardware_category || "—"}</div>
              <div style="color:#6b7280;margin-top:6px">${ticket.brand || ""}${ticket.model ? " — " + ticket.model : ""}</div>
              <div style="color:#9ca3af;margin-top:8px;font-size:12px">S/N: ${ticket.serial_number || "—"}</div>
            </td>
            <td style="padding:18px 12px;border-bottom:1px solid #eef2ff;vertical-align:top;text-align:right;font-weight:700">
              ${total ? new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", minimumFractionDigits: 0 }).format(total) : "—"}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Signatures -->
      <table width="100%" style="border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:24px 12px;vertical-align:top;width:50%;text-align:left;color:#9ca3af;font-size:12px">
            ___________________________<br/>
            Cachet et signature de l'entreprise
          </td>
          <td style="padding:24px 12px;vertical-align:top;width:50%;text-align:right;color:#9ca3af;font-size:12px">
            ___________________________<br/>
            Signature du client
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <div style="border-top:1px solid #eef2ff;padding-top:14px;color:#9ca3af;font-size:12px;text-align:center">
        Informatica Company — 12, chemin Sidi Yahia, locale 14, Bir Mourad Raïs, Alger, Algérie<br/>
        0793 27 23 79 — contact@informaticacompany.com<br/>
        Merci pour votre confiance !
      </div>
    </div>
  </body>
  </html>
  `;
}
