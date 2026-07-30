import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  FaBriefcase, FaBuilding, FaSearch, FaEye, FaPlus, 
  FaPen, FaTrashAlt, FaCheckCircle, FaCalendarAlt, FaMoneyBillWave 
} from 'react-icons/fa';
import ModalBox from './Modal';
import Toast from './Toast';
import SkeletonLoader from './SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AllJobPost() {
  document.title = 'CPMS | Job Listings';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataToParasModal, setDataToParasModal] = useState(null);
  const [modalBody, setModalBody] = useState({ cmpName: '', jbTitle: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${BASE_URL}/user/detail`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
        fetchJobs();
      })
      .catch(err => {
        console.error("Error in fetching user details:", err);
        setToastMessage(err.message || 'Error loading user profile');
        setShowToast(true);
      });
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = response.data.data || [];
      setJobs(data);
      fetchCompanies(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      setLoading(false);
    }
  };

  const fetchCompanies = async (jobList) => {
    const companyNames = {};
    for (const job of jobList) {
      if (job.company && !companyNames[job.company]) {
        try {
          const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${job.company}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          companyNames[job.company] = response.data.company?.companyName || 'Company';
        } catch (error) {
          console.error("Error fetching company name:", error);
        }
      }
    }
    setCompanies(companyNames);
    setLoading(false);
  };

  const handleDeletePost = (jobId, cmpName, jbTitle) => {
    setDataToParasModal(jobId);
    setModalBody({ cmpName, jbTitle });
    setShowModal(true);
  };

  const confirmDelete = async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/delete-job`, { jobId });
      setShowModal(false);
      fetchJobs();
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDataToParasModal(null);
  };

  const { showToastPass, toastMessagePass } = location.state || {};

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(true);
      navigate('.', { replace: true, state: {} });
    }
  }, []);

  const filteredJobs = jobs.filter(j => {
    const cName = companies[j.company] || '';
    return (
      cName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeDrivesCount = jobs.length;
  const uniqueCompaniesCount = Object.keys(companies).length || new Set(jobs.map(j => j.company)).size;
  const myAppliedCount = currentUser ? jobs.filter(j => j.applicants?.some(a => a.studentId == currentUser.id)).length : 0;

  if (loading || !currentUser) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <SkeletonLoader type="metric" />
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
            <FaBriefcase className="text-xs" /> Placement Recruitment Portal
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Active Placement Drives</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Explore corporate campus drives, compensation packages, stipend options, and application deadlines.
          </p>
        </div>

        {currentUser.role !== 'student' && (
          <button
            onClick={() => {
              const paths = {
                'tpo_admin': '../tpo/post-job',
                'management_admin': '../management/post-job',
                'superuser': '../admin/post-job',
              };
              navigate(paths[currentUser.role] || '../tpo/post-job');
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-xs sm:text-sm cursor-pointer shrink-0"
          >
            <FaPlus />
            <span>Post New Drive</span>
          </button>
        )}
      </div>

      {/* Top Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Active Drives</span>
          <h3 className="text-3xl font-extrabold text-slate-900">{activeDrivesCount}</h3>
          <p className="text-xs font-semibold text-amber-600">Open campus recruitments</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Participating Companies</span>
          <h3 className="text-3xl font-extrabold text-slate-900">{uniqueCompaniesCount}</h3>
          <p className="text-xs font-semibold text-blue-600">Corporate recruiters</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">My Submissions</span>
          <h3 className="text-3xl font-extrabold text-slate-900">{myAppliedCount}</h3>
          <p className="text-xs font-semibold text-emerald-600">Drives applied by you</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Deadlines Window</span>
          <h3 className="text-3xl font-extrabold text-slate-900">Active</h3>
          <p className="text-xs font-semibold text-purple-600">Apply before cutoff</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by company or job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-900 font-bold">{filteredJobs.length}</span> of {jobs.length} drives
        </div>
      </div>

      {/* Recruitment Data Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-4 px-4 w-12 text-center">#</th>
                <th className="py-4 px-4">Company Name</th>
                <th className="py-4 px-4">Job Role</th>
                <th className="py-4 px-4 text-center">Monthly Stipend</th>
                <th className="py-4 px-4 text-center">CTC Package</th>
                <th className="py-4 px-4 text-center">Application Deadline</th>
                <th className="py-4 px-4 text-center">Applicants</th>
                <th className="py-4 px-4 text-center">My Status</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-slate-700 bg-white">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => {
                  const isApplied = job.applicants?.some(a => a.studentId == currentUser.id);
                  const companyName = companies[job.company] || 'Loading...';

                  return (
                    <tr key={job._id} className={`hover:bg-amber-50/40 transition-colors ${isApplied ? 'bg-emerald-50/30' : ''}`}>
                      <td className="py-4 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-200/60">
                            {companyName.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{companyName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800">{job.jobTitle}</td>
                      <td className="py-4 px-4 text-center font-bold text-purple-700">
                        {job.stipend ? `₹${Number(job.stipend).toLocaleString('en-IN')}/mo` : '—'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                          {job.expectedCTC ? `${job.expectedCTC} LPA` : (job.salary ? `${job.salary} LPA` : 'N/A')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-slate-600">
                        {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                          {job.applicants?.length || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                            <FaCheckCircle className="text-[10px]" /> Applied
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              const rolePaths = {
                                'tpo_admin': `../tpo/job/${job._id}`,
                                'management_admin': `../management/job/${job._id}`,
                                'superuser': `../admin/job/${job._id}`,
                                'student': `../student/job/${job._id}`,
                              };
                              navigate(rolePaths[currentUser.role] || `../student/job/${job._id}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-2xs transition-all no-underline cursor-pointer"
                          >
                            <FaEye className="text-xs" />
                            <span>View & Apply</span>
                          </button>

                          {currentUser.role !== 'student' && (
                            <>
                              <button
                                onClick={() => {
                                  const rolePaths = {
                                    'tpo_admin': `../tpo/post-job/${job._id}`,
                                    'management_admin': `../management/post-job/${job._id}`,
                                    'superuser': `../admin/post-job/${job._id}`,
                                  };
                                  navigate(rolePaths[currentUser.role]);
                                }}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                                title="Edit Job"
                              >
                                <FaPen className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(job._id, companies[job.company], job.jobTitle)}
                                className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 flex items-center justify-center transition-all cursor-pointer"
                                title="Delete Job"
                              >
                                <FaTrashAlt className="text-xs" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-2xl shadow-xs">
                        <FaBriefcase />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-lg">No Active Placement Drives Currently</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {searchQuery ? `No matching drives found for "${searchQuery}".` : 'There are currently no active placement drives scheduled by the Training & Placement Cell.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalBox
        show={showModal}
        close={closeModal}
        header={`Confirm Delete ${modalBody.cmpName}`}
        body={`Are you sure you want to delete the job posting for ${modalBody.jbTitle} from ${modalBody.cmpName}?`}
        btn="Delete Job"
        confirmAction={() => confirmDelete(dataToParasModal)}
      />
    </div>
  );
}

export default AllJobPost;
