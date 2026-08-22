import { GovernmentScheme } from '../../shared/types.ts';

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'scheme-post-matric-scholarship',
    slug: 'post-matric-scholarship-sc-st-obc',
    name: 'Post-Matric Scholarship for SC / ST / OBC / EBC Students',
    nameTranslations: {
      hi: 'अनुसूचित जाति/जनजाति/अन्य पिछड़ा वर्ग हेतु पोस्ट-मैट्रिक छात्रवृत्ति',
      te: 'ఎస్సీ/ఎస్టీ/బీసీ విద్యార్థుల పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్',
      ta: 'SC / ST / OBC மாணவர்களுக்கான பிந்தைய மெட்ரிக் கல்வி உதவித்தொகை',
      kn: 'ಎಸ್‌ಸಿ/ಎಸ್‌ಟಿ/ಒಬಿಸಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮೆಟ್ರಿಕ್ ನಂತರದ ವಿದ್ಯಾರ್ಥಿವೇತನ',
      ml: 'പോസ്റ്റ്-മെട്രിക് സ്കോളർഷിപ്പ് (SC/ST/OBC)',
      mr: 'पोस्ट-मॅट्रिक शिष्यवृत्ती (SC/ST/OBC)',
      bn: 'পোস্ট-ম্যাট্রিক স্কলারশিপ (SC/ST/OBC)'
    },
    tagline: 'Financial support covering full tuition and maintenance allowance for post-secondary education.',
    ministry: 'Ministry of Social Justice & Empowerment & Ministry of Education',
    department: 'Department of Higher Education',
    category: 'education',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Provides financial assistance to eligible students studying in Class 11, 12, ITI, Polytechnic, Degree, Engineering, and PG courses.',
    fullDescription: 'The Post-Matric Scholarship is a centrally sponsored scheme aimed at increasing enrolment and graduation rates in higher education among underprivileged and low-income students by covering non-refundable academic fees and monthly maintenance allowances directly into bank accounts via DBT.',
    benefits: [
      {
        title: 'Full Course Tuition Fee Coverage',
        description: 'Covers non-refundable college and university tuition fees directly reimbursed.',
        amount: 'Up to ₹1,20,000 / year (as per approved fee structure)',
        type: 'tuition_waiver'
      },
      {
        title: 'Monthly Maintenance & Living Allowance',
        description: 'Monthly stipend paid for hostelers and day scholars to cover books and living expenses.',
        amount: '₹4,000 - ₹13,500 / year',
        frequency: 'Annual DBT in installments',
        type: 'direct_benefit_transfer'
      }
    ],
    criteria: [
      {
        id: 'crit-pms-student',
        field: 'studentStatus',
        operator: 'equals',
        expectedValue: true,
        label: 'Active Student Status',
        description: 'Applicant must be currently enrolled in a recognized post-matric course (Class 11 to PhD).',
        sourceDocId: 'doc-edu-postmatric-2026-v3',
        sourceDocTitle: 'Post-Matric Scholarship Scheme Guidelines (v3.2)',
        sourcePageNumber: 4
      },
      {
        id: 'crit-pms-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 250000,
        label: 'Annual Family Income Limit',
        description: 'Total annual household income from all sources must not exceed ₹2,50,000.',
        sourceDocId: 'doc-edu-postmatric-2026-v3',
        sourceDocTitle: 'Post-Matric Scholarship Scheme Guidelines (v3.2)',
        sourcePageNumber: 8
      },
      {
        id: 'crit-pms-education',
        field: 'educationLevel',
        operator: 'in',
        expectedValue: ['10th_pass', '12th_pass', 'undergraduate', 'postgraduate', 'diploma', 'doctorate'],
        label: 'Minimum Education Level',
        description: 'Must have completed at least 10th standard (Matriculation) from a recognized board.',
        sourceDocId: 'doc-edu-postmatric-2026-v3',
        sourceDocTitle: 'Post-Matric Scholarship Scheme Guidelines (v3.2)',
        sourcePageNumber: 6
      },
      {
        id: 'crit-pms-category',
        field: 'socialCategory',
        operator: 'in',
        expectedValue: ['sc', 'st', 'obc', 'ews'],
        label: 'Eligible Social Categories',
        description: 'Applicant should belong to SC, ST, OBC, or EWS category with valid caste certificate.',
        sourceDocId: 'doc-edu-postmatric-2026-v3',
        sourceDocTitle: 'Post-Matric Scholarship Scheme Guidelines (v3.2)',
        sourcePageNumber: 9
      }
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'Linked with bank account for Aadhaar-enabled payment system (AEPS)', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] },
      { name: 'Income Certificate', description: 'Issued by Revenue Authority (Tahsildar/Mandal Officer) of current financial year', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Caste / Category Certificate', description: 'Valid Community certificate issued by competent state authority', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Previous Academic Marksheet', description: '10th / 12th / Previous semester grade card', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'College Admission / Fee Receipt', description: 'Bonafide certificate or current year admission fee receipt', mandatory: true, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Register on National Scholarship Portal (NSP)', instruction: 'Visit scholarships.gov.in and complete Aadhaar-based e-KYC registration.', onlineUrl: 'https://scholarships.gov.in' },
      { stepNumber: 2, title: 'Fill Post-Matric Scholarship Application', instruction: 'Enter academic institution details, roll number, bank account, and upload certificates.' },
      { stepNumber: 3, title: 'Institute Verification', instruction: 'Submit physical copy with originals to your college scholarship nodal officer for online verification.' },
      { stepNumber: 4, title: 'District & State Approval', instruction: 'Welfare department reviews the application and releases DBT funds directly to your Aadhaar-linked bank account.' }
    ],
    importantDates: {
      applicationStart: '2026-07-01',
      applicationDeadline: '2026-10-31',
      status: 'OPEN',
      notes: 'Portal open for academic year 2026-27 renewal and fresh applications.'
    },
    officialUrl: 'https://scholarships.gov.in',
    helpline: '0120-6619540',
    activeVersion: '3.2',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-edu-postmatric-2026-v3'],
    tags: ['scholarship', 'students', 'higher education', 'tuition waiver', 'college', 'SC/ST/OBC', 'DBT']
  },
  {
    id: 'scheme-pm-kisan-samman-nidhi',
    slug: 'pm-kisan-samman-nidhi',
    name: 'PM Kisan Samman Nidhi (PM-KISAN)',
    nameTranslations: {
      hi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
      te: 'పీఎం కిసాన్ సమ్మాన్ నిధి',
      ta: 'பிரதமர் கிசான் சம்மான் நிதி',
      kn: 'ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
      ml: 'പിഎം കിസാൻ സമ്മാൻ നിധി',
      mr: 'पीएम किसान सन्मान निधी',
      bn: 'প্রধানমন্ত্রী কিষাণ সম্মান নিধি'
    },
    tagline: 'Direct income support of ₹6,000 annually in 3 equal installments to all landholding farmer families.',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    department: 'Department of Agriculture & Cooperation',
    category: 'agriculture',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Assured cash assistance of ₹6,000 per year transferred directly to bank accounts of small and marginal farmer households.',
    fullDescription: 'PM-KISAN provides income support to all landholding farmer families having cultivable land in their names. The financial benefit of ₹6,000 per annum is payable in three equal four-monthly installments of ₹2,000 each to meet agricultural inputs and household needs.',
    benefits: [
      {
        title: 'Annual Income Support of ₹6,000',
        description: 'Paid in 3 equal installments of ₹2,000 every 4 months directly into Aadhaar-seeded bank accounts.',
        amount: '₹6,000 / year',
        frequency: 'Every 4 months (April-July, Aug-Nov, Dec-March)',
        type: 'direct_benefit_transfer'
      }
    ],
    criteria: [
      {
        id: 'crit-pmk-occupation',
        field: 'occupation',
        operator: 'in',
        expectedValue: ['farmer', 'daily_wage', 'self_employed'],
        label: 'Farmer / Agriculture Occupation',
        description: 'Applicant must be engaged in farming or cultivation.',
        sourceDocId: 'doc-agri-pmkisan-2026-v4',
        sourceDocTitle: 'PM-KISAN Operational Guidelines (v4.1)',
        sourcePageNumber: 5
      },
      {
        id: 'crit-pmk-land',
        field: 'landholding',
        operator: 'in',
        expectedValue: ['marginal', 'small', 'medium_large'],
        label: 'Cultivable Landholding',
        description: 'Family must own cultivable land with valid revenue records in their name.',
        sourceDocId: 'doc-agri-pmkisan-2026-v4',
        sourceDocTitle: 'PM-KISAN Operational Guidelines (v4.1)',
        sourcePageNumber: 7
      },
      {
        id: 'crit-pmk-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 800000,
        label: 'Income Tax Exclusion Check',
        description: 'Applicant and family members must not be institutional landholders or income tax payers.',
        sourceDocId: 'doc-agri-pmkisan-2026-v4',
        sourceDocTitle: 'PM-KISAN Operational Guidelines (v4.1)',
        sourcePageNumber: 11
      }
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'Mandatory with completed biometric e-KYC or OTP e-KYC', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] },
      { name: 'Land Record (RoR / Pattadar Passbook)', description: 'Record of Rights (7/12 extract / Khasra / Khatoni) in farmer name', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Bank Passbook / Account Details', description: 'NPCI Aadhaar-seeded bank account for direct transfer', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Online Farmer Registration', instruction: 'Visit pmkisan.gov.in and click on "New Farmer Registration" or visit nearest CSC center.', onlineUrl: 'https://pmkisan.gov.in' },
      { stepNumber: 2, title: 'Enter Land Survey & Khata Details', instruction: 'Provide state, district, sub-district, village, and land parcel survey number.' },
      { stepNumber: 3, title: 'State Nodal Verification', instruction: 'Village Revenue Officer (VRO/Patwari) verifies land ownership details on state land portal.' },
      { stepNumber: 4, title: 'DBT Installment Credited', instruction: 'Funds credited directly via PFMS system every 4 months upon successful e-KYC.' }
    ],
    importantDates: {
      status: 'YEAR_ROUND',
      notes: 'New farmer registrations and e-KYC updates are open round the year.'
    },
    officialUrl: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606',
    activeVersion: '4.1',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-agri-pmkisan-2026-v4'],
    tags: ['agriculture', 'farmers', 'cash transfer', 'DBT', 'kisan', 'landholders']
  },
  {
    id: 'scheme-pm-awas-yojana',
    slug: 'pm-awas-yojana-housing-for-all',
    name: 'Pradhan Mantri Awas Yojana (PMAY-Urban 2.0 & Gramin)',
    nameTranslations: {
      hi: 'प्रधानमंत्री आवास योजना (पीएमएवाई)',
      te: 'ప్రధాన మంత్రి ఆవాస్ యోజన (ఇళ్ల నిర్మాణం)',
      ta: 'பிரதமர் வீட்டு வசதி திட்டம்',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಆವಾಸ್ ಯೋಜನೆ',
      ml: 'പ്രധാൻ മന്ത്രി ആവാസ് യോജന',
      mr: 'प्रधानमंत्री आवास योजना',
      bn: 'প্রধানমন্ত্রী আবাস যোজনা'
    },
    tagline: 'Pucca houses and interest subsidy up to ₹2.67 Lakh for homeless and low-income families.',
    ministry: 'Ministry of Housing and Urban Affairs & Ministry of Rural Development',
    department: 'Housing for All Division',
    category: 'housing',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Subsidies and financial grants to build or purchase a permanent pucca house with basic amenities for EWS, LIG, and rural poor.',
    fullDescription: 'PMAY ensures that every eligible citizen in urban and rural India possesses a pucca house equipped with toilet, electricity, LPG connection, and drinking water. Beneficiaries receive upfront interest subsidy under Credit Linked Subsidy Scheme (CLSS) or direct construction assistance.',
    benefits: [
      {
        title: 'Interest Subsidy on Housing Loan (CLSS)',
        description: 'Up to 6.5% interest subsidy credited upfront to reduce home loan principal and EMI.',
        amount: 'Up to ₹2,67,000',
        type: 'subsidy'
      },
      {
        title: 'Direct Construction Grant (Gramin / BLC)',
        description: 'Direct financial assistance to build individual pucca house in rural / urban areas.',
        amount: '₹1,20,000 - ₹1,50,000',
        type: 'direct_benefit_transfer'
      }
    ],
    criteria: [
      {
        id: 'crit-pmay-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 600000,
        label: 'Annual Household Income (EWS/LIG)',
        description: 'Income up to ₹3,00,000 for EWS and up to ₹6,00,000 for Low Income Group (LIG).',
        sourceDocId: 'doc-house-pmay-2026-v5',
        sourceDocTitle: 'PMAY Scheme Guidelines (v5.0)',
        sourcePageNumber: 12
      },
      {
        id: 'crit-pmay-age',
        field: 'age',
        operator: 'gte',
        expectedValue: 18,
        label: 'Minimum Age',
        description: 'Head of the household must be at least 18 years of age.',
        sourceDocId: 'doc-house-pmay-2026-v5',
        sourceDocTitle: 'PMAY Scheme Guidelines (v5.0)',
        sourcePageNumber: 14
      }
    ],
    documentsRequired: [
      { name: 'Aadhaar Card of all family members', description: 'Identity verification for all members living together', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Income Certificate / Salary Slips / ITR', description: 'Proof of annual income within EWS/LIG bracket', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Affidavit of No Pucca House', description: 'Self-declaration that the beneficiary does not own a pucca house anywhere in India', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Land Title / Property Agreement', description: 'Documents of plot if applying for Beneficiary-Led Construction (BLC)', mandatory: false, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Apply via PMAYMIS or Gram Panchayat', instruction: 'Visit pmaymis.gov.in or contact your Ward Office / Gram Panchayat Sachiv.', onlineUrl: 'https://pmaymis.gov.in' },
      { stepNumber: 2, title: 'Citizen Assessment & Geo-tagging', instruction: 'Local municipal/panchayat team surveys the household and captures geo-tagged photographs.' },
      { stepNumber: 3, title: 'Sanction Order & Subsidy Release', instruction: 'Approved beneficiaries receive direct bank transfer in stages (foundation, roof, completion) or loan subsidy.' }
    ],
    importantDates: {
      status: 'OPEN',
      notes: 'PMAY Urban 2.0 active for 2026-27 urban and rural housing sanctions.'
    },
    officialUrl: 'https://pmaymis.gov.in',
    helpline: '1800-11-6163 / 1800-11-3377',
    activeVersion: '5.0',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-house-pmay-2026-v5'],
    tags: ['housing', 'pucca house', 'home loan subsidy', 'EWS', 'LIG', 'CLSS', 'shelter']
  },
  {
    id: 'scheme-ayushman-bharat-pmjay',
    slug: 'ayushman-bharat-pmjay',
    name: 'Ayushman Bharat - PM Jan Arogya Yojana (PM-JAY)',
    nameTranslations: {
      hi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
      te: 'ఆయుష్మాన్ భారత్ - ఆరోగ్య బీమా పథకం',
      ta: 'ஆயுஷ்மான் பாரத் - பிரதம மந்திரி மக்கள் ஆரோக்கிய திட்டம்',
      kn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ - ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನ ಆರೋಗ್ಯ ಯೋಜನೆ',
      ml: 'ആയുഷ്മാൻ ഭാരത് - പിഎം ജയ്',
      mr: 'आयुष्मान भारत - जन आरोग्य योजना',
      bn: 'আয়ুষ্মান ভারত - প্রধানমন্ত্রী জন আরোগ্য যোজনা'
    },
    tagline: 'Cashless health insurance coverage of ₹5,00,000 per family per year for secondary and tertiary care.',
    ministry: 'Ministry of Health and Family Welfare',
    department: 'National Health Authority (NHA)',
    category: 'healthcare',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'World’s largest government-funded health assurance scheme providing ₹5 Lakh free medical treatments in empaneled public & private hospitals.',
    fullDescription: 'PM-JAY provides health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalisation across 27,000+ empaneled hospitals. Covers 1,900+ procedures including cardiology, oncology, orthopaedics, and critical surgeries with zero out-of-pocket costs.',
    benefits: [
      {
        title: '₹5,00,000 Cashless Health Cover',
        description: 'Complete coverage for hospitalization, surgeries, medicines, diagnostic tests, and post-operative care.',
        amount: '₹5,00,000 / family / year',
        type: 'insurance'
      },
      {
        title: 'Coverage for Pre-existing Conditions',
        description: 'All pre-existing conditions are covered from day one of card generation with no waiting periods.',
        type: 'insurance'
      }
    ],
    criteria: [
      {
        id: 'crit-pmjay-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 300000,
        label: 'Vulnerable / Low-Income Household',
        description: 'Families identified under SECC 2011 deprivation criteria or holding active state ration card (BPL / Antyodaya).',
        sourceDocId: 'doc-health-pmjay-2026-v3',
        sourceDocTitle: 'Ayushman Bharat PM-JAY Operational Guidelines (v3.4)',
        sourcePageNumber: 7
      }
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'For biometric identification and instant Ayushman Card generation', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] },
      { name: 'Ration Card / NFSA Card', description: 'Food security ration card with family member names', mandatory: true, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Check Name on Beneficiary Portal', instruction: 'Visit beneficiary.nha.gov.in and search by Aadhaar or Ration Card number.', onlineUrl: 'https://beneficiary.nha.gov.in' },
      { stepNumber: 2, title: 'e-KYC Verification', instruction: 'Authenticate via Aadhaar OTP, Face RD app, or biometric fingerprint at CSC / Ayushman Mitra kiosk.' },
      { stepNumber: 3, title: 'Download Ayushman Card (PVC/Digital)', instruction: 'Instant plastic Ayushman Card issued for free cashless treatment at any empaneled hospital nationwide.' }
    ],
    importantDates: {
      status: 'YEAR_ROUND',
      notes: 'Card issuance and hospital treatments are active 24x7 throughout the year.'
    },
    officialUrl: 'https://nha.gov.in',
    helpline: '14555 / 1800-111-565',
    activeVersion: '3.4',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-health-pmjay-2026-v3'],
    tags: ['healthcare', 'health insurance', 'hospitalization', 'cashless', 'medical treatment', 'ayushman card']
  },
  {
    id: 'scheme-pmmvy-maternity-benefit',
    slug: 'pradhan-mantri-matru-vandana-yojana',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    nameTranslations: {
      hi: 'प्रधानमंत्री मातृ वंदना योजना',
      te: 'ప్రధాన మంత్రి మాతృ వందన యోజన',
      ta: 'பிரதமர் மாத்ரு வந்தனா திட்டம்',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ',
      ml: 'പ്രധാൻ മന്ത്രി മാതൃ വന്ദന യോജന',
      mr: 'प्रधानमंत्री मातृ वंदना योजना',
      bn: 'প্রধানমন্ত্রী মাতৃ বন্দনা যোজনা'
    },
    tagline: 'Conditional cash incentive of ₹5,000 - ₹6,000 for pregnant women and lactating mothers for health & nutrition.',
    ministry: 'Ministry of Women and Child Development',
    department: 'Women Welfare & Nutrition Division',
    category: 'women',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Cash assistance directly into bank accounts to compensate for wage loss and promote institutional deliveries and infant vaccinations.',
    fullDescription: 'PMMVY provides financial support to pregnant women and lactating mothers for improved health and nutrition practices. Under PMMVY 2.0, ₹5,000 is provided for the first child in two installments, and ₹6,000 is given in a single installment for a second girl child to discourage gender bias.',
    benefits: [
      {
        title: 'Maternity Cash Incentive',
        description: '₹5,000 for first child upon antenatal checkup and child immunization; ₹6,000 for second girl child.',
        amount: '₹5,000 - ₹6,000',
        frequency: 'Direct Bank Transfer in installments',
        type: 'direct_benefit_transfer'
      }
    ],
    criteria: [
      {
        id: 'crit-pmmvy-gender',
        field: 'gender',
        operator: 'equals',
        expectedValue: 'female',
        label: 'Gender: Female',
        description: 'Scheme is exclusively for pregnant women and lactating mothers.',
        sourceDocId: 'doc-women-pmmvy-2026-v2',
        sourceDocTitle: 'PMMVY Implementation Norms (v2.3)',
        sourcePageNumber: 3
      },
      {
        id: 'crit-pmmvy-age',
        field: 'age',
        operator: 'gte',
        expectedValue: 19,
        label: 'Minimum Age (19+)',
        description: 'Beneficiary must be 19 years of age or older at the time of pregnancy.',
        sourceDocId: 'doc-women-pmmvy-2026-v2',
        sourceDocTitle: 'PMMVY Implementation Norms (v2.3)',
        sourcePageNumber: 4
      },
      {
        id: 'crit-pmmvy-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 800000,
        label: 'Family Income Ceiling',
        description: 'Excludes regular Central/State government employees and PSU employees who receive paid maternity leave.',
        sourceDocId: 'doc-women-pmmvy-2026-v2',
        sourceDocTitle: 'PMMVY Implementation Norms (v2.3)',
        sourcePageNumber: 6
      }
    ],
    documentsRequired: [
      { name: 'Mother and Child Protection (MCP) Card', description: 'Proof of ANC registration at Anganwadi / Primary Health Centre (PHC)', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] },
      { name: 'Aadhaar Card of Mother and Husband', description: 'Identity verification for DBT registration', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Bank Passbook / Post Office Account', description: 'Mother’s individual bank account details', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Child Birth Certificate (for 2nd installment)', description: 'Issued by hospital or municipal authority', mandatory: true, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Register Pregnancy at Anganwadi Centre / PMMVY Portal', instruction: 'Register within 150 days of Last Menstrual Period (LMP) on pmmvy.wcd.gov.in or through ASHA/Anganwadi worker.', onlineUrl: 'https://pmmvy.wcd.gov.in' },
      { stepNumber: 2, title: 'Complete Antenatal Checkup (ANC)', instruction: 'Receive 1st installment of ₹3,000 upon registering pregnancy and completing at least one ANC.' },
      { stepNumber: 3, title: 'Child Birth Registration & 1st Cycle Vaccine', instruction: 'Receive 2nd installment of ₹2,000 after child birth and primary immunisation (BCG, OPV, DPT, Hep-B).' }
    ],
    importantDates: {
      status: 'YEAR_ROUND',
      notes: 'Eligible mothers can register at any time during pregnancy or within 270 days of delivery.'
    },
    officialUrl: 'https://pmmvy.wcd.gov.in',
    helpline: '1098 / 011-23382393',
    activeVersion: '2.3',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-women-pmmvy-2026-v2'],
    tags: ['women', 'maternity', 'pregnancy', 'nutrition', 'infant health', 'ASHA', 'Anganwadi', 'cash transfer']
  },
  {
    id: 'scheme-ap-jagananna-vidya-deevena',
    slug: 'ap-jagananna-vidya-deevena-rtf',
    name: 'Andhra Pradesh Jagananna Vidya Deevena (Full Fee Reimbursement)',
    nameTranslations: {
      hi: 'आंध्र प्रदेश जगनन्ना विद्या दीवेना (पूर्ण शुल्क प्रतिपूर्ति)',
      te: 'ఆంధ్రప్రదేశ్ జగనన్న విద్యా దీవెన (పూర్తి ఫీజు రీయింబర్స్‌మెంట్)',
      ta: 'ஆந்திர பிரதேசம் ஜெகனன்னா வித்யா தீவெனா',
      kn: 'ಆಂಧ್ರಪ್ರದೇಶ ಜಗನಣ್ಣ ವಿದ್ಯಾ ದೀವನ',
      ml: 'ആന്ധ്രാപ്രദേശ് ജഗനണ്ണ വിദ്യാ ദീവെന',
      mr: 'आंध्र प्रदेश जगनन्ना विद्या दीवेना',
      bn: 'অন্ধ্রপ্রদেশ জগনন্না বিদ্যা দীভেনা'
    },
    tagline: '100% tuition fee reimbursement directly to mothers of students studying ITI, Polytechnic, Degree, B.Tech, Pharmacy, MBA, and MCA.',
    ministry: 'Government of Andhra Pradesh',
    department: 'Higher Education & Social Welfare Department',
    category: 'education',
    level: 'STATE',
    applicableStates: ['Andhra Pradesh'],
    shortDescription: 'State scheme providing full college tuition fee reimbursement directly to mothers of college students residing in Andhra Pradesh.',
    fullDescription: 'Jagananna Vidya Deevena ensures that poverty is not a barrier to pursuing higher education. It covers complete tuition fee reimbursement for polytechnic, ITI, degree, professional, and postgraduate courses for all eligible students enrolled in state colleges.',
    benefits: [
      {
        title: 'Full College Tuition Fee Reimbursement (RTF)',
        description: '100% college fees reimbursed on quarterly basis directly into mother’s bank account.',
        amount: '₹20,000 - ₹1,10,000 / year (Full Course Fee)',
        type: 'tuition_waiver'
      }
    ],
    criteria: [
      {
        id: 'crit-jvd-state',
        field: 'state',
        operator: 'equals',
        expectedValue: 'Andhra Pradesh',
        label: 'State Domicile: Andhra Pradesh',
        description: 'Student and family must be permanent residents of Andhra Pradesh.',
        sourceDocId: 'doc-state-ap-jvd-2026-v2',
        sourceDocTitle: 'AP Jagananna Vidya Deevena Guidelines (v2.2)',
        sourcePageNumber: 3
      },
      {
        id: 'crit-jvd-student',
        field: 'studentStatus',
        operator: 'equals',
        expectedValue: true,
        label: 'Currently Enrolled Student',
        description: 'Must be enrolled in polytechnic, ITI, undergraduate, or postgraduate degree in an approved college.',
        sourceDocId: 'doc-state-ap-jvd-2026-v2',
        sourceDocTitle: 'AP Jagananna Vidya Deevena Guidelines (v2.2)',
        sourcePageNumber: 5
      },
      {
        id: 'crit-jvd-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 250000,
        label: 'Annual Family Income Limit (≤ ₹2.5 Lakh)',
        description: 'Total annual household income must not exceed ₹2,50,000.',
        sourceDocId: 'doc-state-ap-jvd-2026-v2',
        sourceDocTitle: 'AP Jagananna Vidya Deevena Guidelines (v2.2)',
        sourcePageNumber: 7
      },
      {
        id: 'crit-jvd-category',
        field: 'socialCategory',
        operator: 'in',
        expectedValue: ['sc', 'st', 'obc', 'ews', 'general'],
        label: 'Open to All Eligible Categories',
        description: 'SC, ST, BC, EBC, Kapu, Minority, and Differently Abled students with income eligibility.',
        sourceDocId: 'doc-state-ap-jvd-2026-v2',
        sourceDocTitle: 'AP Jagananna Vidya Deevena Guidelines (v2.2)',
        sourcePageNumber: 8
      }
    ],
    documentsRequired: [
      { name: 'Aadhaar of Student and Mother', description: 'Mandatory for DBT authentication into Mother’s account', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Income Certificate / Integrated Certificate', description: 'Issued by AP MeeSeva (Current Year)', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Rice Card / Ration Card', description: 'AP State White Rice Card for household validation', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'College Admission Allotment Order', description: 'Convenor quota admission allotment letter', mandatory: true, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Registration at Village / Ward Secretariat (Grama Sachivalayam)', instruction: 'Welfare Assistant registers the student in Jnanabhumi portal upon admission.', onlineUrl: 'https://jnanabhumi.ap.gov.in' },
      { stepNumber: 2, title: 'Biometric / Face e-KYC', instruction: 'Student and mother complete biometric authentication at the college / sachivalayam.' },
      { stepNumber: 3, title: 'Quarterly DBT Release', instruction: 'Fee amount credited directly to mother’s account in 4 quarterly releases.' }
    ],
    importantDates: {
      status: 'OPEN',
      notes: 'Quarterly DBT disbursements active for 2026 academic sessions.'
    },
    officialUrl: 'https://jnanabhumi.ap.gov.in',
    helpline: '1902 (AP Spandana Toll Free)',
    activeVersion: '2.2',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-state-ap-jvd-2026-v2'],
    tags: ['Andhra Pradesh', 'higher education', 'college fee', 'tuition reimbursement', 'scholarship', 'B.Tech', 'Degree', 'Jnanabhumi']
  },
  {
    id: 'scheme-pm-mudra-yojana',
    slug: 'pradhan-mantri-mudra-yojana',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    nameTranslations: {
      hi: 'प्रधानमंत्री मुद्रा योजना (पीएमएमवाई)',
      te: 'ప్రధాన మంత్రి ముద్రా యోజన (వ్యాపార రుణాలు)',
      ta: 'பிரதமர் முத்ரா திட்டம்',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಮುದ್ರಾ ಯೋಜನೆ',
      ml: 'പ്രധാൻ മന്ത്രി മുദ്ര യോജന',
      mr: 'प्रधानमंत्री मुद्रा योजना',
      bn: 'প্রধানমন্ত্রী মুদ্রা যোজনা'
    },
    tagline: 'Collateral-free business loans up to ₹10 Lakh for small enterprises, shops, artisans, and self-employed youth.',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services',
    category: 'financial',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Provides collateral-free loans in 3 tiers (Shishu, Kishore, Tarun) to start or expand micro-enterprises and small businesses.',
    fullDescription: 'PMMY enables non-corporate, non-farm small and micro enterprises to access formal credit up to ₹10 Lakh without pledging property collateral. Loans are extended through commercial banks, RRBs, Small Finance Banks, and MFIs with subsidized interest rates.',
    benefits: [
      {
        title: 'Collateral-Free Business Credit',
        description: 'Shishu (up to ₹50,000), Kishore (₹50,000 - ₹5 Lakh), Tarun (₹5 Lakh - ₹10 Lakh) with affordable interest.',
        amount: 'Up to ₹10,00,000',
        type: 'loan_concession'
      },
      {
        title: 'Mudra Debit Card',
        description: 'Pre-loaded working capital overdraft facility for easy business withdrawals.',
        type: 'in_kind'
      }
    ],
    criteria: [
      {
        id: 'crit-mudra-age',
        field: 'age',
        operator: 'gte',
        expectedValue: 18,
        label: 'Minimum Age (18+)',
        description: 'Applicant must be an Indian citizen of at least 18 years of age.',
        sourceDocId: 'doc-fin-mudra-2026-v3',
        sourceDocTitle: 'PMMY Lending Guidelines (v3.1)',
        sourcePageNumber: 4
      },
      {
        id: 'crit-mudra-occupation',
        field: 'occupation',
        operator: 'in',
        expectedValue: ['self_employed', 'artisan', 'daily_wage', 'unemployed', 'farmer'],
        label: 'Self-Employed / Entrepreneur / Artisan',
        description: 'Must have a viable business proposal in manufacturing, trading, service, or agro-processing.',
        sourceDocId: 'doc-fin-mudra-2026-v3',
        sourceDocTitle: 'PMMY Lending Guidelines (v3.1)',
        sourcePageNumber: 6
      }
    ],
    documentsRequired: [
      { name: 'Aadhaar & PAN Card', description: 'Proof of identity and tax identification', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] },
      { name: 'Business Proposal / Project Report', description: 'Brief business model and fund requirement estimation', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Bank Statement (Last 6 Months)', description: 'Bank account statement if existing account holder', mandatory: false, acceptableFormats: ['PDF'] },
      { name: 'Business Address Proof / Trade License / Udyam Registration', description: 'Proof of business location or MSME Udyam certificate', mandatory: false, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Apply on JanSamarth / Mudra Portal', instruction: 'Submit digital loan application at jansamarth.in or visit any public/private bank branch.', onlineUrl: 'https://www.jansamarth.in' },
      { stepNumber: 2, title: 'Document Verification & Loan Sanction', instruction: 'Bank manager reviews business viability and issues sanction letter within 7-10 working days.' },
      { stepNumber: 3, title: 'Disbursement & Mudra Card', instruction: 'Loan amount credited directly to enterprise current/savings account with Mudra RuPay card.' }
    ],
    importantDates: {
      status: 'YEAR_ROUND',
      notes: 'Mudra loan applications processed year-round across all bank branches.'
    },
    officialUrl: 'https://mudra.org.in',
    helpline: '1800-180-1111 / 1800-11-0001',
    activeVersion: '3.1',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-fin-mudra-2026-v3'],
    tags: ['business loan', 'startup', 'MUDRA', 'self-employed', 'micro enterprise', 'collateral-free', 'financial assistance']
  },
  {
    id: 'scheme-national-apprenticeship-naps',
    slug: 'national-apprenticeship-promotion-scheme',
    name: 'National Apprenticeship Promotion Scheme (NAPS-2)',
    nameTranslations: {
      hi: 'राष्ट्रीय शिक्षुता संवर्धन योजना (एनएपीएस)',
      te: 'జాతీయ అప్రెంటిస్‌షిప్ ప్రమోషన్ పథకం',
      ta: 'தேசிய தொழிற்பழகுநர் ஊக்குவிப்பு திட்டம்',
      kn: 'ರಾಷ್ಟ್ರೀಯ ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ ಪ್ರಚಾರ ಯೋಜನೆ',
      ml: 'ദേശീയ അപ്രന്റീസ്ഷിപ്പ് പ്രമോഷൻ സ്കീം',
      mr: 'राष्ट्रीय शिकाऊ उमेदवारी प्रोत्साहन योजना',
      bn: 'জাতীয় শিক্ষানবিশি প্রচার প্রকল্প'
    },
    tagline: 'Paid on-the-job industrial training and government stipend of up to ₹1,500/month for young jobseekers.',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    department: 'Apprenticeship Training Wing',
    category: 'employment',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Industrial on-the-job skill training with government-subsidized monthly stipend for ITI, diploma, graduate, and 10th/12th pass youth.',
    fullDescription: 'NAPS incentivizes industrial employers to engage apprentices by providing direct government stipend sharing of 25% (up to ₹1,500/month) transferred directly to the apprentice’s bank account, boosting employability through hands-on company experience.',
    benefits: [
      {
        title: 'Monthly Government Stipend Support',
        description: 'Direct Benefit Transfer (DBT) of ₹1,500/month in addition to industry employer stipend.',
        amount: '₹1,500 / month (Government DBT component)',
        frequency: 'Monthly DBT',
        type: 'direct_benefit_transfer'
      },
      {
        title: 'National Apprenticeship Certificate (NAC)',
        description: 'Government of India certified skill credential recognized by PSUs and top companies.',
        type: 'in_kind'
      }
    ],
    criteria: [
      {
        id: 'crit-naps-age',
        field: 'age',
        operator: 'between',
        expectedValue: { min: 14, max: 35 },
        label: 'Age between 14 and 35 years',
        description: 'Candidates must be between 14 and 35 years of age.',
        sourceDocId: 'doc-skill-naps-2026-v2',
        sourceDocTitle: 'NAPS Guidelines (v2.0)',
        sourcePageNumber: 5
      },
      {
        id: 'crit-naps-education',
        field: 'educationLevel',
        operator: 'in',
        expectedValue: ['10th_pass', '12th_pass', 'diploma', 'undergraduate', 'postgraduate'],
        label: 'Minimum 10th Pass / ITI / Diploma / Degree',
        description: 'Educational qualification of at least 5th/10th standard depending on designated trade.',
        sourceDocId: 'doc-skill-naps-2026-v2',
        sourceDocTitle: 'NAPS Guidelines (v2.0)',
        sourcePageNumber: 7
      }
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'Mandatory for DBT stipend authentication', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Educational / ITI / Degree Certificate', description: 'Marksheets of qualifying exam', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Bank Account Passbook', description: 'Active Aadhaar-seeded bank account', mandatory: true, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Register on Apprenticeship Portal', instruction: 'Create profile on apprenticeshipindia.gov.in and complete e-KYC.', onlineUrl: 'https://www.apprenticeshipindia.gov.in' },
      { stepNumber: 2, title: 'Apply for Apprenticeship Opportunities', instruction: 'Search registered companies and apply for open training positions.' },
      { stepNumber: 3, title: 'Sign Apprenticeship Contract & Training', instruction: 'Sign digital contract upon selection and receive monthly DBT stipend during training.' }
    ],
    importantDates: {
      status: 'YEAR_ROUND',
      notes: 'Apprenticeship drives and hiring open across sectors monthly.'
    },
    officialUrl: 'https://www.apprenticeshipindia.gov.in',
    helpline: '0120-4405016',
    activeVersion: '2.0',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-skill-naps-2026-v2'],
    tags: ['apprenticeship', 'jobs', 'skill development', 'stipend', 'ITI', 'diploma', 'youth employment']
  },
  {
    id: 'scheme-nsap-old-age-pension',
    slug: 'indira-gandhi-national-old-age-pension-scheme',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    nameTranslations: {
      hi: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना',
      te: 'ఇందిరా గాంధీ జాతీయ వృద్ధాప్య పెన్షన్ పథకం',
      ta: 'இந்திரா காந்தி தேசிய முதியோர் ஓய்வூதியத் திட்டம்',
      kn: 'ಇಂದಿರಾ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ ಯೋಜನೆ',
      ml: 'ഇന്ദിരാഗാന്ധി ദേശീയ വാർദ്ധക്യകാല പെൻഷൻ',
      mr: 'इंदिरा गांधी राष्ट्रीय वृद्धापकाळ निवृत्तीवेतन योजना',
      bn: 'ইন্দিরা গান্ধী জাতীয় বার্ধক্য ভাতা প্রকল্প'
    },
    tagline: 'Monthly pension assistance for destitute senior citizens aged 60+ living below the poverty line.',
    ministry: 'Ministry of Rural Development',
    department: 'Social Assistance Division (NSAP)',
    category: 'senior_citizens',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Monthly financial assistance transferred directly to elderly citizens living in BPL households.',
    fullDescription: 'IGNOAPS is a core component of the National Social Assistance Programme (NSAP) providing social security and monthly subsistence pension to senior citizens aged 60 years and above who belong to Below Poverty Line (BPL) families.',
    benefits: [
      {
        title: 'Monthly Senior Citizen Pension',
        description: 'Monthly direct cash transfer to ensure dignified living and healthcare support in old age.',
        amount: '₹500 - ₹3,000 / month (Central + State contribution combined)',
        frequency: 'Monthly DBT',
        type: 'direct_benefit_transfer'
      }
    ],
    criteria: [
      {
        id: 'crit-ignoaps-age',
        field: 'age',
        operator: 'gte',
        expectedValue: 60,
        label: 'Age: 60 years and above',
        description: 'Applicant must be at least 60 years old.',
        sourceDocId: 'doc-sr-ignoaps-2026-v2',
        sourceDocTitle: 'NSAP IGNOAPS Guidelines (v2.1)',
        sourcePageNumber: 4
      },
      {
        id: 'crit-ignoaps-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 120000,
        label: 'Below Poverty Line (BPL) Status',
        description: 'Applicant household must be registered under state/central BPL list or income under ₹1,20,000/yr.',
        sourceDocId: 'doc-sr-ignoaps-2026-v2',
        sourceDocTitle: 'NSAP IGNOAPS Guidelines (v2.1)',
        sourcePageNumber: 6
      }
    ],
    documentsRequired: [
      { name: 'Age Proof / Voter ID / Aadhaar Card', description: 'Document verifying age 60+', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] },
      { name: 'BPL Ration Card / Income Certificate', description: 'Proof of poverty line status', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Bank / Post Office Passbook', description: 'Aadhaar-linked account for pension DBT', mandatory: true, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Submit Form at Panchayat / Ward Office', instruction: 'Fill NSAP application at Gram Panchayat / Municipal Office or online at nsap.nic.in.', onlineUrl: 'https://nsap.nic.in' },
      { stepNumber: 2, title: 'Verification by Social Welfare Officer', instruction: 'BDO / Tahsildar inspects documents and approves pension sanction order.' },
      { stepNumber: 3, title: 'Monthly Pension Credit', instruction: 'Pension credited directly on 1st week of every month.' }
    ],
    importantDates: {
      status: 'YEAR_ROUND',
      notes: 'Pension enrollment processed throughout the year.'
    },
    officialUrl: 'https://nsap.nic.in',
    helpline: '1800-111-555',
    activeVersion: '2.1',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-sr-ignoaps-2026-v2'],
    tags: ['senior citizens', 'old age pension', 'elderly', 'NSAP', 'BPL', 'social security']
  },
  {
    id: 'scheme-divyangjan-swavalamban',
    slug: 'divyangjan-swavalamban-welfare-scheme',
    name: 'Scholarships & Assistance for Persons with Disabilities (Divyangjan)',
    nameTranslations: {
      hi: 'दिव्यांगजन सशक्तिकरण एवं छात्रवृत्ति योजना',
      te: 'దివ్యాంగుల సాధికారత మరియు స్కాలర్‌షిప్ పథకం',
      ta: 'மாற்றுத்திறனாளிகளுக்கான உதவித்தொகை திட்டம்',
      kn: 'ವಿಕಲಾಂಗರ ಸಬಲೀಕರಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ ಯೋಜನೆ',
      ml: 'ഭിന്നശേഷിക്കാർക്കുള്ള സ്കോളർഷിപ്പ് പദ്ധതി',
      mr: 'दिव्यांगजन सक्षमीकरण व शिष्यवृत्ती योजना',
      bn: 'প্রতিবন্ধী ব্যক্তিদের ক্ষমতায়ন ও বৃত্তি প্রকল্প'
    },
    tagline: 'Tuition fees, assistive devices, and books allowance for students and individuals with benchmark disabilities.',
    ministry: 'Ministry of Social Justice and Empowerment',
    department: 'Department of Empowerment of Persons with Disabilities (DEPwD)',
    category: 'disability',
    level: 'CENTRAL',
    applicableStates: ['ALL'],
    shortDescription: 'Comprehensive financial support covering educational allowances, escorts, and modern assistive aids for persons with 40%+ disability.',
    fullDescription: 'DEPwD offers scholarships from pre-matric to higher research and aids/appliances to students and youth with disabilities to achieve economic independence and equal educational opportunities.',
    benefits: [
      {
        title: 'Education Scholarship & Books Allowance',
        description: 'Tuition reimbursement plus up to ₹4,000/month reader/escort allowance.',
        amount: 'Up to ₹60,000 / year',
        type: 'direct_benefit_transfer'
      },
      {
        title: 'Free Assistive Devices (ADIP Scheme)',
        description: 'Motorized tricycles, braille kits, hearing aids, and laptops with screen readers.',
        type: 'in_kind'
      }
    ],
    criteria: [
      {
        id: 'crit-div-disability',
        field: 'disabilityStatus',
        operator: 'equals',
        expectedValue: true,
        label: 'Person with Benchmark Disability (40%+)',
        description: 'Must possess a valid UDID card or Disability Certificate indicating 40% or more disability.',
        sourceDocId: 'doc-dis-swavalamban-2026-v1',
        sourceDocTitle: 'DEPwD Swavalamban Guidelines (v1.5)',
        sourcePageNumber: 5
      },
      {
        id: 'crit-div-income',
        field: 'annualIncome',
        operator: 'lte',
        expectedValue: 300000,
        label: 'Annual Family Income Limit (≤ ₹3 Lakh)',
        description: 'Total annual household income must not exceed ₹3,00,000.',
        sourceDocId: 'doc-dis-swavalamban-2026-v1',
        sourceDocTitle: 'DEPwD Swavalamban Guidelines (v1.5)',
        sourcePageNumber: 7
      }
    ],
    documentsRequired: [
      { name: 'Unique Disability ID (UDID) Card', description: 'Government issued UDID card or medical board certificate', mandatory: true, acceptableFormats: ['PDF', 'JPEG'] },
      { name: 'Aadhaar Card', description: 'Aadhaar for DBT verification', mandatory: true, acceptableFormats: ['PDF'] },
      { name: 'Income Certificate', description: 'Proof of income within threshold', mandatory: true, acceptableFormats: ['PDF'] }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Apply on Swavalamban / NSP Portal', instruction: 'Visit swavlambancard.gov.in and submit scholarship/aid application.', onlineUrl: 'https://www.swavlambancard.gov.in' },
      { stepNumber: 2, title: 'Verification & Direct DBT Credit', instruction: 'District Social Welfare Officer verifies UDID record and issues grant.' }
    ],
    importantDates: {
      status: 'OPEN',
      notes: 'Scholarship applications open on NSP portal.'
    },
    officialUrl: 'https://disabilityaffairs.gov.in',
    helpline: '011-24369054',
    activeVersion: '1.5',
    status: 'ACTIVE',
    lastVerified: '2026-08-22',
    sourceDocumentIds: ['doc-dis-swavalamban-2026-v1'],
    tags: ['disability', 'PwD', 'UDID', 'special education', 'assistive devices', 'swavalamban', 'DEPwD']
  }
];
