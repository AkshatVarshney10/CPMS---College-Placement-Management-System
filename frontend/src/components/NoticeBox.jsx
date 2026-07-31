import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBullhorn, FaArrowRight, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function NoticeBox() {
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

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

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      let filteredNotices = [];
      if (currentUser?.role === 'management_admin') {
        filteredNotices = (response.data || []).filter(notice => notice.sender_role === 'tpo_admin');
      } else if (currentUser?.role === 'tpo_admin') {
        filteredNotices = (response.data || []).filter(notice => notice.receiver_role === 'tpo_admin');
      } else if (currentUser?.role === 'student') {
        filteredNotices = (response.data || []).filter(notice => notice.receiver_role === 'student');
      } else {
        filteredNotices = response.data || [];
      }

      setNoticesData(filteredNotices);
    } catch (error) {
      console.error('Error while fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNoticePath = (noticeId) => {
    if (currentUser?.role === 'student') return `/student/notice/${noticeId}`;
    if (currentUser?.role === 'tpo_admin') return `/tpo/notice/${noticeId}`;
    if (currentUser?.role === 'management_admin') return `/management/notice/${noticeId}`;
    return '#';
  };

  const getAllNoticesPath = () => {
    if (currentUser?.role === 'student') return '/student/all-notice';
    if (currentUser?.role === 'tpo_admin') return '/tpo/all-notice';
    if (currentUser?.role === 'management_admin') return '/management/all-notice';
    return '#';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4 h-full">
      {/* Top Header Bar */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
            <FaBullhorn />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Campus Circulars</h3>
            <p className="text-xs text-slate-500 font-medium">Official administrative announcements & notices</p>
          </div>
        </div>
        <Link 
          to={getAllNoticesPath()} 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold text-xs rounded-xl border border-amber-200/80 transition-all no-underline shrink-0"
        >
          <span>View All</span>
          <FaArrowRight className="text-[10px]" />
        </Link>
      </div>

      {/* Content Container */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-7 h-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
          {noticesData.length > 0 ? (
            noticesData.map((notice, index) => {
              const isNew = (new Date() - new Date(notice.createdAt)) / (1000 * 60 * 60 * 24) <= 2;
              return (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <h4 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-amber-600 transition-colors">
                        {notice.title}
                      </h4>
                      {isNew && (
                        <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pl-4">
                      <FaCalendarAlt className="text-amber-500/80 text-[11px]" />
                      <span>{new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <Link
                    to={getNoticePath(notice._id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all no-underline shrink-0"
                  >
                    <span>View</span>
                    <FaChevronRight className="text-[10px]" />
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-center py-14 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto text-xl">
                <FaBullhorn />
              </div>
              <h5 className="font-extrabold text-slate-900 text-sm">No Campus Circulars Posted</h5>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                There are currently no active administrative circulars or official announcements available.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NoticeBox;
