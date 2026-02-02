import { renderNarrative } from '../renderer';
import { InternalReasoningModel } from '@/types/internal';

describe('Narrative Renderer', () => {
  const mockInternalModel: InternalReasoningModel = {
    definition: "Test concept is a fundamental approach to understanding core principles.",
    first_principles: [
      {
        id: 'principle_1',
        statement: 'Core essence of test concept',
        necessity_justification: 'This principle is necessary because without it, the concept would collapse logically.'
      },
      {
        id: 'principle_2',
        statement: 'Fundamental building blocks',
        necessity_justification: 'This principle provides the foundation for all other aspects.'
      }
    ],
    reconstruction: [
      {
        id: 'step_1',
        step_number: 1,
        description: 'Identify the core purpose',
        principle_dependencies: ['principle_1'],
        logical_progression: 'This establishes the foundation.'
      },
      {
        id: 'step_2',
        step_number: 2,
        description: 'Build upon the foundation',
        principle_dependencies: ['principle_1', 'principle_2'],
        logical_progression: 'This extends the initial understanding.'
      }
    ],
    examples: [
      {
        id: 'example_1',
        description: 'Basic test case - simple application',
        principle_dependencies: ['principle_1'],
        anchoring_explanation: 'This example demonstrates the principles by showing them in action.'
      }
    ],
    use_cases: [
      {
        id: 'use_case_1',
        description: 'Learning and teaching effectively',
        principle_dependencies: ['principle_1', 'principle_2'],
        anchoring_explanation: 'This use case applies the principles in a practical context.'
      }
    ],
    scenarios: [
      {
        id: 'scenario_1',
        description: 'When encountering test concepts in practice',
        principle_dependencies: ['principle_1'],
        anchoring_explanation: 'This scenario illustrates how the principles operate in a specific situation.'
      }
    ],
    assumption_challenges: [
      {
        id: 'challenge_1',
        challenged_assumption: 'Assuming test concepts work the same in all contexts',
        principle_dependencies: ['principle_2'],
        challenge_explanation: 'The principles invalidate this assumption by revealing fundamental truths.'
      }
    ]
  };

  describe('renderNarrative', () => {
    it('should transform InternalReasoningModel to NarrativeViewModel', () => {
      const result = renderNarrative(mockInternalModel);
      
      expect(result).toBeDefined();
      expect(result.definition).toBe(mockInternalModel.definition);
      expect(result.first_principles).toHaveLength(2);
      expect(result.reconstruction).toHaveLength(2);
      expect(result.examples).toHaveLength(1);
      expect(result.use_cases).toHaveLength(1);
      expect(result.scenarios).toHaveLength(1);
      expect(result.assumption_challenges).toHaveLength(1);
      expect(result.narrative_metadata).toBeDefined();
    });

    it('should maintain deterministic output for same input', () => {
      const result1 = renderNarrative(mockInternalModel);
      const result2 = renderNarrative(mockInternalModel);
      
      expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
    });

    it('should preserve logical ordering of reconstruction steps', () => {
      const result = renderNarrative(mockInternalModel);
      
      expect(result.reconstruction[0].step_description).toContain('Identify the core purpose');
      expect(result.reconstruction[1].step_description).toContain('Build upon the foundation');
    });

    it('should generate appropriate connective language', () => {
      const result = renderNarrative(mockInternalModel);
      
      // Check that reconstruction steps have connections
      expect(result.reconstruction[0].connection_to_previous).toContain('foundation');
      expect(result.reconstruction[1].connection_to_previous).toContain('builds directly');
    });

    it('should handle different audience types', () => {
      const studentResult = renderNarrative(mockInternalModel, 'students');
      const professionalResult = renderNarrative(mockInternalModel, 'professionals');
      const generalResult = renderNarrative(mockInternalModel, 'general');
      
      expect(studentResult.narrative_metadata.target_audience).toBe('students');
      expect(professionalResult.narrative_metadata.target_audience).toBe('professionals');
      expect(generalResult.narrative_metadata.target_audience).toBe('general');
      
      // Check that accessibility notes differ by audience
      expect(studentResult.first_principles[0].accessibility_note).toContain('building block');
      expect(professionalResult.first_principles[0].accessibility_note).toContain('core axiom');
    });

    it('should throw error for invalid input', () => {
      expect(() => renderNarrative(null as any)).toThrow('InternalReasoningModel is required');
      expect(() => renderNarrative(undefined as any)).toThrow('InternalReasoningModel is required');
    });
  });
});
