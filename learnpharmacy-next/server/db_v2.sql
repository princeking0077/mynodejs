-- LearnPharmacy.in Schema Upgrade v2
-- Supporting Dynamic Hierarchy and GPAT Test System

USE learnpharmacy;

-- 1. Years/Categories (e.g. First Year, GPAT Module)
CREATE TABLE IF NOT EXISTS curriculum_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Semesters (or Sections for GPAT)
CREATE TABLE IF NOT EXISTS curriculum_semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (year_id) REFERENCES curriculum_years(id) ON DELETE CASCADE
);

-- 3. Subjects
CREATE TABLE IF NOT EXISTS curriculum_subjects (
    id VARCHAR(50) PRIMARY KEY, -- Using code-based IDs like 'bp101t'
    semester_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Theory',
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES curriculum_semesters(id) ON DELETE CASCADE
);

-- 4. Quizzes (GPAT Tests)
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    time_limit_minutes INT DEFAULT 60,
    passing_score INT DEFAULT 50,
    category VARCHAR(100),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL, -- ["Opt A", "Opt B", "Opt C", "Opt D"]
    correct_answer INT NOT NULL, -- index 0-3
    explanation TEXT,
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Index for performance
CREATE INDEX idx_subject_sem ON curriculum_subjects(semester_id);
CREATE INDEX idx_sem_year ON curriculum_semesters(year_id);
CREATE INDEX idx_question_quiz ON quiz_questions(quiz_id);
