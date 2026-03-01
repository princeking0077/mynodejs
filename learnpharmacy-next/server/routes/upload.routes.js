const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const authenticateToken = require('../middleware/auth.middleware');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Memory Storage to intercept buffer for Sharp
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 15000000 }, // 15MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|html|css|js|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Invalid file type!');
    }
}

// Upload Endpoint with Sharp Optimization
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        let filename = 'file-' + Date.now() + path.extname(req.file.originalname).toLowerCase();

        // Optimize Images
        if (req.file.mimetype.startsWith('image/') && req.file.mimetype !== 'image/gif') {
            // Force save to webp for extreme size reduction while keeping quality, or keep original extension if preferred
            filename = 'img-' + Date.now() + '.webp';
            const uploadPath = path.join(uploadDir, filename);

            await sharp(req.file.buffer)
                .resize({ width: 1200, withoutEnlargement: true }) // Scale down huge photos
                .webp({ quality: 80 }) // 80% quality optimal WebP
                .toFile(uploadPath);
        } else {
            // Non-images (PDFs, GIFs, etc.) saved directly
            const uploadPath = path.join(uploadDir, filename);
            fs.writeFileSync(uploadPath, req.file.buffer);
        }

        // Return relative URL
        const fileUrl = `/uploads/${filename}`;

        res.json({
            message: "File uploaded successfully",
            url: fileUrl
        });

    } catch (error) {
        console.error("Upload/Sharp Error:", error);
        res.status(500).json({ message: "File processing failed" });
    }
});

module.exports = router;
