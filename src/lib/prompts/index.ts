/**
 * Prompt Templates for MVP Pipeline
 * All prompts stored as editable constants for easy iteration
 */

// Step 1: Concept Decomposition
export {
  STEP1_CONCEPT_DECOMPOSITION_PROMPT,
  generateStep1Prompt
} from './step1-decomposition';

// Step 2: Principle Validation  
export {
  STEP2_PRINCIPLE_VALIDATION_PROMPT,
  generateStep2Prompt
} from './step2-validation';

// Step 3: Reconstruction
export {
  STEP3_RECONSTRUCTION_PROMPT,
  generateStep3Prompt
} from './step3-reconstruction';

// Step 4: Application Layer
export {
  STEP4_APPLICATION_LAYER_PROMPT,
  generateStep4Prompt
} from './step4-application';

// Import for internal use in ALL_PROMPT_TEMPLATES
import { STEP1_CONCEPT_DECOMPOSITION_PROMPT } from './step1-decomposition';
import { STEP2_PRINCIPLE_VALIDATION_PROMPT } from './step2-validation';
import { STEP3_RECONSTRUCTION_PROMPT } from './step3-reconstruction';
import { STEP4_APPLICATION_LAYER_PROMPT } from './step4-application';

/**
 * All prompt templates for easy access and editing
 */
export const ALL_PROMPT_TEMPLATES = {
  STEP1_CONCEPT_DECOMPOSITION_PROMPT,
  STEP2_PRINCIPLE_VALIDATION_PROMPT,
  STEP3_RECONSTRUCTION_PROMPT,
  STEP4_APPLICATION_LAYER_PROMPT
} as const;