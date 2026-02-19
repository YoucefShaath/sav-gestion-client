<?php
// Simple router for php-api (public/index.php)
// Routes: /api/<name> -> php-api/api/<name>.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
$path = '/' . ltrim(substr($uri, strlen($base)), '/');

// Normalize trailing slash
$path = rtrim($path, '/');
if ($path === '') $path = '/';

if (strpos($path, '/api/') === 0) {
    $parts = explode('/', $path);
    // /api/<name>
    $apiName = $parts[2] ?? '';
    $file = __DIR__ . '/../api/' . preg_replace('/[^a-z0-9\-_.]/i', '', $apiName) . '.php';
    if (file_exists($file)) {
        require $file;
        exit;
    }
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Not Found']);
    exit;
}

// For non-API requests return a small info page
header('Content-Type: text/html; charset=utf-8');
echo "<h3>php-api - API server</h3><p>Use <code>/api/&lt;endpoint&gt;</code> (e.g. <code>/api/tickets</code>).</p>";
