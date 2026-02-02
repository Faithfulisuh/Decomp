/**
 * Step 4: Application Layer Prompt Template
 * Generate examples, use cases, scenarios, and assumption challenges
 * Differentiate output based on depth mode
 */

export const STEP4_APPLICATION_LAYER_PROMPT = `
Create the application layer for "{concept}" using these validated principles and reconstruction:

PRINCIPLES:
{principles}

RECONSTRUCTION:
{reconstruction}

TASK: Generate examples, use cases, scenarios, and assumption challenges.

DEPTH MODE: {depth} 
DOMAIN: {domain}

REQUIREMENTS:
- Examples: {exampleRequirement} relevant to {domain} domain
- Use cases: Where "{concept}" is actually used in {domain}
- Scenarios: What happens when core assumptions fail or are violated
- Assumption challenges: Common misconceptions that violate the principles

EXAMPLES GUIDELINES:
- Must demonstrate the principles in action
- Should be concrete and specific to {domain}
- {exampleGuidance}

USE CASES GUIDELINES:
- Real-world applications in {domain}
- Show where and why "{concept}" is valuable
- Connect back to the principles

SCENARIOS GUIDELINES:
- Explore what happens when assumptions break down
- Show edge cases or failure modes
- Demonstrate principle violations and their consequences

ASSUMPTION CHALLENGES GUIDELINES:
- Identify common misconceptions about "{concept}"
- Explain why each misconception violates specific principles
- Focus on assumptions that "sound right" but are actually wrong
- Reference principle numbers when explaining why assumptions fail

Each item must reference specific principles from the list above.

OUTPUT FORMAT: Return a JSON object with this exact structure:
{
  "definition": "Clear, non-circular definition",
  "first_principles": {principlesArray},
  "reconstruction": {reconstructionArray},
  "examples": [{exampleArray}],
  "use_cases": [{useCasesArray}],
  "scenarios": [{scenarioArray}],
  "assumption_challenges": [{challengesArray}]
}

Domain: {domain}
Depth: {depth}
`;

/**
 * Generate Step 4 prompt with all necessary substitutions
 */
export function generateStep4Prompt(
  concept: string,
  validatedPrinciples: string[],
  reconstruction: string[],
  domain: string,
  depth: 'short' | 'exhaustive'
): string {
  const isExhaustive = depth === 'exhaustive';
  
  // Depth-specific content
  const exampleRequirement = isExhaustive ? 'Multiple concrete examples' : 'One clear example';
  const exampleGuidance = isExhaustive 
    ? 'Provide 2-3 diverse examples showing different aspects'
    : 'Provide one clear, representative example';
  const exampleArray = isExhaustive ? '"example1", "example2", "example3"' : '"example1"';
  const scenarioArray = isExhaustive ? '"scenario1", "scenario2"' : '"scenario1"';
  const useCasesArray = isExhaustive ? '"use_case1", "use_case2", "use_case3", "use_case4"' : '"use_case1"';
  const challengesArray = isExhaustive ? '"challenge1", "challenge2"' : '"challenge1"';
  
  // Format arrays for template
  const principlesList = validatedPrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n');
  const reconstructionList = reconstruction.map((r, i) => `${i + 1}. ${r}`).join('\n');
  const principlesArray = JSON.stringify(validatedPrinciples);
  const reconstructionArray = JSON.stringify(reconstruction);
  
  return STEP4_APPLICATION_LAYER_PROMPT
    .replace(/{concept}/g, concept)
    .replace(/{principles}/g, principlesList)
    .replace(/{reconstruction}/g, reconstructionList)
    .replace(/{domain}/g, domain)
    .replace(/{depth}/g, depth)
    .replace(/{exampleRequirement}/g, exampleRequirement)
    .replace(/{exampleGuidance}/g, exampleGuidance)
    .replace(/{principlesArray}/g, principlesArray)
    .replace(/{reconstructionArray}/g, reconstructionArray)
    .replace(/{exampleArray}/g, exampleArray)
    .replace(/{scenarioArray}/g, scenarioArray)
    .replace(/{useCasesArray}/g, useCasesArray)
    .replace(/{challengesArray}/g, challengesArray);
}