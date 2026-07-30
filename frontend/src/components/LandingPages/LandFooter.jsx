import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';

function LandFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
