'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConceptInput, DecomposeResponse } from '@/types';
import { renderNarrative } from '@/lib/narrative';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState<ConceptInput>({
    concept: '',
    domain: 'general',
    depth: 'short'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DecomposeResponse | null>(null);
  const [narrativeResult, setNarrativeResult] = useState<any>(null);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    if (authStatus !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setUserEmail(email || '');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.concept.trim()) {
      alert('Please enter a concept to decompose');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setNarrativeResult(null);

    // TEMPORARY MOCK - Remove when API quota resets
    const useMock = false; // Set to false to use real API
    
    if (useMock) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on the concept
      const mockData: DecomposeResponse = {
        success: true,
        data: {
          definition: `${formData.concept} is a fundamental concept in the ${formData.domain} domain that represents a systematic approach to understanding and applying core principles.`,
          first_principles: [
            {
              id: 'principle_1',
              statement: `Core essence of ${formData.concept}`,
              necessity_justification: 'This principle is necessary because without it, the concept would collapse logically.'
            },
            {
              id: 'principle_2',
              statement: `Fundamental building blocks that define ${formData.concept}`,
              necessity_justification: 'This principle is necessary because without it, the concept would collapse logically.'
            }
          ],
          reconstruction: [
            {
              id: 'step_1',
              step_number: 1,
              description: `Identify the core purpose of ${formData.concept}`,
              principle_dependencies: ['principle_1'],
              logical_progression: 'This is the foundational step.'
            },
            {
              id: 'step_2',
              step_number: 2,
              description: `Build understanding using the fundamental principles`,
              principle_dependencies: ['principle_1', 'principle_2'],
              logical_progression: 'This builds upon the foundation.'
            }
          ],
          examples: [
            {
              id: 'example_1',
              description: `Basic ${formData.concept} - simple, foundational case`,
              principle_dependencies: ['principle_1', 'principle_2'],
              anchoring_explanation: 'This example demonstrates the principles by showing them in action.'
            }
          ],
          use_cases: [
            {
              id: 'use_case_1',
              description: `Learning and teaching ${formData.concept} effectively`,
              principle_dependencies: ['principle_1', 'principle_2'],
              anchoring_explanation: 'This use case applies the principles in a practical context.'
            }
          ],
          scenarios: [
            {
              id: 'scenario_1',
              description: `When you encounter ${formData.concept} in ${formData.domain} contexts`,
              principle_dependencies: ['principle_1', 'principle_2'],
              anchoring_explanation: 'This scenario illustrates how the principles operate in a specific situation.'
            }
          ],
          assumption_challenges: [
            {
              id: 'challenge_1',
              challenged_assumption: `Assuming ${formData.concept} works the same in all contexts`,
              principle_dependencies: ['principle_2'],
              challenge_explanation: 'The principles invalidate this assumption by revealing fundamental truths.'
            }
          ]
        }
      };
      
      setResult(mockData);
      
      // Transform to narrative format
      if (mockData.success && mockData.data) {
        const narrative = renderNarrative(mockData.data);
        setNarrativeResult(narrative);
        localStorage.setItem('narrativeResult', JSON.stringify(narrative));
        // Navigate directly to results
        router.push('/results');
      }
      
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/decompose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: formData }),
      });

      const data: DecomposeResponse = await response.json();
      setResult(data);
      
      // Transform to narrative format
      if (data.success && data.data) {
        const narrative = renderNarrative(data.data);
        setNarrativeResult(narrative);
        localStorage.setItem('narrativeResult', JSON.stringify(narrative));
        // Navigate directly to results
        router.push('/results');
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to connect to the API'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ConceptInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fefdfb] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[0.85rem] uppercase tracking-[0.08em] text-[#534e49] animate-pulse" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Analyzing concept...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefdfb] p-8">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* User Info */}
      <div className="fixed top-8 right-8 flex items-center gap-4 text-[0.75rem] uppercase tracking-[0.08em] text-[#534e49] z-50" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        <span>{userEmail}</span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="text-[#d4570a] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-70"
        >
          Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-[680px] w-full">
          {/* Brand */}
          <div className="mb-16 opacity-0 animate-[slideUp_0.6s_ease-out_0.2s_both]">
            <h1 className="text-[2.5rem] font-light tracking-tight mb-3 text-[#1a1614]" style={{ fontFamily: "'Crimson Pro', serif", letterSpacing: '-0.02em' }}>
              What would you like to understand?
            </h1>
            <p className="text-[1.1rem] text-[#534e49] font-light" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Choose your domain and concept for deep decomposition.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="opacity-0 animate-[slideUp_0.6s_ease-out_0.4s_both]">
            {/* Domain Selector */}
            <div className="mb-8">
              <label className="block text-[0.75rem] uppercase tracking-[0.08em] text-[#534e49] mb-3 font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Domain
              </label>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { value: 'mathematics', label: 'Mathematics' },
                  { value: 'physics', label: 'Physics' },
                  { value: 'computer-science', label: 'Computer Science' },
                  { value: 'economics', label: 'Economics' },
                  { value: 'biology', label: 'Biology' },
                  { value: 'philosophy', label: 'Philosophy' },
                  { value: 'chemistry', label: 'Chemistry' },
                  { value: 'psychology', label: 'Psychology' },
                ].map((domain) => (
                  <div key={domain.value} className="relative">
                    <input
                      type="radio"
                      id={`domain-${domain.value}`}
                      name="domain"
                      value={domain.value}
                      checked={formData.domain === domain.value}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      className="absolute opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor={`domain-${domain.value}`}
                      className={`block p-4 border-[1.5px] cursor-pointer transition-all duration-300 text-center text-[0.95rem] min-h-[80px] flex items-center justify-center ${
                        formData.domain === domain.value
                          ? 'border-[#d4570a] bg-[#fefdfb] shadow-[0_0_0_3px_rgba(212,87,10,0.1)] font-semibold'
                          : 'border-[#e5e1db] bg-[#f8f6f2] hover:border-[#e8824a]'
                      }`}
                      style={{ fontFamily: "'Crimson Pro', serif" }}
                    >
                      {domain.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Concept Input */}
            <div className="mb-8">
              <label htmlFor="concept" className="block text-[0.75rem] uppercase tracking-[0.08em] text-[#534e49] mb-3 font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Concept
              </label>
              <input
                type="text"
                id="concept"
                value={formData.concept}
                onChange={(e) => handleInputChange('concept', e.target.value)}
                placeholder="e.g., Compound Interest"
                className="w-full text-[1.5rem] px-0 py-4 border-0 border-b-2 border-[#e5e1db] bg-transparent text-[#1a1614] transition-[border-color] duration-300 outline-none focus:border-[#d4570a] placeholder-[#534e49] placeholder-opacity-50"
                style={{ fontFamily: "'Crimson Pro', serif" }}
                required
              />
            </div>

            {/* Depth Selector */}
            <div className="mb-8">
              <label className="block text-[0.75rem] uppercase tracking-[0.08em] text-[#534e49] mb-3 font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Depth
              </label>
              <div className="flex gap-4 mt-4">
                {[
                  { value: 'short', label: 'Short', hint: 'Quick clarity' },
                  { value: 'exhaustive', label: 'Exhaustive', hint: 'Deep dive' },
                ].map((depth) => (
                  <div key={depth.value} className="flex-1 relative">
                    <input
                      type="radio"
                      id={`depth-${depth.value}`}
                      name="depth"
                      value={depth.value}
                      checked={formData.depth === depth.value}
                      onChange={(e) => handleInputChange('depth', e.target.value)}
                      className="absolute opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor={`depth-${depth.value}`}
                      className={`block p-5 px-6 border-[1.5px] cursor-pointer transition-all duration-300 text-center text-base ${
                        formData.depth === depth.value
                          ? 'border-[#d4570a] bg-[#fefdfb] shadow-[0_0_0_3px_rgba(212,87,10,0.1)]'
                          : 'border-[#e5e1db] bg-[#f8f6f2] hover:border-[#e8824a]'
                      }`}
                      style={{ fontFamily: "'Crimson Pro', serif" }}
                    >
                      {depth.label}
                      <div className="text-[0.9rem] text-[#534e49] mt-2">
                        {depth.hint}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.concept.trim()}
              className="w-full px-8 py-5 bg-[#d4570a] text-white border-none text-[0.85rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 font-medium mt-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b84808] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,22,20,0.04)]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              DECOMPOSE
            </button>
          </form>

          {/* Success Message */}
          {narrativeResult && (
            <div className="mt-8 p-6 border-[1.5px] border-[#d4570a] bg-[#f8f6f2]">
              <p className="text-[#1a1614] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Concept analysis complete. Your decomposition is ready.
              </p>
              <button
                onClick={() => router.push('/results')}
                className="px-6 py-3 bg-[#d4570a] text-white text-[0.85rem] uppercase tracking-[0.1em] font-medium transition-all duration-300 hover:bg-[#b84808]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                VIEW RESULTS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}