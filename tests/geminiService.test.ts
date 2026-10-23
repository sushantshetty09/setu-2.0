import { describe, it, expect } from 'vitest';
import { GeminiService } from '../src/services/geminiService';

describe('Gemini AI Scheme Advisor Service', () => {
  const service = new GeminiService();

  it('should extract profile parameters and detect questions from natural language query', async () => {
    const text = 'Main Uttar Pradesh ka 45 saal ka kisan hoon mujhe tractor subsidy chahiye';
    const profile = await service.extractProfileFromQuery(text);

    expect(profile.state).toBe('Uttar Pradesh');
    expect(profile.age).toBe(45);
    expect(profile.occupation).toBe('Farmer');
    expect(profile.category).toBe('Agriculture');
    expect(profile.isQuestion).toBe(true);
  });

  it('should extract student profile and education category from query', async () => {
    const text = 'I am a college student looking for scholarship';
    const profile = await service.extractProfileFromQuery(text);

    expect(profile.occupation).toBe('Student');
    expect(profile.category).toBe('Education');
    expect(profile.isQuestion).toBe(true);
  });

  it('should provide grounded scheme answer with official portal links even in resilient fallback mode', async () => {
    const query = 'solar pump subsidy for farmers in Rajasthan';
    const answer = await service.answerSchemeQuery(query, { state: 'Rajasthan', occupation: 'Farmer' });

    expect(answer).toBeDefined();
    expect(answer.length).toBeGreaterThan(50);
    // Should mention PM-KUSUM or relevant pump schemes and link
    expect(answer.toLowerCase()).toContain('kusum');
    expect(answer).toContain('http');
  });

  it('should provide fluent Hindi responses for queries in Hindi', async () => {
    const query = 'किसान क्रेडिट कार्ड के क्या लाभ हैं?';
    const answer = await service.answerSchemeQuery(query, { language: 'hi' });

    expect(answer).toBeDefined();
    // Should include Hindi text, benefits, and disclaimer
    expect(/[\u0900-\u097F]/.test(answer)).toBe(true);
    expect(answer).toContain('http');
  });
});
