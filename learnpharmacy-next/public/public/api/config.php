<?php
// Database Configuration
$host = 'localhost'; 
$db_name = 'u631305858_apexapps'; 
$username = 'u631305858_apexpharma';
$password = 'Shaikh@#$001001'; 

// CORS Headers
// allow apexapps.in and localhost for development
$allowed_origins = [
    "https://apexapps.in",
    "http://localhost:5173", 
    "http://localhost:3000"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}
?>
