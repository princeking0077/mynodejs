const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth.middleware');

// GET all years with semesters and subjects
router.get('/hierarchy', async (req, res) => {
    try {
        const [years] = await pool.query("SELECT * FROM curriculum_years ORDER BY position ASC");
        const [semesters] = await pool.query("SELECT * FROM curriculum_semesters ORDER BY position ASC");
        const [subjects] = await pool.query("SELECT * FROM curriculum_subjects ORDER BY position ASC");

        const hierarchy = years.map(y => ({
            ...y,
            semesters: semesters.filter(s => s.year_id === y.id).map(s => ({
                ...s,
                subjects: subjects.filter(sub => sub.semester_id === s.id)
            }))
        }));

        res.json(hierarchy);
    } catch (error) {
        console.error("HIERARCHY ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET all subjects (flat)
router.get('/subjects', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM subjects ORDER BY category, year_slug, semester, title ASC");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST new year
router.post('/years', authenticateToken, async (req, res) => {
    const { title, slug, position } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO curriculum_years (title, slug, position) VALUES (?, ?, ?)",
            [title, slug, position || 0]
        );
        res.json({ id: result.insertId, message: "Year added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new semester
router.post('/semesters', authenticateToken, async (req, res) => {
    const { year_id, title, slug, position } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO curriculum_semesters (year_id, title, slug, position) VALUES (?, ?, ?, ?)",
            [year_id, title, slug, position || 0]
        );
        res.json({ id: result.insertId, message: "Semester added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new subject
router.post('/subjects', authenticateToken, async (req, res) => {
    const { id, semester_id, title, type, position } = req.body;
    try {
        await pool.query(
            "INSERT INTO curriculum_subjects (id, semester_id, title, type, position) VALUES (?, ?, ?, ?, ?)",
            [id, semester_id, title, type || 'Theory', position || 0]
        );
        res.json({ id, message: "Subject added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE subject
router.delete('/subjects/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM curriculum_subjects WHERE id = ?", [req.params.id]);
        res.json({ message: "Subject deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
