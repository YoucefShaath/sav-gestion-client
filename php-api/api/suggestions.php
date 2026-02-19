<?php
// php-api/api/suggestions.php
require_once __DIR__ . '/../src/db.php';
header('Content-Type: application/json; charset=utf-8');
$pdo = db_get_pdo();
$q = trim($_GET['q'] ?? '');
$category = $_GET['category'] ?? null;
$field = $_GET['field'] ?? 'model';
if ($q === '') { echo json_encode([]); exit; }

if ($field === 'brand') {
    $stmt = $pdo->prepare("SELECT DISTINCT brand FROM tickets WHERE brand IS NOT NULL AND brand != '' AND brand LIKE ? UNION SELECT DISTINCT brand FROM archives WHERE brand IS NOT NULL AND brand != '' AND brand LIKE ? ORDER BY brand ASC LIMIT 15");
    $s = "%$q%";
    $stmt->execute([$s,$s]);
    $rows = $stmt->fetchAll();
    $out = array_map(function($r){ return $r['brand']; }, $rows);
    echo json_encode($out);
    exit;
}

// models
$params = [];
$catFilter = '';
if ($category) { $catFilter = 'AND hardware_category = ?'; $params[] = $category; }

$sql = "SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM tickets WHERE model IS NOT NULL AND model != '' AND (model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?) $catFilter UNION SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM archives WHERE model IS NOT NULL AND model != '' AND (model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?) $catFilter ORDER BY suggestion ASC LIMIT 15";
$sq = "%$q%";
$params = [$sq,$sq,$sq];
if ($category) $params[] = $category;
$params = array_merge($params, [$sq,$sq,$sq]);
if ($category) $params[] = $category;

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();
if (!$rows) {
    // fallback tokenized
    $tokens = preg_split('/\s+/', $q);
    $tokens = array_slice(array_filter($tokens), 0, 4);
    if (count($tokens)) {
        $conds = implode(' OR ', array_map(function(){ return '(model LIKE ? OR brand LIKE ? OR CONCAT(brand,\' \\',model) LIKE ?)'; }, $tokens));
        $params = [];
        foreach ($tokens as $t) { $params[] = "%$t%"; $params[] = "%$t%"; $params[] = "%$t%"; }
        $sql2 = "SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM tickets WHERE model IS NOT NULL AND model != '' AND ($conds) $catFilter UNION SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM archives WHERE model IS NOT NULL AND model != '' AND ($conds) $catFilter ORDER BY suggestion ASC LIMIT 15";
        if ($category) { $params[] = $category; $params = array_merge($params, [$category]); }
        $stmt = $pdo->prepare($sql2);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
    }
}

echo json_encode($rows);
