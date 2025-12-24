-- ApexApps Database Schema

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS curriculum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('year', 'semester', 'subject') NOT NULL,
    title VARCHAR(100) NOT NULL,
    parent_id INT DEFAULT NULL, -- Self-referencing relationship (Semester -> Year, Subject -> Semester)
    slug VARCHAR(100) NOT NULL,
    ordering INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    type ENUM('animation', 'note', 'video') NOT NULL,
    file_url VARCHAR(500) NOT NULL, -- URL to the file in /uploads/
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES curriculum(id) ON DELETE CASCADE
);

-- Default Admin User (Password: admin123 - User should change this!)
-- Hash generated using PHP password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2y$10$YourHashHerePlaceholder'); -- We will provide a script to generate this.
