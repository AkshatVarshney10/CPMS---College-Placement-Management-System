import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFileExcel, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Toast from '../Toast';
import * as XLSX from 'xlsx';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const DetailedPlacementStats = () => {
  document.title = 'CPMS | Detailed Placement Report';

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // State for expanded accordions
  const [expandedBatches, setExpandedBatches] = useState({});
  const [expandedBranches, setExpandedBranches] = useState({});

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const pathPrefix = window.location.pathname.startsWith('/admin') ? 'admin' :
                           window.location.pathname.startsWith('/tpo') ? 'tpo' : 'management';

        const response = await axios.get(`${BASE_URL}/${pathPrefix}/detailed-placement-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setStats(response.data.detailedStats || {});
        
        // Keep all batches and branches closed by default
        const initBatches = {};
        const initBranches = {};
        Object.keys(response.data.detailedStats || {}).forEach(batch => {
          initBatches[batch] = false;
          Object.keys(response.data.detailedStats[batch]).forEach(branch => {
            initBranches[`${batch}-${branch}`] = false;
          });
        });
        setExpandedBatches(initBatches);
        setExpandedBranches(initBranches);
      } catch (err) {
        console.error('Error fetching detailed placement stats:', err);
        setError(err.response?.data?.msg || 'Failed to load detailed placement stats');
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedStats();
  }, []);

  const toggleBatch = (batch) => {
    setExpandedBatches(prev => ({ ...prev, [batch]: !prev[batch] }));
  };

  const toggleBranch = (batch, branch) => {
    const key = `${batch}-${branch}`;
    setExpandedBranches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportExcel = () => {
    try {
      // Flatten data for Excel
      const exportData = [];
      
      Object.keys(stats).sort().forEach(batch => {
        Object.keys(stats[batch]).sort().forEach(branch => {
          stats[batch][branch].forEach(student => {
            exportData.push({
              Batch: batch,
              Branch: branch,
              "Roll No.": student.rollNumber,
              "Student Name": student.studentName,
              Remark: student.remark,
              Company: student.company,
              "Package (LPA)": student.packageLPA,
              "Monthly Stipend (INR)": student.monthlyStipend,
              "Designation / Role": student.designation,
              "Campus Type": student.campusType,
              "Multiple Offers?": student.multipleOffers,
              "2nd Company": student.secondCompany,
              "2nd Package (LPA)": student.secondPackageLPA
            });
          });
        });
      });

      if (exportData.length === 0) {
        setToastMessage("No data available to export");
        setShowToast(true);
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed_Placement_Stats");
      
      // Auto-size columns loosely based on header length
      const wscols = Object.keys(exportData[0]).map(key => ({ wch: Math.max(key.length, 15) }));
      worksheet['!cols'] = wscols;

      XLSX.writeFile(workbook, `Detailed_Placement_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setToastMessage("Report exported to Excel successfully!");
      setShowToast(true);
    } catch (e) {
      console.error(e);
      setToastMessage("Failed to export report.");
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
        <p className="text-gray-600 font-medium animate-pulse">Loading Detailed Report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-4 text-center">
        <h4 className="font-semibold text-lg mb-2">Error Loading Report</h4>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-800 via-indigo-900 to-blue-950 rounded-2xl p-6 text-white shadow-xl gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Detailed Placement Tracker</h2>
          <p className="text-indigo-200 mt-1 text-sm sm:text-base">Batch & Branch-wise Placement Records</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base border-none"
        >
          <FaFileExcel className="text-lg" />
          <span>Export Excel</span>
        </button>
      </div>

      {Object.keys(stats).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
          No detailed placement records found.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(stats).sort((a,b) => b.localeCompare(a)).map(batch => (
            <div key={batch} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Batch Header */}
              <div 
                className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => toggleBatch(batch)}
              >
                <h3 className="text-xl font-bold text-gray-800">{batch}</h3>
                <div className="text-gray-500">
                  {expandedBatches[batch] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {/* Branches within Batch */}
              {expandedBatches[batch] && (
                <div className="p-4 space-y-4">
                  {Object.keys(stats[batch]).sort().map(branch => {
                    const isBranchExpanded = expandedBranches[`${batch}-${branch}`];
                    return (
                      <div key={branch} className="border border-indigo-100 rounded-lg overflow-hidden">
                        {/* Branch Header */}
                        <div 
                          className="bg-indigo-50 p-3 flex justify-between items-center cursor-pointer hover:bg-indigo-100 transition-colors"
                          onClick={() => toggleBranch(batch, branch)}
                        >
                          <h4 className="text-lg font-semibold text-indigo-900">{branch}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-200/50 px-2.5 py-1 rounded-full">
                              {stats[batch][branch].length} Students
                            </span>
                            <div className="text-indigo-500">
                              {isBranchExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>

                        {/* Branch Table */}
                        {isBranchExpanded && (
                          <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-max text-left border-collapse">
                              <thead>
                                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600 border-b border-gray-200">
                                  <th className="p-3 font-semibold whitespace-nowrap sticky left-0 bg-gray-50 z-10 border-r border-gray-200 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">Roll No.</th>
                                  <th className="p-3 font-semibold whitespace-nowrap sticky left-[80px] sm:left-[100px] bg-gray-50 z-10 border-r border-gray-200 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">Student Name</th>
                                  <th className="p-3 font-semibold whitespace-nowrap">Remark</th>
                                  <th className="p-3 font-semibold whitespace-nowrap">Company</th>
                                  <th className="p-3 font-semibold whitespace-nowrap text-center">Package (LPA)</th>
                                  <th className="p-3 font-semibold whitespace-nowrap text-center">Monthly Stipend (INR)</th>
                                  <th className="p-3 font-semibold whitespace-nowrap">Designation / Role</th>
                                  <th className="p-3 font-semibold whitespace-nowrap">Campus Type</th>
                                  <th className="p-3 font-semibold whitespace-nowrap text-center">Multiple Offers?</th>
                                  <th className="p-3 font-semibold whitespace-nowrap">2nd Company</th>
                                  <th className="p-3 font-semibold whitespace-nowrap text-center">2nd Package (LPA)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm">
                                {stats[batch][branch].map((student, idx) => (
                                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-3 font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-blue-50/30 z-10 border-r border-gray-100">
                                      {student.rollNumber}
                                    </td>
                                    <td className="p-3 font-medium text-gray-800 sticky left-[80px] sm:left-[100px] bg-white group-hover:bg-blue-50/30 z-10 border-r border-gray-100">
                                      {student.studentName}
                                    </td>
                                    <td className="p-3">
                                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${student.remark === 'Placed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                        {student.remark}
                                      </span>
                                    </td>
                                    <td className="p-3 text-gray-700">{student.company}</td>
                                    <td className="p-3 text-center font-medium text-emerald-700">{student.packageLPA}</td>
                                    <td className="p-3 text-center text-purple-700 font-medium">{student.monthlyStipend}</td>
                                    <td className="p-3 text-gray-600">{student.designation}</td>
                                    <td className="p-3 text-xs font-medium text-gray-600">{student.campusType}</td>
                                    <td className="p-3 text-center">
                                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${student.multipleOffers === 'Yes' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {student.multipleOffers}
                                      </span>
                                    </td>
                                    <td className="p-3 text-gray-500 text-xs">{student.secondCompany}</td>
                                    <td className="p-3 text-center font-medium text-emerald-600/80 text-xs">{student.secondPackageLPA}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailedPlacementStats;
