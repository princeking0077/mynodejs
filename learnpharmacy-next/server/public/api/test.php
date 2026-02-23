<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "status" => "success",
    "message" => "PHP API is working correctly on Hostinger!",
    "server_time" => date("Y-m-d H:i:s")
]);
?>
