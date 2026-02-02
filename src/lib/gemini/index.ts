import { GeminiClient } from './client';

// Singleton instance for the MVP
let geminiClient: GeminiClient | null = null;

/**
 * Get or create the Gemini client instance
 */
function getGeminiClient(): GeminiClient {
  if (!geminiClient) {
    geminiClient = new GeminiClient();
  }
  return geminiClient;
}

/**
 * Simple callGemini function as specified in the MVP task
 * @param prompt The prompt to send to Gemini
 * @returns Promise<string> The response from Gemini
 */
export async function callGemini(prompt: string): Promise<string> {
  const client = getGeminiClient();
  return await client.callGemini(prompt);
}

/**
 * Test the Gemini API connection
 * @returns Promise<boolean> True if connection works
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const client = getGeminiClient();
    return await client.testConnection();
  } catch (error) {
    console.error('Failed to test Gemini connection:', error);
    return false;
  }
}

/**
 * Parse JSON response from Gemini with error handling
 * @param response The raw response from Gemini
 * @returns Parsed JSON object or throws error
 */
export function parseGeminiResponse(response: string): any {
  try {
    // Clean up the response - remove any potential markdown formatting
    let cleanResponse = response.trim();
    
    // Remove markdown code blocks if present
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse the JSON
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON:', response);
    throw new Error(`Invalid JSON response from Gemini: ${error instanceof Error ? error.message : 'Parse error'}`);
  }
}

/**
 * Enhanced parsing with validation and retry logic for MVP
 * @param response The raw response from Gemini
 * @param expectedSchema Optional schema validation (for final output)
 * @returns Parsed and validated JSON object
 */
export function parseAndValidateGeminiResponse(response: string, expectedSchema?: 'structured_output'): any {
  try {
    const parsed = parseGeminiResponse(response);
    
    // Basic validation for structured output without the validation module
    if (expectedSchema === 'structured_output') {
      if (!parsed.definition || !parsed.first_principles || !parsed.reconstruction || 
          !parsed.examples || !parsed.use_cases || !parsed.scenarios || !parsed.assumption_challenges) {
        throw new Error('Missing required fields in structured output');
      }
      if (!Array.isArray(parsed.first_principles) || parsed.first_principles.length === 0) {
        throw new Error('first_principles must be a non-empty array');
      }
      if (!Array.isArray(parsed.reconstruction) || parsed.reconstruction.length === 0) {
        throw new Error('reconstruction must be a non-empty array');
      }
      // Similar basic validation for other arrays
    }
    
    return parsed;
  } catch (error) {
    throw error; // Re-throw for retry logic to handle
  }
}

/**
 * Call Gemini with retry logic for validation failures
 * @param prompt The initial prompt
 * @param expectedSchema Optional schema to validate against
 * @param maxRetries Maximum number of retries (default: 1)
 * @returns Promise<any> Parsed and validated response
 */
export async function callGeminiWithRetry(
  prompt: string, 
  expectedSchema?: 'structured_output',
  maxRetries: number = 1
): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await callGemini(prompt);
      return parseAndValidateGeminiResponse(response, expectedSchema);
    } catch (error) {
      lastError = error as Error;
      
      // If this is not the last attempt, create a retry prompt with feedback
      if (attempt < maxRetries) {
        console.warn(`Attempt ${attempt + 1} failed, retrying with schema feedback:`, lastError.message);
        
        // Enhance the prompt with schema violation feedback
        const retryPrompt = createRetryPromptWithFeedback(prompt, lastError.message, expectedSchema);
        prompt = retryPrompt; // Use the enhanced prompt for the next attempt
      }
    }
  }
  
  // If we get here, all attempts failed
  throw new Error(`All retry attempts failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Create a retry prompt with schema violation feedback
 * @param originalPrompt The original prompt
 * @param errorMessage The validation error message
 * @param expectedSchema The expected schema type
 * @returns Enhanced prompt with feedback
 */
function createRetryPromptWithFeedback(
  originalPrompt: string, 
  errorMessage: string, 
  expectedSchema?: 'structured_output'
): string {
  let schemaReminder = '';
  
  if (expectedSchema === 'structured_output') {
    schemaReminder = `

SCHEMA VALIDATION ERROR: ${errorMessage}

REQUIRED OUTPUT SCHEMA:
{
  "definition": "string (required, non-empty)",
  "first_principles": ["array of strings (required, at least 1 item)"],
  "reconstruction": ["array of strings (required, at least 1 item)"],
  "examples": ["array of strings (required, at least 1 item)"],
  "use_cases": ["array of strings (required, at least 1 item)"],
  "scenarios": ["array of strings (required, at least 1 item)"],
  "assumption_challenges": ["array of strings (required, at least 1 item)"]
}

CRITICAL: Ensure ALL fields are present and non-empty arrays where specified.`;
  } else {
    schemaReminder = `

PARSING ERROR: ${errorMessage}

Please ensure your response is valid JSON that can be parsed directly.`;
  }
  
  return `${originalPrompt}${schemaReminder}

RETRY ATTEMPT: The previous response had validation issues. Please correct them and provide a valid response.`;
}

// Export the client class for advanced usage if needed
export { GeminiClient };