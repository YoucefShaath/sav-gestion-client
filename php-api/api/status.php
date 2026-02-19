<?php
// php-api/api/status.php
require_once __DIR__ . '/../src/db.php';
require_once __DIR__ . '/../src/utils.php';
header('Content-Type: application/json; charset=utf-8');
$pdo = db_get_pdo();
$ticketId = $_GET['id'] ?? null;
if (!$ticketId) { http_response_code(400); echo json_encode(['error'=>'ID ticket requis.']); exit; }

// Check active tickets
$stmt = $pdo->prepare('SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, updated_at, estimated_cost FROM tickets WHERE ticket_id = ?');
$stmt->execute([$ticketId]);
$ticket = $stmt->fetch();
if (!$ticket) {
    $stmt = $pdo->prepare('SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, delivered_at, final_cost, archived_at FROM archives WHERE ticket_id = ?');
    $stmt->execute([$ticketId]);
    $ticket = $stmt->fetch();
    if (!$ticket) { http_response_code(404); echo json_encode(['error'=>'Ticket introuvable.']); exit; }
    $ticket['archived'] = true;
} else {
    $ticket['archived'] = false;
}
$h = $pdo->prepare('SELECT new_status, changed_at FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC');
$h->execute([$ticketId]);
$ticket['history'] = $h->fetchAll();

echo json_encode($ticket);
