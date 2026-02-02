'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication (replace with real auth logic)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation for demo
      if (email && password && confirmPassword) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        // Store auth state (in real app, use secure cookies/tokens)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        router.push('/');
      } else {
        setError('Please enter email, password, and confirm password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', 'demo@example.com');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#fefdfb] flex items-center justify-center p-8 animate-[fadeIn_0.8s_ease-out]">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
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

      <div className="max-w-[420px] w-full">
        {/* Brand */}
        <div className="text-center mb-12 opacity-1 animate-[slideUp_0.6s_ease-out_0.2s_backwards]">
          <h1 className="text-[2.2rem] font-light tracking-tight mb-2 text-[#1a1614]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Concept Decomposition
          </h1>
          <p className="text-base text-[#534e49] font-light" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Deep understanding from first principles.
          </p>
        </div>

        {/* Login Form */}
        <div className="opacity-1 animate-[slideUp_0.6s_ease-out_0.4s_backwards]">
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full text-[1.1rem] px-4 py-4 border-[1.5px] border-[#e5e1db] bg-[#f8f6f2] text-[#1a1614] transition-all duration-300 outline-none focus:border-[#d4570a] focus:bg-[#fefdfb] placeholder-[#534e49] placeholder-opacity-50"
                style={{ fontFamily: "'Crimson Pro', serif" }}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full text-[1.1rem] px-4 py-4 border-[1.5px] border-[#e5e1db] bg-[#f8f6f2] text-[#1a1614] transition-all duration-300 outline-none focus:border-[#d4570a] focus:bg-[#fefdfb] placeholder-[#534e49] placeholder-opacity-50"
                style={{ fontFamily: "'Crimson Pro', serif" }}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full text-[1.1rem] px-4 py-4 border-[1.5px] border-[#e5e1db] bg-[#f8f6f2] text-[#1a1614] transition-all duration-300 outline-none focus:border-[#d4570a] focus:bg-[#fefdfb] placeholder-[#534e49] placeholder-opacity-50"
                style={{ fontFamily: "'Crimson Pro', serif" }}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm" style={{ fontFamily: "'Crimson Pro', serif" }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-5 bg-[#d4570a] text-white border-none text-[0.85rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b84808] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,22,20,0.04)]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Divider */}
          <div className="text-center my-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#e5e1db]"></div>
            <span className="relative bg-[#fefdfb] px-4 text-[0.75rem] uppercase tracking-[0.08em] text-[#534e49]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              or
            </span>
          </div>

          {/* Demo Link */}
          <a
            href="#"
            onClick={handleDemo}
            className="block text-center px-4 py-4 border-[1.5px] border-[#e5e1db] text-[#534e49] no-underline transition-all duration-300 text-[0.85rem] uppercase tracking-[0.08em] hover:border-[#d4570a] hover:text-[#d4570a]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            TRY DEMO
          </a>
        </div>
      </div>
    </div>
  );
}