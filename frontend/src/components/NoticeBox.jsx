import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBullhorn, FaArrowRight } from 'react-icons/fa';

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
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-sm">
            <FaBullhorn />
          </div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">Campus Circulars</h4>
        </div>
        <Link to={getAllNoticesPath()} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 no-underline">
          View All <FaArrowRight className="text-[10px]" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {noticesData.length > 0 ? (
            noticesData.map((notice, index) => {
              const isNew = (new Date() - new Date(notice.createdAt)) / (1000 * 60 * 60 * 24) <= 2;
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <Link
                    to={getNoticePath(notice._id)}
                    className="no-underline text-slate-900 font-bold text-xs truncate max-w-xs hover:text-amber-600 flex items-center gap-2"
                  >
                    <span className="truncate">{notice.title}</span>
                    {isNew && (
                      <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0">
                        New
                      </span>
                    )}
                  </Link>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {new Date(notice.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 font-medium">No notices found!</div>
          )}
        </div>
      )}
    </div>
  );
}

export default NoticeBox;
