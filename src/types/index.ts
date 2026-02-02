// Core TypeScript interfaces for the Concept Decomposition Tool (MVP)

export interface ConceptInput {
  concept: string;
  domain: 'general' | 'mathematics' | 'physics' | 'computer-science' | 'economics' | 'biology' | 'philosophy' | 'chemistry' | 'psychology';
  depth: 'short' | 'exhaustive';
}

// Legacy output structure (deprecated - use InternalReasoningModel instead)
export interface StructuredOutput {
  definition: string;
  first_principles: string[];
  reconstruction: string[];
  examples: string[];
  use_cases: string[];
  scenarios: string[];
  assumption_challenges: string[];
}

// Import new two-layer model interfaces
import { InternalReasoningModel } from './internal';

// Export all interfaces from the new modules
export * from './internal';
export * from './narrative';

// API interfaces
export interface DecomposeRequest {
  input: ConceptInput;
}

export interface DecomposeResponse {
  success: boolean;
  data?: InternalReasoningModel;  // Updated to use InternalReasoningModel
  error?: string;
}

// Legacy response for backward compatibility
export interface LegacyDecomposeResponse {
  success: boolean;
  data?: StructuredOutput;
  error?: string;
}