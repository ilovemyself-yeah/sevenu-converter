const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { convertFile } = require('./utils/converter');

const app = express();
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.post('/api/convert', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const inputPath = req.file.path;
        const outputFormat = req.body.format || 'pdf'; // Default to PDF

        // Basic validation
        const supportedFormats = ['pdf', 'docx', 'pptx'];
        if (!supportedFormats.includes(outputFormat)) {
            // Clean up uploaded file
            fs.unlinkSync(inputPath);
            return res.status(400).json({ error: 'Unsupported output format' });
        }

        const outputPath = await convertFile(inputPath, outputFormat);

        res.download(outputPath, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            // Cleanup files after download (or attempt)
            try {
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            } catch (cleanupErr) {
                console.error('Cleanup error:', cleanupErr);
            }
        });

    } catch (error) {
        console.error('Conversion error:', error);
        // Cleanup input file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) { }
        }
        res.status(500).json({ error: 'Conversion failed', details: error.message });
    }
});

// Keep process alive hack
setInterval(() => { }, 1000);

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
