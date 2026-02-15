<?php
/**
 * Tickets API Endpoint
 * 
 * GET    /tickets.php              → List all tickets (with filters)
 * GET    /tickets.php?id=SAV-...   → Get single ticket
 * POST   /tickets.php              → Create new ticket
 * PUT    /tickets.php?id=SAV-...   → Update ticket
 * PATCH  /tickets.php?id=SAV-...   → Update status only
 * DELETE /tickets.php?id=SAV-...   → Delete ticket
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/Database.php';

$pdo = Database::getInstance()->getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$ticketId = $_GET['id'] ?? null;

switch ($method) {

    // ─── LIST / GET ONE ─────────────────────────────────────
    case 'GET':
        if ($ticketId) {
            // Single ticket
            $stmt = $pdo->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
            $stmt->execute([':id' => $ticketId]);
            $ticket = $stmt->fetch();

            if (!$ticket) {
                jsonResponse(['error' => 'Ticket introuvable.'], 404);
            }

            // Fetch status history
            $hist = $pdo->prepare("SELECT * FROM status_history WHERE ticket_id = :id ORDER BY changed_at ASC");
            $hist->execute([':id' => $ticketId]);
            $ticket['history'] = $hist->fetchAll();

            jsonResponse($ticket);
        }

        // List with filters
        $where = [];
        $params = [];

        if (!empty($_GET['status'])) {
            $where[] = "status = :status";
            $params[':status'] = $_GET['status'];
        }
        if (!empty($_GET['category'])) {
            $where[] = "hardware_category = :category";
            $params[':category'] = $_GET['category'];
        }
        if (!empty($_GET['priority'])) {
            $where[] = "priority = :priority";
            $params[':priority'] = $_GET['priority'];
        }
        if (!empty($_GET['search'])) {
            $where[] = "(client_name LIKE :search OR client_phone LIKE :search2 OR ticket_id LIKE :search3)";
            $s = '%' . $_GET['search'] . '%';
            $params[':search'] = $s;
            $params[':search2'] = $s;
            $params[':search3'] = $s;
        }

        $sql = "SELECT * FROM tickets";
        if ($where) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY FIELD(priority, 'Urgent','High','Normal','Low'), created_at DESC";

        // Pagination
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        // Count total
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

    // ─── CREATE ─────────────────────────────────────────────
    case 'POST':
        $data = getJsonBody();

        // Validate required fields
        $errors = validateRequired($data, ['client_name', 'client_phone', 'hardware_category', 'problem_description']);

        if (!empty($data['client_phone']) && !validatePhone($data['client_phone'])) {
            $errors[] = "Numéro de téléphone invalide.";
        }
        if (!empty($data['hardware_category']) && !validateCategory($data['hardware_category'])) {
            $errors[] = "Catégorie matériel invalide.";
        }
        if (!empty($data['priority']) && !validatePriority($data['priority'])) {
            $errors[] = "Priorité invalide.";
        }

        if ($errors) {
            jsonResponse(['errors' => $errors], 422);
        }

        $newId = generateTicketId($pdo);

        $stmt = $pdo->prepare("
            INSERT INTO tickets (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, priority, location)
            VALUES (:ticket_id, :client_name, :client_phone, :client_email, :hardware_category, :brand, :model, :serial_number, :problem_description, :priority, :location)
        ");

        $stmt->execute([
            ':ticket_id'          => $newId,
            ':client_name'        => trim($data['client_name']),
            ':client_phone'       => trim($data['client_phone']),
            ':client_email'       => trim($data['client_email'] ?? ''),
            ':hardware_category'  => $data['hardware_category'],
            ':brand'              => trim($data['brand'] ?? ''),
            ':model'              => trim($data['model'] ?? ''),
            ':serial_number'      => trim($data['serial_number'] ?? ''),
            ':problem_description'=> trim($data['problem_description']),
            ':priority'           => $data['priority'] ?? 'Normal',
            ':location'           => $data['location'] ?? 'Reception',
        ]);

        // Log initial status
        $hist = $pdo->prepare("INSERT INTO status_history (ticket_id, new_status, notes) VALUES (:id, 'Received', 'Ticket créé')");
        $hist->execute([':id' => $newId]);

        // Return created ticket
        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
        $stmt->execute([':id' => $newId]);

        jsonResponse($stmt->fetch(), 201);
        break;

    // ─── FULL UPDATE ────────────────────────────────────────
    case 'PUT':
        if (!$ticketId) jsonResponse(['error' => 'ID ticket requis.'], 400);

        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
        $stmt->execute([':id' => $ticketId]);
        $existing = $stmt->fetch();
        if (!$existing) jsonResponse(['error' => 'Ticket introuvable.'], 404);

        $data = getJsonBody();

        $errors = validateRequired($data, ['client_name', 'client_phone', 'hardware_category', 'problem_description']);
        if (!empty($data['client_phone']) && !validatePhone($data['client_phone'])) {
            $errors[] = "Numéro de téléphone invalide.";
        }
        if ($errors) jsonResponse(['errors' => $errors], 422);

        $stmt = $pdo->prepare("
            UPDATE tickets SET
                client_name = :client_name,
                client_phone = :client_phone,
                client_email = :client_email,
                hardware_category = :hardware_category,
                brand = :brand,
                model = :model,
                serial_number = :serial_number,
                problem_description = :problem_description,
                diagnostic_notes = :diagnostic_notes,
                technician_notes = :technician_notes,
                location = :location,
                estimated_cost = :estimated_cost,
                final_cost = :final_cost,
                priority = :priority
            WHERE ticket_id = :ticket_id
        ");

        $stmt->execute([
            ':client_name'        => trim($data['client_name']),
            ':client_phone'       => trim($data['client_phone']),
            ':client_email'       => trim($data['client_email'] ?? ''),
            ':hardware_category'  => $data['hardware_category'],
            ':brand'              => trim($data['brand'] ?? ''),
            ':model'              => trim($data['model'] ?? ''),
            ':serial_number'      => trim($data['serial_number'] ?? ''),
            ':problem_description'=> trim($data['problem_description']),
            ':diagnostic_notes'   => trim($data['diagnostic_notes'] ?? ''),
            ':technician_notes'   => trim($data['technician_notes'] ?? ''),
            ':location'           => trim($data['location'] ?? ''),
            ':estimated_cost'     => $data['estimated_cost'] ?? null,
            ':final_cost'         => $data['final_cost'] ?? null,
            ':priority'           => $data['priority'] ?? 'Normal',
            ':ticket_id'          => $ticketId,
        ]);

        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
        $stmt->execute([':id' => $ticketId]);
        jsonResponse($stmt->fetch());
        break;

    // ─── STATUS UPDATE (PATCH) ──────────────────────────────
    case 'PATCH':
        if (!$ticketId) jsonResponse(['error' => 'ID ticket requis.'], 400);

        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
        $stmt->execute([':id' => $ticketId]);
        $existing = $stmt->fetch();
        if (!$existing) jsonResponse(['error' => 'Ticket introuvable.'], 404);

        $data = getJsonBody();

        // Status transition
        if (isset($data['status'])) {
            if (!validateStatus($data['status'])) {
                jsonResponse(['error' => 'Statut invalide.'], 422);
            }
            if (!isValidTransition($existing['status'], $data['status'])) {
                jsonResponse([
                    'error' => "Transition invalide: {$existing['status']} → {$data['status']}",
                    'allowed' => getNextStatuses($existing['status']),
                ], 422);
            }

            $updates = ["status = :status"];
            $params = [':status' => $data['status'], ':ticket_id' => $ticketId];

            if ($data['status'] === 'Delivered') {
                $updates[] = "delivered_at = NOW()";
            }
            if (isset($data['location'])) {
                $updates[] = "location = :location";
                $params[':location'] = $data['location'];
            }
            if (isset($data['diagnostic_notes'])) {
                $updates[] = "diagnostic_notes = :diag";
                $params[':diag'] = $data['diagnostic_notes'];
            }
            if (isset($data['technician_notes'])) {
                $updates[] = "technician_notes = :tech";
                $params[':tech'] = $data['technician_notes'];
            }
            if (isset($data['estimated_cost'])) {
                $updates[] = "estimated_cost = :est";
                $params[':est'] = $data['estimated_cost'];
            }
            if (isset($data['final_cost'])) {
                $updates[] = "final_cost = :fin";
                $params[':fin'] = $data['final_cost'];
            }

            $sql = "UPDATE tickets SET " . implode(', ', $updates) . " WHERE ticket_id = :ticket_id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            // Log history
            $hist = $pdo->prepare("INSERT INTO status_history (ticket_id, old_status, new_status, notes) VALUES (:id, :old, :new, :notes)");
            $hist->execute([
                ':id'   => $ticketId,
                ':old'  => $existing['status'],
                ':new'  => $data['status'],
                ':notes'=> $data['notes'] ?? null,
            ]);
        }

        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
        $stmt->execute([':id' => $ticketId]);
        jsonResponse($stmt->fetch());
        break;

    // ─── DELETE ──────────────────────────────────────────────
    case 'DELETE':
        if (!$ticketId) jsonResponse(['error' => 'ID ticket requis.'], 400);

        $stmt = $pdo->prepare("DELETE FROM tickets WHERE ticket_id = :id");
        $stmt->execute([':id' => $ticketId]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Ticket introuvable.'], 404);
        }

        jsonResponse(['message' => 'Ticket supprimé.']);
        break;

    default:
        jsonResponse(['error' => 'Méthode non supportée.'], 405);
}

/**
 * Helper for error messages: return allowed next statuses
 */
function getNextStatuses(string $current): array {
    $transitions = [
        'Received'    => ['Diagnostic'],
        'Diagnostic'  => ['In Progress', 'Received'],
        'In Progress' => ['Completed', 'Diagnostic'],
        'Completed'   => ['Delivered', 'In Progress'],
        'Delivered'   => [],
    ];
    return $transitions[$current] ?? [];
}
