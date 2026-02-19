<?php
// Minimal invoice HTML renderer (port of renderInvoiceHtml)
require_once __DIR__ . '/utils.php';

function render_invoice_html($ticket, $baseUrl = null) {
    $invoiceNumber = 'FAC-' . str_replace('SAV-', '', ($ticket['ticket_id'] ?? ''));
    $today = date('d F Y');
    $estimatedCost = floatval($ticket['estimated_cost'] ?? 0);
    $finalCost = floatval($ticket['final_cost'] ?? 0);
    $total = $finalCost ?: $estimatedCost ?: 0;
    $tva = $total * 0.19;
    $totalTTC = $total + $tva;
    $logoUrl = ($baseUrl ? rtrim($baseUrl, '/') : '') . '/logo.jpg';

    $clientName = htmlspecialchars($ticket['client_name'] ?? '-', ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($ticket['client_phone'] ?? '-', ENT_QUOTES, 'UTF-8');
    $email = $ticket['client_email'] ? '<div style="color:#6b7280;margin-top:4px">' . htmlspecialchars($ticket['client_email'], ENT_QUOTES, 'UTF-8') . '</div>' : '';
    $problem = nl2br(htmlspecialchars($ticket['problem_description'] ?? '-', ENT_QUOTES, 'UTF-8'));
    $diagnostic = $ticket['diagnostic_notes'] ? '<div style="margin-top:8px;color:#9ca3af">Diagnostic: ' . htmlspecialchars($ticket['diagnostic_notes'], ENT_QUOTES, 'UTF-8') . '</div>' : '';

    ob_start();
    ?>
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Facture <?php echo $invoiceNumber;?></title>
        <style>body{font-family:Arial,Helvetica,sans-serif;color:#111827;background:#fff}.invoice{max-width:800px;margin:0 auto;padding:28px}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;border-bottom:3px solid #1e40af;padding-bottom:12px}.company{font-size:12px;color:#6b7280}h1{color:#1e40af;margin:0;font-size:28px}</style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div style="display:flex;gap:16px;align-items:center">
              <img src="<?php echo $logoUrl;?>" alt="logo" style="height:80px;object-fit:contain" />
              <div class="company"><strong style="color:#111827;display:block">Informatica Company</strong>12, chemin Sidi Yahia, locale 14<br/>Bir Mourad Raïs, Alger<br/>0793 27 23 79<br/>contact@informaticacompany.com</div>
            </div>
            <div style="text-align:right"><h1>FACTURE</h1><div style="color:#6b7280;margin-top:6px"><?php echo $invoiceNumber;?></div><div style="color:#9ca3af;margin-top:4px">Date : <?php echo date('d/m/Y');?></div></div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px">
            <div style="background:#f9fafb;border-radius:8px;padding:12px"><strong>Client</strong><div style="margin-top:6px"><?php echo $clientName;?></div><div style="color:#6b7280;margin-top:4px"><?php echo $phone;?></div><?php echo $email;?></div>
            <div style="background:#f9fafb;border-radius:8px;padding:12px"><strong>Informations ticket</strong><div style="margin-top:8px">N° Ticket: <strong><?php echo htmlspecialchars($ticket['ticket_id'] ?? '-', ENT_QUOTES, 'UTF-8');?></strong></div><div>Date création: <?php echo formatDate($ticket['created_at'] ?? null);?></div><div>Priorité: <?php echo htmlspecialchars($ticket['priority'] ?? '-', ENT_QUOTES, 'UTF-8');?></div></div>
          </div>

          <div><div style="font-size:11px;color:#1e40af;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Détails de la prestation</div>
            <table style="width:100%;border-collapse:collapse;margin-top:8px"><thead><tr><th style="background:#1e40af;color:#fff;padding:8px 10px;font-size:11px;text-transform:uppercase">Description</th><th style="background:#1e40af;color:#fff;padding:8px 10px;font-size:11px;text-transform:uppercase">Matériel</th><th style="background:#1e40af;color:#fff;padding:8px 10px;font-size:11px;text-transform:uppercase;text-align:right">Montant HT</th></tr></thead><tbody><tr><td style="vertical-align:top"><div style="font-weight:600;margin-bottom:6px">Réparation / Maintenance</div><div style="color:#6b7280"><?php echo $problem;?></div><?php echo $diagnostic;?></td><td style="vertical-align:top"><div><?php echo htmlspecialchars($ticket['hardware_category'] ?? '-', ENT_QUOTES, 'UTF-8');?></div><div style="color:#6b7280"><?php echo trim(($ticket['brand'] ?? '') . ' ' . ($ticket['model'] ?? '')) ?: '—';?></div><?php if (!empty($ticket['serial_number'])) echo '<div style="color:#9ca3af;margin-top:6px">S/N: ' . htmlspecialchars($ticket['serial_number'], ENT_QUOTES, 'UTF-8') . '</div>'?></td><td style="text-align:right;vertical-align:top;font-weight:600"><?php echo $total > 0 ? number_format($total, 0, ',', ' ') . ' DA' : '—';?></td></tr></tbody></table></div>

          <?php if ($total > 0): ?>
            <div style="display:flex;justify-content:flex-end;margin-top:12px"><div style="width:260px"><div style="display:flex;justify-content:space-between;padding:8px 0;color:#374151"><span>Total HT</span><span><?php echo number_format($total, 0, ',', ' ') . ' DA';?></span></div><div style="display:flex;justify-content:space-between;padding:8px 0;color:#374151"><span>TVA (19%)</span><span><?php echo number_format($tva, 2, ',', ' ') . ' DA';?></span></div><div style="display:flex;justify-content:space-between;padding:8px 0;color:#1e40af;font-weight:800;border-top:2px solid #1e40af;padding-top:10px"><span>Total TTC</span><span><?php echo number_format($totalTTC, 2, ',', ' ') . ' DA';?></span></div></div></div>
          <?php endif; ?>

          <?php if (!empty($ticket['technician_notes'])): ?><div style="background:#eff6ff;border-radius:8px;padding:12px;margin-top:12px;color:#1e40af"><strong>Notes :</strong> <?php echo htmlspecialchars($ticket['technician_notes'], ENT_QUOTES, 'UTF-8');?></div><?php endif; ?>

          <div style="margin-top:24px;color:#9ca3af;font-size:12px;text-align:center">Informatica Company — 12, chemin Sidi Yahia, locale 14 — contact@informaticacompany.com</div>
        </div>
      </body>
    </html>
    <?php
    return ob_get_clean();
}
