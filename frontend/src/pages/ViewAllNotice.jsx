import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaSearch, FaTrashAlt, FaEye, FaCalendarAlt } from 'react-icons/fa';
import TablePlaceholder from '../components/TablePlaceholder';
import Toast from '../components/Toast';
import ModalBox from '../components/Modal';
import SkeletonLoader from '../components/SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ViewAllNotice() {
  document.title = 'CPMS | Campus Notices';
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalToPass, setModalToPass] = useState('');

  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser({ role: response.data.role });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.role) {
      fetchNotices();
    }
  }, [currentUser?.role]);

  const handleDelete = (noticeId) => {
    setModalToPass(noticeId);
    setShowModal(true);
  };

  const confirmDelete = async (noticeId) => {
    try {
      const response = await axios.post(`${BASE_URL}/management/delete-notice?noticeId=${noticeId}`);
      if (response?.data?.msg) {
        fetchNotices();
        setToastMessage(response.data.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
    setShowModal(false);
  };

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (currentUser?.role === 'tpo_admin') {
        const filtered = response?.data?.filter(notice => (
          notice.sender_role === 'tpo_admin' || notice.receiver_role === 'tpo_admin'
        ));
        setNoticesData(filtered || []);
      } else if (currentUser?.role === 'student') {
        const filtered = response?.data?.filter(notice => notice.receiver_role === 'student');
        setNoticesData(filtered || []);
      } else {
        setNoticesData(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = noticesData.filter(n =>
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Header Title Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaBell className="text-xs" /> Campus Communication Bulletin
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Placement Announcements & Notices</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Official announcements, schedule changes, and recruitment guidelines issued by CDC & TPO Administration.
          </p>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search notices by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-900 font-bold">{filteredNotices.length}</span> of {noticesData.length} notices
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-4 px-4 w-12 text-center">#</th>
                <th className="py-4 px-4">Title</th>
                {currentUser?.role !== 'student' && (
                  <>
                    <th className="py-4 px-4 text-center">Sender</th>
                    <th className="py-4 px-4 text-center">Receiver</th>
                  </>
                )}
                <th className="py-4 px-4">Message Snippet</th>
                <th className="py-4 px-4 text-center">Posted Date & Time</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-slate-700 bg-white">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice, index) => {
                  const isNew = (new Date() - new Date(notice.createdAt)) / (1000 * 60 * 60 * 24) <= 2;
                  const noticePath = currentUser?.role === 'student'
                    ? `/student/notice/${notice._id}`
                    : currentUser?.role === 'tpo_admin'
                    ? `/tpo/notice/${notice._id}`
                    : `/management/notice/${notice._id}`;

                  return (
                    <tr key={notice._id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <Link to={noticePath} className="text-slate-900 hover:text-amber-600 no-underline font-bold text-sm flex items-center gap-2">
                          <span>{notice.title}</span>
                          {isNew && (
                            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow-2xs">
                              New
                            </span>
                          )}
                        </Link>
                      </td>
                      {currentUser?.role !== 'student' && (
                        <>
                          <td className="py-4 px-4 text-center font-semibold text-slate-700">
                            {notice.sender_role === 'management_admin' ? 'Management' : 'TPO'}
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-slate-700">
                            {notice.receiver_role === 'tpo_admin' ? 'TPO' : 'Student'}
                          </td>
                        </>
                      )}
                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate font-medium">
                        {notice.message || '—'}
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-slate-500 whitespace-nowrap">
                        {new Date(notice.createdAt).toLocaleDateString('en-IN')}{' '}
                        <span className="text-slate-400 text-[11px]">{new Date(notice.createdAt).toLocaleTimeString('en-IN')}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={noticePath}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-2xs transition-all no-underline"
                          >
                            <FaEye className="text-xs" /> View
                          </Link>
                          {currentUser?.role !== 'student' && (
                            <button
                              onClick={() => handleDelete(notice._id)}
                              className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all cursor-pointer"
                              title="Delete Notice"
                            >
                              <FaTrashAlt className="text-xs" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-xl">
                        <FaBell />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">No Notices Found</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {searchQuery ? `No matching notices found for "${searchQuery}".` : 'There are currently no placement announcements posted.'}
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
        header="Confirm Notice Deletion"
        body="Are you sure you want to delete this placement notice?"
        btn="Delete"
        confirmAction={() => confirmDelete(modalToPass)}
      />
    </div>
  );
}

export default ViewAllNotice;
