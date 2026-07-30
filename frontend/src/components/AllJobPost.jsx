import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Placeholder from 'react-bootstrap/Placeholder';
import { useLocation, useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ModalBox from './Modal';
import Toast from './Toast';
import TablePlaceholder from './TablePlaceholder';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AllJobPost() {
  document.title = 'CPMS | Job Listings';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);  // Set to null initially

  // Toast and Modal states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataToParasModal, setDataToParasModal] = useState(null);
  const [modalBody, setModalBody] = useState({
    cmpName: '',
    jbTitle: ''
  });

  // Checking for authentication and fetching user details
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
        });
        fetchJobs();  // Fetch jobs only after the user info is loaded
      })
      .catch(err => {
        console.log("Error in fetching user details => ", err);
        setToastMessage(err.message || 'Error loading user data');
        setShowToast(true);
      });
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setJobs(response.data.data);
      fetchCompanies(response.data.data);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  };

  const fetchCompanies = async (jobs) => {
    const companyNames = {};
    for (const job of jobs) {
      if (job.company && !companyNames[job.company]) {
        try {
          const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${job.company}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
          companyNames[job.company] = response.data.company.companyName;
        } catch (error) {
          console.log("Error fetching company name => ", error);
        }
      }
    }
    setCompanies(companyNames);
    setLoading(false);
  };

  const handleDeletePost = (jobId, cmpName, jbTitle) => {
    setDataToParasModal(jobId);
    setModalBody({
      cmpName: cmpName,
      jbTitle: jbTitle
    });
    setShowModal(true);
  };

  const confirmDelete = async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/delete-job`, { jobId });
      setShowModal(false);
      fetchJobs();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDataToParasModal(null);
  };

  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      navigate('.', { replace: true, state: {} });
    }
    if (!jobs) setLoading(false);
  }, []);

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                Placement Listings
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {jobs?.length || 0} Drives Active
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Active recruitment opportunities, stipend breakdown, CTC packages, and applicant statistics.
              </p>
            </div>
          </div>

          {loading || !currentUser ? (
            <TablePlaceholder />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-stone-200/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                    <th className="py-3.5 px-4 w-14 text-center">Sr. No.</th>
                    <th className="py-3.5 px-4">Company Name</th>
                    <th className="py-3.5 px-4">Job Title</th>
                    <th className="py-3.5 px-4">Stipend</th>
                    <th className="py-3.5 px-4">Expected CTC</th>
                    <th className="py-3.5 px-4">Deadline</th>
                    <th className="py-3.5 px-4 text-center">Applicants</th>
                    <th className="py-3.5 px-4 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                  {jobs?.length > 0 ? (
                    jobs.map((job, index) => {
                      const isMatched = job?.applicants?.find(student => student.studentId == currentUser.id);
                      return (
                        <tr
                          key={job?._id}
                          className={`hover:bg-amber-50/40 transition-colors ${
                            isMatched ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center font-medium text-stone-500">{index + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                            {companies[job?.company] || (
                              <span className="text-stone-400 italic">Loading company...</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-stone-800">
                            {job?.jobTitle}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-stone-700">
                            {job?.stipend ? `₹${job.stipend.toLocaleString('en-IN')} / mo` : 'N/A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                              {job?.expectedCTC ? `${job.expectedCTC} LPA` : (job?.salary ? `${job.salary} LPA` : 'N/A')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-500 font-medium">
                            {job?.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-stone-100 text-stone-900 font-extrabold text-xs">
                              {job?.applicants?.length || 0}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View Job */}
                              <button
                                onClick={() => {
                                  const rolePaths = {
                                    'tpo_admin': `../tpo/job/${job._id}`,
                                    'management_admin': `../management/job/${job._id}`,
                                    'superuser': `../admin/job/${job._id}`,
                                    'student': `../student/job/${job._id}`,
                                  };
                                  navigate(rolePaths[currentUser.role]);
                                }}
                                className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-800 hover:text-white transition-all shadow-xs cursor-pointer"
                                title="View Details"
                              >
                                <i className="fa-solid fa-circle-info text-xs" />
                              </button>

                              {currentUser.role !== 'student' && (
                                <>
                                  {/* Edit Job */}
                                  <button
                                    onClick={() => {
                                      const rolePaths = {
                                        'tpo_admin': `../tpo/post-job/${job._id}`,
                                        'management_admin': `../management/post-job/${job._id}`,
                                        'superuser': `../admin/post-job/${job._id}`,
                                      };
                                      navigate(rolePaths[currentUser.role]);
                                    }}
                                    className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-600 hover:text-white transition-all shadow-xs cursor-pointer"
                                    title="Edit Job"
                                  >
                                    <i className="fa-solid fa-pen-to-square text-xs" />
                                  </button>

                                  {/* Delete Job */}
                                  <button
                                    onClick={() => handleDeletePost(job?._id, companies[job?.company], job?.jobTitle)}
                                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer"
                                    title="Delete Job"
                                  >
                                    <i className="fa-solid fa-trash-can text-xs" />
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
                      <td colSpan="8" className="py-12 text-center text-stone-400 font-medium">
                        No Job Listings Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Box for Confirm Delete */}
        <ModalBox
          show={showModal}
          close={closeModal}
          header={`Confirm Delete ${modalBody?.cmpName}`}
          body={`Are you sure you want to delete the job posting for ${modalBody?.jbTitle} from ${modalBody?.cmpName}?`}
          btn={"Delete Job"}
          confirmAction={() => confirmDelete(dataToParasModal)}
        />
      </div>
    </>
  );
}

export default AllJobPost;
