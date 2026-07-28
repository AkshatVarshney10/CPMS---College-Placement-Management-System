import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Placeholder from "react-bootstrap/Placeholder";
import { FaFileExcel, FaSearch, FaUserCheck, FaUserFriends, FaInfoCircle } from "react-icons/fa";
import Toast from "../Toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function JobEligibilityReport() {
  document.title = "CPMS | Job Eligibility & Applicants";

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [searchEligible, setSearchEligible] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [activeTab, setActiveTab] = useState("eligible"); // "eligible" or "applied"

  // Toast notifications
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

  // Filters
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

  // Helper to get bootstrap badges for drive category
  const getCategoryBadge = (category) => {
    switch (category) {
      case "Dream":
        return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-purple-200">Dream</span>;
      case "Core":
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">Core</span>;
      default:
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">Generic</span>;
    }
  };

  // Helper for applied student status
  const getStatusBadge = (status) => {
    switch (status) {
      case "hired":
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-200">Hired</span>;
      case "rejected":
        return <span className="bg-rose-100 text-rose-800 text-xs font-medium px-2 py-0.5 rounded-full border border-rose-200">Rejected</span>;
      case "interview":
        return <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-200">Interview</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-200">Applied</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={4000}
        position="bottom-end"
      />

      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaUserCheck className="text-blue-600" />
          Job Eligibility & Applicant Analysis
        </h2>

        {loading ? (
          <div className="space-y-4">
            <Placeholder as="div" animation="glow">
              <Placeholder xs={6} size="lg" className="rounded mb-3" />
              <Placeholder xs={12} size="md" className="rounded mb-2" />
              <Placeholder xs={8} size="md" className="rounded" />
            </Placeholder>
          </div>
        ) : reportData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaInfoCircle className="text-4xl mx-auto mb-3 text-blue-500" />
            <p className="text-lg font-medium">No job postings found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Job Selection Dropdown */}
            <div className="max-w-md">
              <label htmlFor="job-selector" className="block text-sm font-semibold text-gray-700 mb-2">
                Select Active Job Posting
              </label>
              <Form.Select
                id="job-selector"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="form-select border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {reportData.map((job) => (
                  <option key={job.jobId} value={job.jobId}>
                    {job.companyName} - {job.jobTitle}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* Selected Job Criteria Details */}
            {selectedJob && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase block font-semibold">Job Title</span>
                  <span className="text-gray-900 font-medium">{selectedJob.jobTitle}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase block font-semibold">Company & Category</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-900 font-medium">{selectedJob.companyName}</span>
                    {getCategoryBadge(selectedJob.companyCategory)}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase block font-semibold">Enforced Requirements</span>
                  <span className="text-gray-900 font-medium block">
                    Min CGPA: <strong>{selectedJob.minCG || "0"}</strong>
                  </span>
                  <span className="text-gray-900 font-medium block">
                    Backlogs: <strong>{selectedJob.noBacklog ? "No active backlogs" : "Allowed"}</strong>
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase block font-semibold">Eligible Scope</span>
                  <span className="text-gray-900 text-xs block truncate" title={selectedJob.eligibleBranches?.join(", ")}>
                    Branches: <strong>{selectedJob.eligibleBranches?.length > 0 ? selectedJob.eligibleBranches.join(", ") : "All"}</strong>
                  </span>
                  <span className="text-gray-900 text-xs block" title={selectedJob.eligibleBatches?.join(", ")}>
                    Batches: <strong>{selectedJob.eligibleBatches?.length > 0 ? selectedJob.eligibleBatches.join(", ") : "All"}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50/75">
            <button
              onClick={() => setActiveTab("eligible")}
              className={`flex-1 py-4 px-6 text-center font-semibold text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === "eligible"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              <FaUserCheck />
              Eligible Students ({selectedJob.eligibleStudents?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("applied")}
              className={`flex-1 py-4 px-6 text-center font-semibold text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === "applied"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              <FaUserFriends />
              Applied Students ({selectedJob.appliedStudents?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "eligible" ? (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="relative w-full sm:max-w-xs">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="Search eligible students..."
                      value={searchEligible}
                      onChange={(e) => setSearchEligible(e.target.value)}
                      className="form-control pl-10 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Showing {filteredEligible.length} of {selectedJob.eligibleStudents?.length || 0} students
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table striped bordered hover className="align-middle text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th>Sr. No</th>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Active Backlogs</th>
                        <th>NOC Status</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEligible.length > 0 ? (
                        filteredEligible.map((student, index) => (
                          <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>{student.rollNumber || "N/A"}</td>
                            <td className="font-semibold text-gray-900">
                              {student.first_name} {student.last_name}
                            </td>
                            <td>{student.department || "N/A"}</td>
                            <td>{student.cgpa !== undefined ? student.cgpa.toFixed(2) : "0.00"}</td>
                            <td>
                              <span className={student.liveKT > 0 ? "text-red-600 font-bold" : "text-green-600"}>
                                {student.liveKT || 0}
                              </span>
                            </td>
                            <td>
                              {student.hasNOC ? (
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded border border-red-200">Yes</span>
                              ) : (
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded border border-green-200">No</span>
                              )}
                            </td>
                            <td>
                              <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                                {student.email}
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-6 text-gray-500">
                            No eligible students found matching the filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="relative w-full sm:max-w-xs">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="Search applied students..."
                      value={searchApplied}
                      onChange={(e) => setSearchApplied(e.target.value)}
                      className="form-control pl-10 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Showing {filteredApplied.length} of {selectedJob.appliedStudents?.length || 0} students
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table striped bordered hover className="align-middle text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th>Sr. No</th>
                        <th>Roll Number</th>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Applied Date</th>
                        <th>Selection Status</th>
                        <th>Current Round</th>
                        <th>Round Status</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplied.length > 0 ? (
                        filteredApplied.map((student, index) => (
                          <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>{student.rollNumber || "N/A"}</td>
                            <td className="font-semibold text-gray-900">
                              {student.first_name} {student.last_name}
                            </td>
                            <td>{student.department || "N/A"}</td>
                            <td>{student.cgpa !== undefined ? student.cgpa.toFixed(2) : "0.00"}</td>
                            <td>{student.appliedAt ? new Date(student.appliedAt).toLocaleDateString("en-IN") : "N/A"}</td>
                            <td>{getStatusBadge(student.status)}</td>
                            <td>{student.currentRound || "N/A"}</td>
                            <td>
                              {student.roundStatus ? (
                                <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded border ${
                                  student.roundStatus === "passed"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : student.roundStatus === "failed"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}>
                                  {student.roundStatus}
                                </span>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td>
                              <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                                {student.email}
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center py-6 text-gray-500">
                            No applied students found matching the filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
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
