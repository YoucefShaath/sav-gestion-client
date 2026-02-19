<?php
// Minimal PDO wrapper for MySQL (php-api/src/db.php)

function db_get_pdo() {
    static $pdo = null;
    if ($pdo) return $pdo;

    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') ?: '';
    $name = getenv('DB_NAME') ?: 'sav_gestion';
    $port = getenv('DB_PORT') ?: '3306';

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
    $opts = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $user, $pass, $opts);
    return $pdo;
}
