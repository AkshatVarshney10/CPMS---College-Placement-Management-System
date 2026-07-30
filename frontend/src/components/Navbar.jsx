import React from 'react';
import { FaBars, FaBell, FaSearch, FaChevronRight } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function Navbar({ isSidebarVisible, toggleSidebar }) {
  const location = useLocation();

  // Page name extraction and formatting
  let pathSegments = location.pathname.split('/').filter(Boolean);
  let pageName = pathSegments[pathSegments.length - 1] || 'dashboard';

  const formatTitle = (name) => {
    if (name === 'dashboard') return 'Dashboard Overview';
    if (name === 'management') return 'Management Users';
    if (name === 'add-management-admin') return 'Create Management Admin';
    if (name === 'tpo') return 'TPO Users';
    if (name === 'add-tpo-admin') return 'Create TPO Admin';
    if (name === 'student') return 'Student Directory';
    if (name === 'mass-upload') return 'Mass Student Upload';
    if (name === 'add-student') return 'Create Student';
    if (name === 'companys') return 'Company Directory';
    if (name === 'add-company') return 'Add Company Detail';
    if (name === 'job-listings') return 'Placement Listings';
    if (name === 'post-job') return 'Post New Job';
    if (name === 'job-eligibility') return 'Job Eligibility & Applicants';
    if (name === 'placement-stats') return 'Placement Statistics';
    if (name === 'detailed-placement-stats') return 'Detailed Placement Tracker';

    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <header className={`h-16 sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-stone-200/80 shadow-xs flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${isSidebarVisible ? 'md:ml-[260px]' : 'ml-0'}`}>
      {/* Left side: Toggle button & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95 transition-all cursor-pointer border border-stone-200/60 shadow-xs"
          title="Toggle Navigation"
        >
          <FaBars size={18} />
        </button>

        {/* Page Breadcrumb / Title */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-500">
          <span className="text-amber-700 font-semibold uppercase tracking-wider">CPMS Admin</span>
          <FaChevronRight className="text-[10px] text-stone-400" />
          <span className="text-stone-800 font-bold text-sm sm:text-base">
            {formatTitle(pageName)}
          </span>
        </div>
      </div>

      {/* Right side: Search bar & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Optional Search Bar */}
        <div className="relative hidden md:block w-64">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-stone-100/70 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Notification Icon Placeholder */}
        <button
          className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer border border-stone-200/60"
          title="Notifications"
        >
          <FaBell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-600 ring-2 ring-white animate-pulse" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
