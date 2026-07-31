import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, FaBuilding, FaBriefcase, FaCalendarAlt, FaMoneyBillWave, 
  FaCheckCircle, FaFilePdf, FaTrashAlt, FaSave, FaArrowLeft, FaEye 
} from 'react-icons/fa';
import UploadOfferLetter from './UploadOfferLetter';
import Toast from '../Toast';
import ModalBox from '../Modal';
import SkeletonLoader from '../SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function UpdateJobStatus() {
  document.title = 'CPMS | Update Application Status';
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  const [applicant, setApplicant] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isHired, setHired] = useState(false);

  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${BASE_URL}/user/detail`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          first_name: res.data.first_name,
          middle_name: res.data.middle_name,
          last_name: res.data.last_name,
          email: res.data.email,
          number: res.data.number,
          role: res.data.role,
          uin: res.data.studentProfile?.uin,
        });
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
      }
    }
  };

  const fetchCompanyData = async (companyId) => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`);
      setCompany(response.data.company || null);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchJobDetailsOfApplicant = async () => {
    if (data?.applicants?.length) {
      const appliedApplicant = data.applicants.find(app => app.studentId === currentUser.id);
      if (appliedApplicant) {
        setApplicant(appliedApplicant);
        if (appliedApplicant.status === 'hired') setHired(true);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchJobDetail();
      } catch (error) {
        console.error("Error during fetching job detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  useEffect(() => {
    if (data?.applicants && currentUser?.id) {
      fetchJobDetailsOfApplicant();
    }
  }, [currentUser?.id, data]);

  const handleApplicantChange = (e) => {
    setApplicant({
      ...applicant,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'status') {
      if (e.target.value === 'hired') setHired(true);
      else setHired(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (applicant?.status === 'hired' && !applicant?.package) {
      setToastMessage("Package Offered is required for Hired status!");
      setShowToast(true);
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post(`${BASE_URL}/student/update-status/${jobId}/${currentUser.id}`, { applicant });
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      setToastMessage(error.response?.data?.msg || "Failed to update status");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => setShowModal(true);

  const confirmDelete = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/student/delete-offer-letter/${jobId}/${currentUser.id}`, { applicant });
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
        setShowModal(false);
        fetchJobDetail();
      }
    } catch (error) {
      console.error("Error deleting offer letter:", error);
      setToastMessage(error.response?.data?.msg || "Error deleting offer letter");
      setShowToast(true);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* Back Button & Header Banner */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
        >
          <FaArrowLeft /> Back to Applied Jobs
        </button>

        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
              <FaBriefcase className="text-xs" /> Application Audit Tracker
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Update Application Status</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Keep your recruitment round progress, interview selection dates, offer letters, and package details current.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Student & Drive Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
                  <FaUser />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">1. Student & Drive Metadata</h3>
                  <p className="text-xs text-slate-500">Applicant profile & target drive information</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Applicant</span>
                  <p className="font-extrabold text-slate-900 text-base">
                    {currentUser.first_name} {currentUser.middle_name || ''} {currentUser.last_name}
                  </p>
                  <p className="text-slate-600 font-medium">{currentUser.email} • {currentUser.number}</p>
                  {currentUser.uin && <p className="text-amber-600 font-bold">UIN: {currentUser.uin}</p>}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recruitment Drive</span>
                  <p className="font-extrabold text-slate-900 text-base">{company?.companyName || 'Corporate Employer'}</p>
                  <p className="text-amber-600 font-bold">{data?.jobTitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Status & Round Progress */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
                  <FaCheckCircle />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">2. Round Progress & Offer Letter</h3>
                  <p className="text-xs text-slate-500">Update current stage, selection date, and offer letter</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Current Round & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Current Round</label>
                    <select
                      name="currentRound"
                      value={applicant?.currentRound || "undefined"}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option disabled value="undefined">Select Round</option>
                      <option value="Aptitude Test">Aptitude Test</option>
                      <option value="Technical Interview">Technical Interview</option>
                      <option value="HR Interview">HR Interview</option>
                      <option value="Group Discussion">Group Discussion</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Round Status</label>
                    <select
                      name="roundStatus"
                      value={applicant?.roundStatus || "undefined"}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option disabled value="undefined">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Selection & Joining Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Selection Date</label>
                    <input
                      type="date"
                      name="selectionDate"
                      value={formatDate(applicant?.selectionDate)}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Joining Date</label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formatDate(applicant?.joiningDate)}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Overall Job Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Overall Application Status</label>
                  <select
                    name="status"
                    value={applicant?.status || "undefined"}
                    onChange={handleApplicantChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option disabled value="undefined">Select Application Status</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Package Input if Hired */}
                {isHired && (
                  <div className="space-y-1.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <label className="text-xs font-extrabold text-emerald-900 block uppercase tracking-wider">
                      Package Offered (LPA) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 12.5"
                      name="package"
                      required
                      value={applicant?.package || ''}
                      onChange={handleApplicantChange}
                      className="w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm font-black text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {/* Offer Letter Upload & Preview */}
                <div className="pt-2 space-y-3">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Offer Letter Document</label>
                  <UploadOfferLetter jobId={jobId} fetchJobDetailsOfApplicant={fetchJobDetailsOfApplicant} />

                  {applicant?.offerLetter && (
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={BASE_URL + applicant.offerLetter}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl no-underline transition-all shadow-2xs"
                      >
                        <FaEye /> View Offer Letter
                      </a>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <FaSave className="text-base" />
            )}
            <span>{saving ? 'Updating Status...' : 'Save & Update Application Status'}</span>
          </button>
        </div>
      </form>

      <ModalBox
        show={showModal}
        close={closeModal}
        header="Confirm Offer Letter Deletion"
        body="Are you sure you want to delete your uploaded offer letter?"
        btn="Delete Document"
        confirmAction={confirmDelete}
      />
    </div>
  );
}

export default UpdateJobStatus;
