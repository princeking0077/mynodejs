<?php
include 'config.php';
include_once 'validate_token.php'; // Security Check

// Verify Auth
$user = validate_request($conn); // Will exit if invalid

$data = json_decode(file_get_contents("php://input"));

// Helper: Generate Slug
function generate_slug($text) {
    // Replace non-letter or digits by -
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    // Transliterate
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    // Remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);
    // Trim
    $text = trim($text, '-');
    // Lowercase
    $text = strtolower($text);
    return empty($text) ? 'n-a' : $text;
}

// Helper: Word Count & Reading Time
function calculate_reading_metrics($content) {
    $text = strip_tags($content);
    $word_count = str_word_count($text);
    $reading_time = ceil($word_count / 200); // Avg 200 words per minute
    return ['words' => $word_count, 'minutes' => $reading_time];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!empty($data->subjectId) && !empty($data->title) && !empty($data->type)) {
        
        try {
            // Generate Slug
            $slug = generate_slug($data->title);
            // Check if slug exists, append timestamp if needed
            $check = $conn->prepare("SELECT id FROM content WHERE slug = ?");
            $check->execute([$slug]);
            if ($check->rowCount() > 0) {
                $slug .= '-' . time();
            }

            // Metrics
            $metrics = calculate_reading_metrics($data->blogContent ?? '');

            // JSON Encodings
            $quizJson = isset($data->quiz) ? json_encode($data->quiz) : '[]';
            $faqsJson = isset($data->faqs) ? json_encode($data->faqs) : '[]';
            $targetKeywordsJson = isset($data->targetKeywords) ? json_encode($data->targetKeywords) : '[]';
            
            // Breadcrumbs & Canonical (Basic Logic for PHP)
            // Ideally should match Node.js logic, but for now we verify fields are saved.
            
            $sql = "INSERT INTO content (
                subject_id, title, slug, type, file_url, description, blog_content, youtube_id, quiz_data, 
                meta_title, meta_description, faqs, year_slug, unit_number, primary_keyword, target_keywords,
                content_word_count, reading_time_minutes, created_at
            ) VALUES (
                :subject, :title, :slug, :type, :file, :desc, :blog, :youtube, :quiz, 
                :metaTitle, :metaDesc, :faqs, :yearSlug, :unitNum, :primKey, :targetKey,
                :wordCount, :readTime, NOW()
            )";
            
            $stmt = $conn->prepare($sql);
            
            $stmt->bindParam(':subject', $data->subjectId);
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':slug', $slug);
            $stmt->bindParam(':type', $data->type);
            $stmt->bindParam(':file', $data->fileUrl); 
            $stmt->bindParam(':desc', $data->description); 
            $stmt->bindParam(':blog', $data->blogContent);
            $stmt->bindParam(':youtube', $data->youtubeId);
            $stmt->bindParam(':quiz', $quizJson);
            
            // NEW SEO FIELDS
            $stmt->bindParam(':metaTitle', $data->metaTitle);
            $stmt->bindParam(':metaDesc', $data->metaDescription);
            $stmt->bindParam(':faqs', $faqsJson);
            $stmt->bindParam(':yearSlug', $data->yearSlug);
            $stmt->bindParam(':unitNum', $data->unitNumber);
            $stmt->bindParam(':primKey', $data->primaryKeyword);
            $stmt->bindParam(':targetKey', $targetKeywordsJson);
            $stmt->bindParam(':wordCount', $metrics['words']);
            $stmt->bindParam(':readTime', $metrics['minutes']);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Topic saved successfully", "id" => $conn->lastInsertId(), "slug" => $slug]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to save topic."]);
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
