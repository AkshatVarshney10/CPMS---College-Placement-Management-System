import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserGraduate, FaBuilding, FaCheckCircle, FaClock, FaTimesCircle, FaBell } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function NotificationBox() {
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState([]);
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
    fetchUpdates();
  }, [currentUser?.role]);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/student/notify-interview-hired`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const students = response?.data?.studentsWithJobDetails || [];

      const filteredJobs = students.map(student => {
        return {
          id: student._id,
          studentName: student.name,
          department: student.department,
          year: student.year,
          jobs: (student.jobs || []).filter(job => job.status === 'interview' || job.status === 'hired' || job.status === 'shortlisted' || job.status === 'rejected')
        };
      }).filter(student => student.jobs.length > 0);

      setNotify(filteredJobs);
    } catch (error) {
      console.error('Error while fetching updates notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYearText = (year) => {
    if (year === 1) return 'First Year';
    if (year === 2) return 'Second Year';
    if (year === 3) return 'Third Year';
    if (year === 4) return 'Fourth Year';
    return 'Final Year';
  };

  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower === 'hired') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-extrabold shrink-0">
          <FaCheckCircle className="text-emerald-600 text-[11px]" /> ✓ Hired
        </span>
      );
    }
    if (lower === 'shortlisted' || lower === 'interview') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-extrabold shrink-0">
          <FaClock className="text-amber-600 text-[11px]" /> Shortlisted
        </span>
      );
    }
    if (lower === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-extrabold shrink-0">
          <FaTimesCircle className="text-rose-600 text-[11px]" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4 h-full">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
            <FaBell />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Placement Activity</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time status updates of student recruitment rounds</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-7 h-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
          {notify?.length > 0 ? (
            notify.map((student, studentIndex) => {
              const studentProfilePath = currentUser?.role === 'tpo_admin' 
                ? `/tpo/user/${student.id}` 
                : `/management/user/${student.id}`;

              return (
                <div 
                  key={studentIndex} 
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 space-y-3"
                >
                  {/* Header: Student info */}
                  <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                        {student.studentName?.substring(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <div>
                        <Link 
                          to={studentProfilePath}
                          target="_blank"
                          className="font-extrabold text-slate-900 text-sm hover:text-amber-600 no-underline transition-colors block"
                        >
                          {student.studentName}
                        </Link>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {getYearText(student.year)} • {student.department || 'Branch'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body: Jobs */}
                  <div className="space-y-2">
                    {student.jobs.map((job, jobIndex) => {
                      const jobPath = currentUser?.role === 'tpo_admin'
                        ? `/tpo/job/${job?.jobId}`
                        : `/management/job/${job?.jobId}`;

                      return (
                        <div key={jobIndex} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                          <div className="space-y-0.5">
                            <Link 
                              to={jobPath}
                              target="_blank"
                              className="font-bold text-slate-900 text-xs hover:text-amber-600 no-underline flex items-center gap-1.5"
                            >
                              <FaBuilding className="text-amber-500 text-[11px]" />
                              <span>{job?.companyName || 'Employer'}</span>
                            </Link>
                            <p className="text-xs text-slate-600 font-medium pl-4">
                              {job?.jobTitle}
                            </p>
                          </div>
                          <div>
                            {getStatusBadge(job?.status)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No recent notifications found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBox;
