import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserShield,
  FaUserTie,
  FaGraduationCap,
  FaCrown,
  FaUserClock,
  FaPlusCircle,
  FaFileUpload,
  FaBriefcase,
  FaChartLine,
  FaBuilding,
  FaArrowRight,
} from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Home() {
  document.title = 'CPMS | Admin Dashboard';
  const navigate = useNavigate();

  const [countUsers, setCountUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setCountUsers(response.data);
      } catch (error) {
        console.log("Home.jsx => ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 p-8 sm:p-10 border border-stone-800 shadow-2xl overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-700" />
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
              <FaCrown className="text-xs" /> System Super Admin Control Panel
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome Back, Admin 👋
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Manage institution accounts, student onboardings, recruitment drives, and placement statistics from one central hub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="../admin/mass-upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all cursor-pointer no-underline"
            >
              <FaFileUpload /> Mass Upload Students
            </Link>
            <Link
              to="../admin/post-job"
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer no-underline"
            >
              <FaBriefcase /> Post New Job
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-stone-200/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Main User Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Management Admin Card */}
            <Link to="../admin/management" className="no-underline group">
              <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Management Admin
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    <FaUserShield />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {countUsers.managementUsers ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View List <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </Link>

            {/* TPO Admin Card */}
            <Link to="../admin/tpo" className="no-underline group">
              <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    TPO Admin
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    <FaUserTie />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {countUsers.tpoUsers ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View List <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Student User Card */}
            <Link to="../admin/student" className="no-underline group">
              <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Student Users
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    <FaGraduationCap />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {countUsers.studentUsers ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View List <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Superuser Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Superuser
                </span>
                <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center text-xl">
                  <FaCrown />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                  {countUsers.superUsers ?? 0}
                </span>
                <span className="text-xs font-medium text-stone-400">System Admin</span>
              </div>
            </div>
          </div>

          {/* Student Approval Pending Alert Card */}
          {countUsers.studentApprovalPendingUsers > 0 && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                  <FaUserClock />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {countUsers.studentApprovalPendingUsers} Student Registration(s) Pending Approval
                  </h3>
                  <p className="text-xs text-amber-100 mt-0.5">
                    Newly registered students require verification before accessing placement drives.
                  </p>
                </div>
              </div>
              <Link
                to="../admin/approve-student"
                className="bg-white text-amber-800 hover:bg-stone-100 font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer no-underline whitespace-nowrap"
              >
                Review Registrations
              </Link>
            </div>
          )}

          {/* Quick Management Shortcuts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Quick Platform Shortcuts
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Frequently accessed management modules and creation forms.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <button
                onClick={() => navigate('../admin/add-management-admin')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-200 text-stone-700 hover:text-amber-800 transition-all gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <FaPlusCircle />
                </div>
                <span className="text-xs font-semibold text-center leading-snug">Add Management</span>
              </button>

              <button
                onClick={() => navigate('../admin/add-tpo-admin')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 hover:bg-blue-50/60 border border-stone-200/80 hover:border-blue-200 text-stone-700 hover:text-blue-800 transition-all gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <FaPlusCircle />
                </div>
                <span className="text-xs font-semibold text-center leading-snug">Add TPO Admin</span>
              </button>

              <button
                onClick={() => navigate('../admin/add-student')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 hover:bg-emerald-50/60 border border-stone-200/80 hover:border-emerald-200 text-stone-700 hover:text-emerald-800 transition-all gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <FaPlusCircle />
                </div>
                <span className="text-xs font-semibold text-center leading-snug">Add Student</span>
              </button>

              <button
                onClick={() => navigate('../admin/add-company')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 hover:bg-purple-50/60 border border-stone-200/80 hover:border-purple-200 text-stone-700 hover:text-purple-800 transition-all gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <FaBuilding />
                </div>
                <span className="text-xs font-semibold text-center leading-snug">Add Company</span>
              </button>

              <button
                onClick={() => navigate('../admin/job-eligibility')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-200 text-stone-700 hover:text-amber-800 transition-all gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <FaBriefcase />
                </div>
                <span className="text-xs font-semibold text-center leading-snug">Eligibility Hub</span>
              </button>

              <button
                onClick={() => navigate('../admin/placement-stats')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 hover:bg-rose-50/60 border border-stone-200/80 hover:border-rose-200 text-stone-700 hover:text-rose-800 transition-all gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                  <FaChartLine />
                </div>
                <span className="text-xs font-semibold text-center leading-snug">Placement Stats</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
