import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaArrowRight } from 'react-icons/fa';

function LandingNavbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
            <FaGraduationCap className="text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">
              IIIT Una Placement Portal
            </h1>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              Indian Institute of Information Technology Una
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => scrollToSection('roles')}
            className="hover:text-amber-700 transition-colors cursor-pointer"
          >
            Platform Roles
          </button>
          <button
            onClick={() => scrollToSection('process')}
            className="hover:text-amber-700 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('stats')}
            className="hover:text-amber-700 transition-colors cursor-pointer"
          >
            Statistics
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="hover:text-amber-700 transition-colors cursor-pointer"
          >
            Success Stories
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-amber-600/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <span>Login</span>
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;
