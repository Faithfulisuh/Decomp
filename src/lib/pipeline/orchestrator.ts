import { callGemini, parseGeminiResponse, parseAndValidateGeminiResponse } from '../gemini';
import { ConceptInput } from '@/types';
import { InternalReasoningModel, FirstPrinciple, ReconstructionStep, PrincipleAnchoredExample, PrincipleAnchoredUseCase, PrincipleAnchoredScenario, PrincipleAnchoredChallenge } from '@/types/internal';
import {
  generateStep1Prompt,
  generateStep2Prompt,
  generateStep3Prompt,
  generateStep4Prompt
} from '../prompts';
import { prependGoverningPrompt, validateGoverningCompliance } from '../../../llm/governingPrompt';

/**
 * Core pipeline orchestrator for MVP
 * Enforces fixed execution order with no branching or parallel execution
 */
export class PipelineOrchestrator {
  
  /**
   * Run the complete pipeline for a concept input
   * @param input ConceptInput with concept, domain, and depth
   * @returns Promise<InternalReasoningModel> The complete internal reasoning model
   */
  async runPipeline(input: ConceptInput): Promise<InternalReasoningModel> {
    console.log(`Starting pipeline for concept: ${input.concept} (${input.domain}, ${input.depth})`);
    
    try {
      // Step 1: Concept Decomposition (first principles)
      console.log('Step 1: Concept Decomposition');
      const principles = await this.executeStep1(input);
      
      // Step 2: Principle Validation
      console.log('Step 2: Principle Validation');
      const validatedPrinciples = await this.executeStep2(principles, input);
      
      // Step 3: Reconstruction from principles
      console.log('Step 3: Reconstruction');
      const reconstructionData = await this.executeStep3(validatedPrinciples, input);
      
      // Step 4: Application layer generation
      console.log('Step 4: Application Layer');
      const internalModel = await this.executeStep4(validatedPrinciples, reconstructionData, input);
      
      console.log('Pipeline completed successfully');
      return internalModel;
      
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      throw new Error(`Pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 1: Concept Decomposition - Extract irreducible first principles only
   */
  private async executeStep1(input: ConceptInput): Promise<string[]> {
    const taskPrompt = generateStep1Prompt(input.concept, input.domain, input.depth);
    
    // Validate prompt compliance and prepend governing constraints
    if (!validateGoverningCompliance(taskPrompt)) {
      throw new Error('Step 1 prompt violates governing constraints');
    }
    
    const governedPrompt = prependGoverningPrompt(taskPrompt);

    try {
      // Use the enhanced retry logic for better reliability
      const response = await callGemini(governedPrompt);
      console.log('Step 1 raw response:', response);
      const parsed = parseGeminiResponse(response);
      console.log('Step 1 parsed response:', parsed);
      
      if (!parsed || !parsed.first_principles || !Array.isArray(parsed.first_principles)) {
        console.error('Step 1 parsed response:', parsed);
        throw new Error('Step 1 failed: Invalid first_principles format');
      }
      
      return parsed.first_principles;
    } catch (error) {
      throw new Error(`Step 1 failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 2: Principle Validation - Remove redundancy and ensure fundamentals
   */
  private async executeStep2(principles: string[], input: ConceptInput): Promise<string[]> {
    const taskPrompt = generateStep2Prompt(input.concept, principles);
    
    // Validate prompt compliance and prepend governing constraints
    if (!validateGoverningCompliance(taskPrompt)) {
      throw new Error('Step 2 prompt violates governing constraints');
    }
    
    const governedPrompt = prependGoverningPrompt(taskPrompt);

    try {
      const response = await callGemini(governedPrompt);
      const parsed = parseGeminiResponse(response);
      
      if (!parsed.validated_principles || !Array.isArray(parsed.validated_principles)) {
        throw new Error('Step 2 failed: Invalid validated_principles format');
      }
      
      return parsed.validated_principles;
    } catch (error) {
      throw new Error(`Step 2 failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 3: Reconstruction - Build concept step-by-step from principles
   */
  private async executeStep3(validatedPrinciples: string[], input: ConceptInput): Promise<{ reconstruction: string[], definition: string }> {
    const taskPrompt = generateStep3Prompt(input.concept, validatedPrinciples, input.depth);
    
    // Validate prompt compliance and prepend governing constraints
    if (!validateGoverningCompliance(taskPrompt)) {
      throw new Error('Step 3 prompt violates governing constraints');
    }
    
    const governedPrompt = prependGoverningPrompt(taskPrompt);

    try {
      const response = await callGemini(governedPrompt);
      const parsed = parseGeminiResponse(response);
      
      if (!parsed.reconstruction || !Array.isArray(parsed.reconstruction) || !parsed.definition) {
        throw new Error('Step 3 failed: Invalid reconstruction format - missing reconstruction array or definition');
      }
      
      return {
        reconstruction: parsed.reconstruction,
        definition: parsed.definition
      };
    } catch (error) {
      throw new Error(`Step 3 failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 4: Application Layer - Generate examples, use cases, scenarios, and assumption challenges
   */
  private async executeStep4(
    validatedPrinciples: string[], 
    reconstructionData: { reconstruction: string[], definition: string }, 
    input: ConceptInput
  ): Promise<InternalReasoningModel> {
    const taskPrompt = generateStep4Prompt(
      input.concept, 
      validatedPrinciples, 
      reconstructionData.reconstruction, 
      input.domain, 
      input.depth
    );
    
    // Validate prompt compliance and prepend governing constraints
    if (!validateGoverningCompliance(taskPrompt)) {
      throw new Error('Step 4 prompt violates governing constraints');
    }
    
    const governedPrompt = prependGoverningPrompt(taskPrompt);

    try {
      // Get the raw response from Gemini
      const response = await callGemini(governedPrompt);
      const parsed = parseGeminiResponse(response);
      
      // Validate required sections are present
      const requiredSections = ['definition', 'first_principles', 'reconstruction', 'examples', 'use_cases', 'scenarios', 'assumption_challenges'];
      for (const section of requiredSections) {
        if (!parsed[section]) {
          throw new Error(`Step 4 failed: Missing ${section} in output`);
        }
      }
      
      // Transform the parsed response into InternalReasoningModel
      const internalModel: InternalReasoningModel = {
        definition: parsed.definition,
        first_principles: this.transformToFirstPrinciples(parsed.first_principles),
        reconstruction: this.transformToReconstructionSteps(parsed.reconstruction, validatedPrinciples),
        examples: this.transformToPrincipleAnchoredExamples(parsed.examples, validatedPrinciples),
        use_cases: this.transformToPrincipleAnchoredUseCases(parsed.use_cases, validatedPrinciples),
        scenarios: this.transformToPrincipleAnchoredScenarios(parsed.scenarios, validatedPrinciples),
        assumption_challenges: this.transformToPrincipleAnchoredChallenges(parsed.assumption_challenges, validatedPrinciples)
      };
      
      return internalModel;
    } catch (error) {
      throw new Error(`Step 4 failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transform string principles to FirstPrinciple objects
   */
  private transformToFirstPrinciples(principles: string[]): FirstPrinciple[] {
    return principles.map((principle, index) => ({
      id: `principle_${index + 1}`,
      statement: principle,
      necessity_justification: `This principle is necessary because without it, the concept would collapse logically.`
    }));
  }

  /**
   * Transform reconstruction steps with principle dependencies
   */
  private transformToReconstructionSteps(reconstruction: string[], principles: string[]): ReconstructionStep[] {
    return reconstruction.map((step, index) => ({
      id: `step_${index + 1}`,
      step_number: index + 1,
      description: step,
      principle_dependencies: principles.map((_, i) => `principle_${i + 1}`),
      logical_progression: index === 0 ? 'This is the foundational step.' : `This builds upon step ${index}.`
    }));
  }

  /**
   * Transform examples to principle-anchored examples
   */
  private transformToPrincipleAnchoredExamples(examples: string[], principles: string[]): PrincipleAnchoredExample[] {
    return examples.map((example, index) => ({
      id: `example_${index + 1}`,
      description: example,
      principle_dependencies: principles.map((_, i) => `principle_${i + 1}`),
      anchoring_explanation: `This example demonstrates the principles by showing them in action.`
    }));
  }

  /**
   * Transform use cases to principle-anchored use cases
   */
  private transformToPrincipleAnchoredUseCases(use_cases: string[], principles: string[]): PrincipleAnchoredUseCase[] {
    return use_cases.map((useCase, index) => ({
      id: `use_case_${index + 1}`,
      description: useCase,
      principle_dependencies: principles.map((_, i) => `principle_${i + 1}`),
      anchoring_explanation: `This use case applies the principles in a practical context.`
    }));
  }

  /**
   * Transform scenarios to principle-anchored scenarios
   */
  private transformToPrincipleAnchoredScenarios(scenarios: string[], principles: string[]): PrincipleAnchoredScenario[] {
    return scenarios.map((scenario, index) => ({
      id: `scenario_${index + 1}`,
      description: scenario,
      principle_dependencies: principles.map((_, i) => `principle_${i + 1}`),
      anchoring_explanation: `This scenario illustrates how the principles operate in a specific situation.`
    }));
  }

  /**
   * Transform assumption challenges to principle-anchored challenges
   */
  private transformToPrincipleAnchoredChallenges(challenges: string[], principles: string[]): PrincipleAnchoredChallenge[] {
    return challenges.map((challenge, index) => ({
      id: `challenge_${index + 1}`,
      challenged_assumption: challenge,
      principle_dependencies: principles.map((_, i) => `principle_${i + 1}`),
      challenge_explanation: `The principles invalidate this assumption by revealing fundamental truths.`
    }));
  }
}

/**
 * Simple runPipeline function as specified in the MVP task
 * @param input ConceptInput
 * @returns Promise<InternalReasoningModel> The complete internal reasoning model
 */
export async function runPipeline(input: ConceptInput): Promise<InternalReasoningModel> {
  const orchestrator = new PipelineOrchestrator();
  return await orchestrator.runPipeline(input);
}