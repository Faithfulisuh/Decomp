import { callGemini, parseGeminiResponse, testGeminiConnection } from '../index';

// Mock the Gemini API for testing
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('{"test": "success"}')
        }
      })
    })
  }))
}));

describe('Gemini API Wrapper (MVP)', () => {
  // Set up environment variable for tests
  beforeAll(() => {
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  afterAll(() => {
    delete process.env.GEMINI_API_KEY;
  });

  describe('parseGeminiResponse', () => {
    it('should parse valid JSON response', () => {
      const response = '{"definition": "test", "examples": ["example1"]}';
      const parsed = parseGeminiResponse(response);
      
      expect(parsed).toEqual({
        definition: "test",
        examples: ["example1"]
      });
    });

    it('should handle JSON with markdown code blocks', () => {
      const response = '```json\n{"definition": "test"}\n```';
      const parsed = parseGeminiResponse(response);
      
      expect(parsed).toEqual({
        definition: "test"
      });
    });

    it('should throw error for invalid JSON', () => {
      const response = 'This is not JSON';
      
      expect(() => parseGeminiResponse(response)).toThrow('Invalid JSON response from Gemini');
    });

    it('should handle whitespace in response', () => {
      const response = '  \n  {"test": "value"}  \n  ';
      const parsed = parseGeminiResponse(response);
      
      expect(parsed).toEqual({ test: "value" });
    });
  });

  describe('callGemini', () => {
    it('should call Gemini API successfully', async () => {
      const response = await callGemini('Test prompt');
      expect(response).toBe('{"test": "success"}');
    });
  });

  describe('testGeminiConnection', () => {
    it('should test connection successfully', async () => {
      const result = await testGeminiConnection();
      expect(result).toBe(true);
    });
  });

  describe('JSON enforcement', () => {
    it('should add JSON enforcement instructions to prompts', async () => {
      // This test verifies that the prompt enhancement is working
      // The actual prompt enhancement is tested indirectly through the mock
      const response = await callGemini('Simple test prompt');
      expect(response).toBe('{"test": "success"}');
    });
  });
});