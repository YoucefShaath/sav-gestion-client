<?php
/**
 * CORS Headers & Request Bootstrapping
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * Utility: send JSON response
 */
function jsonResponse($data, int $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Utility: get JSON body
 */
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Utility: generate unique ticket ID  (SAV-YYMMDD-XXXX)
 */
function generateTicketId(PDO $pdo): string {
    $prefix = 'SAV-' . date('ymd') . '-';
    $stmt = $pdo->prepare("SELECT ticket_id FROM tickets WHERE ticket_id LIKE :prefix ORDER BY id DESC LIMIT 1");
    $stmt->execute([':prefix' => $prefix . '%']);
    $last = $stmt->fetchColumn();

    if ($last) {
        $num = (int) substr($last, -4) + 1;
    } else {
        $num = 1;
    }

    return $prefix . str_pad($num, 4, '0', STR_PAD_LEFT);
}

/**
 * Validation helpers
 */
function validatePhone(string $phone): bool {
    // Accept formats: 0X XX XX XX XX, +213XXXXXXXXX, or 10-15 digits
    $cleaned = preg_replace('/[\s\-\.]/', '', $phone);
    return preg_match('/^(\+?\d{10,15})$/', $cleaned) === 1;
}

function validateRequired(array $data, array $fields): array {
    $errors = [];
    foreach ($fields as $field) {
        if (empty(trim($data[$field] ?? ''))) {
            $errors[] = "Le champ '{$field}' est obligatoire.";
        }
    }
    return $errors;
}

function validateCategory(string $cat): bool {
    $valid = [
        'Laser Mono - Photocopieur', 'Laser Mono - MFP',
        'Laser Couleur - Photocopieur', 'Laser Couleur - MFP',
        'MFP Ink', 'Matricielle',
        'Laptop', 'All In One', 'PC Bureaux', 'Serveur',
        'Ecran', 'Reseau', 'Other',
    ];
    // Accept predefined categories OR any non-empty custom string (for "Other")
    return in_array($cat, $valid, true) || (strlen(trim($cat)) >= 2);
}

function validateStatus(string $status): bool {
    $valid = ['Received', 'Diagnostic', 'In Progress', 'Completed', 'Delivered'];
    return in_array($status, $valid, true);
}

function validatePriority(string $p): bool {
    return in_array($p, ['Low', 'Normal', 'High', 'Urgent'], true);
}

/**
 * Enforce workflow status transitions
 */
function isValidTransition(string $from, string $to): bool {
    $transitions = [
        'Received'    => ['Diagnostic'],
        'Diagnostic'  => ['In Progress', 'Received'],
        'In Progress' => ['Completed', 'Diagnostic'],
        'Completed'   => ['Delivered', 'In Progress'],
        'Delivered'   => [],
    ];

    return in_array($to, $transitions[$from] ?? [], true);
}
