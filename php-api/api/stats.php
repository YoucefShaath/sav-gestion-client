<?php
// php-api/api/stats.php
require_once __DIR__ . '/../src/db.php';
header('Content-Type: application/json; charset=utf-8');
$pdo = db_get_pdo();

$stmt = $pdo->query("SELECT status, COUNT(*) as count FROM tickets GROUP BY status");
$statusRows = $stmt->fetchAll();
$statusCounts = [];
foreach ($statusRows as $r) $statusCounts[$r['status']] = intval($r['count']);
foreach (['Received','Diagnostic','In Progress','Completed','Delivered'] as $s) if (!isset($statusCounts[$s])) $statusCounts[$s] = 0;
$total = array_sum(array_values($statusCounts));

$categories = $pdo->query("SELECT hardware_category, COUNT(*) as count FROM tickets GROUP BY hardware_category ORDER BY count DESC")->fetchAll();
$priorityRows = $pdo->query("SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority")->fetchAll();
$priorities = [];
foreach ($priorityRows as $r) $priorities[$r['priority']] = intval($r['count']);
$recent = $pdo->query("SELECT ticket_id, client_name, hardware_category, status, priority, created_at FROM tickets ORDER BY created_at DESC LIMIT 5")->fetchAll();
$archived = intval($pdo->query("SELECT COUNT(*) as count FROM archives")->fetchColumn());
$today = intval($pdo->query("SELECT COUNT(*) as count FROM tickets WHERE DATE(created_at) = CURDATE()")->fetchColumn());

echo json_encode(['total_active'=>$total,'today'=>$today,'total_archived'=>$archived,'by_status'=>$statusCounts,'by_category'=>$categories,'by_priority'=>$priorities,'recent'=>$recent]);
