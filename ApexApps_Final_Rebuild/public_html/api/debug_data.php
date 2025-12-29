<?php
include 'config.php';

// Turn on error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>SEO Data Debugger</h1>";

// 1. Check Table Columns
echo "<h2>1. Checking Database Columns</h2>";
try {
    $stmt = $conn->query("SHOW COLUMNS FROM content");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $seo_cols = ['meta_title', 'meta_description', 'primary_keyword', 'slug'];
    
    foreach($seo_cols as $col) {
        if(in_array($col, $columns)) {
            echo "<div style='color:green'>✅ Column '$col' exists.</div>";
        } else {
            echo "<div style='color:red'>❌ Column '$col' MISSING! Run ADD_MISSING_COLUMNS.sql</div>";
        }
    }
} catch(Exception $e) {
    echo "Error checking columns: " . $e->getMessage();
}

// 2. Dump Recent Topics
echo "<h2>2. Recent 5 Topics (Raw Data)</h2>";
try {
    $stmt = $conn->query("SELECT id, title, slug, meta_title, meta_description, primary_keyword FROM content ORDER BY id DESC LIMIT 5");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if(count($rows) > 0) {
        echo "<table border='1' cellpadding='5' style='border-collapse:collapse; width:100%'>";
        echo "<tr><th>ID</th><th>Title</th><th>Slug</th><th>Meta Title (SEO)</th><th>Meta Desc (SEO)</th></tr>";
        foreach($rows as $row) {
            echo "<tr>";
            echo "<td>{$row['id']}</td>";
            echo "<td>{$row['title']}</td>";
            echo "<td>{$row['slug']}</td>";
            echo "<td>" . ($row['meta_title'] ? htmlspecialchars($row['meta_title']) : "<span style='color:red'>NULL</span>") . "</td>";
            echo "<td>" . ($row['meta_description'] ? htmlspecialchars(substr($row['meta_description'],0,50))."..." : "<span style='color:red'>NULL</span>") . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No content found in table.";
    }
} catch(Exception $e) {
    echo "Error fetching data: " . $e->getMessage();
}

// 3. Search Specific Slug
if(isset($_GET['slug'])) {
    echo "<h2>3. Inspecting Slug: " . htmlspecialchars($_GET['slug']) . "</h2>";
    $stmt = $conn->prepare("SELECT * FROM content WHERE slug = ?");
    $stmt->execute([$_GET['slug']]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if($item) {
        echo "<pre style='background:#eee; padding:10px'>";
        print_r($item);
        echo "</pre>";
    } else {
        echo "Topic not found for this slug.";
    }
} else {
    echo "<p><em>To inspect a specific topic, add ?slug=your-slug-here to the URL.</em></p>";
}
?>
