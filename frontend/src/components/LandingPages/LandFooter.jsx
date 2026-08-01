import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

function LandFooter() {
  const navigate = useNavigate();

  const handleRoleNavigation = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-md">
                <FaGraduationCap className="text-lg" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                IIIT Placement Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Empowering students to achieve their career aspirations with a seamless campus recruitment platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#roles" className="text-stone-400 hover:text-amber-400 transition-colors duration-200 cursor-pointer block">
                  For Students
                </a>
              </li>
              <li>
                <a href="#roles" className="text-stone-400 hover:text-amber-400 transition-colors duration-200 cursor-pointer block">
                  For Recruiters
                </a>
              </li>
              <li>
                <a href="#process" className="text-stone-400 hover:text-amber-400 transition-colors duration-200 cursor-pointer block">
                  Campus Drive Process
                </a>
              </li>
              <li>
                <a href="#stats" className="text-stone-400 hover:text-amber-400 transition-colors duration-200 cursor-pointer block">
                  Placement Stats
                </a>
              </li>
            </ul>
          </div>

          {/* Access Roles */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Role Access
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleRoleNavigation('student')}
                  className="text-stone-400 hover:text-amber-400 transition-colors duration-200 text-left cursor-pointer block w-full"
                >
                  Student Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleRoleNavigation('tpo')}
                  className="text-stone-400 hover:text-amber-400 transition-colors duration-200 text-left cursor-pointer block w-full"
                >
                  CDC Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleRoleNavigation('management')}
                  className="text-stone-400 hover:text-amber-400 transition-colors duration-200 text-left cursor-pointer block w-full"
                >
                  Management Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleRoleNavigation('admin')}
                  className="text-stone-400 hover:text-amber-400 transition-colors duration-200 text-left cursor-pointer block w-full"
                >
                  Super Admin Panel
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 Indian Institute of Information Technology. All rights reserved.</p>
          <div className="flex gap-5 sm:gap-6">
            <span className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-amber-400 transition-colors duration-200 cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandFooter;
