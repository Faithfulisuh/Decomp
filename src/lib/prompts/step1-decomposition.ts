/**
 * Step 1: Concept Decomposition Prompt Template
 * Extract irreducible first principles only - No examples, no metaphors
 */

export const STEP1_CONCEPT_DECOMPOSITION_PROMPT = `
Analyze the concept "{concept}" in the {domain} domain.

TASK: Extract ONLY the irreducible first principles that form the foundation of this concept.

DEPTH MODE: {depth}

RULES:
- Extract ONLY fundamental principles that cannot be broken down further
- NO examples, NO metaphors, NO applications
- Each principle must explain WHY something is true, not HOW it works
- Focus on the most basic, foundational elements
- If you remove any principle, the concept should become incomplete
- Principles should be universal truths about this concept
- Avoid domain-specific jargon - use clear, fundamental, simple and easy to understand language such that a 15 year highschool student can comprehend without it losing its fundamental meaning

DEPTH GUIDELINES:
- For "short": Extract the 2-3 most essential principles only
- For "exhaustive": Extract all fundamental principles (4-6 typically)

WHAT MAKES A GOOD FIRST PRINCIPLE:
- Cannot be reduced to simpler components
- Explains the essential nature of the concept
- Is universally true regardless of implementation
- Answers "why" this concept exists or works

OUTPUT FORMAT: Return a JSON object with this exact structure:
{
  "first_principles": ["principle1", "principle2", "principle3"]
}

Concept: {concept}
Domain: {domain}
Depth: {depth}
`;

/**
 * Generate Step 1 prompt with concept and domain substitution
 */
export function generateStep1Prompt(concept: string, domain: string, depth: string): string {
  return STEP1_CONCEPT_DECOMPOSITION_PROMPT
    .replace(/{concept}/g, concept)
    .replace(/{domain}/g, domain)
    .replace(/{depth}/g, depth);
}