import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import {
  FaBriefcase, FaBuilding, FaMoneyBillWave, FaCalendarAlt,
  FaGraduationCap, FaCheckSquare, FaFileAlt, FaPaperPlane
} from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PostJob() {
  document.title = 'CPMS | Post Job';
  const navigate = useNavigate();
  const { jobId } = useParams();
  const editor = useRef(null);

  const [data, setData] = useState({});
  const [companys, setCompanys] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.company || !data?.jobTitle || !data?.stipend || !data?.expectedCTC || !data?.applicationDeadline || !data?.jobDescription || !data?.howToApply) {
      setToastMessage("All Required Fields Must Be Completed!");
      setShowToast(true);
      return;
    }
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/post-job`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);

        const newDataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg,
        };
        navigate('../tpo/job-listings', { state: newDataToPass });
      }
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg);
        else setToastMessage(error.message);
        setShowToast(true);
      }
      console.log("PostJob error while fetching => ", error);
    }
  };

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg);
        else setToastMessage(error.message);
        setShowToast(true);

        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCompanys(response.data.companys);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  };

  useEffect(() => {
    if (jobId) fetchJobDetail();
    fetchCompanys();
    if (!jobId) setLoading(false);
  }, [jobId]);

  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {loading ? (
        <div className="flex justify-center h-72 items-center">
          <div className="w-8 h-8 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto py-6 space-y-8 pb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: General Information */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden">
              <div className="bg-stone-900 text-white p-6 sm:p-8 border-b border-stone-800 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                    <FaBriefcase />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">General Information & Compensation</h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Select corporate partner, role title, monthly stipend, package CTC, and deadline.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Company Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Select Company Name <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                    <select
                      name="companySelected"
                      value={data?.company || ''}
                      onChange={(e) => setData({ ...data, company: e.target.value })}
                      className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer appearance-none"
                    >
                      <option disabled value="">Choose Participating Company</option>
                      {companys?.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Job Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Job Title <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      name="jobTitle"
                      value={data?.jobTitle || ''}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* Stipend */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Stipend / Month <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="text"
                        placeholder="e.g. 50000"
                        name="stipend"
                        value={data?.stipend || ''}
                        onChange={(e) => !isNaN(e.target.value) && handleDataChange(e)}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Expected CTC */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Expected CTC (LPA) <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14.5"
                      name="expectedCTC"
                      value={data?.expectedCTC || ''}
                      onChange={(e) => !isNaN(e.target.value) && /^[0-9]*[.,]?[0-9]*$/.test(e.target.value) && handleDataChange(e)}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* Deadline Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Deadline Date <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formatDate(data?.applicationDeadline) || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: System Enforced Eligibility Criteria */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden">
              <div className="bg-stone-900 text-white p-6 sm:p-8 border-b border-stone-800 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                    <FaGraduationCap />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">System-Enforced Eligibility Criteria</h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Automated criteria evaluated during student application submissions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Min CGPA */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Minimum CGPA Cutoff
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="e.g. 7.50"
                      name="minCG"
                      value={data?.minCG !== undefined ? data.minCG : ''}
                      onChange={(e) => setData({ ...data, minCG: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* Company Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Recruitment Tier Category
                    </label>
                    <select
                      name="companyCategory"
                      value={data?.companyCategory || 'Generic'}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                    >
                      <option value="Generic">Generic Tier</option>
                      <option value="Core">Core Engineering</option>
                      <option value="Dream">Dream Category</option>
                    </select>
                  </div>

                  {/* Placement Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Placement Type
                    </label>
                    <select
                      name="placementType"
                      value={data?.placementType || 'On-Campus'}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                    >
                      <option value="On-Campus">On-Campus Drive</option>
                      <option value="Off-Campus">Off-Campus Drive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Eligible Batches */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Eligible Passing Batches (e.g. 2027, 2028)
                    </label>
                    <input
                      type="text"
                      placeholder="Comma separated years"
                      name="eligibleBatchesInput"
                      value={data?.eligibleBatchesInput !== undefined ? data.eligibleBatchesInput : (data?.eligibleBatches ? data.eligibleBatches.join(', ') : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        const parsed = val.split(',')
                          .map(item => parseInt(item.trim(), 10))
                          .filter(item => !isNaN(item));
                        setData({
                          ...data,
                          eligibleBatchesInput: val,
                          eligibleBatches: parsed
                        });
                      }}
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* No Backlog Checkbox */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl w-full cursor-pointer hover:bg-amber-100/50 transition-colors">
                      <input
                        type="checkbox"
                        name="noBacklog"
                        checked={data?.noBacklog || false}
                        onChange={(e) => setData({ ...data, noBacklog: e.target.checked })}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="text-xs font-bold text-stone-900">
                        Require Zero Active Backlogs (No live KT allowed)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Eligible Branches */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
                    Eligible Branches / Academic Programs
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {['CSE', 'IT', 'ECE', 'CSE with DS', 'CSE with Cyber security'].map((branch) => {
                      const isChecked = data?.eligibleBranches?.includes(branch);
                      return (
                        <label
                          key={branch}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked || false}
                            onChange={(e) => {
                              let updatedBranches = [...(data?.eligibleBranches || [])];
                              if (e.target.checked) {
                                if (!updatedBranches.includes(branch)) updatedBranches.push(branch);
                              } else {
                                updatedBranches = updatedBranches.filter(b => b !== branch);
                              }
                              setData({ ...data, eligibleBranches: updatedBranches });
                            }}
                            className="hidden"
                          />
                          <FaCheckSquare className={`text-xs ${isChecked ? 'text-white' : 'text-stone-300'}`} />
                          <span>{branch}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Job Description & Selection Process */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden">
              <div className="bg-stone-900 text-white p-6 sm:p-8 border-b border-stone-800 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                    <FaFileAlt />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Job Description & Selection Process</h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Detailed role expectations, responsibilities, interview rounds, and instructions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Job Description <span className="text-amber-600">*</span>
                  </label>
                  <div className="rounded-xl border border-stone-200 overflow-hidden">
                    <JoditEditor
                      ref={editor}
                      tabIndex={1}
                      value={data?.jobDescription || ''}
                      onChange={(e) => setData({ ...data, jobDescription: e })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Process To Apply & Selection Rounds <span className="text-amber-600">*</span>
                  </label>
                  <div className="rounded-xl border border-stone-200 overflow-hidden">
                    <JoditEditor
                      ref={editor}
                      tabIndex={3}
                      value={data?.howToApply || ''}
                      onChange={(e) => setData({ ...data, howToApply: e })}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-base shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane />
                    <span>{jobId ? 'Update Job Listing' : 'Publish Job Listing'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirm Job Publication"}
        body={`Do you want to ${jobId ? 'update' : 'publish'} job posting for ${data?.jobTitle}?`}
        btn={jobId ? "Update Job" : "Publish Job"}
        confirmAction={confirmSubmit}
      />
    </>
  );
}

export default PostJob;
