<?php
/**
 * Dashboard Stats API
 * GET /stats.php → Returns aggregate counts for the dashboard
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/Database.php';

$pdo = Database::getInstance()->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Méthode non supportée.'], 405);
}

// Status counts
$stmt = $pdo->query("SELECT status, COUNT(*) as count FROM tickets GROUP BY status");
$statusCounts = [];
while ($row = $stmt->fetch()) {
    $statusCounts[$row['status']] = (int)$row['count'];
}

// Fill missing statuses with 0
foreach (['Received', 'Diagnostic', 'In Progress', 'Completed', 'Delivered'] as $s) {
    $statusCounts[$s] = $statusCounts[$s] ?? 0;
}

// Total active
$total = array_sum($statusCounts);

// Category distribution
$stmt = $pdo->query("SELECT hardware_category, COUNT(*) as count FROM tickets GROUP BY hardware_category ORDER BY count DESC");
$categories = $stmt->fetchAll();

// Priority distribution
$stmt = $pdo->query("SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority");
$priorities = [];
while ($row = $stmt->fetch()) {
    $priorities[$row['priority']] = (int)$row['count'];
}

// Recent tickets (last 5)
$stmt = $pdo->query("SELECT ticket_id, client_name, hardware_category, status, priority, created_at FROM tickets ORDER BY created_at DESC LIMIT 5");
$recent = $stmt->fetchAll();

// Total archived
$stmt = $pdo->query("SELECT COUNT(*) as count FROM archives");
$archived = (int)$stmt->fetch()['count'];

// Today's tickets
$stmt = $pdo->prepare("SELECT COUNT(*) as count FROM tickets WHERE DATE(created_at) = CURDATE()");
$stmt->execute();
$today = (int)$stmt->fetch()['count'];

jsonResponse([
    'total_active'  => $total,
    'today'         => $today,
    'total_archived' => $archived,
    'by_status'     => $statusCounts,
    'by_category'   => $categories,
    'by_priority'   => $priorities,
    'recent'        => $recent,
]);
