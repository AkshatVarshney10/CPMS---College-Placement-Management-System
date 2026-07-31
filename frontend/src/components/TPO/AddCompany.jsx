import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { FaBuilding, FaGlobe, FaMapMarkerAlt, FaTags, FaAlignLeft, FaUserTie, FaPhone, FaEnvelope, FaLinkedin, FaPlusCircle } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AddCompany() {
  document.title = 'CPMS | Add Company';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { companyId } = useParams();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});

  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !data?.companyName ||
      !data?.companyDescription ||
      !data?.category ||
      !data?.companyLocation ||
      !data?.companyWebsite ||
      !data?.hrName ||
      !data?.hrPhone ||
      !data?.hrEmail ||
      !data?.hrLinkedin
    )
      return setError("All Fields Required!");
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    const url = companyId
      ? `${BASE_URL}/company/update-company?companyId=${companyId}`
      : `${BASE_URL}/company/add-company`;
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      if (response?.status === 201) {
        setShowModal(false);
        setToastMessage(response?.data?.msg);
        const dataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg
        };
        navigate('../tpo/companys', { state: dataToPass });
      }
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
      setShowModal(false);
      setToastMessage(error?.response?.data?.msg);
      setShowToast(true);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`);
      setData(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchCompanyData();
    else setLoading(false);
  }, [companyId]);

  const handleDataChange = (e) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value });
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
        <div className="max-w-4xl mx-auto py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Company Information */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden">
              <div className="bg-stone-900 text-white p-6 sm:p-8 border-b border-stone-800 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                    <FaBuilding />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {companyId ? 'Update Company Profile' : 'Company Information'}
                    </h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Enter corporate identity, website URL, location, and recruitment tier.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Company Name <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="text"
                        placeholder="e.g. Google, TCS, Zscaler"
                        name="companyName"
                        value={data?.companyName || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Company Location */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Company Location <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="text"
                        placeholder="e.g. Bangalore, Hyderabad"
                        name="companyLocation"
                        value={data?.companyLocation || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Company Website <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="url"
                        placeholder="https://company.com"
                        name="companyWebsite"
                        value={data?.companyWebsite || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Company Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Company Category <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaTags className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <select
                        name="category"
                        value={data?.category || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer appearance-none"
                      >
                        <option value="" disabled>Select Company Category</option>
                        <option value="Generic">Generic Tier</option>
                        <option value="Core">Core Engineering</option>
                        <option value="Dream">Dream Category</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Company Description <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative">
                    <FaAlignLeft className="absolute left-3.5 top-4 text-stone-400 text-xs" />
                    <textarea
                      placeholder="Brief overview of company business domain, tech stack, and workplace culture..."
                      name="companyDescription"
                      rows={4}
                      value={data?.companyDescription || ''}
                      onChange={handleDataChange}
                      className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: HR Contact Details */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden">
              <div className="bg-stone-900 text-white p-6 sm:p-8 border-b border-stone-800 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                    <FaUserTie />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">HR Contact Details</h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Direct point of contact details for placement coordination.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* HR Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      HR Name <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaUserTie className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="text"
                        placeholder="HR Manager's Full Name"
                        name="hrName"
                        value={data?.hrName || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* HR Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      HR Phone <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="text"
                        placeholder="HR Phone Number"
                        name="hrPhone"
                        value={data?.hrPhone || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* HR Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      HR Email <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="email"
                        placeholder="hr@company.com"
                        name="hrEmail"
                        value={data?.hrEmail || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* HR LinkedIn */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      HR LinkedIn <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <FaLinkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        name="hrLinkedin"
                        value={data?.hrLinkedin || ''}
                        onChange={handleDataChange}
                        className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-bold mt-2">{error}</p>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-base shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaPlusCircle />
                    <span>{companyId ? 'Update Company Details' : 'Add Company Details'}</span>
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
        header={"Confirm Company Registration"}
        body={`Do you want to ${companyId ? 'update' : 'add'} company details for ${data?.companyName}?`}
        btn={companyId ? "Update" : "Save Company"}
        confirmAction={confirmSubmit}
      />
    </>
  );
}

export default AddCompany;
