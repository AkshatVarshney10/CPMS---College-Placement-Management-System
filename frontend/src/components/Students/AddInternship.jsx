import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaBuilding, FaGlobe, FaMapMarkerAlt, FaBriefcase, 
  FaCalendarAlt, FaMoneyBillWave, FaSave, FaPlusCircle 
} from 'react-icons/fa';
import Toast from '../Toast';
import ModalBox from '../Modal';
import SkeletonLoader from '../SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AddInternship() {
  document.title = 'CPMS | Add Internship';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState('');

  const closeModal = () => setShowModal(false);
  const [internship, setInternship] = useState({});
  const [currentUserData, setCurrentUserData] = useState('');

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserData({ id: response.data.id });
        if (!internshipId) setLoading(false);
      } catch (error) {
        console.error("AddInternship.jsx => ", error);
      }
    };
    fetchCurrentUserData();
  }, []);

  const fetchInternshipData = async () => {
    try {
      if (!currentUserData?.id || !internshipId) return;
      const response = await axios.get(`${BASE_URL}/student/internship?studentId=${currentUserData?.id}&internshipId=${internshipId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInternship(response.data.internship || {});
      setModalBody(response.data.internship?.companyName || '');
    } catch (error) {
      console.error("Error while fetching internship detail:", error);
      setToastMessage("Error loading internship details");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternshipData();
  }, [currentUserData?.id]);

  const handleDataChange = (e) => {
    setInternship({ ...internship, [e.target.name]: e.target.value });
    if (e.target.name === "companyName") setModalBody(e.target.value);
  };

  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!internship?.companyName || !internship?.internshipDuration || !internship?.startDate || !internship?.type) {
      setToastMessage('Please fill all mandatory fields marked with (*)');
      setShowToast(true);
      return;
    }
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    try {
      setSaving(true);
      const response = await axios.post(
        `${BASE_URL}/student/update-internship?studentId=${currentUserData?.id}&internshipId=${internshipId || ''}`, 
        { internship }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
        if (response.data.msg.includes("Successfully")) {
          navigate('/student/internship', { 
            state: { showToastPass: true, toastMessagePass: response.data.msg } 
          });
        }
      }
    } catch (error) {
      console.error("Error updating internship:", error);
      setToastMessage(error.response?.data?.msg || "Error while saving internship. Please try again.");
      setShowToast(true);
    } finally {
      setSaving(false);
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

      {/* Header Title Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaBriefcase className="text-xs" /> Industrial Training Ledger
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {internshipId ? 'Update Internship Record' : 'Add New Internship Record'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Record details about your industrial training, company contacts, duration, and monthly stipend compensation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Company Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
                  <FaBuilding />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">1. Company Information</h3>
                  <p className="text-xs text-slate-500">Corporate identity and web details</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-4 top-3.5 text-slate-400 text-sm" />
                    <input
                      type="text"
                      placeholder="e.g. Tata Consultancy Services"
                      name="companyName"
                      required
                      value={internship?.companyName || ""}
                      onChange={handleDataChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Company Website */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Company Website
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-3.5 text-slate-400 text-sm" />
                    <input
                      type="text"
                      placeholder="e.g. https://www.tcs.com"
                      name="companyWebsite"
                      value={internship?.companyWebsite || ""}
                      onChange={handleDataChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Company Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Company Office Address
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-3.5 text-slate-400 text-sm" />
                    <textarea
                      rows="3"
                      placeholder="Full office address / branch location..."
                      name="companyAddress"
                      value={internship?.companyAddress || ""}
                      onChange={handleDataChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Internship Details & Compensation */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
                  <FaBriefcase />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">2. Internship Details</h3>
                  <p className="text-xs text-slate-500">Mode, duration, and monthly stipend</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Internship Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Internship Mode <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="type"
                    required
                    value={internship?.type || "undefined"}
                    onChange={handleDataChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  >
                    <option disabled value="undefined">Select Internship Mode</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="On-Site">On-Site</option>
                    <option value="Work From Home">Work From Home (Remote)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Duration in Days */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Duration (Days) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step={1}
                      placeholder="e.g. 90"
                      name="internshipDuration"
                      required
                      value={internship?.internshipDuration || ""}
                      onChange={handleDataChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* Monthly Stipend */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Monthly Stipend (₹)
                    </label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-4 top-3.5 text-slate-400 text-sm" />
                      <input
                        type="number"
                        step={500}
                        placeholder="e.g. 15000"
                        name="monthlyStipend"
                        value={internship?.monthlyStipend || ""}
                        onChange={handleDataChange}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Start Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-3.5 text-slate-400 text-sm" />
                      <input
                        type="date"
                        name="startDate"
                        required
                        value={formatDate(internship?.startDate) || ""}
                        onChange={handleDataChange}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      End Date
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-3.5 text-slate-400 text-sm" />
                      <input
                        type="date"
                        name="endDate"
                        value={formatDate(internship?.endDate) || ""}
                        onChange={handleDataChange}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Description Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
          <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
            Internship Description & Key Projects
          </label>
          <textarea
            rows="4"
            placeholder="Describe your role, technologies used, responsibilities, and key project outcomes..."
            name="description"
            value={internship?.description || ""}
            onChange={handleDataChange}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
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
            <span>{internshipId ? 'Save Internship Record' : 'Submit Internship Record'}</span>
          </button>
        </div>
      </form>

      <ModalBox
        show={showModal}
        close={closeModal}
        header="Confirm Internship Submission"
        body={`Are you sure you want to save the internship record for ${modalBody ? modalBody : 'this company'}?`}
        btn="Confirm & Save"
        confirmAction={confirmSubmit}
      />
    </div>
  );
}

export default AddInternship;
