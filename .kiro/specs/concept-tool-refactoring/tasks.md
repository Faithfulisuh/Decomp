# Implementation Plan: Concept Tool Refactoring

## Overview

This implementation plan systematically refactors the Gemini-based concept explanation application through 6 sequential steps: establishing immutable prompt governance, refactoring prompt assembly, enforcing data model separation, implementing deterministic narrative rendering, updating UI constraints, and adding failure safeguards. Each step builds upon the previous to ensure first-principles correctness and prevent content fabrication.

## Tasks

- [x] 1. Establish Governing Prompt System (Step 1)
  - Create `/llm/governingPrompt.ts` with immutable GOVERNING_PROMPT constant
  - Include first-principles persona constraints, necessity test, no-hallucination rule, WHY-not-HOW enforcement, derivability enforcement, principle anchoring, failure-is-allowed rule, and self-check requirement
  - Export as constant for system-wide use
  - _Requirements: 1.1, 1.2_

- [ ]* 1.1 Write property test for governing prompt structure
  - **Property 2: Governing Constraint Enforcement**
  - **Validates: Requirements 1.2**

- [x] 2. Refactor Prompt Assembly Pipeline (Step 2)
  - Modify `src/lib/pipeline/orchestrator.ts` to prepend GOVERNING_PROMPT to all task prompts
  - Add prompt compliance validation function
  - Ensure no task prompt can override governing constraints
  - Update all 4 step prompt generation to use governed prompts
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 2.1 Write property test for prompt composition
  - **Property 1: Governing Prompt Immutability**
  - **Validates: Requirements 1.3, 2.1**

- [x] 2.2 Write property test for composition purity
  - **Property 3: Prompt Composition Purity**
  - **Validates: Requirements 2.5**

- [x] 3. Implement Two-Layer Data Model (Step 3)
  - Create `src/types/internal.ts` with InternalReasoningModel interface
  - Create `src/types/narrative.ts` with NarrativeViewModel interface
  - Add principle anchoring to examples and assumption challenges
  - Update pipeline to return InternalReasoningModel instead of StructuredOutput
  - _Requirements: 3.1, 3.2_

- [ ]* 3.1 Write property test for internal model validation
  - **Property 5: Internal Model Structure Validation**
  - **Validates: Requirements 3.1, 7.1, 7.2**

- [x] 3.2 Write property test for principle anchoring
  - **Property 13: Principle Anchoring Completeness**
  - **Validates: Requirements 7.1, 7.2**

- [x] 4. Implement Deterministic Narrative Renderer (Step 4)
  - Create `src/lib/narrative/renderer.ts` with pure renderNarrative function
  - Implement logical content ordering: definition → reconstruction → examples → challenges
  - Add connective language without new information
  - Ensure deterministic output (same input → same output)
  - Handle content omission when logical ordering impossible
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

- [ ]* 4.1 Write property test for rendering determinism
  - **Property 6: Narrative Rendering Determinism**
  - **Validates: Requirements 4.1, 4.8**

- [ ]* 4.2 Write property test for content ordering
  - **Property 7: Content Ordering Preservation**
  - **Validates: Requirements 4.2, 4.5, 4.6**

- [ ]* 4.3 Write property test for content addition prevention
  - **Property 8: Content Addition Prevention**
  - **Validates: Requirements 4.4, 5.6**

- [x] 4.4 Write property test for content omission behavior
  - **Property 15: Content Omission Over Violation**
  - **Validates: Requirements 4.9**

- [x] 5. Update UI to Follow Narrative Contract (Step 5)
  - Create `src/components/narrative/NarrativeDisplay.tsx` component
  - Modify `src/app/page.tsx` to use narrative rendering pipeline
  - Remove structural labels ("Definition", "First Principles", etc.)
  - Ensure UI only accesses NarrativeViewModel, never InternalReasoningModel
  - Display paragraphs in strict order without reordering
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_

- [ ]* 5.1 Write property test for UI access control
  - **Property 4: Data Model Access Control**
  - **Validates: Requirements 3.3, 3.4, 3.5, 5.1**

- [x] 5.2 Write property test for UI rendering fidelity
  - **Property 9: UI Rendering Fidelity**
  - **Validates: Requirements 5.2, 5.3**

- [x] 6. Checkpoint - Test core refactoring
  - Ensure all tests pass, verify governing prompt system works
  - Test narrative rendering with sample data
  - Validate UI displays content without structural labels
  - Ask the user if questions arise

- [x] 7. Implement Failure Safeguards (Step 6)
  - Create `src/lib/safeguards/index.ts` with failure handling logic
  - Add validation for incomplete/invalid Gemini responses
  - Implement graceful error states instead of content fabrication
  - Prefer empty/partial output over invented content
  - Add content derivability validation
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.4, 7.5_

- [ ]* 7.1 Write property test for failure over fabrication
  - **Property 10: Failure Over Fabrication**
  - **Validates: Requirements 6.1, 6.2, 6.4, 6.5**

- [ ]* 7.2 Write property test for content derivability
  - **Property 11: Content Derivability Validation**
  - **Validates: Requirements 7.4, 7.5**

- [ ] 8. Update API Integration
  - Modify `src/app/api/decompose/route.ts` to use new pipeline
  - Ensure backward compatibility for response format
  - Maintain existing input validation
  - Update error handling to use new safeguards
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 8.1 Write property test for API compatibility
  - **Property 12: API Compatibility Preservation**
  - **Validates: Requirements 8.1, 8.2, 8.3**

- [ ] 9. Add Content Validation Layer
  - Create `src/lib/validation/content.ts` for principle anchoring validation
  - Implement logical sequence validation for reconstruction steps
  - Add traceability validation from narrative to internal model
  - Ensure all content is derivable from stated principles
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 9.1 Write property test for logical sequence validation
  - **Property 14: Logical Sequence Validation**
  - **Validates: Requirements 7.3**

- [ ] 10. Integration and Final Wiring
  - Wire all components together in the complete pipeline
  - Update main application flow to use new architecture
  - Ensure governing prompt is applied to all Gemini calls
  - Verify narrative rendering works end-to-end
  - Test failure safeguards with invalid data
  - _Requirements: All requirements integration_

- [ ] 11. Final checkpoint - Complete system validation
  - Run full test suite to ensure all properties pass
  - Test with various concept inputs to verify correctness
  - Validate that UI never shows structural labels
  - Confirm failure states work properly
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at critical points
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- The 6-step approach ensures systematic refactoring without breaking existing functionality