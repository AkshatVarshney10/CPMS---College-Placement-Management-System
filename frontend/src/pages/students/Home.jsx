import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaBriefcase, FaBuilding, FaRegFileAlt, FaBell, FaArrowRight, 
  FaUserGraduate, FaCalendarAlt, FaPlusCircle, FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';
import SkeletonLoader from '../../components/SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function HomeStudent() {
  document.title = 'CPMS | Student Dashboard';

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeDrives, setActiveDrives] = useState([]);
  const [internships, setInternships] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        // 1. Fetch User details
        const userRes = await axios.get(`${BASE_URL}/user/detail`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = userRes.data;
        setCurrentUser(user);

        // 2. Fetch Applied Jobs for this student
        if (user?.id) {
          const appliedRes = await axios.get(`${BASE_URL}/tpo/myjob/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAppliedJobs(appliedRes.data || []);
        }

        // 3. Fetch Placement Drives
        const drivesRes = await axios.get(`${BASE_URL}/tpo/jobs`);
        const allJobs = drivesRes.data?.data || [];
        setActiveDrives(allJobs);

        // 4. Fetch Internships
        const internRes = await axios.get(`${BASE_URL}/tpo/internships`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInternships(internRes.data?.data || internRes.data || []);

        // 5. Fetch Notices
        const noticeRes = await axios.get(`${BASE_URL}/management/get-all-notices`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allNotices = noticeRes.data || [];
        const studentNotices = allNotices.filter(n => n.receiver_role === 'student');
        setNotices(studentNotices);

      } catch (err) {
        console.error('Error loading student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <SkeletonLoader type="metric" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="table" count={4} />
          <SkeletonLoader type="table" count={4} />
        </div>
      </div>
    );
  }

  const hiredCount = appliedJobs.filter(j => j.status?.toLowerCase() === 'hired').length;
  const recentApplications = appliedJobs.slice(0, 5);
  const recentNotices = notices.slice(0, 5);
  const upcomingDeadlines = activeDrives
    .filter(d => new Date(d.applicationDeadline) >= new Date())
    .sort((a, b) => new Date(a.applicationDeadline) - new Date(b.applicationDeadline))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaUserGraduate className="text-xs" /> Student Placement Portal
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{currentUser?.name || 'Student'}</span> 👋
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Track your recruitment applications, explore active drives, manage your internship records, and stay updated with campus placement alerts.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/student/job-listings"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-xs sm:text-sm no-underline cursor-pointer"
          >
            <FaBriefcase />
            <span>Explore Drives</span>
          </Link>
          <Link
            to="/student/placement-profile"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-all text-xs sm:text-sm no-underline cursor-pointer"
          >
            <FaRegFileAlt />
            <span>My Profile</span>
          </Link>
        </div>
      </div>

      {/* Top Level Hero Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Applications */}
        <Link to="/student/myjob" className="no-underline group">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-200 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Active Applications</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-base shadow-xs group-hover:scale-110 transition-transform">
                <FaRegFileAlt />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-3xl font-extrabold text-slate-900">{appliedJobs.length}</h3>
              <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                <span>{hiredCount} Offer(s) Secured</span>
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Available Drives */}
        <Link to="/student/job-listings" className="no-underline group">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Available Drives</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center text-base shadow-xs group-hover:scale-110 transition-transform">
                <FaBuilding />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-3xl font-extrabold text-slate-900">{activeDrives.length}</h3>
              <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                <span>Open for application</span>
              </p>
            </div>
          </div>
        </Link>

        {/* Card 3: Internships */}
        <Link to="/student/internship" className="no-underline group">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">My Internships</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center text-base shadow-xs group-hover:scale-110 transition-transform">
                <FaBriefcase />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-3xl font-extrabold text-slate-900">{internships.length}</h3>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <span>Logged Experience</span>
              </p>
            </div>
          </div>
        </Link>

        {/* Card 4: Notifications */}
        <Link to="/student/all-notice" className="no-underline group">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Campus Notices</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/80 flex items-center justify-center text-base shadow-xs group-hover:scale-110 transition-transform">
                <FaBell />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-3xl font-extrabold text-slate-900">{notices.length}</h3>
              <p className="text-[11px] text-purple-600 font-bold flex items-center gap-1">
                <span>Latest Announcements</span>
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Grid: Recent Applications & Latest Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-200/80 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Recent Applications</h4>
              <p className="text-xs text-slate-500">Track status of your applied companies</p>
            </div>
            <Link to="/student/myjob" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 no-underline">
              View All <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="p-6 flex-grow space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((job, idx) => {
                const status = job.status?.toLowerCase() || 'applied';
                let statusColor = 'bg-amber-100 text-amber-800 border-amber-200';
                if (status === 'hired') statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                else if (status === 'rejected') statusColor = 'bg-rose-100 text-rose-800 border-rose-200';
                else if (status === 'shortlisted') statusColor = 'bg-blue-100 text-blue-800 border-blue-200';

                return (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900 text-sm">{job.companyName}</h5>
                      <p className="text-xs text-slate-500 font-medium">{job.jobTitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColor}`}>
                        {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                      </span>
                      <Link to={`/student/job/${job.jobId}`} className="text-slate-400 hover:text-slate-600">
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                  <FaRegFileAlt />
                </div>
                <p className="text-slate-500 text-xs font-semibold">No applications submitted yet.</p>
                <Link to="/student/job-listings" className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold no-underline">
                  Browse Active Drives
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Latest Notices Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-200/80 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Placement Announcements</h4>
              <p className="text-xs text-slate-500">Official circulars from CDC & TPO</p>
            </div>
            <Link to="/student/all-notice" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 no-underline">
              View All <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="p-6 flex-grow space-y-3">
            {recentNotices.length > 0 ? (
              recentNotices.map((notice, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1 max-w-xs sm:max-w-sm">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{notice.title}</h5>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {new Date(notice.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <Link to={`/student/notice/${notice._id}`} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold no-underline transition-colors shrink-0">
                    Read Notice
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                  <FaBell />
                </div>
                <p className="text-slate-500 text-xs font-semibold">No recent placement circulars found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Upcoming Deadlines & Quick Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Drive Deadlines</h4>
              <p className="text-xs text-slate-500">Apply before registration windows close</p>
            </div>
            <FaCalendarAlt className="text-slate-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((drive, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{drive.companyName}</h5>
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      {drive.jobTitle}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium pt-1 border-t border-amber-200/40">
                    <span>Deadline:</span>
                    <span className="font-bold text-amber-900">
                      {new Date(drive.applicationDeadline).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <Link
                    to={`/student/job/${drive._id}`}
                    className="block text-center mt-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold no-underline transition-colors"
                  >
                    View & Apply
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs py-4 col-span-2 text-center font-medium">No upcoming registration deadlines.</p>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">Quick Actions</h4>
          <div className="space-y-3">
            <Link
              to="/student/placement-profile"
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all no-underline text-slate-800 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                <FaRegFileAlt />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">Update Profile & Resume</h5>
                <p className="text-[11px] text-slate-500">Keep SGPA & resume current</p>
              </div>
            </Link>

            <Link
              to="/student/add-internship"
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all no-underline text-slate-800 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                <FaPlusCircle />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">Add Internship Record</h5>
                <p className="text-[11px] text-slate-500">Submit new industrial training</p>
              </div>
            </Link>

            <Link
              to="/student/job-listings"
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all no-underline text-slate-800 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                <FaBriefcase />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">Placement Drive Portal</h5>
                <p className="text-[11px] text-slate-500">Check eligibility & requirements</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeStudent;
