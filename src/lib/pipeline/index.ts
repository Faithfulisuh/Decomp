/**
 * Pipeline module exports for MVP
 * Provides the core runPipeline function and orchestrator
 */

export { runPipeline, PipelineOrchestrator } from './orchestrator';

// Re-export types for convenience
export type { ConceptInput, StructuredOutput } from '@/types';