// Application constants and configuration (MVP)

export const APP_CONFIG = {
  // Gemini Configuration
  GEMINI_MODEL: 'gemini-2.5-flash', // Updated to working model
  GEMINI_TEMPERATURE: 0.1, // Low temperature for consistency
  GEMINI_MAX_TOKENS: 4000, // Increased for full pipeline responses
  
  // Pipeline Configuration
  PIPELINE_TIMEOUT: 60000, // 60 seconds
  MAX_RETRIES: 1, // Single retry for MVP
  
  // Validation Rules
  CONCEPT_MIN_LENGTH: 3,
  CONCEPT_MAX_LENGTH: 50,
} as const;

export const DOMAINS = ['general', 'tech', 'business', 'education', 'medicine', 'science', 'arts', 'law', 'engineering', 'psychology'] as const;
export const DEPTH_MODES = ['short', 'exhaustive'] as const;

export const REQUIRED_OUTPUT_SECTIONS = [
  'definition',
  'first_principles', 
  'reconstruction',
  'examples',
  'use_cases',
  'scenarios',
  'assumption_challenges'
] as const;