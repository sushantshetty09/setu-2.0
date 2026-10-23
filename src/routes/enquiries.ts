import { Router, Request, Response } from 'express';
import { defaultEnquiryService } from '../services/enquiryService';

export const enquiriesRouter = Router();

/**
 * GET /api/enquiries
 * Returns all stored citizen enquiries with optional query filtering
 * (e.g. ?state=Karnataka&occupation=Farmer&gender=Female&limit=25)
 */
enquiriesRouter.get('/', (req: Request, res: Response) => {
  const { state, occupation, gender, category, language, limit } = req.query;

  const results = defaultEnquiryService.getEnquiries({
    state: typeof state === 'string' ? state : undefined,
    occupation: typeof occupation === 'string' ? occupation : undefined,
    gender: typeof gender === 'string' ? gender : undefined,
    category: typeof category === 'string' ? category : undefined,
    language: typeof language === 'string' ? language : undefined,
    limit: typeof limit === 'string' ? parseInt(limit, 10) : undefined,
  });

  res.status(200).json({
    success: true,
    count: results.length,
    enquiries: results,
  });
});

/**
 * GET /api/enquiries/stats
 * Returns summary statistics for website analytics dashboards
 */
enquiriesRouter.get('/stats', (_req: Request, res: Response) => {
  const stats = defaultEnquiryService.getStats();
  res.status(200).json({
    success: true,
    stats,
  });
});

/**
 * GET /api/enquiries/:id
 * Fetches single enquiry by ID
 */
enquiriesRouter.get('/:id', (req: Request, res: Response) => {
  const enquiry = defaultEnquiryService.getEnquiryById(String(req.params.id));
  if (!enquiry) {
    res.status(404).json({ success: false, error: 'Enquiry not found' });
    return;
  }
  res.status(200).json({ success: true, enquiry });
});

/**
 * POST /api/enquiries
 * Records a new citizen enquiry
 */
enquiriesRouter.post('/', async (req: Request, res: Response) => {
  const {
    name,
    gender,
    state,
    age,
    occupation,
    annualIncome,
    category,
    language,
    phoneNumber,
    senderId,
    matchedSchemeNames,
  } = req.body;

  if (!name || !state || !age || !occupation) {
    res.status(400).json({
      success: false,
      error: 'Missing required citizen profile fields: name, state, age, occupation',
    });
    return;
  }

  const newEnquiry = await defaultEnquiryService.recordEnquiry({
    senderId: senderId || 'manual-entry',
    phoneNumber: phoneNumber || senderId || 'N/A',
    name: String(name),
    gender: gender || 'Other',
    state: String(state),
    age: parseInt(String(age), 10) || 30,
    occupation: occupation || 'Other',
    annualIncome: annualIncome || 'Below ₹1 Lakh (BPL)',
    category: category || 'Agriculture',
    language: language || 'en',
    matchedSchemesCount: Array.isArray(matchedSchemeNames) ? matchedSchemeNames.length : 0,
    matchedSchemeNames: Array.isArray(matchedSchemeNames) ? matchedSchemeNames : [],
  });

  res.status(201).json({
    success: true,
    message: 'Citizen enquiry successfully recorded in portal database',
    enquiry: newEnquiry,
  });
});
