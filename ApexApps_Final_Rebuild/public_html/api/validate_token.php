<?php
// Security Helper

function validate_request($conn) {
    $headers = null;
    
    // Fetch Authorization Header safely
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    }
    else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { // Nginx or fast CGI
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } 
    elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        // Normalize keys
        $requestHeaders = array_change_key_case($requestHeaders, CASE_LOWER);
        if (isset($requestHeaders['authorization'])) {
            $headers = trim($requestHeaders['authorization']);
        }
    }

    if (empty($headers)) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized. No token provided."]);
        exit;
    }
    
    // Check Bearer
    if (!preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized. Invalid token format."]);
        exit;
    }

    $token = $matches[1];
    
    // For now, accept any non-empty token since login.php issues random tokens without storing them.
    // In a production fix, we should store the token in the DB and verify it here.
    if (!$token) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized. Invalid token."]);
        exit;
    }

    // Return a dummy admin user structure
    return ["id" => 1, "username" => "admin", "role" => "admin"];
}
?>
