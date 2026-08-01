import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import CompanyLogos from './CompanyLogos';

function LandingHeroPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleScrollRoles = () => {
    const el = document.getElementById('roles');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-stone-50 via-amber-50/30 to-white overflow-hidden">
      {/* Decorative background glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-300/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Empower Your Career with{' '}
          <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent">
            Placement Excellence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Connecting students with top recruiters through a seamless, transparent, and efficient campus placement management platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-amber-600/25 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <span>Login</span>
            <FaArrowRight className="text-sm" />
          </button>
          <button
            type="button"
            onClick={handleScrollRoles}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 font-semibold text-base px-8 py-3.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            Explore Platform
          </button>
        </div>

        {/* Company Logos Showcase */}
        <CompanyLogos />
      </div>
    </section>
  );
}

export default LandingHeroPage;
