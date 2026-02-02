'use client';

import { NarrativeViewModel } from '@/types/narrative';

interface NarrativeDisplayProps {
  narrative: NarrativeViewModel;
}

export default function NarrativeDisplay({ narrative }: NarrativeDisplayProps) {
  return (
    <div className="space-y-12">
      {/* Definition */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Definition</h3>
            <p className="text-lg text-gray-800 leading-relaxed">
              {narrative.definition}
            </p>
          </div>
        </div>
      </section>

      {/* First Principles */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Core Principles</h3>
        </div>
        
        {narrative.first_principles.map((principle, index) => (
          <div key={index} className="bg-white rounded-xl border-2 border-orange-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                  {principle.statement}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {principle.explanation}
                </p>
                <p className="text-sm text-orange-600 italic">
                  {principle.accessibility_note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Reconstruction */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Step-by-Step Understanding</h3>
        </div>
        
        <div className="relative">
          {narrative.reconstruction.map((step, index) => (
            <div key={index} className="relative flex items-start space-x-6 pb-8">
              {index < narrative.reconstruction.length - 1 && (
                <div className="absolute left-9 top-12 bottom-0 w-0.5 bg-orange-200" />
              )}
              <div className="flex-shrink-0 w-18 h-18 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {index + 1}
              </div>
              <div className="flex-1 bg-orange-50 rounded-xl p-6 border border-orange-100">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {step.step_description}
                </p>
                <p className="text-sm text-orange-600 mt-3 font-medium">
                  {step.connection_to_previous}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Practical Examples</h3>
        </div>
        
        {narrative.examples.map((example, index) => (
          <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {example.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {example.description}
                </p>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm text-orange-600 font-medium">
                    Key Insight: {example.takeaway}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Use Cases */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Real-World Applications</h3>
        </div>
        
        {narrative.use_cases.map((useCase, index) => (
          <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Application: {useCase.application}
                </h4>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium text-orange-600">Application:</span> {useCase.application}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium text-orange-600">Principle Basis:</span> {useCase.principle_basis}
                  </p>
                  <p className="text-gray-700 text-sm font-medium">
                    <span className="font-medium text-orange-600">Outcome:</span> {useCase.outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Scenarios */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Scenario Analysis</h3>
        </div>
        
        {narrative.scenarios.map((scenario, index) => (
          <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Situation: {scenario.situation}
                </h4>
                <div className="space-y-2">
                  {/* <p className="text-gray-700">
                    <span className="font-medium text-orange-600">Situation:</span> {scenario.situation}
                  </p> */}
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium text-orange-600">Concept Application:</span> {scenario.concept_application}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium text-orange-600">Learning Point:</span> {scenario.learning_point}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Assumption Challenges */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Common Misconceptions</h3>
        </div>
        
        {narrative.assumption_challenges.map((challenge, index) => (
          <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Myth: {challenge.common_assumption}
                </h4>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-gray-700">
                    <span className="font-medium text-orange-600">Reality:</span> {challenge.challenge}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium text-orange-600">Corrected Understanding:</span> {challenge.corrected_understanding}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
