import { runPipeline, PipelineOrchestrator } from '../orchestrator';
import { ConceptInput } from '@/types';

// Mock the Gemini API
jest.mock('../../gemini', () => ({
  callGemini: jest.fn(),
  parseGeminiResponse: jest.fn(),
  parseAndValidateGeminiResponse: jest.fn()
}));

import { callGemini, parseGeminiResponse, parseAndValidateGeminiResponse } from '../../gemini';

const mockCallGemini = callGemini as jest.MockedFunction<typeof callGemini>;
const mockParseGeminiResponse = parseGeminiResponse as jest.MockedFunction<typeof parseGeminiResponse>;
const mockParseAndValidateGeminiResponse = parseAndValidateGeminiResponse as jest.MockedFunction<typeof parseAndValidateGeminiResponse>;

describe('Pipeline Orchestrator (MVP)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runPipeline function', () => {
    beforeEach(() => {
      // Set up default mock responses for each step
      mockCallGemini.mockResolvedValue('{"mock": "response"}');
      
      // Mock parseGeminiResponse to return appropriate responses for each step
      mockParseGeminiResponse
        .mockReturnValueOnce({ // Step 1
          first_principles: ['Principle 1', 'Principle 2', 'Principle 3']
        })
        .mockReturnValueOnce({ // Step 2
          validated_principles: ['Validated Principle 1', 'Validated Principle 2']
        })
        .mockReturnValueOnce({ // Step 3
          reconstruction: ['Step 1', 'Step 2', 'Step 3'],
          definition: 'Test definition'
        });
      
      // Mock parseAndValidateGeminiResponse for Step 4
      mockParseAndValidateGeminiResponse.mockReturnValueOnce({ // Step 4
        definition: 'A clear definition of the concept',
        first_principles: ['Validated Principle 1', 'Validated Principle 2'],
        reconstruction: ['Step 1', 'Step 2', 'Step 3'],
        examples: ['Example 1'],
        use_cases: ['Use case 1', 'Use case 2'],
        scenarios: ['Scenario 1'],
        assumption_challenges: ['Challenge 1', 'Challenge 2']
      });
    });

    it('should execute complete pipeline successfully', async () => {
      const input: ConceptInput = {
        concept: 'Algorithm',
        domain: 'tech',
        depth: 'short'
      };

      const result = await runPipeline(input);

      expect(result).toEqual({
        definition: 'A clear definition of the concept',
        first_principles: ['Validated Principle 1', 'Validated Principle 2'],
        reconstruction: ['Step 1', 'Step 2', 'Step 3'],
        examples: ['Example 1'],
        use_cases: ['Use case 1', 'Use case 2'],
        scenarios: ['Scenario 1'],
        assumption_challenges: ['Challenge 1', 'Challenge 2']
      });

      // Verify all 4 steps were called
      expect(mockCallGemini).toHaveBeenCalledTimes(4);
      expect(mockParseGeminiResponse).toHaveBeenCalledTimes(4);
    });

    it('should handle exhaustive depth mode', async () => {
      // Reset mocks for exhaustive mode
      jest.clearAllMocks();
      mockCallGemini.mockResolvedValue('{"mock": "response"}');
      
      mockParseGeminiResponse
        .mockReturnValueOnce({ first_principles: ['P1', 'P2'] })
        .mockReturnValueOnce({ validated_principles: ['VP1', 'VP2'] })
        .mockReturnValueOnce({ reconstruction: ['R1', 'R2'], definition: 'Def' });
      
      mockParseAndValidateGeminiResponse.mockReturnValueOnce({
        definition: 'Exhaustive definition',
        first_principles: ['VP1', 'VP2'],
        reconstruction: ['R1', 'R2'],
        examples: ['Example 1', 'Example 2', 'Example 3'],
        use_cases: ['Use case 1', 'Use case 2'],
        scenarios: ['Scenario 1', 'Scenario 2'],
        assumption_challenges: ['Challenge 1', 'Challenge 2']
      });

      const input: ConceptInput = {
        concept: 'Algorithm',
        domain: 'tech',
        depth: 'exhaustive'
      };

      const result = await runPipeline(input);

      expect(result.examples.length).toBeGreaterThanOrEqual(1);
      expect(result.scenarios.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Pipeline execution order', () => {
    it('should execute steps in fixed order', async () => {
      const input: ConceptInput = {
        concept: 'Test',
        domain: 'tech',
        depth: 'short'
      };

      await runPipeline(input);

      // Verify the prompts contain the expected step indicators
      const calls = mockCallGemini.mock.calls;
      expect(calls[0][0]).toContain('Extract ONLY the irreducible first principles');
      expect(calls[1][0]).toContain('Review these principles');
      expect(calls[2][0]).toContain('reconstruct the concept');
      expect(calls[3][0]).toContain('Create the application layer');
    });

    it('should abort on step failure', async () => {
      // Reset mocks for this specific test
      jest.clearAllMocks();
      
      mockParseGeminiResponse
        .mockReturnValueOnce({ first_principles: ['P1'] })
        .mockImplementationOnce(() => {
          throw new Error('Step 2 parsing failed');
        });

      const input: ConceptInput = {
        concept: 'Test',
        domain: 'tech',
        depth: 'short'
      };

      await expect(runPipeline(input)).rejects.toThrow('Pipeline failed');
      
      // Should call first 2 steps before failing
      expect(mockCallGemini).toHaveBeenCalledTimes(2);
    });
  });

  describe('Domain-specific processing', () => {
    it('should include domain in prompts', async () => {
      const input: ConceptInput = {
        concept: 'Profit',
        domain: 'business',
        depth: 'short'
      };

      await runPipeline(input);

      const calls = mockCallGemini.mock.calls;
      expect(calls[0][0]).toContain('business domain');
      expect(calls[3][0]).toContain('Domain: business');
    });
  });

  describe('Error handling', () => {
    it('should handle Gemini API failures', async () => {
      mockCallGemini.mockRejectedValueOnce(new Error('API Error'));

      const input: ConceptInput = {
        concept: 'Test',
        domain: 'tech',
        depth: 'short'
      };

      await expect(runPipeline(input)).rejects.toThrow('Pipeline failed');
    });

    it('should handle invalid step outputs', async () => {
      // Reset mocks for this specific test
      jest.clearAllMocks();
      
      mockParseGeminiResponse
        .mockReturnValueOnce({ invalid: 'response' }); // Missing first_principles

      const input: ConceptInput = {
        concept: 'Test',
        domain: 'tech',
        depth: 'short'
      };

      await expect(runPipeline(input)).rejects.toThrow('Pipeline failed');
    });

    it('should handle output validation failures', async () => {
      // Reset mocks for this specific test
      jest.clearAllMocks();
      
      mockParseGeminiResponse
        .mockReturnValueOnce({ first_principles: ['P1'] })
        .mockReturnValueOnce({ validated_principles: ['VP1'] })
        .mockReturnValueOnce({ reconstruction: ['R1'], definition: 'Def' });
      
      mockParseAndValidateGeminiResponse.mockReturnValueOnce({
        definition: 'Test',
        first_principles: ['VP1'],
        reconstruction: ['R1'],
        examples: ['Example 1'],
        use_cases: ['Use case 1'],
        scenarios: ['Scenario 1'],
        assumption_challenges: ['Challenge 1']
      });

      const input: ConceptInput = {
        concept: 'Test',
        domain: 'tech',
        depth: 'short'
      };

      await expect(runPipeline(input)).rejects.toThrow('Pipeline failed');
    });
  });

  describe('PipelineOrchestrator class', () => {
    it('should be instantiable and work independently', async () => {
      const orchestrator = new PipelineOrchestrator();
      
      const input: ConceptInput = {
        concept: 'Test',
        domain: 'tech',
        depth: 'short'
      };

      const result = await orchestrator.runPipeline(input);
      expect(result).toBeDefined();
      expect(result.definition).toBeDefined();
    });
  });
});