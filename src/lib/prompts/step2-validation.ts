/**
 * Step 2: Principle Validation Prompt Template
 * Remove redundancy and ensure principles are fundamental
 */

export const STEP2_PRINCIPLE_VALIDATION_PROMPT = `
Review these principles for the concept "{concept}":

{principles}

TASK: Validate and clean these principles to ensure they are truly fundamental.

VALIDATION RULES:
- Each principle must stand alone (no redundancy between principles)
- If you remove any principle, the concept "{concept}" must become incomplete
- Must be truly fundamental (cannot be broken down further)
- Must explain WHY, not HOW
- Should be universally true about this concept
- Remove any principles that are just restatements of others
- Combine overlapping principles into single, clearer, easy to understand statements

VALIDATION QUESTIONS FOR EACH PRINCIPLE:
1. Is this principle irreducible? (Cannot be broken into simpler parts)
2. Is this principle unique? (Not covered by other principles)
3. Is this principle essential? (Concept breaks without it)
4. Does this principle explain WHY, not HOW?

OUTPUT FORMAT: Return a JSON object with this exact structure:
{
  "validated_principles": ["cleaned_principle1", "cleaned_principle2"]
}

Original principles to validate:
{principles}
`;

/**
 * Generate Step 2 prompt with concept and principles substitution
 */
export function generateStep2Prompt(concept: string, principles: string[]): string {
  const principlesList = principles.map((p, i) => `${i + 1}. ${p}`).join('\n');
  
  return STEP2_PRINCIPLE_VALIDATION_PROMPT
    .replace(/{concept}/g, concept)
    .replace(/{principles}/g, principlesList);
}