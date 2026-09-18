<?php
/**
 * Karl Evan Tabunda - Site Visitors & Views Counter API
 * Privacy-friendly, zero external tracker, session-deduplicated hit counter.
 * Reads and updates: cache/visitors.json
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$cacheDir = __DIR__ . '/../cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0777, true);
}

$cacheFile = $cacheDir . '/visitors.json';

// Default initial metrics
$metrics = [
    'totalViews' => 268,
    'uniqueVisitors' => 94,
    'lastUpdated' => date('c')
];

// Session / deduplication cookies (30 min session cooldown, 1 year unique ID)
$sessionCookieName = 'ke_portfolio_sess';
$uniqueCookieName = 'ke_portfolio_uid';

$isNewSession = false;
$isNewUnique = false;

if (empty($_COOKIE[$sessionCookieName])) {
    $isNewSession = true;
    $sessId = bin2hex(random_bytes(16));
    // Set 30-minute session cookie
    setcookie($sessionCookieName, $sessId, [
        'expires' => time() + 1800,
        'path' => '/',
        'samesite' => 'Lax'
    ]);
}

if (empty($_COOKIE[$uniqueCookieName])) {
    $isNewUnique = true;
    $uid = bin2hex(random_bytes(16));
    // Set 1-year visitor cookie
    setcookie($uniqueCookieName, $uid, [
        'expires' => time() + (365 * 24 * 3600),
        'path' => '/',
        'samesite' => 'Lax'
    ]);
}

// Read and update atomically
$fp = fopen($cacheFile, 'c+');
if ($fp) {
    if (flock($fp, LOCK_EX)) {
        $filesize = filesize($cacheFile);
        if ($filesize > 0) {
            $contents = fread($fp, $filesize);
            $decoded = json_decode($contents, true);
            if (is_array($decoded) && isset($decoded['totalViews'])) {
                $metrics['totalViews'] = (int)$decoded['totalViews'];
                $metrics['uniqueVisitors'] = (int)($decoded['uniqueVisitors'] ?? $decoded['totalViews']);
            }
        }

        // Only increment if it's a new session or explicitly forced via query param
        $shouldIncrement = $isNewSession || (isset($_GET['increment']) && $_GET['increment'] === '1');
        
        if ($shouldIncrement) {
            $metrics['totalViews']++;
            if ($isNewUnique) {
                $metrics['uniqueVisitors']++;
            }
            $metrics['lastUpdated'] = date('c');

            // Rewrite file
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($metrics, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }

        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

// Format numbers nicely (e.g. 1,234)
$formattedViews = number_format($metrics['totalViews']);
$formattedUniques = number_format($metrics['uniqueVisitors']);

echo json_encode([
    'success' => true,
    'totalViews' => $metrics['totalViews'],
    'uniqueVisitors' => $metrics['uniqueVisitors'],
    'formattedViews' => $formattedViews,
    'formattedUniques' => $formattedUniques,
    'lastUpdated' => $metrics['lastUpdated'],
    'isNewVisit' => $isNewSession
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
