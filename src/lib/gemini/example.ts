import { callGemini, parseGeminiResponse } from './index';

/**
 * Example usage of the Gemini API wrapper
 * This file demonstrates how to use the callGemini function
 */

export async function exampleGeminiCall() {
  try {
    // Example prompt that requests JSON output
    const prompt = `
Analyze the concept "Algorithm" and provide a JSON response with the following structure:
{
  "definition": "Brief definition of algorithm",
  "first_principles": ["principle1", "principle2"],
  "examples": ["example1", "example2"]
}
`;

    // Call Gemini API
    const response = await callGemini(prompt);
    console.log('Raw Gemini response:', response);

    // Parse the JSON response
    const parsedResponse = parseGeminiResponse(response);
    console.log('Parsed response:', parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error('Example Gemini call failed:', error);
    throw error;
  }
}

/**
 * Example of testing the Gemini connection
 */
export async function exampleConnectionTest() {
  const { testGeminiConnection } = await import('./index');
  
  try {
    const isConnected = await testGeminiConnection();
    console.log('Gemini connection test:', isConnected ? 'SUCCESS' : 'FAILED');
    return isConnected;
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
}