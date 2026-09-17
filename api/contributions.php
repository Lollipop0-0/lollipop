<?php
/**
 * Karl Evan Tabunda - GitHub Contribution Calendar Parser
 * Strictly public, zero token, zero GitHub REST/GraphQL API.
 * Fetches and parses: https://github.com/users/{$username}/contributions
 * Returns canonical contributionCalendar JSON with totalContributions and weekly contributionDays.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$username = isset($_GET['username']) ? trim((string)$_GET['username']) : 'Lollipop0-0';
if (!preg_match('/^[a-zA-Z0-9\-]+$/', $username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid GitHub username']);
    exit;
}

$cacheDir = __DIR__ . '/../cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0777, true);
}

$cacheFile = $cacheDir . '/contributions_' . strtolower($username) . '.json';
$cacheTtl = 6 * 3600; // 6 hours

$forceRefresh = isset($_GET['refresh']) && $_GET['refresh'] === '1';

if (!$forceRefresh && file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtl)) {
    $cachedData = @file_get_contents($cacheFile);
    if ($cachedData !== false) {
        $json = json_decode($cachedData, true);
        if (isset($json['contributionCalendar']['weeks'])) {
            header('X-Cache: HIT');
            echo $cachedData;
            exit;
        }
    }
}

function fetchPublicCalendar(string $username): ?array {
    $url = "https://github.com/users/{$username}/contributions";

    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => [
                'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Cache-Control: no-cache'
            ],
            'timeout' => 12
        ]
    ]);

    $html = @file_get_contents($url, false, $ctx);
    if (!$html) {
        return null;
    }

    $totalContributions = 0;
    if (preg_match('/([0-9,]+)\s+contributions?\s+in\s+the\s+last\s+year/i', $html, $m)) {
        $totalContributions = (int) str_replace(',', '', $m[1]);
    }

    $tooltips = [];
    if (preg_match_all('/<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/i', $html, $toolMatches, PREG_SET_ORDER)) {
        foreach ($toolMatches as $tm) {
            $cellId = $tm[1];
            $tooltipText = trim(strip_tags($tm[2]));
            $count = 0;
            if (preg_match('/([0-9,]+)\s+contribution/i', $tooltipText, $cm)) {
                $count = (int) str_replace(',', '', $cm[1]);
            }
            $tooltips[$cellId] = [
                'count' => $count,
                'text' => $tooltipText
            ];
        }
    }

    $matrix = [];

    if (preg_match_all('/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>[\s\S]*?<\/td>/i', $html, $tdMatches)) {
        foreach ($tdMatches[0] as $td) {
            preg_match('/data-date="([0-9]{4}-[0-9]{2}-[0-9]{2})"/i', $td, $dateMatch);
            preg_match('/data-level="([0-4])"/i', $td, $lvlMatch);
            preg_match('/id="([^"]+)"/i', $td, $idMatch);
            preg_match('/data-ix="([0-9]+)"/i', $td, $ixMatch);

            if ($dateMatch && $lvlMatch && $idMatch) {
                $date = $dateMatch[1];
                $levelNum = (int) $lvlMatch[1];
                $cellId = $idMatch[1];
                $colIdx = isset($ixMatch[1]) ? (int) $ixMatch[1] : null;

                $levelMap = [
                    0 => 'NONE',
                    1 => 'FIRST_QUARTILE',
                    2 => 'SECOND_QUARTILE',
                    3 => 'THIRD_QUARTILE',
                    4 => 'FOURTH_QUARTILE'
                ];
                $colorMap = [
                    0 => '#ebedf0',
                    1 => '#9be9a8',
                    2 => '#40c463',
                    3 => '#30a14e',
                    4 => '#216e39'
                ];

                $count = isset($tooltips[$cellId]) ? $tooltips[$cellId]['count'] : ($levelNum > 0 ? $levelNum : 0);

                $rowIdx = 0;
                if (preg_match('/contribution-day-component-([0-9]+)-([0-9]+)/i', $cellId, $idParts)) {
                    $rowIdx = (int) $idParts[1];
                    if ($colIdx === null) {
                        $colIdx = (int) $idParts[2];
                    }
                } else {
                    $rowIdx = (int) date('w', strtotime($date));
                }

                if ($colIdx !== null) {
                    if (!isset($matrix[$colIdx])) {
                        $matrix[$colIdx] = [];
                    }
                    $matrix[$colIdx][$rowIdx] = [
                        'date' => $date,
                        'contributionCount' => $count,
                        'contributionLevel' => $levelMap[$levelNum],
                        'color' => $colorMap[$levelNum],
                        'weekday' => $rowIdx
                    ];
                }
            }
        }
    }

    if (empty($matrix)) {
        return null;
    }

    ksort($matrix);
    $weeks = [];
    $sumFromCells = 0;
    foreach ($matrix as $colIdx => $days) {
        ksort($days);
        $contributionDays = array_values($days);
        foreach ($contributionDays as $d) {
            $sumFromCells += $d['contributionCount'];
        }
        $firstDay = !empty($contributionDays) ? $contributionDays[0]['date'] : '';
        $weeks[] = [
            'firstDay' => $firstDay,
            'contributionDays' => $contributionDays
        ];
    }

    if ($totalContributions === 0 && $sumFromCells > 0) {
        $totalContributions = $sumFromCells;
    }

    return [
        'totalContributions' => $totalContributions,
        'weeks' => $weeks
    ];
}

$calendar = fetchPublicCalendar($username);

if (!$calendar) {
    if (file_exists($cacheFile)) {
        $cachedData = @file_get_contents($cacheFile);
        if ($cachedData) {
            header('X-Cache: STALE-FALLBACK');
            echo $cachedData;
            exit;
        }
    }

    http_response_code(502);
    echo json_encode([
        'error' => 'Unable to retrieve GitHub contributions.',
        'username' => $username
    ]);
    exit;
}

$responsePayload = [
    'username' => $username,
    'fetchedAt' => date('c'),
    'contributionCalendar' => $calendar
];

$jsonEncoded = json_encode($responsePayload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
@file_put_contents($cacheFile, $jsonEncoded);

header('X-Cache: MISS');
echo $jsonEncoded;
