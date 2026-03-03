const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth.middleware');

// GET all quizzes
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM quizzes WHERE is_active = 1 ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET single quiz by slug with questions
router.get('/slug/:slug', async (req, res) => {
    try {
        const [quiz] = await pool.query("SELECT * FROM quizzes WHERE slug = ?", [req.params.slug]);
        if (quiz.length === 0) return res.status(404).json({ message: "Quiz not found" });

        const [questions] = await pool.query("SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY position ASC", [quiz[0].id]);

        res.json({ ...quiz[0], questions });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET single quiz by ID with questions
router.get('/:id', async (req, res) => {
    try {
        const [quiz] = await pool.query("SELECT * FROM quizzes WHERE id = ?", [req.params.id]);
        if (quiz.length === 0) return res.status(404).json({ message: "Quiz not found" });

        const [questions] = await pool.query("SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY position ASC", [req.params.id]);

        res.json({ ...quiz[0], questions });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST new quiz
router.post('/', authenticateToken, async (req, res) => {
    const { title, slug, description, time_limit_minutes, positive_marks, negative_marks, category, is_active } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO quizzes (title, slug, description, time_limit_minutes, positive_marks, negative_marks, category, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [title, slug, description, time_limit_minutes || 60, positive_marks || 1, negative_marks || 0, category, is_active !== undefined ? is_active : 1]
        );
        res.json({ id: result.insertId, message: "Quiz created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update quiz
router.put('/:id', authenticateToken, async (req, res) => {
    const { title, slug, description, time_limit_minutes, positive_marks, negative_marks, category, is_active } = req.body;
    try {
        await pool.query(
            "UPDATE quizzes SET title = ?, slug = ?, description = ?, time_limit_minutes = ?, positive_marks = ?, negative_marks = ?, category = ?, is_active = ? WHERE id = ?",
            [title, slug, description, time_limit_minutes, positive_marks, negative_marks, category, is_active, req.params.id]
        );
        res.json({ message: "Quiz updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE quiz
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM quizzes WHERE id = ?", [req.params.id]);
        res.json({ message: "Quiz deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- QUESTIONS ---

// POST add question
router.post('/:id/questions', authenticateToken, async (req, res) => {
    const { question_text, options, correct_answer, explanation, position } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer, explanation, position) VALUES (?, ?, ?, ?, ?, ?)",
            [req.params.id, question_text, JSON.stringify(options), correct_answer, explanation, position || 0]
        );
        res.json({ id: result.insertId, message: "Question added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE question
router.delete('/questions/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM quiz_questions WHERE id = ?", [req.params.id]);
        res.json({ message: "Question deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
