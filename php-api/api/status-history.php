<?php
// php-api/api/status-history.php
require_once __DIR__ . '/../src/db.php';
header('Content-Type: application/json; charset=utf-8');
$pdo = db_get_pdo();
$ticketId = $_GET['ticket_id'] ?? null;
if (!$ticketId) { http_response_code(400); echo json_encode(['error'=>'ID ticket requis.']); exit; }
$stmt = $pdo->prepare('SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC');
$stmt->execute([$ticketId]);
$rows = $stmt->fetchAll();
echo json_encode($rows);
