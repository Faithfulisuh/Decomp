/**
 * Internal Reasoning Model - Two-Layer Architecture
 * 
 * This interface represents the raw, structured output from the first-principles
 * reasoning pipeline. It maintains strict logical relationships and principle anchoring
 * without any narrative transformation.
 */

export interface InternalReasoningModel {
  // Core concept definition derived from first principles
  definition: string;
  
  // First-principles foundation - irreducible truths
  first_principles: FirstPrinciple[];
  
  // Step-by-step logical reconstruction from principles
  reconstruction: ReconstructionStep[];
  
  // Examples anchored to specific principles
  examples: PrincipleAnchoredExample[];
  
  // Use cases anchored to specific principles  
  use_cases: PrincipleAnchoredUseCase[];
  
  // Scenarios anchored to specific principles
  scenarios: PrincipleAnchoredScenario[];
  
  // Assumption challenges anchored to specific principles
  assumption_challenges: PrincipleAnchoredChallenge[];
}

/**
 * Individual first principle with metadata
 */
export interface FirstPrinciple {
  id: string;                    // Unique identifier for referencing
  statement: string;             // The principle statement
  necessity_justification: string; // Why this principle is necessary
}

/**
 * Single step in logical reconstruction
 */
export interface ReconstructionStep {
  id: string;                    // Unique identifier
  step_number: number;           // Sequential order
  description: string;           // What this step accomplishes
  principle_dependencies: string[]; // IDs of principles this step depends on
  logical_progression: string;   // How this step builds upon previous steps
}

/**
 * Example anchored to specific principles
 */
export interface PrincipleAnchoredExample {
  id: string;                    // Unique identifier
  description: string;           // The example description
  principle_dependencies: string[]; // IDs of principles this example illustrates
  anchoring_explanation: string; // How this example demonstrates the principles
}

/**
 * Use case anchored to specific principles
 */
export interface PrincipleAnchoredUseCase {
  id: string;                    // Unique identifier
  description: string;           // The use case description
  principle_dependencies: string[]; // IDs of principles this use case relies on
  anchoring_explanation: string; // How this use case applies the principles
}

/**
 * Scenario anchored to specific principles
 */
export interface PrincipleAnchoredScenario {
  id: string;                    // Unique identifier
  description: string;           // The scenario description
  principle_dependencies: string[]; // IDs of principles this scenario involves
  anchoring_explanation: string; // How this scenario demonstrates the principles
}

/**
 * Assumption challenge anchored to specific principles
 */
export interface PrincipleAnchoredChallenge {
  id: string;                    // Unique identifier
  challenged_assumption: string; // The assumption being challenged
  principle_dependencies: string[]; // IDs of principles that challenge this assumption
  challenge_explanation: string; // How the principles invalidate the assumption
}

/**
 * Validation result for internal model
 */
export interface InternalModelValidation {
  success: boolean;
  errors?: string[];
  warnings?: string[];
}
