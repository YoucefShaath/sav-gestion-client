<?php
/**
 * Technician Login API
 * POST /login.php → Authenticate technician
 * 
 * Default credentials: admin / admin123
 * Change these in production!
 */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Méthode non supportée.'], 405);
}

// ── Hardcoded credentials (change in production) ────────────
$VALID_USERS = [
    ['username' => 'admin',     'password' => 'admin123',   'name' => 'Administrateur'],
    ['username' => 'tech1',     'password' => 'tech123',    'name' => 'Technicien 1'],
    ['username' => 'tech2',     'password' => 'tech123',    'name' => 'Technicien 2'],
];

$data = getJsonBody();

if (empty($data['username']) || empty($data['password'])) {
    jsonResponse(['error' => 'Nom d\'utilisateur et mot de passe requis.'], 422);
}

$username = trim($data['username']);
$password = trim($data['password']);

foreach ($VALID_USERS as $user) {
    if ($user['username'] === $username && $user['password'] === $password) {
        // Generate a simple token
        $token = bin2hex(random_bytes(32));
        
        jsonResponse([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'username' => $user['username'],
                'name'     => $user['name'],
            ],
        ]);
    }
}

jsonResponse(['error' => 'Identifiants incorrects.'], 401);
