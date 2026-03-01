const pool = require('./db');

const baseCurriculum = [
    {
        id: 'year-1',
        title: 'First Year',
        semesters: [
            { id: 'sem-1', title: 'Semester I', subjects: [{ id: 'bp101t', title: 'Human Anatomy and Physiology – I', type: 'Theory & Practical' }, { id: 'bp102t', title: 'Pharmaceutical Analysis – I', type: 'Theory & Practical' }, { id: 'bp103t', title: 'Pharmaceutics – I', type: 'Theory & Practical' }, { id: 'bp104t', title: 'Pharmaceutical Inorganic Chemistry', type: 'Theory & Practical' }, { id: 'bp105t', title: 'Communication Skills', type: 'Theory & Practical' }, { id: 'bp106rbt', title: 'Remedial Biology', type: 'Theory & Practical' }] },
            { id: 'sem-2', title: 'Semester II', subjects: [{ id: 'bp201t', title: 'Human Anatomy and Physiology – II', type: 'Theory & Practical' }, { id: 'bp202t', title: 'Pharmaceutical Organic Chemistry – I', type: 'Theory & Practical' }, { id: 'bp203t', title: 'Biochemistry', type: 'Theory & Practical' }, { id: 'bp204t', title: 'Pathophysiology', type: 'Theory' }, { id: 'bp205t', title: 'Computer Applications in Pharmacy', type: 'Theory & Practical' }, { id: 'bp206t', title: 'Environmental Sciences', type: 'Theory' }] }
        ]
    },
    {
        id: 'year-2',
        title: 'Second Year',
        semesters: [
            { id: 'sem-3', title: 'Semester III', subjects: [{ id: 'bp301t', title: 'Pharmaceutical Organic Chemistry – II', type: 'Theory & Practical' }, { id: 'bp302t', title: 'Physical Pharmaceutics – I', type: 'Theory & Practical' }, { id: 'bp303t', title: 'Pharmaceutical Microbiology', type: 'Theory & Practical' }, { id: 'bp304t', title: 'Pharmaceutical Engineering', type: 'Theory & Practical' }] },
            { id: 'sem-4', title: 'Semester IV', subjects: [{ id: 'bp401t', title: 'Pharmaceutical Organic Chemistry – III', type: 'Theory' }, { id: 'bp402t', title: 'Medicinal Chemistry – I', type: 'Theory & Practical' }, { id: 'bp403t', title: 'Physical Pharmaceutics – II', type: 'Theory & Practical' }, { id: 'bp404t', title: 'Pharmacology – I', type: 'Theory & Practical' }, { id: 'bp405t', title: 'Pharmacognosy and Phytochemistry – I', type: 'Theory & Practical' }] }
        ]
    },
    {
        id: 'year-3',
        title: 'Third Year',
        semesters: [
            { id: 'sem-5', title: 'Semester V', subjects: [{ id: 'bp501t', title: 'Medicinal Chemistry – II', type: 'Theory' }, { id: 'bp502t', title: 'Industrial Pharmacy – I', type: 'Theory & Practical' }, { id: 'bp503t', title: 'Pharmacology – II', type: 'Theory & Practical' }, { id: 'bp504t', title: 'Pharmacognosy and Phytochemistry – II', type: 'Theory & Practical' }, { id: 'bp505t', title: 'Pharmaceutical Jurisprudence', type: 'Theory' }] },
            { id: 'sem-6', title: 'Semester VI', subjects: [{ id: 'bp601t', title: 'Medicinal Chemistry – III', type: 'Theory & Practical' }, { id: 'bp602t', title: 'Pharmacology – III', type: 'Theory & Practical' }, { id: 'bp603t', title: 'Herbal Drug Technology', type: 'Theory & Practical' }, { id: 'bp604t', title: 'Biopharmaceutics and Pharmacokinetics', type: 'Theory' }, { id: 'bp605t', title: 'Pharmaceutical Biotechnology', type: 'Theory' }, { id: 'bp606t', title: 'Quality Assurance', type: 'Theory' }] }
        ]
    },
    {
        id: 'year-4',
        title: 'Final Year',
        semesters: [
            { id: 'sem-7', title: 'Semester VII', subjects: [{ id: 'bp701t', title: 'Instrumental Methods of Analysis', type: 'Theory & Practical' }, { id: 'bp702t', title: 'Industrial Pharmacy – II', type: 'Theory' }, { id: 'bp703t', title: 'Pharmacy Practice', type: 'Theory' }, { id: 'bp704t', title: 'Novel Drug Delivery System', type: 'Theory' }, { id: 'bp705t', title: 'Practice School', type: 'Practical' }] },
            { id: 'sem-8', title: 'Semester VIII', subjects: [{ id: 'bp801t', title: 'Biostatistics and Research Methodology', type: 'Theory' }, { id: 'bp802t', title: 'Social and Preventive Pharmacy', type: 'Theory' }, { id: 'bp803t', title: 'Elective – I & II', type: 'Elective' }] }
        ]
    }
];

const updateSchema = async () => {
    try {
        console.log('Connected to database pool.');

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS subjects (
                id VARCHAR(100) PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                year_title VARCHAR(100) NOT NULL,
                semester_title VARCHAR(100) NOT NULL,
                title VARCHAR(255) NOT NULL,
                type VARCHAR(100) DEFAULT 'Theory'
            );
        `);
        console.log('Created subjects table.');

        for (const year of baseCurriculum) {
            for (const sem of year.semesters) {
                for (const sub of sem.subjects) {
                    await pool.execute(
                        `INSERT INTO subjects (id, category, year_title, semester_title, title, type) 
                         VALUES (?, 'bpharm', ?, ?, ?, ?)
                         ON DUPLICATE KEY UPDATE title = VALUES(title), type = VALUES(type);`,
                        [sub.id, year.title, sem.title, sub.title, sub.type]
                    );
                }
            }
        }
        console.log('B.Pharm curriculum seeded!');

        process.exit(0);

    } catch (error) {
        console.error('Schema update failed:', error);
        process.exit(1);
    }
};

updateSchema();
