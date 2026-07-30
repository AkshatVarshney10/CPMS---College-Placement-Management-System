import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaRegFileAlt, FaEye, FaBuilding, FaMoneyBillWave, 
  FaCalendarAlt, FaUserCheck 
} from 'react-icons/fa';
import Toast from '../Toast';
import SkeletonLoader from '../SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function MyApplied() {
  document.title = 'CPMS | My Applied Jobs';
  
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const userRes = await axios.get(`${BASE_URL}/user/detail`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser({ id: userRes.data.id, role: userRes.data.role });

        if (userRes.data?.id) {
          const jobsRes = await axios.get(`${BASE_URL}/tpo/myjob/${userRes.data.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setJobs(jobsRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        setToastMessage("Failed to load applied job applications");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndJobs();
  }, []);

  const filteredJobs = jobs.filter(j => 
    j.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'applied';
    if (s === 'hired') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Hired
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      );
    }
    if (s === 'shortlisted') {
      return (
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Shortlisted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Applied
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <SkeletonLoader type="table" count={5} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaRegFileAlt className="text-xs" /> Application Audit Tracker
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Applied Job Applications</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Audit your submitted recruitment applications, status history, compensation packages, and application deadlines.
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-2xl text-center shrink-0">
          <span className="block text-2xl font-black text-amber-400">{jobs.length}</span>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Submissions</span>
        </div>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by company, title, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
          Showing <span className="text-slate-900 font-bold">{filteredJobs.length}</span> of {jobs.length} applications
        </div>
      </div>

      {/* Modern Data Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-4 px-4 w-12 text-center">#</th>
                <th className="py-4 px-4">Company Name</th>
                <th className="py-4 px-4">Job Title</th>
                <th className="py-4 px-4 text-center">Stipend</th>
                <th className="py-4 px-4 text-center">CTC Package</th>
                <th className="py-4 px-4 text-center">Applied On</th>
                <th className="py-4 px-4 text-center">Deadline</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Applicants</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-slate-700 bg-white">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <tr key={index} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-200/60">
                          {job.companyName?.substring(0, 2).toUpperCase() || 'CP'}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{job.companyName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{job.jobTitle}</td>
                    <td className="py-4 px-4 text-center font-bold text-purple-700">
                      {job.stipend ? `₹${Number(job.stipend).toLocaleString('en-IN')}/mo` : '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-extrabold text-emerald-700">
                      {job.expectedCTC ? `${job.expectedCTC} LPA` : (job.salary ? `${job.salary} LPA` : '—')}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-600">
                      {new Date(job.appliedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-600">
                      {new Date(job.applicationDeadline).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        {job.numberOfApplicants || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link
                        to={`/student/job/${job.jobId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-2xs transition-all no-underline cursor-pointer"
                      >
                        <FaEye className="text-xs" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-xl">
                        <FaRegFileAlt />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">No Applications Found</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {searchQuery ? `No matching records found for "${searchQuery}".` : 'You have not submitted any placement applications yet.'}
                      </p>
                      <Link
                        to="/student/job-listings"
                        className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 no-underline transition-all"
                      >
                        Explore Recruitment Drives
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyApplied;
