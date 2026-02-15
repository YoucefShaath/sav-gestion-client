<?php
/**
 * Archives API Endpoint
 * 
 * GET    /archives.php              → List archived tickets
 * POST   /archives.php?id=SAV-...   → Archive a "Delivered" ticket
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/Database.php';

$pdo = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$ticketId = $_GET['id'] ?? null;

switch ($method) {

    case 'GET':
        if ($ticketId) {
            $stmt = $pdo->prepare("SELECT * FROM archives WHERE ticket_id = :id");
            $stmt->execute([':id' => $ticketId]);
            $ticket = $stmt->fetch();
            if (!$ticket) jsonResponse(['error' => 'Archive introuvable.'], 404);
            jsonResponse($ticket);
        }

        // List with optional filters
        $where = [];
        $params = [];

        if (!empty($_GET['category'])) {
            $where[] = "hardware_category = :category";
            $params[':category'] = $_GET['category'];
        }
        if (!empty($_GET['search'])) {
            $where[] = "(client_name LIKE :search OR client_phone LIKE :search2 OR ticket_id LIKE :search3)";
            $s = '%' . $_GET['search'] . '%';
            $params[':search'] = $s;
            $params[':search2'] = $s;
            $params[':search3'] = $s;
        }

        $sql = "SELECT * FROM archives";
        if ($where) $sql .= " WHERE " . implode(" AND ", $where);
        $sql .= " ORDER BY archived_at DESC";

        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        $countSql = str_replace("SELECT *", "SELECT COUNT(*) as total", $sql);
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = (int) $countStmt->fetch()['total'];

        $sql .= " LIMIT {$limit} OFFSET {$offset}";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        jsonResponse([
            'data'  => $stmt->fetchAll(),
            'total' => $total,
            'page'  => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit),
        ]);
        break;

    case 'POST':
        if (!$ticketId) jsonResponse(['error' => 'ID ticket requis.'], 400);

        // Get the ticket
        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
        $stmt->execute([':id' => $ticketId]);
        $ticket = $stmt->fetch();

        if (!$ticket) jsonResponse(['error' => 'Ticket introuvable.'], 404);
        if ($ticket['status'] !== 'Delivered') {
            jsonResponse(['error' => 'Seuls les tickets "Delivered" peuvent être archivés.'], 422);
        }

        // Insert into archives
        $stmt = $pdo->prepare("
            INSERT INTO archives (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at)
            VALUES (:ticket_id, :client_name, :client_phone, :client_email, :hardware_category, :brand, :model, :serial_number, :problem_description, :diagnostic_notes, :technician_notes, :status, :location, :estimated_cost, :final_cost, :priority, :created_at, :updated_at, :delivered_at)
        ");

        $stmt->execute([
            ':ticket_id'          => $ticket['ticket_id'],
            ':client_name'        => $ticket['client_name'],
            ':client_phone'       => $ticket['client_phone'],
            ':client_email'       => $ticket['client_email'],
            ':hardware_category'  => $ticket['hardware_category'],
            ':brand'              => $ticket['brand'],
            ':model'              => $ticket['model'],
            ':serial_number'      => $ticket['serial_number'],
            ':problem_description'=> $ticket['problem_description'],
            ':diagnostic_notes'   => $ticket['diagnostic_notes'],
            ':technician_notes'   => $ticket['technician_notes'],
            ':status'             => $ticket['status'],
            ':location'           => $ticket['location'],
            ':estimated_cost'     => $ticket['estimated_cost'],
            ':final_cost'         => $ticket['final_cost'],
            ':priority'           => $ticket['priority'],
            ':created_at'         => $ticket['created_at'],
            ':updated_at'         => $ticket['updated_at'],
            ':delivered_at'       => $ticket['delivered_at'],
        ]);

        // Delete from active tickets
        $del = $pdo->prepare("DELETE FROM tickets WHERE ticket_id = :id");
        $del->execute([':id' => $ticketId]);

        jsonResponse(['message' => 'Ticket archivé avec succès.', 'ticket_id' => $ticketId], 201);
        break;

    default:
        jsonResponse(['error' => 'Méthode non supportée.'], 405);
}
