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

    console.log('🌱 Starting GPAT Topics Seed (Target: "content" table)...');

    // Minimal Curriculum Mapping for GPAT (Titles -> IDs)
    // Sourced from client/src/data/curriculum.js
    const gpatSubjectMapping = {
        // Pharmacology
        "General Pharmacology": "gpat-pharm-gen",
        "Autonomic Nervous System": "gpat-pharm-ans",
        "Central Nervous System": "gpat-pharm-cns",
        "Cardiovascular Pharmacology": "gpat-pharm-cvs",
        "Respiratory & GIT": "gpat-pharm-respgit",
        "Endocrine Pharmacology": "gpat-pharm-endo",
        "Chemotherapy": "gpat-pharm-chemo",
        "Toxicology & Bioassay": "gpat-pharm-tox",

        // Pharmaceutics
        "Physical Pharmaceutics": "gpat-ceutics-physical",
        "Pharmaceutical Calculations": "gpat-ceutics-calcs",
        "Conventional Dosage Forms": "gpat-ceutics-conv",
        "Advanced Dosage Forms": "gpat-ceutics-adv",
        "Biopharmaceutics & Pharmacokinetics": "gpat-ceutics-bio",
        "NDDS": "gpat-ceutics-ndds",
        "Industrial Pharmacy": "gpat-ceutics-ind",
        "Packaging & Stability": "gpat-ceutics-pack",

        // Pharmaceutical Chemistry
        "Medicinal Chemistry": "gpat-chem-med",
        "Organic Chemistry": "gpat-chem-org",
        "Inorganic Pharmaceutical Chemistry": "gpat-chem-inorg",
        "Physical Chemistry": "gpat-chem-phys",

        // Others (Mapped from gpatSyllabusData keys to simplified IDs if not in curriculum explicit list, 
        // but assuming user only cares about what's in curriculum.js for Admin Panel)
        "Pharmaceutical Analysis": "gpat-analysis-main",
        "Pharmacognosy": "gpat-cog-main",
        "Biochemistry": "gpat-biochem-main",
        "Microbiology": "gpat-micro-main",
        "Biotechnology": "gpat-biotech-main",
        "Pathophysiology": "gpat-patho-main",
        "Clinical Pharmacy": "gpat-clinical-main",
        "Hospital & Community Pharmacy": "gpat-hospital-main",
        "Pharmaceutical Jurisprudence": "gpat-juris-main",
        "Pharmaceutical Engineering": "gpat-eng-main",
        "Biostatistics & Research Methodology": "gpat-biostat-main",
        "General Awareness": "gpat-general-main"
    };

    try {
        let totalAdded = 0;
        let totalSkipped = 0;

        for (const module of gpatSyllabus) {
            for (const [subjectTitle, topics] of Object.entries(module.topics)) {

                // 1. Resolve Subject ID from Map
                // Some titles in Syllabus Data might be "Topics" (e.g. for Pharmacognosy), 
                // in which case the Module Title is the subject.
                let targetSubjectId = gpatSubjectMapping[subjectTitle];

                if (!targetSubjectId) {
                    // Fallback: If the section key is "Topics", try mapping the Module Title
                    // e.g. Module "GPAT Pharmacognosy" -> Key "Topics" -> Map "Pharmacognosy"
                    if (subjectTitle === "Topics") {
                        const cleanModuleTitle = module.title.replace("GPAT ", "").replace(" Syllabus", "");
                        targetSubjectId = gpatSubjectMapping[cleanModuleTitle];
                    }
                }

                if (!targetSubjectId) {
                    // console.warn(`⚠️ Skipped: No ID mapping for subject "${subjectTitle}"`);
                    continue;
                }

                for (const topicTitle of topics) {
                    const slug = generateSlug(topicTitle);

                    // 2. Check if Topic exists in CONTENT table
                    const [existing] = await pool.query(
                        'SELECT id FROM content WHERE subject_id = ? AND (slug = ? OR title = ?)',
                        [targetSubjectId, slug, topicTitle]
                    );

                    if (existing.length > 0) {
                        totalSkipped++;
                        continue;
                    }

                    // 3. Insert Topic into CONTENT table
                    await pool.query(
                        `INSERT INTO content 
                        (subject_id, title, slug, description, blog_content, year_slug, unit_number, primary_keyword, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                        [
                            targetSubjectId,
                            topicTitle,
                            slug,
                            '', // description (animation code)
                            '', // blog_content
                            'gpat',
                            1, // Default Unit 1
                            topicTitle // Default keyword
                        ]
                    );

                    totalAdded++;
                    // Small delay
                    await new Promise(r => setTimeout(r, 2));
                }
            }
        }

        console.log(`✅ GPAT SEED (Content Table): Added ${totalAdded} topics, Skipped ${totalSkipped} existing.`);

    } catch (error) {
        console.error('❌ Error seeding topics:', error);
    }
}

module.exports = { seedGpatTopics };
