<?php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->password)) {
    $query = "SELECT id, username, password_hash FROM admins WHERE username = :username LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(password_verify($data->password, $row['password_hash'])) {
            // Password is correct
            echo json_encode([
                "message" => "Login successful",
                "token" => bin2hex(random_bytes(16)), // Simple token for demo
                "user" => $row['username']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "User not found."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
