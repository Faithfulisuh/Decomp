# Implementation Plan: Concept Decomposition Tool (MVP – Gemini API)

## Overview

This implementation plan converts the concept decomposition tool design into a minimal set of discrete coding tasks required to ship a working MVP. The approach focuses on building the core reasoning pipeline first, exposing it through a single API endpoint, and adding a minimal web interface for interaction. Each task builds incrementally to avoid orphaned code and reduce iteration friction, with prompt quality prioritized over architectural complexity.

## Tasks

- [x] 1. Set up Next.js project structure and core dependencies
  - Initialize Next.js project with TypeScript
  - Set up minimal directory structure (/lib/pipeline, /lib/prompts, /lib/gemini, /api, /types)
  - Install and configure required dependencies (Gemini SDK, Zod)
  - Configure environment variables for Gemini API access
  - _Requirements: Project foundation_

- [x] 2. Define core input and output schemas
  - Create TypeScript interfaces for ConceptInput
    - concept: string
    - domain: "tech" | "business" | "education" | "general"
    - depth: "short" | "exhaustive"
  - Define strict Zod schema for StructuredOutput
    - definition
    - first_principles
    - reconstruction
    - examples
    - use_cases
    - scenarios
    - assumption_challenges
  - Implement schema validation helper
  - _Requirements: Deterministic structured output_

- [x] 3. Implement Gemini API wrapper
  - Create Gemini client initialization logic
  - Implement callGemini(prompt) function
  - Configure low temperature for deterministic output
  - Enforce "JSON only, no markdown" instructions at prompt level
  - _Requirements: LLM integration_

- [x] 4. Implement core pipeline orchestrator
  - Create a single runPipeline(input) function
  - Enforce fixed execution order:
    - Concept decomposition (first principles)
    - Principle validation
    - Reconstruction from principles
    - Application layer generation
  - Abort pipeline on any step failure
  - Do not allow branching or parallel execution
  - _Requirements: First-principles reasoning pipeline_

- [x] 5. Create prompt templates for each pipeline step
  - Implement Step 1: Concept Decomposition prompt
    - Extract irreducible first principles only
    - No examples, no metaphors
  - Implement Step 2: Principle Validation prompt
    - Remove redundancy and non-fundamental principles
  - Implement Step 3: Reconstruction prompt
    - Rebuild concept step-by-step from principles
  - Implement Step 4: Application Layer prompt
    - Generate examples, use cases, scenarios, and assumption challenges
    - Differentiate output based on depth mode
  - Store prompts as editable constants
  - _Requirements: Structured explanation generation_

- [x] 6. Implement output parsing, validation, and retry logic
  - Parse Gemini response as JSON
  - Validate output against Zod schema
  - If validation fails:
    - Retry once with schema violation feedback
    - Fail hard on second failure
  - Do not implement partial regeneration in MVP
  - _Requirements: Reliability and determinism_

- [x] 7. Create API route
  - Implement POST /api/decompose endpoint
  - Validate request body using Zod
  - Invoke pipeline orchestrator
  - Return structured JSON response
  - Handle errors with appropriate HTTP status codes
  - _Requirements: External interface_

- [ ] 8. Build minimal frontend input form
  - Create form with:
    - Concept name input
    - Domain selector
    - Depth selector
  - Prevent free-text prompting or advanced options
  - Submit request to /api/decompose
  - _Requirements: Controlled user input_

- [ ] 9. Implement structured output renderer
  - Render output sections in fixed order:
    - Definition
    - First principles
    - Reconstruction
    - Examples
    - Use cases
    - Scenarios
    - Assumption challenges
  - Respect depth mode differences
  - Keep UI minimal and readable
  - _Requirements: Clarity and usability_

- [ ] 10. Benchmark and prompt iteration checkpoint
  - Test manually with benchmark concepts:
    - Algorithm
    - API
    - Profit
    - Learning
    - Time
  - Evaluate:
    - Principle quality
    - Assumption challenge strength
    - Consistency across reruns
  - Iterate on prompts only; avoid code changes unless necessary
  - _Requirements: Output quality validation_

- [ ] 11. Final MVP checkpoint
  - Verify:
    - Same input produces structurally consistent output
    - All required sections are always present
    - Wrong assumptions are explicitly challenged
    - Confirm tool is usable for students and self-learners
  - _Requirements: MVP completion_

## Notes

- No property-based testing or over-engineering
- Focus on prompt quality over architectural complexity
- Each task builds incrementally with no orphaned code
- Manual testing and iteration prioritized over automated testing
- Gemini API used instead of OpenAI for cost efficiency