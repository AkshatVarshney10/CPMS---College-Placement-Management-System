import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';
import SkeletonLoader from './SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ViewNotice() {
  const navigate = useNavigate();
  const noticeId = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'CPMS | Notice Details';
    fetchNotice();
  }, [noticeId]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const id = noticeId.noticeId?.trim();
      if (!id) return;

      const response = await axios.get(`${BASE_URL}/management/get-notice`, {
        params: { noticeId: id },
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotice(response.data);
    } catch (error) {
      console.error("Error while fetching notice:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <SkeletonLoader type="card" count={1} />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
          <FaBell />
        </div>
        <h4 className="font-extrabold text-slate-900 text-lg">Notice Not Found</h4>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
      >
        <FaArrowLeft /> Back to All Notices
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200">
            <FaBell className="text-xs" /> Placement Announcement
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {notice.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold pt-1">
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-amber-500" />
              {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {notice.sender_role && (
              <span className="flex items-center gap-1.5">
                <FaUser className="text-amber-500" />
                Sender: <strong className="text-slate-800 uppercase">{notice.sender_role === 'tpo_admin' ? 'TPO Cell' : 'Management'}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="text-slate-800 text-sm leading-relaxed font-medium whitespace-pre-line space-y-4">
          {notice.message}
        </div>
      </div>
    </div>
  );
}

export default ViewNotice;
