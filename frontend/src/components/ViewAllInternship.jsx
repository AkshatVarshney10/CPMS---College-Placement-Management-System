import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  FaBriefcase, FaPlus, FaGlobe, FaCalendarAlt, FaMoneyBillWave, 
  FaEdit, FaTrashAlt, FaSearch 
} from 'react-icons/fa';
import ModalBox from './Modal';
import Toast from './Toast';
import SkeletonLoader from './SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ViewAllInternship() {
  document.title = 'CPMS | My Internships';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState({});
  const [dataToParasModal, setDataToParasModal] = useState('');
  const [currentUser, setCurrentUser] = useState({});

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
      })
      .catch(err => {
        console.error("ViewAllInternship.jsx => ", err);
      });
  }, []);

  const fetchInternships = async () => {
    try {
      if (!currentUser?.id) return;
      const response = await axios.get(`${BASE_URL}/student/internship?studentId=${currentUser?.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInternships(response.data.internships || []);
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [currentUser?.id]);

  const handleDeleteInternship = (internshipId, cmpName) => {
    setDataToParasModal(internshipId);
    setModalBody({ cmpName: cmpName });
    setShowModal(true);
  };

  const confirmDelete = async (internshipId) => {
    try {
      const response = await axios.post(`${BASE_URL}/student/delete-internship`, 
        { internshipId, studentId: currentUser.id }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setShowModal(false);
      fetchInternships();
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

  const { showToastPass, toastMessagePass } = location.state || {};

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(true);
      navigate('.', { replace: true, state: {} });
    }
  }, []);

  const filteredInternships = internships.filter(i =>
    i.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.companyWebsite?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <SkeletonLoader type="table" count={4} />
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

      {/* Header Title Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaBriefcase className="text-xs" /> Industrial Training Ledger
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">My Internship Experience</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Log and manage your official industrial training experiences, monthly stipends, and company duration records.
          </p>
        </div>
        <Link
          to="/student/add-internship"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-xs sm:text-sm no-underline cursor-pointer shrink-0"
        >
          <FaPlus />
          <span>Add New Internship</span>
        </Link>
      </div>

      {/* Search & Counter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by company name or website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-900 font-bold">{filteredInternships.length}</span> of {internships.length} internships
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-4 px-4 w-12 text-center">#</th>
                <th className="py-4 px-4">Company Name</th>
                <th className="py-4 px-4">Company Website</th>
                <th className="py-4 px-4 text-center">Start Date</th>
                <th className="py-4 px-4 text-center">End Date</th>
                <th className="py-4 px-4 text-center">Duration</th>
                <th className="py-4 px-4 text-center">Monthly Stipend</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-slate-700 bg-white">
              {filteredInternships.length > 0 ? (
                filteredInternships.map((internship, index) => (
                  <tr key={internship._id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200/60">
                          {internship.companyName?.substring(0, 2).toUpperCase() || 'IN'}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{internship.companyName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {internship.companyWebsite ? (
                        <a
                          href={internship.companyWebsite.startsWith('http') ? internship.companyWebsite : `https://${internship.companyWebsite}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 no-underline font-medium"
                        >
                          <FaGlobe className="text-xs" />
                          <span className="truncate max-w-xs">{internship.companyWebsite}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-600">
                      {internship.startDate ? new Date(internship.startDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-600">
                      {internship.endDate ? new Date(internship.endDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        {internship.internshipDuration ? `${internship.internshipDuration} days` : '—'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-extrabold text-purple-700">
                      {internship.monthlyStipend ? `₹${Number(internship.monthlyStipend).toLocaleString('en-IN')}/mo` : '—'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/student/add-internship/${internship._id}`)}
                          className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center transition-all cursor-pointer"
                          title="Edit Internship"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDeleteInternship(internship._id, internship.companyName)}
                          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all cursor-pointer"
                          title="Delete Internship"
                        >
                          <FaTrashAlt className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-xl">
                        <FaBriefcase />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">No Internship Logged</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        You have not recorded any industrial training or internship experiences yet.
                      </p>
                      <Link
                        to="/student/add-internship"
                        className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 no-underline transition-all"
                      >
                        Add Your First Internship
                      </Link>
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
        close={() => setShowModal(false)}
        header="Delete Internship Record"
        body={`Are you sure you want to delete the internship record for ${modalBody.cmpName}?`}
        btn="Delete"
        confirmAction={() => confirmDelete(dataToParasModal)}
      />
    </div>
  );
}

export default ViewAllInternship;
