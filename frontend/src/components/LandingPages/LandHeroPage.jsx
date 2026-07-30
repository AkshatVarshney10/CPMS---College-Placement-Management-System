import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap } from 'react-icons/fa';

function LandingHeroPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleScrollRoles = () => {
    const el = document.getElementById('roles');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const topRecruiters = [
    'Google',
    'Microsoft',
    'Amazon',
    'Flipkart',
    'Goldman Sachs',
    'Adobe',
    'Oracle',
    'Cisco',
    'Samsung',
    'Intel',
    'Qualcomm',
    'Nvidia',
    'Cognizant',
    'Infosys',
    'TCS',
  ];

  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-stone-50 via-amber-50/30 to-white overflow-hidden">
      {/* Decorative background glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-300/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold mb-8 shadow-xs">
          <span>🎓 Empowering Careers Since 2010</span>
        </div>

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

        {/* Marquee Ticker Section */}
        <div className="pt-8 border-t border-stone-200/80">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-stone-500 uppercase mb-6">
            Trusted by Leading Global Companies & Top Recruiters
          </p>

          <div className="relative w-full overflow-hidden py-3">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee space-x-8">
              {[...topRecruiters, ...topRecruiters, ...topRecruiters].map((company, index) => (
                <div
                  key={index}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white border border-stone-200/90 text-stone-700 font-bold text-sm sm:text-base shadow-2xs hover:border-amber-500/50 hover:text-amber-700 transition-colors"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingHeroPage;
