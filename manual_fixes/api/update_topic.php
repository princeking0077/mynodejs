<?php
include 'config.php';
include_once 'validate_token.php'; // Security Check

// Verify Auth
$user = validate_request($conn);

$data = json_decode(file_get_contents("php://input"));

// Helper: Word Count & Reading Time
function calculate_reading_metrics($content) {
    $text = strip_tags($content);
    $word_count = str_word_count($text);
    $reading_time = ceil($word_count / 200);
    return ['words' => $word_count, 'minutes' => $reading_time];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT') {
    if (!empty($data->id) && !empty($data->title)) {
        try {
            // Metrics
            $metrics = calculate_reading_metrics($data->blogContent ?? '');
            
            // Build Query
            $sql = "UPDATE content SET 
                title = :title, 
                description = :desc, 
                blog_content = :blog, 
                youtube_id = :youtube, 
                quiz_data = :quiz,
                meta_title = :metaTitle,
                meta_description = :metaDesc,
                faqs = :faqs,
                year_slug = :yearSlug,
                unit_number = :unitNum,
                primary_keyword = :primKey,
                target_keywords = :targetKey,
                content_word_count = :wordCount,
                reading_time_minutes = :readTime
            ";

            // Only update file_url if provided
            if (isset($data->fileUrl)) {
                 $sql .= ", file_url = :file";
            }
            
            $sql .= " WHERE id = :id";
            
            $stmt = $conn->prepare($sql);
            
            $quizJson = isset($data->quiz) ? json_encode($data->quiz) : '[]';
            $faqsJson = isset($data->faqs) ? json_encode($data->faqs) : '[]';
            $targetKeywordsJson = isset($data->targetKeywords) ? json_encode($data->targetKeywords) : '[]';
            
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':desc', $data->description); 
            $stmt->bindParam(':blog', $data->blogContent);
            $stmt->bindParam(':youtube', $data->youtubeId);
            $stmt->bindParam(':quiz', $quizJson);
            
            // SEO
            $stmt->bindParam(':metaTitle', $data->metaTitle);
            $stmt->bindParam(':metaDesc', $data->metaDescription);
            $stmt->bindParam(':faqs', $faqsJson);
            $stmt->bindParam(':yearSlug', $data->yearSlug);
            $stmt->bindParam(':unitNum', $data->unitNumber);
            $stmt->bindParam(':primKey', $data->primaryKeyword);
            $stmt->bindParam(':targetKey', $targetKeywordsJson);
            $stmt->bindParam(':wordCount', $metrics['words']);
            $stmt->bindParam(':readTime', $metrics['minutes']);
            
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
