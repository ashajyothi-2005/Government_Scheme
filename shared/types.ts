export interface SchemeCriterion {
  id: string;
  field: 'age' | 'annualIncome' | 'state' | 'gender' | 'educationLevel' | 'occupation' | 'socialCategory' | 'disabilityStatus' | 'ruralUrban' | 'studentStatus' | 'landholding';
  operator: 'equals' | 'in' | 'lte' | 'gte' | 'between' | 'boolean';
  expectedValue: any;
  label: string;
  description: string;
  sourceDocId: string;
  sourceDocTitle: string;
  sourcePageNumber: number;
}

export interface SchemeBenefit {
  title: string;
  description: string;
  amount?: string;
  frequency?: string;
  type: 'direct_benefit_transfer' | 'subsidy' | 'tuition_waiver' | 'insurance' | 'loan_concession' | 'in_kind';
}

export interface SchemeDocument {
  name: string;
  description: string;
  mandatory: boolean;
  acceptableFormats: string[];
}

export interface SchemeApplicationStep {
  stepNumber: number;
  title: string;
  instruction: string;
  onlineUrl?: string;
  offlineFacility?: string;
}

export interface SchemeSource {
  documentId: string;
  title: string;
  ministry: string;
  department: string;
  sourceUrl: string;
  version: string;
  publicationDate: string;
  lastVerified: string;
  verifiedBy: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'UNDER_REVIEW' | 'PENDING';
  pageCount?: number;
  summary: string;
}

export interface GovernmentScheme {
  id: string;
  slug: string;
  name: string;
  nameTranslations?: Record<string, string>;
  tagline: string;
  ministry: string;
  department: string;
  category: 'education' | 'agriculture' | 'housing' | 'employment' | 'women' | 'disability' | 'senior_citizens' | 'financial' | 'children' | 'healthcare';
  level: 'CENTRAL' | 'STATE';
  applicableStates: string[]; // ["ALL"] or specific state names
  shortDescription: string;
  fullDescription: string;
  benefits: SchemeBenefit[];
  criteria: SchemeCriterion[];
  documentsRequired: SchemeDocument[];
  applicationProcess: SchemeApplicationStep[];
  importantDates?: {
    applicationStart?: string;
    applicationDeadline?: string;
    status: 'OPEN' | 'CLOSING_SOON' | 'YEAR_ROUND' | 'CLOSED';
    notes?: string;
  };
  officialUrl: string;
  helpline?: string;
  activeVersion: string;
  status: 'ACTIVE' | 'ARCHIVED';
  lastVerified: string;
  sourceDocumentIds: string[];
  tags: string[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'transgender' | 'other' | '';
  state: string;
  district?: string;
  educationLevel?: 'below_10th' | '10th_pass' | '12th_pass' | 'undergraduate' | 'postgraduate' | 'diploma' | 'doctorate' | 'uneducated' | '';
  studentStatus?: boolean;
  occupation?: 'student' | 'farmer' | 'salaried' | 'self_employed' | 'daily_wage' | 'unemployed' | 'homemaker' | 'retired' | 'artisan' | '';
  employmentType?: 'formal' | 'informal' | 'unemployed' | '';
  landholding?: 'none' | 'marginal' | 'small' | 'medium_large' | ''; // for agriculture schemes
  annualIncome?: number; // In INR (e.g. 200000)
  socialCategory?: 'general' | 'obc' | 'sc' | 'st' | 'ews' | '';
  disabilityStatus?: boolean;
  ruralUrban?: 'rural' | 'urban' | 'semi_urban' | '';
  preferredLanguage: string; // 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn'
  interestedCategories: string[];
  savedSchemeIds: string[];
}

export interface CriterionEvaluation {
  criterionId: string;
  label: string;
  status: 'PASS' | 'FAIL' | 'UNKNOWN';
  reason: string;
  sourceDocTitle: string;
  sourcePageNumber: number;
  userValueProvided: any;
  expectedValue: any;
}

export interface EligibilityResult {
  schemeId: string;
  overallStatus: 'LIKELY_ELIGIBLE' | 'MORE_INFO_NEEDED' | 'LIKELY_NOT_ELIGIBLE';
  matchScore: number; // 0 - 100 percentage estimate
  evaluations: CriterionEvaluation[];
  summaryMessage: string;
  missingFields: string[];
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  schemeId: string;
  schemeName: string;
  section: string;
  pageNumber: number;
  content: string;
  ministry: string;
  sourceUrl: string;
  version: string;
  lastVerified: string;
  status: 'ACTIVE' | 'ARCHIVED';
  keywords: string[];
}

export interface Citation {
  sourceTitle: string;
  ministry: string;
  pageNumber: number;
  version: string;
  lastVerified: string;
  sourceUrl: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role?: 'user' | 'assistant' | 'system';
  sender?: 'user' | 'assistant' | 'system';
  content?: string;
  text?: string;
  translatedText?: string;
  language?: string;
  timestamp: string;
  citations?: Citation[];
  suggestedActions?: {
    type: 'view_scheme' | 'check_eligibility' | 'apply_link' | 'ask_query';
    label: string;
    payload: string;
  }[];
  schemeCard?: {
    id: string;
    name: string;
    category: string;
    ministry: string;
    matchScore?: number;
  };
  audioUrl?: string;
}


export interface AdminRAGStatus {
  totalDocuments: number;
  activeDocuments: number;
  archivedDocuments: number;
  totalChunks: number;
  indexedSchemes: number;
  lastIndexed: string;
  health: 'HEALTHY' | 'NEEDS_REINDEX' | 'PROCESSING';
  coverageByCategory: Record<string, number>;
}
