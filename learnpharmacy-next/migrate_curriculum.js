const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Data to migrate (simplified from the JS files)
const curriculumData = [
    {
        title: "GPAT & Competitive Exams",
        slug: "gpat-module",
        semesters: [
            { title: "Pharmacology", slug: "pharmacology", subjects: ["General Pharmacology", "Autonomic Nervous System", "Central Nervous System", "Cardiovascular Pharmacology", "Respiratory & GIT", "Endocrine Pharmacology", "Chemotherapy", "Toxicology & Bioassay"] },
            { title: "Pharmaceutics", slug: "pharmaceutics", subjects: ["Physical Pharmaceutics", "Pharmaceutical Calculations", "Conventional Dosage Forms", "Advanced Dosage Forms", "Biopharmaceutics & Pharmacokinetics", "NDDS", "Industrial Pharmacy", "Packaging & Stability"] },
            { title: "Pharmaceutical Chemistry", slug: "pharmaceutical-chemistry", subjects: ["Medicinal Chemistry", "Organic Chemistry", "Inorganic Pharmaceutical Chemistry", "Physical Chemistry"] },
            { title: "Pharmaceutical Analysis", slug: "pharmaceutical-analysis", subjects: ["Topics"] },
            { title: "Pharmacognosy", slug: "pharmacognosy", subjects: ["Topics"] },
            { title: "Biochemistry", slug: "biochemistry", subjects: ["Topics"] },
            { title: "Microbiology", slug: "microbiology", subjects: ["Topics"] },
            { title: "Biotechnology", slug: "biotechnology", subjects: ["Topics"] },
            { title: "Pathophysiology", slug: "pathophysiology", subjects: ["Topics"] },
            { title: "Clinical Pharmacy", slug: "clinical-pharmacy", subjects: ["Topics"] },
            { title: "Hospital & Community Pharmacy", slug: "hospital-community-pharmacy", subjects: ["Topics"] },
            { title: "Pharmaceutical Jurisprudence", slug: "pharmaceutical-jurisprudence", subjects: ["Topics"] },
            { title: "Pharmaceutical Engineering", slug: "pharmaceutical-engineering", subjects: ["Topics"] },
            { title: "Biostatistics", slug: "biostatistics", subjects: ["Topics"] },
            { title: "General Awareness", slug: "general-awareness", subjects: ["Topics"] }
        ]
    },
    {
        title: "First Year", slug: "year-1",
        semesters: [
            {
                title: "Semester I", slug: "sem-1", subjects: [
                    { id: "bp101t", title: "Human Anatomy and Physiology – I" },
                    { id: "bp102t", title: "Pharmaceutical Analysis – I" },
                    { id: "bp103t", title: "Pharmaceutics – I" },
                    { id: "bp104t", title: "Pharmaceutical Inorganic Chemistry" },
                    { id: "bp105t", title: "Communication Skills" },
                    { id: "bp106rbt", title: "Remedial Biology" }
                ]
            },
            {
                title: "Semester II", slug: "sem-2", subjects: [
                    { id: "bp201t", title: "Human Anatomy and Physiology – II" },
                    { id: "bp202t", title: "Pharmaceutical Organic Chemistry – I" },
                    { id: "bp203t", title: "Biochemistry" },
                    { id: "bp204t", title: "Pathophysiology" },
                    { id: "bp205t", title: "Computer Applications in Pharmacy" },
                    { id: "bp206t", title: "Environmental Sciences" }
                ]
            }
        ]
    },
    {
        title: "Second Year", slug: "year-2",
        semesters: [
            {
                title: "Semester III", slug: "sem-3", subjects: [
                    { id: "bp301t", title: "Pharmaceutical Organic Chemistry – II" },
                    { id: "bp302t", title: "Physical Pharmaceutics – I" },
                    { id: "bp303t", title: "Pharmaceutical Microbiology" },
                    { id: "bp304t", title: "Pharmaceutical Engineering" }
                ]
            },
            {
                title: "Semester IV", slug: "sem-4", subjects: [
                    { id: "bp401t", title: "Pharmaceutical Organic Chemistry – III" },
                    { id: "bp402t", title: "Medicinal Chemistry – I" },
                    { id: "bp403t", title: "Physical Pharmaceutics – II" },
                    { id: "bp404t", title: "Pharmacology – I" },
                    { id: "bp405t", title: "Pharmacognosy and Phytochemistry – I" }
                ]
            }
        ]
    },
    {
        title: "Third Year", slug: "year-3",
        semesters: [
            {
                title: "Semester V", slug: "sem-5", subjects: [
                    { id: "bp501t", title: "Medicinal Chemistry – II" },
                    { id: "bp502t", title: "Industrial Pharmacy – I" },
                    { id: "bp503t", title: "Pharmacology – II" },
                    { id: "bp504t", title: "Pharmacognosy and Phytochemistry – II" },
                    { id: "bp505t", title: "Pharmaceutical Jurisprudence" }
                ]
            },
            {
                title: "Semester VI", slug: "sem-6", subjects: [
                    { id: "bp601t", title: "Medicinal Chemistry – III" },
                    { id: "bp602t", title: "Pharmacology – III" },
                    { id: "bp603t", title: "Herbal Drug Technology" },
                    { id: "bp604t", title: "Biopharmaceutics and Pharmacokinetics" },
                    { id: "bp605t", title: "Pharmaceutical Biotechnology" },
                    { id: "bp606t", title: "Quality Assurance" }
                ]
            }
        ]
    },
    {
        title: "Final Year", slug: "year-4",
        semesters: [
            {
                title: "Semester VII", slug: "sem-7", subjects: [
                    { id: "bp701t", title: "Instrumental Methods of Analysis" },
                    { id: "bp702t", title: "Industrial Pharmacy – II" },
                    { id: "bp703t", title: "Pharmacy Practice" },
                    { id: "bp704t", title: "Novel Drug Delivery System" }
                ]
            },
            {
                title: "Semester VIII", slug: "sem-8", subjects: [
                    { id: "bp801t", title: "Biostatistics and Research Methodology" },
                    { id: "bp802t", title: "Social and Preventive Pharmacy" }
                ]
            }
        ]
    }
];

async function run() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'pharma',
        password: process.env.DB_PASS || 'Suhana@001001',
        database: process.env.DB_NAME || 'learnpharmacy'
    });

    try {
        console.log("Starting Migration...");

        for (const [yIdx, year] of curriculumData.entries()) {
            const [yRes] = await conn.query(
                "INSERT INTO curriculum_years (title, slug, position) VALUES (?, ?, ?)",
                [year.title, year.slug, yIdx]
            );
            const yearId = yRes.insertId;
            console.log(`Inserted Year: ${year.title}`);

            for (const [sIdx, sem] of year.semesters.entries()) {
                const [sRes] = await conn.query(
                    "INSERT INTO curriculum_semesters (year_id, title, slug, position) VALUES (?, ?, ?, ?)",
                    [yearId, sem.title, sem.slug, sIdx]
                );
                const semId = sRes.insertId;

                for (const [subIdx, sub] of sem.subjects.entries()) {
                    const subId = typeof sub === 'string' ? `${sem.slug}-${subIdx}` : sub.id;
                    const subTitle = typeof sub === 'string' ? sub : sub.title;

                    await conn.query(
                        "INSERT INTO curriculum_subjects (id, semester_id, title, position) VALUES (?, ?, ?, ?)",
                        [subId, semId, subTitle, subIdx]
                    );
                }
            }
        }

        console.log("Migration Complete!");
    } catch (e) {
        console.error("Migration Failed:", e);
    } finally {
        await conn.end();
    }
}

run();
