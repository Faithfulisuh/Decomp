/**
 * Narrative View Model - Two-Layer Architecture
 * 
 * This interface represents the transformed, human-readable output that maintains
 * first-principles fidelity while providing an accessible narrative flow.
 * It's designed for comprehension while preserving logical structure.
 */

export interface NarrativeViewModel {
  // Simple, recitable definition for immediate understanding
  definition: string;
  
  // First principles presented in accessible language
  first_principles: NarrativePrinciple[];
  
  // Logical reconstruction as a flowing narrative
  reconstruction: NarrativeReconstruction[];
  
  // Examples presented as supporting illustrations
  examples: NarrativeExample[];
  
  // Use cases presented as practical applications
  use_cases: NarrativeUseCase[];
  
  // Scenarios presented as illustrative situations
  scenarios: NarrativeScenario[];
  
  // Assumption challenges presented as critical thinking prompts
  assumption_challenges: NarrativeChallenge[];
  
  // Metadata about the narrative transformation
  narrative_metadata: NarrativeMetadata;
}

/**
 * First principle in narrative form
 */
export interface NarrativePrinciple {
  statement: string;             // Clear, accessible principle statement
  explanation: string;           // Brief explanation of why it matters
  accessibility_note: string;     // Note on how this relates to everyday understanding
}

/**
 * Reconstruction step in narrative form
 */
export interface NarrativeReconstruction {
  step_description: string;       // Flowing description of this logical step
  connection_to_previous: string; // How this connects to what came before
  insight_offered: string;        // What understanding this step provides
}

/**
 * Example in narrative form
 */
export interface NarrativeExample {
  title: string;                 // Descriptive title for the example
  description: string;           // Clear example description
  principle_connection: string;   // How this illustrates the principles (without explicit IDs)
  takeaway: string;               // Key insight from this example
}

/**
 * Use case in narrative form
 */
export interface NarrativeUseCase {
  context: string;                // The situation or context
  application: string;            // How the concept applies here
  principle_basis: string;        // What principles make this possible
  outcome: string;                // What results from applying the concept
}

/**
 * Scenario in narrative form
 */
export interface NarrativeScenario {
  situation: string;              // The scenario setup
  concept_application: string;    // How the concept applies in this scenario
  principle_demonstration: string; // What principles this scenario reveals
  learning_point: string;         // What can be learned from this scenario
}

/**
 * Assumption challenge in narrative form
 */
export interface NarrativeChallenge {
  common_assumption: string;      // The assumption that's commonly held
  challenge: string;              // How the principles challenge this assumption
  corrected_understanding: string; // What the proper understanding should be
  practical_implication: string;  // How this changes practical application
}

/**
 * Metadata about the narrative transformation
 */
export interface NarrativeMetadata {
  target_audience: 'students' | 'professionals' | 'general';
  complexity_level: 'basic' | 'intermediate' | 'advanced';
  narrative_style: 'educational' | 'professional' | 'conversational';
  principle_fidelity_score: number; // 0-1 score of how well principles are preserved
  accessibility_score: number;     // 0-1 score of how accessible the narrative is
}

/**
 * Transformation result from internal to narrative model
 */
export interface NarrativeTransformation {
  success: boolean;
  narrative_model?: NarrativeViewModel;
  transformation_errors?: string[];
  fidelity_warnings?: string[];
}
