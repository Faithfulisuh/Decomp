/**
 * Step 3: Reconstruction Prompt Template
 * Rebuild concept step-by-step from principles
 */

export const STEP3_RECONSTRUCTION_PROMPT = `
Using ONLY these validated principles, reconstruct the concept "{concept}" step by step:

PRINCIPLES:
{principles}

DEPTH MODE: {depth}

TASK: Rebuild "{concept}" logically from these principles.

RECONSTRUCTION RULES:
- Step-by-step logical building from principles to complete concept
- Each step must reference specific principles by number
- No domain shortcuts or assumed knowledge
- Show how the principles combine and build upon each other
- Each step should be a logical progression toward the full concept
- No external knowledge - only use what's in the principles
- Build from most fundamental to most complex aspects

DEPTH GUIDELINES:
- For "short": Create 2-3 essential reconstruction steps only
- For "exhaustive": Create detailed reconstruction with 4-6 steps

RECONSTRUCTION APPROACH:
1. Start with the most basic principle
2. Show how principles interact and combine
3. Build complexity gradually
4. End with the complete concept understanding

DEFINITION REQUIREMENTS:
- Clear, non-circular definition of the concept
- Must be derivable from the principles
- Avoid using the concept name in its own definition
- Should capture the essence revealed by the principles

OUTPUT FORMAT: Return a JSON object with this exact structure:
{
  "reconstruction": ["step1", "step2", "step3"],
  "definition": "Clear, non-circular definition of the concept"
}

Principles to use:
{principles}
Depth: {depth}
`;

/**
 * Generate Step 3 prompt with concept and principles substitution
 */
export function generateStep3Prompt(concept: string, validatedPrinciples: string[], depth: string): string {
  const principlesList = validatedPrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n');
  
  return STEP3_RECONSTRUCTION_PROMPT
    .replace(/{concept}/g, concept)
    .replace(/{principles}/g, principlesList)
    .replace(/{depth}/g, depth);
}