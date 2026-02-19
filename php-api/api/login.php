<?php
// php-api/api/login.php
header('Content-Type: application/json; charset=utf-8');
$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];
$USERS = [
    ['username'=>'admin','password'=>'admin123','name'=>'Administrateur','role'=>'admin'],
    ['username'=>'tech1','password'=>'tech123','name'=>'Technicien 1','role'=>'technician'],
    ['username'=>'tech2','password'=>'tech123','name'=>'Technicien 2','role'=>'technician'],
];
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$found = null;
foreach ($USERS as $u) { if ($u['username'] === $username && $u['password'] === $password) { $found = $u; break; } }
if (!$found) { http_response_code(401); echo json_encode(['error'=>'Identifiants incorrects.']); exit; }
$token = bin2hex(random_bytes(12));
echo json_encode(['success'=>true,'token'=>$token,'user'=>['username'=>$found['username'],'name'=>$found['name'],'role'=>$found['role']]]);
