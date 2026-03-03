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

const gpatSubjects = [
    {
        id: 'gpat-pharmacology',
        title: 'GPAT Pharmacology Syllabus',
        description: 'Complete GPAT Pharmacology syllabus including general pharmacology, ANS, CNS, cardiovascular, respiratory, endocrine, chemotherapy, and toxicology',
        category: 'gpat'
    },
    {
        id: 'gpat-pharmaceutics',
        title: 'GPAT Pharmaceutics Syllabus',
        description: 'Physical pharmaceutics, pharmaceutical calculations, dosage forms, biopharmaceutics, NDDS, industrial pharmacy, and packaging',
        category: 'gpat'
    },
    {
        id: 'gpat-pharmaceutical-chemistry',
        title: 'GPAT Pharmaceutical Chemistry',
        description: 'Medicinal chemistry, organic chemistry, inorganic pharmaceutical chemistry, and physical chemistry for GPAT',
        category: 'gpat'
    },
    {
        id: 'gpat-pharmaceutical-analysis',
        title: 'GPAT Pharmaceutical Analysis',
        description: 'Volumetric analysis, gravimetric analysis, chromatography, spectroscopy, electrochemical methods, and method validation',
        category: 'gpat'
    },
    {
        id: 'gpat-pharmacognosy',
        title: 'GPAT Pharmacognosy',
        description: 'General pharmacognosy, classification of crude drugs, phytochemistry, secondary metabolites, herbal drugs, and quality control',
        category: 'gpat'
    },
    {
        id: 'gpat-biochemistry',
        title: 'GPAT Biochemistry',
        description: 'Carbohydrate, protein, and lipid metabolism, enzymes, vitamins, hormones, molecular biology, and clinical biochemistry',
        category: 'gpat'
    },
    {
        id: 'gpat-microbiology',
        title: 'GPAT Microbiology',
        description: 'General microbiology, sterilization, immunology, microbial genetics, antibiotics, industrial microbiology, and fermentation',
        category: 'gpat'
    },
    {
        id: 'gpat-biotechnology',
        title: 'GPAT Biotechnology',
        description: 'Recombinant DNA technology, genetic engineering, monoclonal antibodies, vaccines, biopharmaceuticals, and bioinformatics',
        category: 'gpat'
    },
    {
        id: 'gpat-pathophysiology',
        title: 'GPAT Pathophysiology',
        description: 'Cell injury, inflammation, neoplasia, cardiovascular, respiratory, renal, endocrine, and neurological disorders',
        category: 'gpat'
    },
    {
        id: 'gpat-clinical-pharmacy',
        title: 'GPAT Clinical Pharmacy',
        description: 'Drug interactions, adverse drug reactions, therapeutic drug monitoring, pharmacovigilance, clinical trials, and patient counseling',
        category: 'gpat'
    },
    {
        id: 'gpat-hospital-community-pharmacy',
        title: 'GPAT Hospital & Community Pharmacy',
        description: 'Hospital pharmacy services, drug distribution systems, community pharmacy, OTC drugs, and drug information services',
        category: 'gpat'
    },
    {
        id: 'gpat-pharmaceutical-jurisprudence',
        title: 'GPAT Pharmaceutical Jurisprudence',
        description: 'Drugs & Cosmetics Act, Pharmacy Act, NDPS Act, DPCO, Indian Patent Act, regulatory affairs, and ethics in pharmacy',
        category: 'gpat'
    },
    {
        id: 'gpat-pharmaceutical-engineering',
        title: 'GPAT Pharmaceutical Engineering',
        description: 'Unit operations including size reduction, mixing, filtration, drying, distillation, heat transfer, and material handling',
        category: 'gpat'
    },
    {
        id: 'gpat-biostatistics-research-methodology',
        title: 'GPAT Biostatistics & Research Methodology',
        description: 'Probability, sampling methods, statistical tests, data interpretation, research design, and clinical data analysis',
        category: 'gpat'
    },
    {
        id: 'gpat-general-awareness',
        title: 'GPAT General Awareness',
        description: 'Recent drug approvals, pharmaceutical current affairs, regulatory updates, and pharma industry trends',
        category: 'gpat'
    }
];

async function seedGpatSubjects() {
    try {
        console.log('Starting GPAT subjects seeding...\n');

        for (const subject of gpatSubjects) {
            // Check if subject already exists
            const [existing] = await pool.execute(
                'SELECT id FROM subjects WHERE id = ?',
                [subject.id]
            );

            if (existing.length > 0) {
                console.log(`✓ Subject already exists: ${subject.title}`);
                // Update it to ensure description is correct
                await pool.execute(
                    'UPDATE subjects SET title = ?, description = ?, category = ? WHERE id = ?',
                    [subject.title, subject.description, subject.category, subject.id]
                );
            } else {
                // Insert new subject
                await pool.execute(
                    'INSERT INTO subjects (id, title, description, category) VALUES (?, ?, ?, ?)',
                    [subject.id, subject.title, subject.description, subject.category]
                );
                console.log(`+ Added new subject: ${subject.title}`);
            }
        }

        // Verify the count
        const [count] = await pool.query(
            'SELECT COUNT(*) as total FROM subjects WHERE category = "gpat"'
        );

        console.log(`\n✅ Seeding complete!`);
        console.log(`Total GPAT subjects in database: ${count[0].total}`);
        console.log('\nAll 15 GPAT modules are now available in the admin section.');

    } catch (error) {
        console.error('❌ Error seeding GPAT subjects:', error);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

if (require.main === module) {
    seedGpatSubjects();
}

module.exports = seedGpatSubjects;
