'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NarrativeDisplay from '@/components/narrative/NarrativeDisplay';

export default function Results() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [narrativeResult, setNarrativeResult] = useState<any>(null);
  const [conceptName, setConceptName] = useState('');
  const [domain, setDomain] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      // Retrieve stored narrative result
      const storedNarrative = localStorage.getItem('narrativeResult');
      const storedConcept = localStorage.getItem('currentConcept');
      const storedDomain = localStorage.getItem('currentDomain');
      
      if (storedNarrative) {
        setNarrativeResult(JSON.parse(storedNarrative));
      }
      if (storedConcept) {
        setConceptName(storedConcept);
      }
      if (storedDomain) {
        setDomain(storedDomain);
      }
    }
  }, [router]);

  const handleBackToInput = () => {
    router.push('/');
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInContent {
          to { opacity: 1; }
        }
        
        body {
          background: #fefdfb;
        }
      `}</style>

      {/* Reading Header */}
      <div className="sticky top-0 bg-[#fefdfb] border-b border-[#e5e1db] px-8 py-6 z-50 flex justify-between items-center">
        <div className="text-[0.85rem] text-[#534e49] uppercase tracking-[0.08em]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          {conceptName}{domain && ` · ${domain}`}
        </div>
        <button
          onClick={handleBackToInput}
          className="bg-transparent border border-[#e5e1db] px-5 py-2 text-[0.75rem] uppercase tracking-[0.08em] text-[#534e49] cursor-pointer transition-all duration-300 hover:border-[#d4570a] hover:text-[#d4570a]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          New Concept
        </button>
      </div>

      {/* Reading Content */}
      {narrativeResult ? (
        <div className="max-w-[680px] mx-auto px-8 py-16 pb-24 opacity-0 animate-[fadeInContent_0.8s_ease-out_0.2s_forwards]">
          <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: '18px', lineHeight: '1.7', color: '#1a1614' }}>
            <NarrativeDisplay narrative={narrativeResult} />
          </div>
        </div>
      ) : (
        <div className="max-w-[680px] mx-auto px-8 py-16">
          <div className="text-center py-16">
            <p className="text-[1.25rem] text-[#534e49] mb-8" style={{ fontFamily: "'Crimson Pro', serif" }}>
              No concept has been analyzed yet.
            </p>
            <button
              onClick={handleBackToInput}
              className="px-8 py-5 bg-[#d4570a] text-white border-none text-[0.85rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 font-medium hover:bg-[#b84808] hover:-translate-y-0.5"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Start Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}