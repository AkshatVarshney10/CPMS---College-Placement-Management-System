import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFileExcel, FaChevronDown, FaChevronUp, FaTable, FaGraduationCap } from 'react-icons/fa';
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
        
        const initBatches = {};
        const initBranches = {};
        Object.keys(response.data.detailedStats || {}).forEach(batch => {
          initBatches[batch] = true; // Open batches by default for quick view
          Object.keys(response.data.detailedStats[batch]).forEach(branch => {
            initBranches[`${batch}-${branch}`] = true; // Open branches by default
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
        <div className="w-10 h-10 rounded-full border-4 border-amber-600 border-t-transparent animate-spin" />
        <p className="text-stone-500 font-medium text-xs animate-pulse">Loading Detailed Placement Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl p-8 my-4 text-center max-w-xl mx-auto space-y-4">
        <h4 className="font-bold text-lg">Error Loading Report</h4>
        <p className="text-xs">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
        >
          Retry
        </button>
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

      {/* Hero Title Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 p-8 sm:p-10 border border-stone-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-700" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaTable className="text-xs" /> Detailed Student-Level Ledger
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Detailed Placement Tracker</h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl">
            Granular batch & branch-wise placement audit records with company offers and CTC details.
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all cursor-pointer text-xs sm:text-sm shrink-0"
        >
          <FaFileExcel className="text-sm" />
          <span>Export Excel Report</span>
        </button>
      </div>

      {Object.keys(stats).length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 p-12 text-center text-stone-400 font-medium">
          No detailed placement records found.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(stats).sort((a,b) => b.localeCompare(a)).map(batch => (
            <div key={batch} className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              {/* Batch Accordion Header */}
              <div 
                className="bg-stone-900 text-white p-5 sm:p-6 flex justify-between items-center cursor-pointer hover:bg-stone-850 transition-colors border-b border-stone-800"
                onClick={() => toggleBatch(batch)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-base">
                    <FaGraduationCap />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{batch} Cohort</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 text-xs">
                  {expandedBatches[batch] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {/* Branches within Batch */}
              {expandedBatches[batch] && (
                <div className="p-6 space-y-6">
                  {Object.keys(stats[batch]).sort().map(branch => {
                    const isBranchExpanded = expandedBranches[`${batch}-${branch}`];
                    return (
                      <div key={branch} className="border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs">
                        {/* Branch Sub-Header */}
                        <div 
                          className="bg-stone-50 p-4 flex justify-between items-center cursor-pointer hover:bg-amber-50/50 transition-colors"
                          onClick={() => toggleBranch(batch, branch)}
                        >
                          <h4 className="text-sm font-bold text-stone-900 tracking-tight">{branch} Department</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-3 py-0.5 rounded-full">
                              {stats[batch][branch].length} Students Record
                            </span>
                            <div className="text-stone-400 text-xs">
                              {isBranchExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                        </div>

                        {/* Branch Table */}
                        {isBranchExpanded && (
                          <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                                  <th className="py-3 px-4 w-24">Roll No.</th>
                                  <th className="py-3 px-4">Student Name</th>
                                  <th className="py-3 px-4 text-center">Remark</th>
                                  <th className="py-3 px-4">Company</th>
                                  <th className="py-3 px-4 text-center">Package (LPA)</th>
                                  <th className="py-3 px-4 text-center">Stipend (INR/mo)</th>
                                  <th className="py-3 px-4">Designation</th>
                                  <th className="py-3 px-4 text-center">Campus</th>
                                  <th className="py-3 px-4 text-center">Multiple?</th>
                                  <th className="py-3 px-4">2nd Company</th>
                                  <th className="py-3 px-4 text-center">2nd Package</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                                {stats[batch][branch].map((student, idx) => (
                                  <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                                    <td className="py-3 px-4 font-mono font-medium text-stone-900">
                                      {student.rollNumber}
                                    </td>
                                    <td className="py-3 px-4 font-bold text-stone-900">
                                      {student.studentName}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                                        student.remark === 'Placed' 
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                          : 'bg-rose-100 text-rose-800 border-rose-200'
                                      }`}>
                                        {student.remark}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-stone-800">{student.company || '—'}</td>
                                    <td className="py-3 px-4 text-center font-extrabold text-emerald-700">
                                      {student.packageLPA ? `${student.packageLPA} LPA` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-center font-bold text-purple-700">
                                      {student.monthlyStipend ? `₹${student.monthlyStipend}` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-stone-600 font-medium">{student.designation || '—'}</td>
                                    <td className="py-3 px-4 text-center font-medium text-stone-600">{student.campusType || '—'}</td>
                                    <td className="py-3 px-4 text-center">
                                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${
                                        student.multipleOffers === 'Yes' 
                                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                                          : 'bg-stone-100 text-stone-600 border-stone-200'
                                      }`}>
                                        {student.multipleOffers || 'No'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-stone-500 font-medium">{student.secondCompany || '—'}</td>
                                    <td className="py-3 px-4 text-center font-bold text-emerald-700/80">{student.secondPackageLPA ? `${student.secondPackageLPA} LPA` : '—'}</td>
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
