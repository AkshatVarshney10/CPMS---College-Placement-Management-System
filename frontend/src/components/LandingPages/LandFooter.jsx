import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaArrowRight } from 'react-icons/fa';

function LandFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="relative bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-2xl overflow-hidden text-center sm:text-left">
          {/* Top Amber Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-700" />
          
          {/* Glow backdrop */}
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-amber-600/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Ready to Start Your Career Journey?
              </h3>
              <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                Join hundreds of students who have secured their dream jobs through IIIT Placement Portal.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate('/student/login')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Student Login</span>
                <FaArrowRight className="text-xs" />
              </button>
              <button
                onClick={() => navigate('/tpo/login')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                CDC Login
              </button>
              <button
                onClick={() => navigate('/management/login')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Management
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Super Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white">
                <FaGraduationCap className="text-lg" />
              </div>
              <span className="text-lg font-bold text-white">
                IIIT Placement Portal
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm mb-4 leading-relaxed">
              Empowering students to achieve their career aspirations with a seamless campus recruitment platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <a href="#roles" className="hover:text-amber-500 transition-colors">
                  For Students
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-amber-500 transition-colors">
                  For Recruiters
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-amber-500 transition-colors">
                  Campus Drive Process
                </a>
              </li>
              <li>
                <a href="#stats" className="hover:text-amber-500 transition-colors">
                  Placement Stats
                </a>
              </li>
            </ul>
          </div>

          {/* Access Roles */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Role Access
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => navigate('/student/login')} className="hover:text-amber-500 transition-colors text-left">
                  Student Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tpo/login')} className="hover:text-amber-500 transition-colors text-left">
                  CDC Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/management/login')} className="hover:text-amber-500 transition-colors text-left">
                  Management Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="hover:text-amber-500 transition-colors text-left">
                  Super Admin Panel
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Indian Institute of Information Technology. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandFooter;
