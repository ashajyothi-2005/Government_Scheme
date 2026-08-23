import express, { Request, Response } from 'express';
import { GOVERNMENT_SCHEMES } from '../data/schemes.ts';
import { OFFICIAL_SOURCES } from '../data/sources.ts';
import { KNOWLEDGE_CHUNKS } from '../../rag/chunks.ts';
import { evaluateSchemeEligibility, rankSchemesForUser } from '../eligibility/engine.ts';
import { retrieveKnowledge } from '../../rag/retriever.ts';
import { generateGroundedAshaResponse } from '../gemini.ts';
import type { UserProfile, SchemeSource, KnowledgeChunk } from '../../shared/types.ts';

const router = express.Router();

// In-memory state for runtime admin document updates / feedback demonstrations
let currentSchemes = [...GOVERNMENT_SCHEMES];
let currentSources = [...OFFICIAL_SOURCES];
let currentChunks = [...KNOWLEDGE_CHUNKS];
let feedbacks: any[] = [];
let queryLogs: any[] = [];

// GET /api/schemes
router.get('/schemes', (req: Request, res: Response) => {
  const { category, state, search, level, sort } = req.query;

  let list = [...currentSchemes];

  if (category && category !== 'all') {
    list = list.filter((s) => s.category === category);
  }

  if (state && state !== 'All India') {
    list = list.filter(
      (s) => s.applicableStates.includes('ALL') || s.applicableStates.includes(String(state))
    );
  }

  if (level) {
    list = list.filter((s) => s.level === level);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'verified') {
    list.sort((a, b) => new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime());
  }

  res.json({ schemes: list, total: list.length });
});

// GET /api/schemes/:id
router.get('/schemes/:id', (req: Request, res: Response) => {
  const scheme = currentSchemes.find((s) => s.id === req.params.id || s.slug === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }

  const sources = currentSources.filter((s) => scheme.sourceDocumentIds.includes(s.documentId));
  res.json({ scheme, sources });
});

// POST /api/recommendations
router.post('/recommendations', (req: Request, res: Response) => {
  const profile: Partial<UserProfile> = req.body.profile || {};
  const ranked = rankSchemesForUser(currentSchemes, profile);
  res.json({ recommendations: ranked });
});

// POST /api/eligibility
router.post('/eligibility', (req: Request, res: Response) => {
  const { schemeId, profile } = req.body;
  const scheme = currentSchemes.find((s) => s.id === schemeId);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found for eligibility evaluation' });
  }

  const result = evaluateSchemeEligibility(scheme, profile || {});
  res.json({ result, scheme });
});

// POST /api/assistant (RAG)
router.post('/assistant', async (req: Request, res: Response) => {
  const { message, profile, language = 'en', schemeId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Valid message string required' });
  }

  try {
    const retrieval = await retrieveKnowledge(message, { schemeId });
    const ashaResponse = await generateGroundedAshaResponse(
      message,
      retrieval,
      profile,
      language
    );

    // Find if there is an immediately relevant scheme card to attach
    const topChunk = retrieval.chunks[0];
    const matchedScheme = currentSchemes.find((s) => s.id === topChunk?.schemeId);

    const result = {
      text: ashaResponse.text,
      language,
      citations: ashaResponse.citations,
      schemeCard: matchedScheme
        ? {
            id: matchedScheme.id,
            name: matchedScheme.name,
            category: matchedScheme.category,
            ministry: matchedScheme.ministry,
            matchScore: 95,
          }
        : undefined,
      timestamp: new Date().toISOString(),
    };

    queryLogs.push({
      question: message,
      language,
      timestamp: new Date().toISOString(),
      retrievedChunksCount: retrieval.chunks.length,
    });

    res.json(result);
  } catch (err: any) {
    console.error('Assistant error:', err);
    res.status(500).json({
      error: 'Failed to process AI assistant inquiry',
      details: err.message,
    });
  }
});

// GET /api/sources
router.get('/sources', (_req: Request, res: Response) => {
  res.json({ sources: currentSources });
});

// POST /api/feedback
router.post('/feedback', (req: Request, res: Response) => {
  const { question, answer, rating, comment } = req.body;
  const entry = {
    id: `fb-${Date.now()}`,
    question,
    answer,
    rating, // 'positive' | 'negative'
    comment,
    timestamp: new Date().toISOString(),
  };
  feedbacks.push(entry);
  res.json({ success: true, entry });
});

// GET /api/admin/dashboard
router.get('/admin/dashboard', (_req: Request, res: Response) => {
  const totalSchemes = currentSchemes.length;
  const activeSchemes = currentSchemes.filter((s) => s.status === 'ACTIVE').length;
  const totalDocuments = currentSources.length;
  const verifiedDocuments = currentSources.filter((s) => s.status === 'ACTIVE').length;
  const pendingUpdates = currentSources.filter((s) => s.status === 'UNDER_REVIEW' || s.status === 'PENDING').length;
  const totalChunks = currentChunks.length;
  const totalQueries = queryLogs.length;

  const coverageByCategory: Record<string, number> = {};
  currentSchemes.forEach((s) => {
    coverageByCategory[s.category] = (coverageByCategory[s.category] || 0) + 1;
  });

  res.json({
    analytics: {
      totalSchemes,
      activeSchemes,
      totalDocuments,
      verifiedDocuments,
      pendingUpdates,
      totalChunks,
      totalQueries,
      feedbackCount: feedbacks.length,
      coverageByCategory,
    },
    sources: currentSources,
    schemes: currentSchemes,
    feedbacks: feedbacks.slice(-10),
    queryLogs: queryLogs.slice(-15),
  });
});

// POST /api/admin/documents/upload
router.post('/admin/documents/upload', (req: Request, res: Response) => {
  const { title, ministry, department, sourceUrl, version, textContent, schemeId } = req.body;

  if (!title || !textContent) {
    return res.status(400).json({ error: 'Title and document content are required' });
  }

  const newDocId = `doc-admin-${Date.now()}`;
  const newSource: SchemeSource = {
    documentId: newDocId,
    title,
    ministry: ministry || 'Government Authority',
    department: department || 'Welfare Division',
    sourceUrl: sourceUrl || 'https://gov.in',
    version: version || '1.0',
    publicationDate: new Date().toISOString().split('T')[0],
    lastVerified: new Date().toISOString().split('T')[0],
    verifiedBy: 'Administrator / Hackathon Reviewer',
    status: 'UNDER_REVIEW',
    pageCount: 1,
    summary: textContent.slice(0, 150) + '...',
  };

  currentSources.unshift(newSource);

  // Chunk the uploaded document
  const newChunk: KnowledgeChunk = {
    id: `chunk-${Date.now()}`,
    documentId: newDocId,
    schemeId: schemeId || 'scheme-custom',
    schemeName: title,
    section: 'Admin Uploaded Section',
    pageNumber: 1,
    content: textContent,
    ministry: newSource.ministry,
    sourceUrl: newSource.sourceUrl,
    version: newSource.version,
    lastVerified: newSource.lastVerified,
    status: 'ACTIVE',
    keywords: title.toLowerCase().split(/\s+/),
  };

  currentChunks.unshift(newChunk);

  res.json({ success: true, source: newSource, chunk: newChunk });
});

// POST /api/admin/documents/:id/approve
router.post('/admin/documents/:id/approve', (req: Request, res: Response) => {
  const doc = currentSources.find((s) => s.documentId === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  doc.status = 'ACTIVE';
  doc.lastVerified = new Date().toISOString().split('T')[0];
  res.json({ success: true, document: doc });
});

// POST /api/admin/documents/:id/archive
router.post('/admin/documents/:id/archive', (req: Request, res: Response) => {
  const doc = currentSources.find((s) => s.documentId === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  doc.status = 'ARCHIVED';
  res.json({ success: true, document: doc });
});

// GET /api/admin/versions/compare
router.get('/admin/versions/compare', (_req: Request, res: Response) => {
  const comparison = {
    schemeName: 'Post-Matric Scholarship for SC/ST/OBC Students',
    versionA: {
      version: '2.8',
      year: '2023-24',
      incomeLimit: '₹2,00,000 / year',
      maintenanceAllowance: '₹3,000 - ₹10,000 / year',
      mode: 'State offline + portal verification',
      status: 'ARCHIVED',
    },
    versionB: {
      version: '3.2',
      year: '2026-27',
      incomeLimit: '₹2,50,000 / year',
      maintenanceAllowance: '₹4,000 - ₹13,500 / year',
      mode: '100% Aadhaar AEPS Direct Benefit Transfer (DBT)',
      status: 'ACTIVE & VERIFIED',
    },
    changes: [
      { field: 'Annual Income Ceiling', oldVal: '₹2,00,000', newVal: '₹2,50,000', changeType: 'EXPANDED_ACCESS' },
      { field: 'Maintenance Allowance', oldVal: '₹10,000 max', newVal: '₹13,500 max', changeType: 'INCREASED_BENEFIT' },
      { field: 'Disbursement Pipeline', oldVal: 'Manual treasury bill', newVal: 'Direct Aadhaar AEPS DBT', changeType: 'DIGITAL_UPGRADE' },
    ],
  };

  res.json(comparison);
});

// GET /api/admin/rag-status
router.get('/admin/rag-status', (_req: Request, res: Response) => {
  res.json({
    totalDocuments: currentSources.length,
    activeDocuments: currentSources.filter((s) => s.status === 'ACTIVE').length,
    archivedDocuments: currentSources.filter((s) => s.status === 'ARCHIVED').length,
    totalChunks: currentChunks.length,
    indexedSchemes: currentSchemes.length,
    lastIndexed: new Date().toISOString(),
    health: 'HEALTHY',
  });
});

export default router;
