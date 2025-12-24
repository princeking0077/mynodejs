<?php
include 'config.php';

// Ensure uploads directory exists
$uploadDir = '../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $fileName = time() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;
    
    // Validate file types (basic)
    $fileType = strtolower(pathinfo($targetPath, PATHINFO_EXTENSION));
    $allowed = ['pdf', 'jpg', 'png', 'html', 'js', 'css'];
    
    if (!in_array($fileType, $allowed)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid file type."]);
        exit();
    }

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // Return the public URL
        // Assumes API is at /api/, so uploads are at /uploads/
        $publicUrl = '/uploads/' . $fileName;
        echo json_encode([
            "message" => "Upload successful",
            "url" => $publicUrl
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to move uploaded file."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "No file uploaded."]);
}
?>
