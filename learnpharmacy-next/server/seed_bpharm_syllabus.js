const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Create pool with direct credentials
const pool = mysql.createPool({
    host: 'localhost',
    user: 'learnpharmacy_user',
    password: 'Pharmacy@2024Secure#',
    database: 'learnpharmacy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Define Slug Generator locally if needed
function makeSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

const subjectMapping = {
    // Year 1 Sem 1
    'HUMAN ANATOMY AND PHYSIOLOGY – I': 'bp101t',
    'PHARMACEUTICAL ANALYSIS – I': 'bp102t',
    'PHARMACEUTICS – I': 'bp103t',
    'PHARMACEUTICAL INORGANIC CHEMISTRY': 'bp104t',
    'COMMUNICATION SKILLS': 'bp105t',
    'REMEDIAL BIOLOGY': 'bp106rbt',
    'REMEDIAL MATHEMATICS': 'bp106rbt',

    // Year 1 Sem 2
    'HUMAN ANATOMY AND PHYSIOLOGY – II': 'bp201t',
    'PHARMACEUTICAL ORGANIC CHEMISTRY – I': 'bp202t',
    'BIOCHEMISTRY': 'bp203t',
    'PATHOPHYSIOLOGY': 'bp204t',
    'COMPUTER APPLICATIONS IN PHARMACY': 'bp205t',
    'ENVIRONMENTAL SCIENCES': 'bp206t',

    // Year 2 Sem 3
    'PHARMACEUTICAL ORGANIC CHEMISTRY – II': 'bp301t',
    'PHYSICAL PHARMACEUTICS – I': 'bp302t',
    'PHARMACEUTICAL MICROBIOLOGY': 'bp303t',
    'PHARMACEUTICAL ENGINEERING': 'bp304t',

    // Year 2 Sem 4
    'PHARMACEUTICAL ORGANIC CHEMISTRY – III': 'bp401t',
    'MEDICINAL CHEMISTRY – I': 'bp402t',
    'PHYSICAL PHARMACEUTICS – II': 'bp403t',
    'PHARMACOLOGY – I': 'bp404t',
    'PHARMACOGNOSY AND PHYTOCHEMISTRY – I': 'bp405t',

    // Year 3 Sem 5
    'MEDICINAL CHEMISTRY – II': 'bp501t',
    'INDUSTRIAL PHARMACY – I': 'bp502t',
    'PHARMACOLOGY – II': 'bp503t',
    'PHARMACOGNOSY AND PHYTOCHEMISTRY – II': 'bp504t',
    'PHARMACEUTICAL JURISPRUDENCE': 'bp505t',

    // Year 3 Sem 6
    'MEDICINAL CHEMISTRY – III': 'bp601t',
    'PHARMACOLOGY – III': 'bp602t',
    'HERBAL DRUG TECHNOLOGY': 'bp603t',
    'BIOPHARMACEUTICS AND PHARMACOKINETICS': 'bp604t',
    'PHARMACEUTICAL BIOTECHNOLOGY': 'bp605t',
    'PHARMACEUTICAL QUALITY ASSURANCE': 'bp606t',

    // Year 4 Sem 7
    'INSTRUMENTAL METHODS OF ANALYSIS': 'bp701t',
    'INDUSTRIAL PHARMACY – II': 'bp702t',
    'PHARMACY PRACTICE': 'bp703t',
    'NOVEL DRUG DELIVERY SYSTEMS': 'bp704t',
    'PRACTICE SCHOOL': 'bp705t',

    // Year 4 Sem 8
    'BIOSTATISTICS & RESEARCH METHODOLOGY': 'bp801t',
    'SOCIAL & PREVENTIVE PHARMACY': 'bp802t',
    'PHARMA MARKETING MANAGEMENT (Elective)': 'bp803t',
    'PHARMACEUTICAL REGULATORY SCIENCE (Elective)': 'bp803t',
    'PHARMACOVIGILANCE (Elective)': 'bp803t'
};

const romanToInt = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6
};

async function seedBPharmSyllabus() {
    try {
        const filePaths = [
            path.join(__dirname, 'data', 'syllabus_part1.txt'),
            path.join(__dirname, 'data', 'syllabus_part2.txt'),
            path.join(__dirname, 'data', 'syllabus_part3.txt')
        ];

        let fullText = '';
        for (const file of filePaths) {
            if (fs.existsSync(file)) {
                fullText += fs.readFileSync(file, 'utf8') + '\n';
            }
        }

        const lines = fullText.split('\n');
        let currentSubjectId = null;
        let currentSubjectName = '';
        let currentUnit = 1;
        let count = 0;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            if (line.startsWith('---') || line.startsWith('## ')) continue;

            // Check for Subject Header: ### [Number]. [TITLE]
            const subjectMatch = line.match(/^###\s+\d+\.\s+(.+)$/);
            if (subjectMatch) {
                let title = subjectMatch[1].trim();

                // Manual fix based on map
                if (title === 'QUALITY ASSURANCE') title = 'PHARMACEUTICAL QUALITY ASSURANCE';

                if (subjectMapping[title]) {
                    currentSubjectId = subjectMapping[title];
                    currentSubjectName = title;
                    console.log(`Processing Subject: ${title} (${currentSubjectId})`);
                } else {
                    // Try removing "(Elective)"
                    const cleanTitle = title.replace(/\s*\(Elective\)\s*/i, '');
                    if (subjectMapping[cleanTitle]) {
                        currentSubjectId = subjectMapping[cleanTitle];
                        currentSubjectName = title;
                        console.log(`Processing Subject (Cleaned): ${title} -> ${currentSubjectId}`);
                    } else {
                        console.warn(`WARNING: No mapping found for subject: "${title}"`);
                        currentSubjectId = null;
                    }
                }
                continue;
            }

            // Check for Unit: **Unit [Roman]: [Title]**
            const unitMatch = line.match(/^\*\*Unit\s+([IVX]+):(.+)\*\*$/);
            if (unitMatch) {
                const roman = unitMatch[1];
                currentUnit = romanToInt[roman] || 1;
                continue;
            }

            // Check for Topic: * [Topic]
            if (line.startsWith('*') && currentSubjectId) {
                const topicTitle = line.substring(1).trim();
                const slug = makeSlug(topicTitle);

                try {
                    // Check if exists
                    const [rows] = await pool.execute(
                        'SELECT id FROM content WHERE subject_id = ? AND title = ? AND type = ?',
                        [currentSubjectId, topicTitle, 'topic']
                    );

                    if (rows.length === 0) {
                        await pool.execute(
                            `INSERT INTO content 
                (subject_id, title, type, slug, unit_number, content, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                            [currentSubjectId, topicTitle, 'topic', slug, currentUnit, '']
                        );
                        count++;
                        console.log(`Inserted: ${currentSubjectId} - ${topicTitle}`);
                    }
                } catch (dbError) {
                    console.error(`Failed to insert ${topicTitle}:`, dbError.message);
                }
            }
        }

        console.log(`Seeding complete. Inserted ${count} new topics.`);

    } catch (error) {
        console.error('Error seeding syllabus:', error);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

if (require.main === module) {
    seedBPharmSyllabus();
}

module.exports = seedBPharmSyllabus;
