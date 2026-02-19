<?php
// php-api/api/tickets.php
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../src/utils.php';
require_once __DIR__ . '/../src/invoice.php';
require_once __DIR__ . '/../src/mail.php';

header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD'];
$pdo = db_get_pdo();

function json_ok($v) { echo json_encode($v); exit; }
function json_err($msg, $status = 400) { http_response_code($status); echo json_encode(['error'=>$msg]); exit; }

// Parse raw body for non-form requests
$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?: [];

// Helper to fetch query param
function q($k, $default=null) { return $_GET[$k] ?? $default; }

if ($method === 'GET') {
    $id = q('id');
    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM tickets WHERE ticket_id = ?');
        $stmt->execute([$id]);
        $ticket = $stmt->fetch();
        if (!$ticket) json_err('Ticket introuvable.', 404);
        $h = $pdo->prepare('SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC');
        $h->execute([$id]);
        $ticket['history'] = $h->fetchAll();
        json_ok($ticket);
    }

    // list with filters
    $status = q('status');
    $category = q('category');
    $priority = q('priority');
    $search = q('search');
    $page = max(1, intval(q('page', 1)));
    $limit = min(100, intval(q('limit', 50)));
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];
    if ($status) { $where[] = 'status = ?'; $params[] = $status; }
    if ($category) { $where[] = 'hardware_category = ?'; $params[] = $category; }
    if ($priority) { $where[] = 'priority = ?'; $params[] = $priority; }
    if ($search) {
        $where[] = '(client_name LIKE ? OR client_phone LIKE ? OR ticket_id LIKE ?)';
        $s = "%$search%";
        $params[] = $s; $params[] = $s; $params[] = $s;
    }
    $sql = 'SELECT * FROM tickets';
    if (count($where)) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= " ORDER BY FIELD(priority, 'Urgent','High','Normal','Low'), created_at DESC";

    // count
    $countSql = preg_replace('/SELECT \*/i', 'SELECT COUNT(*) as total', $sql, 1);
    $stmt = $pdo->prepare($countSql);
    $stmt->execute($params);
    $total = intval($stmt->fetchColumn());

    $sql .= ' LIMIT ? OFFSET ?';
    $params[] = $limit; $params[] = $offset;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    json_ok(['data'=>$rows,'total'=>$total,'page'=>$page,'limit'=>$limit,'pages'=>ceil($total/$limit)]);
}

if ($method === 'POST') {
    $data = $body;
    $client_name = trim($data['client_name'] ?? '');
    $client_phone = trim($data['client_phone'] ?? '');
    $client_email = trim($data['client_email'] ?? '');
    $hardware_category = trim($data['hardware_category'] ?? '');
    $brand = trim($data['brand'] ?? '');
    $model = trim($data['model'] ?? '');
    $reference = trim($data['reference'] ?? '');
    $serial_number = trim($data['serial_number'] ?? '');
    $problem_description = trim($data['problem_description'] ?? '');
    $priority = $data['priority'] ?? 'Normal';
    $location = $data['location'] ?? 'Reception';

    $errors = [];
    if ($client_name === '') $errors[] = 'client_name';
    if ($client_phone === '') $errors[] = 'client_phone';
    if ($hardware_category === '') $errors[] = 'hardware_category';
    if ($brand === '') $errors[] = 'brand';
    if ($problem_description === '') $errors[] = 'problem_description';
    if (count($errors)) json_err(['errors'=>$errors,'error'=>'Champs obligatoires manquants.'], 422);

    // validate phone
    if (!validatePhone($client_phone)) json_err('Numéro de téléphone invalide.', 422);

    try {
        // Generate ticket id SAV-YYMMDD-XXXX
        $prefix = 'SAV-' . date('ymd') . '-';
        $stmt = $pdo->prepare("SELECT ticket_id FROM tickets WHERE ticket_id LIKE ? ORDER BY id DESC LIMIT 1");
        $stmt->execute([$prefix . '%']);
        $last = $stmt->fetchColumn();
        $seq = 1;
        if ($last) {
            $n = intval(substr($last, -4));
            if ($n) $seq = $n + 1;
        }
        $ticketId = $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);

        $ins = $pdo->prepare("INSERT INTO tickets (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, status, location, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Received', ?, ?, NOW(), NOW())");
        $ins->execute([$ticketId, $client_name, $client_phone, $client_email ?: null, $hardware_category, $brand, $model ?: null, $serial_number ?: null, $problem_description, $location ?: null, $priority ?: 'Normal']);

        $pdo->prepare("INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, 'Received', NOW())")->execute([$ticketId]);

        $stmt = $pdo->prepare('SELECT * FROM tickets WHERE ticket_id = ?');
        $stmt->execute([$ticketId]);
        $ticket = $stmt->fetch();
        $h = $pdo->prepare('SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC');
        $h->execute([$ticketId]);
        $ticket['history'] = $h->fetchAll();
        json_ok($ticket);
    } catch (Exception $e) {
        json_err('Erreur lors de la création du ticket.', 500);
    }
}

if ($method === 'PATCH') {
    // Update status (expects ?id=... and { status: '...' })
    $id = q('id');
    if (!$id) json_err('ID requis', 400);
    $data = $body;
    $newStatus = $data['status'] ?? null;
    if (!$newStatus) json_err('Nouveau statut requis', 400);

    // Normalize mapping (accept French labels) - simple mapping using $STATUS_LABELS
    global $STATUS_LABELS;
    $invert = array_flip($STATUS_LABELS);
    $canonical = $newStatus;
    if (!isset(TRANSITIONS[$canonical])) {
        if (isset($invert[$newStatus])) $canonical = $invert[$newStatus];
    }

    try {
        $stmt = $pdo->prepare('SELECT status FROM tickets WHERE ticket_id = ?');
        $stmt->execute([$id]);
        $current = $stmt->fetchColumn();
        if (!$current) json_err('Ticket introuvable.', 404);
        $currentCanonical = $current;

        if (!isset(TRANSITIONS[$currentCanonical]) || !in_array($canonical, TRANSITIONS[$currentCanonical])) {
            json_err("Transition invalide: {$current} → {$newStatus}", 400);
        }

        $pdo->beginTransaction();
        $pdo->prepare('UPDATE tickets SET status = ?, updated_at = NOW() WHERE ticket_id = ?')->execute([$canonical, $id]);
        $pdo->prepare('INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, ?, NOW())')->execute([$id, $canonical]);
        $pdo->commit();

        $stmt = $pdo->prepare('SELECT * FROM tickets WHERE ticket_id = ?');
        $stmt->execute([$id]);
        $ticket = $stmt->fetch();
        $h = $pdo->prepare('SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC');
        $h->execute([$id]);
        $ticket['history'] = $h->fetchAll();

        // If moved to Completed, send email (non-blocking)
        if ($canonical === 'Completed' && !empty($ticket['client_email']) && getenv('EMAIL_ON_COMPLETED') !== 'false') {
            try {
                $origin = getenv('APP_URL') ?: 'http://localhost:3000';
                $trackUrl = rtrim($origin, '/') . '/track/' . $ticket['ticket_id'];
                $subject = "Votre réparation (" . $ticket['ticket_id'] . ") est prête";
                $invoiceHtml = render_invoice_html($ticket, $origin);
                $preamble = "<p>Bonjour " . htmlspecialchars($ticket['client_name'] ?: 'client', ENT_QUOTES, 'UTF-8') . ",</p><p>Votre appareil pris en charge sous le numéro <strong>" . $ticket['ticket_id'] . "</strong> est désormais <strong>terminé</strong>. Vous trouverez ci-dessous la facture correspondante et vous pouvez également la consulter en ligne : <a href=\"$trackUrl\">$trackUrl</a></p>";
                $combined = $preamble . $invoiceHtml;
                send_mail_html($ticket['client_email'], $subject, $combined);
            } catch (Exception $e) { /* ignore */ }
        }

        json_ok($ticket);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        json_err('Erreur interne', 500);
    }
}

if ($method === 'DELETE') {
    $id = q('id');
    if (!$id) json_err('ID requis', 400);
    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('SELECT ticket_id FROM tickets WHERE ticket_id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetchColumn()) { $pdo->rollBack(); json_err('Ticket introuvable.', 404); }
        $pdo->prepare('DELETE FROM status_history WHERE ticket_id = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM tickets WHERE ticket_id = ?')->execute([$id]);
        $pdo->commit();
        json_ok(['success'=>true]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        json_err('Erreur lors de la suppression.', 500);
    }
}

http_response_code(405);
echo json_encode(['error'=>'Method not allowed']);
