<?php
/**
 * Public Ticket Status Lookup (no auth required)
 * GET /status.php?id=SAV-... → Returns minimal status info for QR code scans
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/Database.php';

$pdo = Database::getInstance()->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Méthode non supportée.'], 405);
}

$ticketId = $_GET['id'] ?? null;
if (!$ticketId) {
    jsonResponse(['error' => 'ID ticket requis.'], 400);
}

// Check active tickets
$stmt = $pdo->prepare("SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, updated_at, estimated_cost FROM tickets WHERE ticket_id = :id");
$stmt->execute([':id' => $ticketId]);
$ticket = $stmt->fetch();

if (!$ticket) {
    // Check archives
    $stmt = $pdo->prepare("SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, delivered_at, final_cost, archived_at FROM archives WHERE ticket_id = :id");
    $stmt->execute([':id' => $ticketId]);
    $ticket = $stmt->fetch();

    if (!$ticket) {
        jsonResponse(['error' => 'Ticket introuvable.'], 404);
    }
    $ticket['archived'] = true;
} else {
    $ticket['archived'] = false;
}

// Fetch status history
$hist = $pdo->prepare("SELECT new_status, changed_at FROM status_history WHERE ticket_id = :id ORDER BY changed_at ASC");
$hist->execute([':id' => $ticketId]);
$ticket['history'] = $hist->fetchAll();

jsonResponse($ticket);
