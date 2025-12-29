<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Debug Output</h1>";
echo "<p>Script started...</p>";

$configFile = __DIR__ . '/config.php';

if (!file_exists($configFile)) {
    die("<p style='color:red'>Critical: config.php not found at $configFile</p>");
} else {
    echo "<p>config.php found.</p>";
}

try {
    include $configFile;
    echo "<p>config.php included successfully.</p>";
} catch (Throwable $t) {
    die("<p style='color:red'>Error including config.php: " . $t->getMessage() . "</p>");
}

if (!isset($conn)) {
    die("<p style='color:red'>\$conn variable not set after config include.</p>");
} else {
    echo "<p>Database connection object exists.</p>";
}

echo "<h2>Fetching content...</h2>";
try {
    $stmt = $conn->query("SELECT id, title, slug, meta_title, meta_description FROM content ORDER BY id DESC LIMIT 5");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' cellspacing='0' cellpadding='5'>";
    echo "<tr><th>ID</th><th>Title</th><th>Slug</th><th>Meta Title</th><th>Meta Desc</th></tr>";
    foreach ($rows as $row) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . htmlspecialchars($row['title']) . "</td>";
        echo "<td>" . htmlspecialchars($row['slug']) . "</td>";
        echo "<td>" . htmlspecialchars($row['meta_title'] ?? 'NULL') . "</td>";
        echo "<td>" . htmlspecialchars($row['meta_description'] ?? 'NULL') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} catch (PDOException $e) {
    echo "<p style='color:red'>DB Error: " . $e->getMessage() . "</p>";
}
echo "<p>Debug finished.</p>";
?>
