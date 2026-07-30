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

function AllCompany() {
  document.title = 'CPMS | All Company';

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [companys, setCompanys] = useState({});
  const [jobs, setJobs] = useState({});

  const [modalBody, setModalBody] = useState({
    companyName: "",
    companyId: ""
  });

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  // stores only user role
  const [currentUser, setCurrentUser] = useState('');

  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response?.data) setCurrentUser(response?.data?.role);
    } catch (error) {
      console.log("Account.jsx => ", error);
    }
  }

  const fetchCompanys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCompanys(response.data.companys);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  const handleDeleteCompany = (companyName, companyId) => {
    setModalBody({ companyId: companyId, companyName: companyName });
    setShowModal(true);
  }

  const confirmDelete = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/company/delete-company`,
        { companyId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        },
      );

      setShowModal(false);
      fetchCompanys();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setJobs(response.data.data);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  const renderTooltipDeleteCompany = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete Company
    </Tooltip>
  );

  const renderTooltipEditCompany = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit Company
    </Tooltip>
  );


  const closeModal = () => setShowModal(false);

  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
    fetchCurrentUserData();
    fetchCompanys();
    fetchJobs();
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
                Company Directory
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {companys?.length || 0} Registered
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Corporate partners, recruitment categories, and HR contact profiles.
              </p>
            </div>
          </div>

          {loading ? (
            <TablePlaceholder />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-stone-200/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                    <th className="py-3.5 px-4 w-14 text-center">Sr. No.</th>
                    <th className="py-3.5 px-4">Company Name</th>
                    <th className="py-3.5 px-4">Website</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">HR Contact</th>
                    <th className="py-3.5 px-4 text-center">Jobs Posted</th>
                    <th className="py-3.5 px-4 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                  {companys?.length > 0 ? (
                    companys.map((company, index) => (
                      <tr key={company?._id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-medium text-stone-500">{index + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                          {company?.companyName}
                        </td>
                        <td className="py-3.5 px-4">
                          {company?.companyWebsite ? (
                            <a
                              href={company.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-700 hover:text-amber-900 font-medium no-underline hover:underline truncate max-w-[160px] inline-block"
                            >
                              {company.companyWebsite}
                            </a>
                          ) : (
                            <span className="text-stone-400">N/A</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-700">
                          {company?.companyLocation || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          {company?.category === 'Generic' && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                              Generic
                            </span>
                          )}
                          {company?.category === 'Core' && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                              Core
                            </span>
                          )}
                          {company?.category === 'Dream' && (
                            <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                              Dream
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {company?.hrName ? (
                            <div className="text-[11px] leading-tight space-y-0.5 bg-stone-50 p-2 rounded-xl border border-stone-200/60 max-w-[220px]">
                              <div className="font-semibold text-stone-900">{company.hrName}</div>
                              <div className="text-stone-500">{company.hrPhone}</div>
                              <div className="truncate">
                                <a href={`mailto:${company.hrEmail}`} className="text-amber-700 hover:underline">
                                  {company.hrEmail}
                                </a>
                              </div>
                              {company.hrLinkedin && (
                                <div>
                                  <a href={company.hrLinkedin} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">
                                    LinkedIn Profile
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-stone-400">N/A</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-stone-100 text-stone-800 font-extrabold text-xs">
                            {jobs.length
                              ? jobs?.filter(job => job?.company == company?._id)?.length
                              : 0
                            }
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                if (currentUser === 'tpo_admin') navigate(`../tpo/add-company/${company._id}`);
                                else if (currentUser === 'management_admin') navigate(`../management/add-company/${company._id}`);
                                else if (currentUser === 'superuser') navigate(`../admin/add-company/${company._id}`);
                              }}
                              className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-800 hover:text-white transition-all shadow-xs cursor-pointer"
                              title="Edit Company"
                            >
                              <i className="fa-solid fa-pen-to-square text-xs" />
                            </button>
                            <button
                              onClick={() => handleDeleteCompany(company?.companyName, company?._id)}
                              className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer"
                              title="Delete Company"
                            >
                              <i className="fa-solid fa-trash-can text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-stone-400 font-medium">
                        No companies registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ModalBox Component for Delete Confirmation */}
        <ModalBox
          show={showModal}
          close={closeModal}
          header={"Confirmation"}
          body={`Do you want to delete company ${modalBody.companyName}?`}
          btn={"Delete"}
          confirmAction={() => confirmDelete(modalBody.companyId)}
        />
      </div>
    </>
  );
}

export default AllCompany;
