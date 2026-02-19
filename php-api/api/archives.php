<?php
// php-api/api/archives.php
require_once __DIR__ . '/../src/db.php';
header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD'];
$pdo = db_get_pdo();
function json_ok($v) { echo json_encode($v); exit; }
function json_err($m,$s=400){ http_response_code($s); echo json_encode(['error'=>$m]); exit; }

if ($method === 'GET') {
    $ticketId = $_GET['id'] ?? null;
    $category = $_GET['category'] ?? null;
    $search = $_GET['search'] ?? null;
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, intval($_GET['limit'] ?? 50));
    $offset = ($page - 1) * $limit;

    if ($ticketId) {
        $stmt = $pdo->prepare('SELECT * FROM archives WHERE ticket_id = ?');
        $stmt->execute([$ticketId]);
        $row = $stmt->fetch();
        if (!$row) json_err('Archive introuvable.', 404);
        json_ok($row);
    }

    $where = [];
    $params = [];
    if ($category) { $where[] = 'hardware_category = ?'; $params[] = $category; }
    if ($search) { $where[] = '(client_name LIKE ? OR client_phone LIKE ? OR ticket_id LIKE ?)'; $s = "%$search%"; $params[] = $s; $params[] = $s; $params[] = $s; }
    $sql = 'SELECT * FROM archives';
    if (count($where)) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY archived_at DESC';

    $countSql = preg_replace('/SELECT \*/i', 'SELECT COUNT(*) as total', $sql, 1);
    $stmt = $pdo->prepare($countSql);
    $stmt->execute($params);
    $total = intval($stmt->fetchColumn());

    $sql .= ' LIMIT ? OFFSET ?'; $params[] = $limit; $params[] = $offset;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    json_ok(['data'=>$rows,'total'=>$total,'page'=>$page,'limit'=>$limit,'pages'=>ceil($total/$limit)]);
}

if ($method === 'POST') {
    $ticketId = $_GET['id'] ?? null;
    if (!$ticketId) json_err('ID requis', 400);
    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('SELECT * FROM tickets WHERE ticket_id = ?');
        $stmt->execute([$ticketId]);
        $ticket = $stmt->fetch();
        if (!$ticket) { $pdo->rollBack(); json_err('Ticket introuvable.', 404); }
        if ($ticket['status'] !== 'Delivered') { $pdo->rollBack(); json_err("Seuls les tickets 'Delivered' peuvent être archivés.", 400); }

        $ins = $pdo->prepare('INSERT INTO archives (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at, archived_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())');
        $ins->execute([
            $ticket['ticket_id'],$ticket['client_name'],$ticket['client_phone'],$ticket['client_email'],$ticket['hardware_category'],$ticket['brand'],$ticket['model'],$ticket['serial_number'],$ticket['problem_description'],$ticket['diagnostic_notes'],$ticket['technician_notes'],$ticket['status'],$ticket['location'],$ticket['estimated_cost'],$ticket['final_cost'],$ticket['priority'],$ticket['created_at'],$ticket['updated_at'],$ticket['delivered_at']
        ]);
        $pdo->prepare('DELETE FROM tickets WHERE ticket_id = ?')->execute([$ticketId]);
        $pdo->commit();
        json_ok(['success'=>true]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        json_err('Erreur lors de l\'archivage.', 500);
    }
}

http_response_code(405); echo json_encode(['error'=>'Method not allowed']);
