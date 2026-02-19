<?php
// php-api/api/send-invoice.php
require_once __DIR__ . '/../src/mail.php';
header('Content-Type: application/json; charset=utf-8');
$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];
$to = $data['to'] ?? null; $subject = $data['subject'] ?? null; $html = $data['html'] ?? null;
if (!$to || !$subject || !$html) { http_response_code(400); echo json_encode(['error'=>'Missing fields']); exit; }

$ok = send_mail_html($to, $subject, $html);
if ($ok) { echo json_encode(['success'=>true]); } else { http_response_code(500); echo json_encode(['error'=>'Failed to send email']); }
