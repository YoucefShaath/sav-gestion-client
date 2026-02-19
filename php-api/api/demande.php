<?php
// php-api/api/demande.php
require_once __DIR__ . '/../src/mail.php';
require_once __DIR__ . '/../src/db.php';
header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD'];
$pdo = db_get_pdo();

function json_ok($v) { echo json_encode($v); exit; }
function json_err($m, $s = 400) { http_response_code($s); echo json_encode(['error'=>$m]); exit; }

if ($method === 'GET') {
    $type = $_GET['type'] ?? null;
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, intval($_GET['limit'] ?? 50));
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];
    if ($type) { $where[] = 'type = ?'; $params[] = $type; }
    $sql = 'SELECT * FROM demandes';
    if (count($where)) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY created_at DESC';

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
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: [];
    $required = ['type','company_name','contact_phone','contact_email','description'];
    $missing = [];
    foreach ($required as $r) if (empty($data[$r]) || trim($data[$r]) === '') $missing[] = $r;
    if (count($missing)) json_err('Champs obligatoires manquants: ' . implode(', ', $missing), 422);

    $type = $data['type'];
    $company_name = $data['company_name'];
    $contact_phone = $data['contact_phone'];
    $contact_email = $data['contact_email'];
    $description = $data['description'];
    $urgency = $data['urgency'] ?? 'normal';

    if (!filter_var($contact_email, FILTER_VALIDATE_EMAIL)) json_err('Adresse email invalide.', 422);
    if (!in_array($type, ['achat','prestation'])) json_err('Type de demande invalide.', 422);

    try {
        $stmt = $pdo->prepare('INSERT INTO demandes (type, company_name, contact_phone, contact_email, description, urgency, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())');
        $stmt->execute([$type, $company_name, $contact_phone, $contact_email ?: null, $description, $urgency]);
        $insertedId = $pdo->lastInsertId();
    } catch (Exception $e) {
        json_err('Erreur lors de la sauvegarde.', 500);
    }

    $to = $type === 'achat' ? 'commercial@it-smv.com' : 'technique@it-smv.com';
    $typeLabel = $type === 'achat' ? 'Demande d\'achat' : 'Demande de prestation';
    $urgencyLabel = ['normal'=>'Normale','moyenne'=>'Moyenne','urgente'=>'Urgente'][$urgency] ?? 'Normale';
    $subject = "[Informatica] $typeLabel - $company_name";
    $body = "<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;'><div style='background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0;'><h2 style='margin: 0; font-size: 18px;'>📋 $typeLabel</h2><p style='margin: 5px 0 0; font-size: 12px; color: #93c5fd;'>Informatica — Espace Entreprise</p></div><div style='padding: 20px;'><p><strong>Entreprise:</strong> $company_name</p><p><strong>Téléphone:</strong> $contact_phone</p><p><strong>Email:</strong> $contact_email</p><p><strong>Urgence:</strong> $urgencyLabel</p><p><strong>Description:</strong><br>" . nl2br(htmlspecialchars($description, ENT_QUOTES, 'UTF-8')) . "</p></div></body></html>";

    // Try to send notification but do not fail the request if mail fails
    try {
        send_mail_html($to, $subject, $body);
    } catch (Exception $e) {
        error_log('Failed to send demande email: ' . $e->getMessage());
    }

    json_ok(['success'=>true, 'id' => $insertedId]);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) json_err('ID requis', 400);
    try {
        $stmt = $pdo->prepare('SELECT id FROM demandes WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetchColumn()) json_err('Demande introuvable.', 404);
        $pdo->prepare('DELETE FROM demandes WHERE id = ?')->execute([$id]);
        json_ok(['success'=>true]);
    } catch (Exception $e) {
        json_err('Erreur lors de la suppression.', 500);
    }
}

json_err('Method not allowed', 405);

