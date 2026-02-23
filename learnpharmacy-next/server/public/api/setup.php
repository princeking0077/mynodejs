<?php
include 'config.php';

// SQL to Create Tables
$sql = "
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS curriculum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('year', 'semester', 'subject') NOT NULL,
    title VARCHAR(100) NOT NULL,
    parent_id INT DEFAULT NULL,
    slug VARCHAR(100) NOT NULL,
    ordering INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    type ENUM('animation', 'note', 'video') NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    description TEXT,
    quiz_data JSON, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
";

try {
    // 1. Create Tables
    $conn->exec($sql);
    echo "Tables created successfully.<br>";

    // 2. Create Admin User
    $adminUser = 'shoaib.ss300@gmail.com';
    $plainPass = 'Shaikh@#$001001';
    $hash = password_hash($plainPass, PASSWORD_DEFAULT);

    // Check if user exists first
    $stmt = $conn->prepare("SELECT id FROM admins WHERE username = ?");
    $stmt->execute([$adminUser]);
    
    if ($stmt->rowCount() == 0) {
        $insert = $conn->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
        $insert->execute([$adminUser, $hash]);
        echo "Admin user <b>$adminUser</b> created successfully.<br>";
    } else {
        echo "Admin user already exists. Updating password...<br>";
        $update = $conn->prepare("UPDATE admins SET password_hash = ? WHERE username = ?");
        $update->execute([$hash, $adminUser]);
        echo "Password updated for <b>$adminUser</b>.<br>";
    }

    echo "<h3>Setup Complete! Please delete this file (setup.php) from your server for security.</h3>";

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
