<?php
/**
 * Model Suggestions API
 * GET /suggestions.php?category=Laptop&q=xps  →  returns matching models
 * GET /suggestions.php?field=brand&q=hp        →  returns matching brands
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$pdo = Database::getInstance()->getConnection();

$category = $_GET['category'] ?? '';
$q = trim($_GET['q'] ?? '');
$field = $_GET['field'] ?? 'model'; // 'model' or 'brand'

if (strlen($q) < 1) {
    jsonResponse([]);
}

if ($field === 'brand') {
    // Suggest brands from previous tickets
    $stmt = $pdo->prepare("
        SELECT DISTINCT brand FROM tickets
        WHERE brand IS NOT NULL AND brand != '' AND brand LIKE :q1
        UNION
        SELECT DISTINCT brand FROM archives
        WHERE brand IS NOT NULL AND brand != '' AND brand LIKE :q2
        ORDER BY brand ASC
        LIMIT 15
    ");
    $stmt->execute([':q1' => '%' . $q . '%', ':q2' => '%' . $q . '%']);
    jsonResponse($stmt->fetchAll(PDO::FETCH_COLUMN));
}

// Default: suggest models (optionally filtered by category)
$catFilter1 = $category ? 'AND hardware_category = :cat1' : '';
$catFilter2 = $category ? 'AND hardware_category = :cat2' : '';

$sql = "
    SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion,
           brand, model
    FROM tickets
    WHERE model IS NOT NULL AND model != ''
      AND (model LIKE :q1 OR brand LIKE :q1b)
      $catFilter1
    UNION
    SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion,
           brand, model
    FROM archives
    WHERE model IS NOT NULL AND model != ''
      AND (model LIKE :q2 OR brand LIKE :q2b)
      $catFilter2
    ORDER BY suggestion ASC
    LIMIT 15
";

$params = [
    ':q1'  => '%' . $q . '%',
    ':q1b' => '%' . $q . '%',
    ':q2'  => '%' . $q . '%',
    ':q2b' => '%' . $q . '%',
];
if ($category) {
    $params[':cat1'] = $category;
    $params[':cat2'] = $category;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse($results);
