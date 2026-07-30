import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaUserCheck, FaUserFriends, FaInfoCircle, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import Toast from "../Toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function JobEligibilityReport() {
  document.title = "CPMS | Job Eligibility & Applicants";

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [searchEligible, setSearchEligible] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [activeTab, setActiveTab] = useState("eligible");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const userRole = localStorage.getItem("role") || "";
  const rolePath = userRole === "superuser" ? "admin" : "management";

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${rolePath}/job-eligibility-report`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.data?.report) {
        setReportData(response.data.report);
        if (response.data.report.length > 0) {
          setSelectedJobId(response.data.report[0].jobId);
        }
      }
    } catch (error) {
      console.error("Error fetching job eligibility report:", error);
      setToastMessage(error.response?.data?.msg || "Failed to load report data.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const selectedJob = reportData.find(item => item.jobId === selectedJobId);

  const filteredEligible = selectedJob?.eligibleStudents?.filter(student => {
    const fullName = `${student.first_name || ""} ${student.last_name || ""}`.toLowerCase();
    const query = searchEligible.toLowerCase();
    return (
      fullName.includes(query) ||
      (student.email || "").toLowerCase().includes(query) ||
      (student.rollNumber || "").toString().includes(query) ||
      (student.department || "").toLowerCase().includes(query)
    );
  }) || [];

  const filteredApplied = selectedJob?.appliedStudents?.filter(student => {
    const fullName = `${student.first_name || ""} ${student.last_name || ""}`.toLowerCase();
    const query = searchApplied.toLowerCase();
    return (
      fullName.includes(query) ||
      (student.email || "").toLowerCase().includes(query) ||
      (student.rollNumber || "").toString().includes(query) ||
      (student.department || "").toLowerCase().includes(query)
    );
  }) || [];

  const getCategoryBadge = (category) => {
    switch (category) {
      case "Dream":
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">Dream</span>;
      case "Core":
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">Core</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">Generic</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "hired":
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">Hired</span>;
      case "rejected":
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-200">Rejected</span>;
      case "interview":
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">Interview</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">Applied</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={4000}
        position="bottom-end"
      />

      {/* Header Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center text-xl shadow-xs">
              <FaUserCheck />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                Job Eligibility & Applicant Analysis
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Evaluate student eligibility matrix and track application progress per drive.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
          </div>
        ) : reportData.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <FaInfoCircle className="text-4xl mx-auto mb-3 text-amber-500/60" />
            <p className="text-base font-semibold text-stone-700">No active job postings found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selector */}
            <div className="max-w-md space-y-1.5">
              <label htmlFor="job-selector" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Select Active Job Posting
              </label>
              <select
                id="job-selector"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer font-semibold"
              >
                {reportData.map((job) => (
                  <option key={job.jobId} value={job.jobId}>
                    {job.companyName} — {job.jobTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Job Metadata Box */}
            {selectedJob && (
              <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-6 border border-stone-800 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Job Title
                  </span>
                  <span className="text-sm font-bold text-white">{selectedJob.jobTitle}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Company & Tier
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{selectedJob.companyName}</span>
                    {getCategoryBadge(selectedJob.companyCategory)}
                  </div>
                </div>
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Requirements
                  </span>
                  <span className="text-stone-300 block">Min CGPA: <strong className="text-white">{selectedJob.minCG || "0"}</strong></span>
                  <span className="text-stone-300 block">Backlogs: <strong className="text-white">{selectedJob.noBacklog ? "Zero allowed" : "Permitted"}</strong></span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Scope
                  </span>
                  <span className="text-stone-300 block truncate" title={selectedJob.eligibleBranches?.join(", ")}>
                    Branches: <strong className="text-white">{selectedJob.eligibleBranches?.length > 0 ? selectedJob.eligibleBranches.join(", ") : "All"}</strong>
                  </span>
                  <span className="text-stone-300 block" title={selectedJob.eligibleBatches?.join(", ")}>
                    Batches: <strong className="text-white">{selectedJob.eligibleBatches?.length > 0 ? selectedJob.eligibleBatches.join(", ") : "All"}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="bg-white border border-stone-200/80 rounded-3xl shadow-xs overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200 bg-stone-50/75 p-2 gap-2">
            <button
              onClick={() => setActiveTab("eligible")}
              className={`flex-1 py-3.5 px-6 rounded-2xl text-center font-bold text-xs transition-all flex justify-center items-center gap-2 cursor-pointer ${
                activeTab === "eligible"
                  ? "bg-stone-900 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <FaUserCheck className={activeTab === "eligible" ? "text-amber-400" : "text-stone-400"} />
              Eligible Students ({selectedJob.eligibleStudents?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("applied")}
              className={`flex-1 py-3.5 px-6 rounded-2xl text-center font-bold text-xs transition-all flex justify-center items-center gap-2 cursor-pointer ${
                activeTab === "applied"
                  ? "bg-stone-900 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <FaUserFriends className={activeTab === "applied" ? "text-amber-400" : "text-stone-400"} />
              Applied Students ({selectedJob.appliedStudents?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            {activeTab === "eligible" ? (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="relative w-full sm:max-w-xs">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search eligible students..."
                      value={searchEligible}
                      onChange={(e) => setSearchEligible(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div className="text-xs font-semibold text-stone-500">
                    Showing <strong className="text-stone-900">{filteredEligible.length}</strong> of {selectedJob.eligibleStudents?.length || 0} students
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200/80">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                        <th className="py-3.5 px-4 w-12 text-center">Sr. No.</th>
                        <th className="py-3.5 px-4">Roll Number</th>
                        <th className="py-3.5 px-4">Student Name</th>
                        <th className="py-3.5 px-4">Branch</th>
                        <th className="py-3.5 px-4 text-center">CGPA</th>
                        <th className="py-3.5 px-4 text-center">Backlogs</th>
                        <th className="py-3.5 px-4 text-center">NOC</th>
                        <th className="py-3.5 px-4">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                      {filteredEligible.length > 0 ? (
                        filteredEligible.map((student, index) => (
                          <tr key={student._id} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-3.5 px-4 text-center font-medium text-stone-500">{index + 1}</td>
                            <td className="py-3.5 px-4 font-mono font-medium text-stone-800">{student.rollNumber || "N/A"}</td>
                            <td className="py-3.5 px-4 font-bold text-stone-900">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-stone-700">{student.department || "N/A"}</td>
                            <td className="py-3.5 px-4 text-center font-bold text-stone-900">
                              {student.cgpa !== undefined ? student.cgpa.toFixed(2) : "0.00"}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold">
                              <span className={student.liveKT > 0 ? "text-rose-600" : "text-emerald-600"}>
                                {student.liveKT || 0}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {student.hasNOC ? (
                                <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full text-[11px] font-bold">Yes</span>
                              ) : (
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">No</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <a href={`mailto:${student.email}`} className="text-amber-700 hover:underline font-medium">
                                {student.email}
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="py-12 text-center text-stone-400 font-medium">
                            No eligible students matching the current search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="relative w-full sm:max-w-xs">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search applied students..."
                      value={searchApplied}
                      onChange={(e) => setSearchApplied(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div className="text-xs font-semibold text-stone-500">
                    Showing <strong className="text-stone-900">{filteredApplied.length}</strong> of {selectedJob.appliedStudents?.length || 0} students
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200/80">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                        <th className="py-3.5 px-4 w-12 text-center">Sr. No.</th>
                        <th className="py-3.5 px-4">Roll Number</th>
                        <th className="py-3.5 px-4">Student Name</th>
                        <th className="py-3.5 px-4">Branch</th>
                        <th className="py-3.5 px-4 text-center">CGPA</th>
                        <th className="py-3.5 px-4">Applied Date</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4">Current Round</th>
                        <th className="py-3.5 px-4 text-center">Round Status</th>
                        <th className="py-3.5 px-4">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                      {filteredApplied.length > 0 ? (
                        filteredApplied.map((student, index) => (
                          <tr key={student._id} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-3.5 px-4 text-center font-medium text-stone-500">{index + 1}</td>
                            <td className="py-3.5 px-4 font-mono font-medium text-stone-800">{student.rollNumber || "N/A"}</td>
                            <td className="py-3.5 px-4 font-bold text-stone-900">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-stone-700">{student.department || "N/A"}</td>
                            <td className="py-3.5 px-4 text-center font-bold text-stone-900">
                              {student.cgpa !== undefined ? student.cgpa.toFixed(2) : "0.00"}
                            </td>
                            <td className="py-3.5 px-4 text-stone-500 font-medium">
                              {student.appliedAt ? new Date(student.appliedAt).toLocaleDateString("en-IN") : "N/A"}
                            </td>
                            <td className="py-3.5 px-4 text-center">{getStatusBadge(student.status)}</td>
                            <td className="py-3.5 px-4 font-medium text-stone-800">{student.currentRound || "N/A"}</td>
                            <td className="py-3.5 px-4 text-center">
                              {student.roundStatus ? (
                                <span className={`capitalize text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                  student.roundStatus === "passed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : student.roundStatus === "failed"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-stone-100 text-stone-700 border-stone-200"
                                }`}>
                                  {student.roundStatus}
                                </span>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <a href={`mailto:${student.email}`} className="text-amber-700 hover:underline font-medium">
                                {student.email}
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="py-12 text-center text-stone-400 font-medium">
                            No applied students matching the current search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobEligibilityReport;
