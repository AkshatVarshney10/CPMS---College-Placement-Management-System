import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaArrowRight, FaBriefcase } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function NotificationBox() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`);
      const sorted = (response.data.data || []).sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).slice(0, 8);
      setJobs(sorted);
    } catch (error) {
      console.error('Error while fetching job notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-sm">
            <FaBell />
          </div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">Recent Drive Alerts</h4>
        </div>
        <Link to="/student/job-listings" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 no-underline">
          View All <FaArrowRight className="text-[10px]" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {jobs.length > 0 ? (
            jobs.map((job, index) => {
              const isNew = (new Date() - new Date(job.postedAt)) / (1000 * 60 * 60 * 24) <= 2;
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <Link
                    to={`/student/job/${job._id}`}
                    className="no-underline text-slate-900 font-bold text-xs truncate max-w-xs hover:text-amber-600 flex items-center gap-2"
                  >
                    <span className="truncate">{job.jobTitle}</span>
                    {isNew && (
                      <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0">
                        New
                      </span>
                    )}
                  </Link>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {new Date(job.postedAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 font-medium">No job notifications found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBox;
