import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaBuilding, FaGlobe, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, 
  FaMoneyBillWave, FaCheckCircle, FaUser, FaEnvelope, FaPhone, 
  FaLinkedin, FaArrowLeft, FaCheck
} from 'react-icons/fa';
import Toast from './Toast';
import ModalBox from './Modal';
import SkeletonLoader from './SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ViewJobPost() {
  document.title = 'CPMS | View Job Post';
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [applied, setApplied] = useState(false);
  const [applicant, setApplicant] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState('');

  const fetchApplied = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/student/check-applied/${jobId}/${userId}`);
      if (response?.data?.applied) {
        setApplied(response.data.applied);
      }
    } catch (error) {
      console.error("Error checking applied status:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${BASE_URL}/user/detail`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const u = {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        };
        setCurrentUser(u);
        if (u.role === 'student') {
          fetchApplied(res.data.id);
        }
      })
      .catch(err => {
        console.error("Error fetching user detail:", err);
      });
  }, []);

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setData(response.data || {});
      if (response.data?.company) {
        fetchCompanyData(response.data.company);
      }
    } catch (error) {
      console.error("Error fetching job detail:", error);
      if (error.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
        if (error.response.data.msg === "job data not found") navigate('../404');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyData = async (companyId) => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`);
      setCompany(response.data.company || null);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const fetchApplicant = async () => {
    if (!jobId || currentUser?.role === 'student') return;
    try {
      const res = await axios.get(`${BASE_URL}/tpo/job/applicants/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplicant(res.data?.applicantsList || []);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobDetail();
      fetchApplicant();
    }
  }, [jobId, currentUser.role]);

  const handleApply = () => {
    setModalBody("Do you really want to apply for this placement drive? Make sure your placement profile and resume are updated.");
    setShowModal(true);
  };

  const handleConfirmApply = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/student/job/${jobId}/${currentUser.id}`);
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
      }
      setShowModal(false);
      fetchApplied(currentUser.id);
    } catch (error) {
      setShowModal(false);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  const categoryColor = company?.category === 'Dream' 
    ? 'bg-rose-100 text-rose-800 border-rose-200' 
    : company?.category === 'Core'
    ? 'bg-amber-100 text-amber-800 border-amber-200'
    : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* Back Button & Top Banner */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
        >
          <FaArrowLeft /> Back to Drives
        </button>

        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${categoryColor}`}>
                {company?.category || 'Recruitment Drive'}
              </span>
              {applied && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  <FaCheckCircle className="text-xs" /> Applied
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">{data?.jobTitle}</h2>
            <p className="text-slate-300 text-sm font-semibold flex items-center gap-2">
              <FaBuilding className="text-amber-400" /> {company?.companyName || 'Corporate Employer'}
            </p>
          </div>

          {currentUser.role === 'student' && (
            <div className="shrink-0">
              {!applied ? (
                <button
                  onClick={handleApply}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-500/25 transition-all cursor-pointer text-sm"
                >
                  <FaCheck /> Apply for Drive
                </button>
              ) : (
                <Link
                  to={`/student/status/${jobId}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold px-6 py-3.5 rounded-2xl border border-slate-700 transition-all no-underline text-sm"
                >
                  Update Application Status
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Company Info */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
                <FaBuilding />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Company Overview</h3>
                <p className="text-xs text-slate-500">Recruiter background details</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">{company?.companyName}</h4>
                <p className="text-slate-600 mt-2 leading-relaxed font-medium">
                  {company?.companyDescription || 'No description provided.'}
                </p>
              </div>

              {company?.companyWebsite && (
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Website</span>
                  <a
                    href={company.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 hover:text-amber-700 font-bold no-underline truncate max-w-xs"
                  >
                    {company.companyWebsite}
                  </a>
                </div>
              )}

              {company?.companyLocation && (
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Locations</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {company.companyLocation.split(',').map((loc, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        {loc.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {company?.hrName && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">HR Contact Person</span>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200/60">
                    <p className="font-bold text-slate-900">{company.hrName}</p>
                    {company.hrPhone && <p className="text-slate-600 flex items-center gap-2"><FaPhone className="text-amber-500" /> {company.hrPhone}</p>}
                    {company.hrEmail && (
                      <p className="text-slate-600 flex items-center gap-2">
                        <FaEnvelope className="text-amber-500" />
                        <a href={`mailto:${company.hrEmail}`} className="text-amber-600 font-medium no-underline">{company.hrEmail}</a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Job & Eligibility Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Expected CTC</span>
              <h3 className="text-2xl font-extrabold text-emerald-600">
                {data?.expectedCTC ? `${data.expectedCTC} LPA` : (data?.salary ? `${data.salary} LPA` : 'N/A')}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Monthly Stipend</span>
              <h3 className="text-2xl font-extrabold text-purple-600">
                {data?.stipend ? `₹${Number(data.stipend).toLocaleString('en-IN')}/mo` : 'N/A'}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Application Deadline</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {data?.applicationDeadline ? new Date(data.applicationDeadline).toLocaleDateString('en-IN') : 'N/A'}
              </h3>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3">Job Description & Role Summary</h3>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2 prose max-w-none" dangerouslySetInnerHTML={{ __html: data?.jobDescription || 'No detailed description provided.' }} />
          </div>

          {/* Eligibility Criteria Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3">Eligibility Requirements</h3>
            {data?.eligibility && (
              <div className="text-xs text-slate-700 leading-relaxed border-b border-slate-100 pb-4" dangerouslySetInnerHTML={{ __html: data.eligibility }} />
            )}

            <div className="space-y-3 pt-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-amber-600">System-Enforced Rules:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-semibold">
                  Minimum CGPA: <span className="font-black text-slate-900">{data?.minCG !== undefined ? data.minCG : '0'}</span>
                </li>
                <li className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-semibold">
                  Backlog Policy: <span className="font-black text-slate-900">{data?.noBacklog ? 'No active backlogs allowed' : 'Backlogs permitted'}</span>
                </li>
                {data?.eligibleBatches?.length > 0 && (
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-semibold sm:col-span-2">
                    Eligible Batches: <span className="font-black text-slate-900">{data.eligibleBatches.join(', ')}</span>
                  </li>
                )}
                {data?.eligibleBranches?.length > 0 && (
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-semibold sm:col-span-2">
                    Eligible Branches: <span className="font-black text-slate-900">{data.eligibleBranches.join(', ')}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Application Instructions */}
          {(applied || currentUser?.role !== 'student') && data?.howToApply && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3">How to Apply & Next Steps</h3>
              <div className="text-xs text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.howToApply }} />
            </div>
          )}

          {/* Applicants Audit (For TPO/Admin) */}
          {currentUser.role !== 'student' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">Applied Students ({applicant.length})</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 w-12 text-center">#</th>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4 text-center">Current Round</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Applied On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {applicant.length > 0 ? (
                      applicant.map((app, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{app.name}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">{app.email}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-800">{app.currentRound || '—'}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-500">
                            {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">No students have applied yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalBox
        show={showModal}
        close={() => setShowModal(false)}
        header="Confirm Application"
        body={modalBody}
        btn="Apply for Drive"
        confirmAction={handleConfirmApply}
      />
    </div>
  );
}

export default ViewJobPost;
