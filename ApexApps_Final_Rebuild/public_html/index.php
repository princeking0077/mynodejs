<?php
// Display errors for debugging (Disable in production if preferred)
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 1. Check if Config Exists
if (!file_exists(__DIR__ . '/api/config.php')) {
    if (file_exists(__DIR__ . '/install.php')) {
        header("Location: install.php");
        exit;
    } else {
        die("System not installed and install.php is missing.");
    }
}

// 2. Include Config for DB Connection
include __DIR__ . '/api/config.php';

// OVERRIDE JSON HEADER FROM CONFIG.PHP
header("Content-Type: text/html; charset=UTF-8");

// Prevent Caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Fetch Site Settings (GA, GSC, etc.)
$ga_id = '';
$gsc_tag = '';
$adsense_code = '';

if (isset($conn) && $conn instanceof PDO) {
    try {
        $stmt = $conn->prepare("SELECT setting_key, setting_value FROM site_settings");
        $stmt->execute();
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        $ga_id = $settings['google_analytics_id'] ?? '';
        $gsc_tag = $settings['google_search_console'] ?? '';
        $adsense_code = $settings['google_adsense_code'] ?? '';
    } catch(PDOException $e) {
        error_log("SEO Settings Fetch Error: " . $e->getMessage());
    }
}

// Get index.html content
$html = file_get_contents('index.html');

// --- SSR Lite: Dynamic Meta Tags based on URL ---
$requestUri = $_SERVER['REQUEST_URI'];
$metaTitle = "LearnPharmacy.in | B.Pharm Notes & Animations";
$metaDesc = "Visual pharmacy education with 3D animations, interactive quizzes, and comprehensive B.Pharm notes.";
$metaImage = "https://learnpharmacy.in/icon.png"; 
$canonicalUrl = "https://learnpharmacy.in" . strtok($requestUri, '?');

// LOGIC: URL Structure /subject/:subjectSlug/:topicSlug OR /subject/:subjectSlug
$topicSlug = null;
$subjectSlug = null;

if (preg_match('/\/subject\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/', $requestUri, $matches)) {
    // Topic Page
    $subjectSlug = $matches[1];
    $topicSlug = $matches[2];
} elseif (preg_match('/\/subject\/([a-zA-Z0-9-]+)/', $requestUri, $matches)) {
    // Subject Page
    $subjectSlug = $matches[1];
}

// DB Lookup for Specific Metadata
if ($topicSlug && isset($conn)) {
    try {
        // Fetch meta_title, meta_description, title from DB
        $stmt = $conn->prepare("SELECT title, meta_title, meta_description, primary_keyword FROM content WHERE slug = ? LIMIT 1");
        $stmt->execute([$topicSlug]);
        $topic = $stmt->fetch();

        if ($topic) {
            // Use DB meta fields if available, fallback to Title
            $dbTitle = !empty($topic['meta_title']) ? $topic['meta_title'] : $topic['title'];
            $dbDesc = !empty($topic['meta_description']) ? $topic['meta_description'] : "$dbTitle - Comprehensive notes and animations for pharmacy students.";
            
            $metaTitle = $dbTitle . " | LearnPharmacy.in";
            $metaDesc = $dbDesc;
        }
    } catch (Exception $e) {
        // Fallback to regex based if DB fails
    }
} elseif ($subjectSlug) {
    // Basic formatting for Subject pages
    $readableTitle = ucwords(str_replace('-', ' ', $subjectSlug));
    $metaTitle = "$readableTitle | LearnPharmacy.in";
    $metaDesc = "Study $readableTitle with interactive 3D animations and comprehensive notes on LearnPharmacy.in.";
}

// Apply Replacements to HTML
// 1. Title
$html = preg_replace('/<title>(.*?)<\/title>/', "<title>$metaTitle</title>", $html);
// 2. Meta Description (Find existing or inject)
if (strpos($html, '<meta name="description"') !== false) {
    $html = preg_replace('/<meta name="description" content="(.*?)" \/>/', "<meta name=\"description\" content=\"$metaDesc\" />", $html);
} else {
    $html = str_replace('<head>', "<head>\n    <meta name=\"description\" content=\"$metaDesc\" />", $html);
}

// 3. Open Graph Tags (Inject)
$ogTags = "
    <meta property=\"og:title\" content=\"$metaTitle\" />
    <meta property=\"og:description\" content=\"$metaDesc\" />
    <meta property=\"og:url\" content=\"$canonicalUrl\" />
    <meta property=\"og:image\" content=\"$metaImage\" />
    <meta property=\"og:type\" content=\"website\" />
    <meta name=\"twitter:card\" content=\"summary_large_image\" />
    <meta name=\"twitter:title\" content=\"$metaTitle\" />
    <meta name=\"twitter:description\" content=\"$metaDesc\" />
    <meta name=\"twitter:image\" content=\"$metaImage\" />
";
$html = str_replace('</head>', $ogTags . '</head>', $html);


// Inject Analytics / AdSense
$injection = "";
if (!empty($ga_id)) {
    $injection .= "
    <script async src='https://www.googletagmanager.com/gtag/js?id={$ga_id}'></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{$ga_id}');
    </script>";
}
if (!empty($gsc_tag)) {
    $injection .= $gsc_tag . "\n";
}
if (!empty($adsense_code)) {
    $injection .= $adsense_code . "\n";
}

$html = str_replace('</head>', $injection . '</head>', $html);

// Serve
echo "<!-- SSR LITE: DB FETCHED -->\n" . $html;
?>
