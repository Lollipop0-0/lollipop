<?php
/**
 * Karl Evan Tabunda - Site Visitors & Real-Time Views Counter API
 * Privacy-friendly, zero external tracker, session-deduplicated hit counter & real-time presence engine.
 * Reads and updates: cache/visitors.json and cache/active_viewers.json
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
$activeFile = $cacheDir . '/active_viewers.json';

// Parse action and viewer ID
$action = $_GET['action'] ?? $_POST['action'] ?? 'visit';
$viewerId = $_GET['viewerId'] ?? $_POST['viewerId'] ?? null;

// Validate or fallback viewer ID
if (!$viewerId || !preg_match('/^[a-zA-Z0-9_-]{6,64}$/', $viewerId)) {
    $remoteIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $viewerId = 'v_' . substr(md5($remoteIp . $userAgent), 0, 16);
}

// --------------------------------------------------------------------------
// 1. Live Concurrent Viewers Tracking (cache/active_viewers.json)
// --------------------------------------------------------------------------
$activeTimeout = 25; // seconds considered active
$now = time();
$activeViewers = [];

$afp = fopen($activeFile, 'c+');
if ($afp) {
    if (flock($afp, LOCK_EX)) {
        $fsize = filesize($activeFile);
        if ($fsize > 0) {
            $contents = fread($afp, $fsize);
            $decoded = json_decode($contents, true);
            if (is_array($decoded)) {
                $activeViewers = $decoded;
            }
        }

        // Prune expired sessions older than $activeTimeout seconds
        foreach ($activeViewers as $vid => $timestamp) {
            if (($now - (int)$timestamp) > $activeTimeout) {
                unset($activeViewers[$vid]);
            }
        }

        if ($action === 'leave') {
            unset($activeViewers[$viewerId]);
        } else {
            // Heartbeat or Visit: update active timestamp
            $activeViewers[$viewerId] = $now;
        }

        // Rewrite active viewers file
        ftruncate($afp, 0);
        rewind($afp);
        fwrite($afp, json_encode($activeViewers, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        flock($afp, LOCK_UN);
    }
    fclose($afp);
}

// Guarantee at least 1 active viewer if not explicitly a leave action
$currentViewers = count($activeViewers);
if ($action !== 'leave' && $currentViewers < 1) {
    $currentViewers = 1;
}

// --------------------------------------------------------------------------
// 2. Persistent Total Views & Unique Visitors (cache/visitors.json)
// --------------------------------------------------------------------------
$metrics = [
    'totalViews' => 268,
    'uniqueVisitors' => 94,
    'lastUpdated' => date('c')
];

$sessionCookieName = 'ke_portfolio_sess';
$uniqueCookieName = 'ke_portfolio_uid';

$isNewSession = empty($_COOKIE[$sessionCookieName]);
$isNewUnique = empty($_COOKIE[$uniqueCookieName]);

// Set cookies for real browser clients on visit
if ($action === 'visit') {
    if ($isNewSession) {
        $sessId = bin2hex(random_bytes(16));
        setcookie($sessionCookieName, $sessId, [
            'expires' => time() + 1800, // 30-minute session cooldown
            'path' => '/',
            'samesite' => 'Lax'
        ]);
    }

    if ($isNewUnique) {
        $uid = bin2hex(random_bytes(16));
        setcookie($uniqueCookieName, $uid, [
            'expires' => time() + (365 * 24 * 3600), // 1-year unique ID
            'path' => '/',
            'samesite' => 'Lax'
        ]);
    }
}

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

        // Only increment persistent visits if it is a new visit session (not heartbeat / leave)
        $shouldIncrement = ($action === 'visit' && $isNewSession) || (isset($_GET['increment']) && $_GET['increment'] === '1');
        
        if ($shouldIncrement) {
            $metrics['totalViews']++;
            if ($isNewUnique) {
                $metrics['uniqueVisitors']++;
            }
            $metrics['lastUpdated'] = date('c');

            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($metrics, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }

        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

// Format numbers
$formattedViews = number_format($metrics['totalViews']);
$formattedUniques = number_format($metrics['uniqueVisitors']);

echo json_encode([
    'success' => true,
    'currentViewers' => $currentViewers,
    'totalViews' => $metrics['totalViews'],
    'uniqueVisitors' => $metrics['uniqueVisitors'],
    'formattedViews' => $formattedViews,
    'formattedUniques' => $formattedUniques,
    'lastUpdated' => $metrics['lastUpdated'],
    'action' => $action
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
