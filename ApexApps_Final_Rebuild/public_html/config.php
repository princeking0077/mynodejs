<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'u480091743_shoaib');
define('DB_PASS', 'Shaikh@001001');
define('DB_NAME', 'u480091743_pharmacy');

try {
    $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4", DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Return JSON error if connection fails, so API clients see it
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["message" => "Database Connection Failed: " . $e->getMessage()]);
    exit;
}
?>
