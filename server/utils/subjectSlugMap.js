// MAPPING: Subject ID -> Slug
const subjectSlugMap = {
    // GPAT
    'gpat-pharm-gen': 'general-pharmacology',
    'gpat-pharm-ans': 'autonomic-nervous-system',
    'gpat-pharm-cns': 'central-nervous-system',
    'gpat-pharm-cvs': 'cardiovascular-pharmacology',
    'gpat-pharm-respgit': 'respiratory-git',
    'gpat-pharm-endo': 'endocrine-pharmacology',
    'gpat-pharm-chemo': 'chemotherapy',
    'gpat-pharm-tox': 'toxicology-bioassay',
    'gpat-ceutics-physical': 'physical-pharmaceutics',
    'gpat-ceutics-calcs': 'pharmaceutical-calculations',
    'gpat-ceutics-conv': 'conventional-dosage-forms',
    'gpat-ceutics-adv': 'advanced-dosage-forms',
    'gpat-ceutics-bio': 'biopharmaceutics-pharmacokinetics',
    'gpat-ceutics-ndds': 'ndds',
    'gpat-ceutics-ind': 'industrial-pharmacy',
    'gpat-ceutics-pack': 'packaging-stability',
    'gpat-chem-med': 'medicinal-chemistry',
    'gpat-chem-org': 'organic-chemistry',
    'gpat-chem-inorg': 'inorganic-pharmaceutical-chemistry',
    'gpat-chem-phys': 'physical-chemistry',
    'gpat-analysis-main': 'pharmaceutical-analysis-all-topics',
    'gpat-cog-main': 'pharmacognosy-all-topics',
    'gpat-biochem-main': 'biochemistry-all-topics',
    'gpat-micro-main': 'microbiology-all-topics',
    'gpat-biotech-main': 'biotechnology-all-topics',
    'gpat-patho-main': 'pathophysiology-all-topics',
    'gpat-clinical-main': 'clinical-pharmacy-all-topics',
    'gpat-hospital-main': 'hospital-community-pharmacy',
    'gpat-juris-main': 'pharmaceutical-jurisprudence',
    'gpat-eng-main': 'pharmaceutical-engineering',
    'gpat-biostat-main': 'biostatistics-research-methodology',
    'gpat-general-main': 'general-awareness',

    // B.Pharm Semester 1
    'bp101t': 'human-anatomy-and-physiology-i',
    'bp102t': 'pharmaceutical-analysis-i',
    'bp103t': 'pharmaceutics-i',
    'bp104t': 'pharmaceutical-inorganic-chemistry',
    'bp105t': 'communication-skills',
    'bp106rbt': 'remedial-biology-remedial-mathematics',

    // Semester 2
    'bp201t': 'human-anatomy-and-physiology-ii',
    'bp202t': 'pharmaceutical-organic-chemistry-i',
    'bp203t': 'biochemistry',
    'bp204t': 'pathophysiology',
    'bp205t': 'computer-applications-in-pharmacy',
    'bp206t': 'environmental-sciences',

    // Semester 3
    'bp301t': 'pharmaceutical-organic-chemistry-ii',
    'bp302t': 'physical-pharmaceutics-i',
    'bp303t': 'pharmaceutical-microbiology',
    'bp304t': 'pharmaceutical-engineering',

    // Semester 4
    'bp401t': 'pharmaceutical-organic-chemistry-iii',
    'bp402t': 'medicinal-chemistry-i',
    'bp403t': 'physical-pharmaceutics-ii',
    'bp404t': 'pharmacology-i',
    'bp405t': 'pharmacognosy-and-phytochemistry-i',

    // Semester 5
    'bp501t': 'medicinal-chemistry-ii',
    'bp502t': 'industrial-pharmacy-i',
    'bp503t': 'pharmacology-ii',
    'bp504t': 'pharmacognosy-and-phytochemistry-ii',
    'bp505t': 'pharmaceutical-jurisprudence',

    // Semester 6
    'bp601t': 'medicinal-chemistry-iii',
    'bp602t': 'pharmacology-iii',
    'bp603t': 'herbal-drug-technology',
    'bp604t': 'biopharmaceutics-and-pharmacokinetics',
    'bp605t': 'pharmaceutical-biotechnology',
    'bp606t': 'quality-assurance',

    // Semester 7
    'bp701t': 'instrumental-methods-of-analysis',
    'bp702t': 'industrial-pharmacy-ii',
    'bp703t': 'pharmacy-practice',
    'bp704t': 'novel-drug-delivery-system',
    'bp705t': 'practice-school',

    // Semester 8
    'bp801t': 'biostatistics-and-research-methodology',
    'bp802t': 'social-and-preventive-pharmacy',
    'bp803t': 'elective-i-ii',
    'bp804t': 'project-work'
};

module.exports = subjectSlugMap;
