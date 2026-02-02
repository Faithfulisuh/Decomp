import { 
  parseGeminiResponse, 
  parseAndValidateGeminiResponse 
} from '../index';

describe('Gemini Response Parsing and Validation', () => {
  describe('parseGeminiResponse', () => {
    it('should parse clean JSON', () => {
      const response = '{"test": "value", "array": ["item1", "item2"]}';
      const result = parseGeminiResponse(response);
      
      expect(result).toEqual({
        test: "value",
        array: ["item1", "item2"]
      });
    });

    it('should clean markdown formatting', () => {
      const response = '```json\n{"clean": "me"}\n```';
      const result = parseGeminiResponse(response);
      
      expect(result).toEqual({ clean: "me" });
    });

    it('should handle plain code blocks', () => {
      const response = '```\n{"plain": "block"}\n```';
      const result = parseGeminiResponse(response);
      
      expect(result).toEqual({ plain: "block" });
    });

    it('should throw descriptive error for invalid JSON', () => {
      const response = 'Not valid JSON at all';
      
      expect(() => {
        parseGeminiResponse(response);
      }).toThrow('Invalid JSON response from Gemini');
    });

    it('should handle whitespace', () => {
      const response = '  \n  {"trimmed": "value"}  \n  ';
      const result = parseGeminiResponse(response);
      
      expect(result).toEqual({ trimmed: "value" });
    });
  });

  describe('parseAndValidateGeminiResponse', () => {
    it('should parse valid JSON without schema validation', () => {
      const response = '{"test": "value", "array": ["item1", "item2"]}';
      const result = parseAndValidateGeminiResponse(response);
      
      expect(result).toEqual({
        test: "value",
        array: ["item1", "item2"]
      });
    });

    it('should validate structured output schema successfully', () => {
      const validStructuredOutput = {
        definition: "Test definition",
        first_principles: ["Principle 1", "Principle 2"],
        reconstruction: ["Step 1", "Step 2"],
        examples: ["Example 1"],
        use_cases: ["Use case 1"],
        scenarios: ["Scenario 1"],
        assumption_challenges: ["Challenge 1"]
      };
      
      const response = JSON.stringify(validStructuredOutput);
      const result = parseAndValidateGeminiResponse(response, 'structured_output');
      
      expect(result).toEqual(validStructuredOutput);
    });

    it('should throw error for invalid structured output schema', () => {
      const invalidStructuredOutput = {
        definition: "Test definition",
        first_principles: ["Principle 1"],
        // Missing required fields: reconstruction, examples, use_cases, scenarios, assumption_challenges
      };
      
      const response = JSON.stringify(invalidStructuredOutput);
      
      expect(() => {
        parseAndValidateGeminiResponse(response, 'structured_output');
      }).toThrow('Schema validation failed');
    });

    it('should throw error for empty arrays in structured output', () => {
      const invalidStructuredOutput = {
        definition: "Test definition",
        first_principles: [], // Empty array should fail
        reconstruction: ["Step 1"],
        examples: ["Example 1"],
        use_cases: ["Use case 1"],
        scenarios: ["Scenario 1"],
        assumption_challenges: ["Challenge 1"]
      };
      
      const response = JSON.stringify(invalidStructuredOutput);
      
      expect(() => {
        parseAndValidateGeminiResponse(response, 'structured_output');
      }).toThrow('Schema validation failed');
    });

    it('should handle markdown-wrapped JSON with schema validation', () => {
      const validStructuredOutput = {
        definition: "Test definition",
        first_principles: ["Principle 1"],
        reconstruction: ["Step 1"],
        examples: ["Example 1"],
        use_cases: ["Use case 1"],
        scenarios: ["Scenario 1"],
        assumption_challenges: ["Challenge 1"]
      };
      
      const response = `\`\`\`json\n${JSON.stringify(validStructuredOutput)}\n\`\`\``;
      const result = parseAndValidateGeminiResponse(response, 'structured_output');
      
      expect(result).toEqual(validStructuredOutput);
    });
  });
});