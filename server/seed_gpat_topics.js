// --- DATA FROM CLIENT ---
const gpatSyllabus = [
    {
        id: "pharmacology",
        topics: {
            "General Pharmacology": [
                "Scope and sources of drugs",
                "Routes of drug administration",
                "Pharmacokinetics (ADME)",
                "Pharmacodynamics",
                "Drug receptors and signal transduction",
                "Drug metabolism",
                "Bioavailability and bioequivalence",
                "Drug interactions",
                "Adverse drug reactions",
                "Drug dependence, tolerance, and addiction"
            ],
            "Autonomic Nervous System": [
                "Cholinergic agonists and antagonists",
                "Anticholinesterases",
                "Adrenergic agonists and antagonists",
                "Ganglion blockers",
                "Neuromuscular blocking agents"
            ],
            "Central Nervous System": [
                "Sedatives and hypnotics",
                "Antipsychotics",
                "Antidepressants",
                "Antiepileptics",
                "Anti-Parkinson drugs",
                "Opioid and non-opioid analgesics",
                "CNS stimulants"
            ],
            "Cardiovascular Pharmacology": [
                "Antihypertensive drugs",
                "Antianginal drugs",
                "Antiarrhythmic drugs",
                "Cardiac glycosides",
                "Drugs for heart failure",
                "Anticoagulants and antiplatelet drugs"
            ],
            "Respiratory & GIT": [
                "Bronchodilators",
                "Antiasthmatic drugs",
                "Antitussives and expectorants",
                "Antiulcer drugs",
                "Antiemetics",
                "Laxatives and antidiarrheals"
            ],
            "Endocrine Pharmacology": [
                "Insulin and oral antidiabetics",
                "Thyroid and antithyroid drugs",
                "Corticosteroids",
                "Sex hormones and contraceptives"
            ],
            "Chemotherapy": [
                "Antibiotics",
                "Antitubercular drugs",
                "Antifungal drugs",
                "Antiviral drugs",
                "Anticancer drugs"
            ],
            "Toxicology & Bioassay": [
                "Acute and chronic toxicity",
                "Poisoning and antidotes",
                "Bioassay methods"
            ]
        }
    },
    {
        id: "pharmaceutics",
        topics: {
            "Physical Pharmaceutics": [
                "States of matter",
                "Surface and interfacial phenomena",
                "Rheology",
                "Solubility and dissolution",
                "Diffusion and dissolution rate"
            ],
            "Pharmaceutical Calculations": [
                "Percentage solutions",
                "Isotonic solutions",
                "Alligation",
                "Dose calculations"
            ],
            "Conventional Dosage Forms": [
                "Tablets",
                "Capsules",
                "Powders",
                "Liquid orals"
            ],
            "Advanced Dosage Forms": [
                "Parenterals",
                "Suspensions and emulsions",
                "Semisolids",
                "Aerosols"
            ],
            "Biopharmaceutics & Pharmacokinetics": [
                "Absorption, distribution, metabolism, excretion",
                "Bioavailability studies"
            ],
            "NDDS": [
                "Sustained release systems",
                "Controlled drug delivery",
                "Targeted drug delivery"
            ],
            "Industrial Pharmacy": [
                "Pilot plant scale-up",
                "GMP",
                "Validation"
            ],
            "Packaging & Stability": [
                "Packaging materials",
                "Stability testing",
                "ICH stability guidelines"
            ]
        }
    },
    {
        id: "pharmaceutical-chemistry",
        topics: {
            "Medicinal Chemistry": [
                "Drug classification",
                "Drug synthesis",
                "Structure–Activity Relationship (SAR)",
                "Drug metabolism"
            ],
            "Organic Chemistry": [
                "Reaction mechanisms",
                "Stereochemistry",
                "Heterocyclic chemistry",
                "Name reactions"
            ],
            "Inorganic Pharmaceutical Chemistry": [
                "Inorganic drugs",
                "Limit tests",
                "Pharmaceutical aids"
            ],
            "Physical Chemistry": [
                "Thermodynamics",
                "Chemical kinetics",
                "Electrochemistry",
                "Phase equilibria",
                "Surface chemistry"
            ]
        }
    }
];

const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Seeds GPAT topics into the database using the provided pool.
 * @param {import('mysql2/promise').Pool} pool 
 */
async function seedGpatTopics(pool) {
    if (!pool) {
        console.error('❌ seedGpatTopics: No database pool provided.');
        return;
    }

    console.log('🌱 Starting GPAT Topics Seed...');

    try {
        let totalAdded = 0;
        let totalSkipped = 0;

        for (const module of gpatSyllabus) {
            // console.log(`Processing Module: ${module.id}`);

            for (const [subjectTitle, topics] of Object.entries(module.topics)) {
                // 1. Find Subject ID by Title
                const [subjects] = await pool.query(
                    'SELECT id FROM subjects WHERE title = ? OR title LIKE ?',
                    [subjectTitle, `${subjectTitle}%`] // Flexible match
                );

                if (subjects.length === 0) {
                    // console.warn(`⚠️ Subject not found in DB: "${subjectTitle}". Skipping topics.`);
                    continue;
                }

                const subjectId = subjects[0].id;
                // console.log(`   👉 Found Subject: "${subjectTitle}" (${subjectId})`);

                for (const topicTitle of topics) {
                    const slug = generateSlug(topicTitle);

                    // 2. Check if Topic exists
                    const [existing] = await pool.query(
                        'SELECT id FROM topics WHERE subject_id = ? AND (slug = ? OR title = ?)',
                        [subjectId, slug, topicTitle]
                    );

                    if (existing.length > 0) {
                        totalSkipped++;
                        continue;
                    }

                    // 3. Insert Topic
                    // Defaulting to year_slug='gpat' and unit=1 as these are likely 1 unit per sub-topic or just general
                    await pool.query(
                        `INSERT INTO topics 
                        (id, subject_id, title, slug, type, description, year_slug, unit_number, primary_keyword, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                        [
                            Date.now() + Math.floor(Math.random() * 100000), // generic ID
                            subjectId,
                            topicTitle,
                            slug,
                            'notes', // Default type
                            '', // No description initially
                            'gpat',
                            1, // Default Unit 1
                            topicTitle // Default keyword
                        ]
                    );

                    totalAdded++;

                    // Small delay to prevent ID collision if using Date.now() strictly
                    await new Promise(r => setTimeout(r, 2));
                }
            }
        }

        console.log(`✅ GPAT SEED: Added ${totalAdded} topics, Skipped ${totalSkipped} existing.`);

    } catch (error) {
        console.error('❌ Error seeding topics:', error);
    }
}

module.exports = { seedGpatTopics };
