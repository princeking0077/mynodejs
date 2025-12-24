<?php
// Database Configuration for Hostinger
// This file is loaded by api/login.php, api/search.php etc.

define('DB_HOST', 'localhost');
define('DB_USER', 'u480091743_shoaib');
define('DB_PASS', 'Shaikh@001001');
define('DB_NAME', 'u480091743_pharmacy');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4", DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database Connection Failed: " . $e->getMessage()]);
    exit;
}
?>
