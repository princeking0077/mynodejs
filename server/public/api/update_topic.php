<?php
include 'config.php';

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!empty($data->id) && !empty($data->title)) {
        try {
            // Build query dynamically or just update all fields
            $sql = "UPDATE content SET title = :title, description = :desc, quiz_data = :quiz";
            
            // Only update file_url if provided (to avoid overwriting with null if no new file)
            if (isset($data->fileUrl)) {
                 $sql .= ", file_url = :file";
            }
            
            $sql .= " WHERE id = :id";
            
            $stmt = $conn->prepare($sql);
            
            $quizJson = isset($data->quiz) ? json_encode($data->quiz) : '[]';
            
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':desc', $data->description); // Animation Code
            $stmt->bindParam(':quiz', $quizJson);
            $stmt->bindParam(':id', $data->id);
            
            if (isset($data->fileUrl)) {
                $stmt->bindParam(':file', $data->fileUrl);
            }

            if ($stmt->execute()) {
                echo json_encode(["message" => "Topic updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to update topic"]);
            }
        } catch(PDOException $e) {
             http_response_code(500);
             echo json_encode(["message" => "Db Error: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}
?>
