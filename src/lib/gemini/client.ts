import { GoogleGenerativeAI } from '@google/generative-ai';
import { APP_CONFIG } from '../constants';

/**
 * Gemini API client for MVP
 * Provides deterministic output with low temperature and JSON-only responses
 */
export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: APP_CONFIG.GEMINI_MODEL,
      generationConfig: {
        temperature: APP_CONFIG.GEMINI_TEMPERATURE,
        maxOutputTokens: APP_CONFIG.GEMINI_MAX_TOKENS,
      }
    });
  }

  /**
   * Call Gemini with a prompt and enforce JSON-only output
   * @param prompt The prompt to send to Gemini
   * @returns Promise<string> The response from Gemini
   */
  async callGemini(prompt: string): Promise<string> {
    try {
      // Enforce JSON-only output at prompt level
      const enhancedPrompt = this.enforceJSONOutput(prompt);
      
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      return text.trim();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enforce JSON-only output by modifying the prompt
   * @param originalPrompt The original prompt
   * @returns Enhanced prompt with JSON enforcement
   */
  private enforceJSONOutput(originalPrompt: string): string {
    return `${originalPrompt}

CRITICAL OUTPUT REQUIREMENTS:
- Respond ONLY with valid JSON
- NO markdown formatting (no \`\`\`json blocks)
- NO explanatory text before or after the JSON
- NO comments in the JSON
- Ensure the JSON is properly formatted and parseable
- Start your response directly with { and end with }

Your response must be pure JSON that can be parsed directly.`;
  }

  /**
   * Test the Gemini connection
   * @returns Promise<boolean> True if connection is successful
   */
  async testConnection(): Promise<boolean> {
    try {
      const testPrompt = 'Respond with valid JSON: {"test": "success"}';
      const response = await this.callGemini(testPrompt);
      
      // Try to parse the response as JSON
      JSON.parse(response);
      return true;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}