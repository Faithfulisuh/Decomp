import { NextRequest, NextResponse } from 'next/server';
import { runPipeline } from '@/lib/pipeline/orchestrator';
import { ConceptInput, DecomposeResponse } from '@/types';
import { z } from 'zod';

// Simple validation schema since we removed the validation module
const conceptInputSchema = z.object({
  concept: z
    .string()
    .min(3, 'Concept must be at least 3 characters')
    .max(50, 'Concept must be less than 50 characters')
    .trim()
    .refine((val) => val.length > 0, 'Concept cannot be empty'),
  
  domain: z.enum(['general', 'mathematics', 'physics', 'computer-science', 'economics', 'biology', 'philosophy', 'chemistry', 'psychology'], {
    errorMap: () => ({ message: 'Invalid domain selected' })
  }),
  
  depth: z.enum(['short', 'exhaustive'], {
    errorMap: () => ({ message: 'Depth must be either short or exhaustive' })
  })
});

/**
 * POST /api/decompose
 * 
 * Processes a concept through the 4-step pipeline to generate structured explanations
 * 
 * Request Body:
 * {
 *   "input": {
 *     "concept": "Algorithm",
 *     "domain": "tech",
 *     "depth": "short"
 *   }
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "definition": "...",
 *     "first_principles": ["..."],
 *     "reconstruction": ["..."],
 *     "examples": ["..."],
 *     "use_cases": ["..."],
 *     "scenarios": ["..."],
 *     "assumption_challenges": ["..."]
 *   }
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<DecomposeResponse>> {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body'
        },
        { status: 400 }
      );
    }

    // Validate request structure
    if (!body || !body.input) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: input'
        },
        { status: 400 }
      );
    }

    // Validate concept input using Zod schema
    const validation = conceptInputSchema.safeParse(body.input);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid input: ${validation.error.errors.map(err => err.message).join(', ')}`
        },
        { status: 400 }
      );
    }

    const conceptInput: ConceptInput = validation.data;

    // Log the request for debugging (remove in production)
    console.log('Processing concept decomposition request:', {
      concept: conceptInput.concept,
      domain: conceptInput.domain,
      depth: conceptInput.depth
    });

    // Run the pipeline
    try {
      const result = await runPipeline(conceptInput);

      // Log successful completion
      console.log('Pipeline completed successfully for concept:', conceptInput.concept);

      return NextResponse.json(
        {
          success: true,
          data: result
        },
        { status: 200 }
      );

    } catch (pipelineError) {
      console.error('Pipeline execution failed:', pipelineError);
      
      return NextResponse.json(
        {
          success: false,
          error: `Pipeline failed: ${pipelineError instanceof Error ? pipelineError.message : 'Unknown pipeline error'}`
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/decompose
 * 
 * Returns API information and usage instructions
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      name: 'Concept Decomposition API',
      version: '1.0.0',
      description: 'Decomposes concepts into structured explanations using first principles',
      usage: {
        method: 'POST',
        endpoint: '/api/decompose',
        body: {
          input: {
            concept: 'string (3-50 characters)',
            domain: 'tech | business | education | general',
            depth: 'short | exhaustive'
          }
        }
      },
      example: {
        input: {
          concept: 'Algorithm',
          domain: 'tech',
          depth: 'short'
        }
      }
    },
    { status: 200 }
  );
}