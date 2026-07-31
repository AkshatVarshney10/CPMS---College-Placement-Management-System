import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  FaCloudUploadAlt, FaFileDownload, FaEnvelopeOpenText,
  FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTrashAlt
} from 'react-icons/fa';
import Toast from '../Toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const MassStudentUpload = () => {
  document.title = 'CPMS | Mass Student Upload';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/student-mass-upload-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const downloadResultExcel = (records, filename) => {
    if (!records || records.length === 0) return;
    const formatted = records.map(r => ({
      "Sr. No.": r.srNo,
      "Email Address": r.email,
      "Name of Student": r.name,
      "Status": r.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, filename || "mass_upload_result.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parsedStudents = jsonData.map((row, index) => {
          const srNoKey = Object.keys(row).find(k => k.toLowerCase().replace(/[\s\.]/g, '') === 'srno');
          const srNo = srNoKey ? row[srNoKey] : index + 1;

          const emailKey = Object.keys(row).find(k => k.toLowerCase() === 'email');
          const email = emailKey ? String(row[emailKey]).trim() : '';

          const nameKey = Object.keys(row).find(k => k.toLowerCase() === 'nameofstudent' || k.toLowerCase().replace(/\s/g, '') === 'nameofstudent' || k.toLowerCase() === 'name');
          const name = nameKey ? String(row[nameKey]).trim() : '';

          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

          return {
            id: index + 1,
            srNo,
            email,
            name,
            isValid: isValidEmail && email.length > 0
          };
        });

        setStudents(parsedStudents);
        setSuccessResponse(null);
        setErrorMsg('');
        setToastMessage(`Parsed ${parsedStudents.length} rows successfully!`);
        setShowToast(true);
      } catch (err) {
        console.error("Error reading file:", err);
        setErrorMsg("Failed to parse the file. Please ensure it is a valid Excel or CSV sheet.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleRemoveRow = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const downloadSampleTemplate = () => {
    const sampleData = [
      {
        "Sr. No.": 1,
        "email": "anushka.sen@example.com",
        "name of student": "Anushka Sen"
      },
      {
        "Sr. No.": 2,
        "email": "rahul.sharma@example.com",
        "name of student": "Rahul Sharma"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students Onboarding");
    XLSX.writeFile(workbook, "cpms_student_upload_template.xlsx");
  };

  const handleSubmit = async () => {
    const invalidCount = students.filter(s => !s.isValid).length;
    if (invalidCount > 0) {
      setErrorMsg("Please fix or remove records with invalid emails before submitting.");
      return;
    }

    if (students.length === 0) {
      setErrorMsg("Please upload a spreadsheet with student email records.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessResponse(null);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/admin/student-mass-upload`, 
        { studentsList: students },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccessResponse(response.data);
      setStudents([]);
      setToastMessage("Mass onboarding complete! Credentials dispatched.");
      setShowToast(true);
      fetchHistory();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.msg || "Server error while processing list.");
    } finally {
      setLoading(false);
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

      {/* Hero Title Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 p-8 sm:p-10 border border-stone-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-700" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaEnvelopeOpenText className="text-xs" /> Automated Onboarding Engine
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Mass Student Onboarding</h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl">
            Pre-register batch students and automatically dispatch login credentials using a `.xlsx` or `.csv` spreadsheet.
          </p>
        </div>
        <button
          onClick={downloadSampleTemplate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all cursor-pointer text-xs sm:text-sm shrink-0"
        >
          <FaFileDownload />
          <span>Download Excel Template</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 text-xs">
          <FaTimesCircle className="text-base mt-0.5 shrink-0 text-rose-600" />
          <div>
            <p className="font-bold">Verification Notice</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Success Summary Banner */}
      {successResponse && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-2xl text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-base sm:text-lg">Mass Onboarding Completed Successfully</h4>
              <p className="text-xs text-emerald-700 mt-0.5">{successResponse.msg}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center">
              <span className="text-3xl font-extrabold text-emerald-600">{successResponse.createdCount}</span>
              <p className="text-[11px] text-stone-500 font-bold uppercase tracking-wider mt-1">Emailed & Registered</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center">
              <span className="text-3xl font-extrabold text-amber-600">{successResponse.existingCount}</span>
              <p className="text-[11px] text-stone-500 font-bold uppercase tracking-wider mt-1">Skipped (Existed)</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center">
              <span className="text-3xl font-extrabold text-rose-600">{successResponse.errorCount}</span>
              <p className="text-[11px] text-stone-500 font-bold uppercase tracking-wider mt-1">System Errors</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => downloadResultExcel(successResponse.records, "recent_mass_upload_result.xlsx")}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md text-xs transition-all cursor-pointer"
            >
              <FaFileDownload />
              <span>Download Full Results Excel</span>
            </button>
          </div>
        </div>
      )}

      {/* File Drag & Drop Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200/60 shadow-xs group-hover:scale-110 transition-transform">
          <FaCloudUploadAlt className="text-3xl animate-bounce" />
        </div>

        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Upload Student Spreadsheet
          </h4>
          <p className="text-xs text-stone-500 max-w-md leading-relaxed">
            Drag & drop or select your `.xlsx` or `.csv` onboarding file. Credentials will be generated and dispatched immediately upon processing.
          </p>
        </div>

        <label className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-amber-600/20 hover:shadow-lg transition-all">
          Choose Spreadsheet File
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Parsed Spreadsheet Preview Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-stone-200/80 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-base font-bold text-stone-900 tracking-tight">Parsed Spreadsheet Preview</h4>
              <p className="text-xs text-stone-500 mt-0.5">Verify parsed entries before triggering mass account creation</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Dispatching Credentials...</span>
                </>
              ) : (
                <>
                  <FaEnvelopeOpenText />
                  <span>Onboard & Dispatch Credentials ({students.length})</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                  <th className="py-3.5 px-4 w-16 text-center">Sr. No.</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Name of Student</th>
                  <th className="py-3.5 px-4 text-center w-28">Status</th>
                  <th className="py-3.5 px-4 text-center w-20">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-stone-500">{student.srNo}</td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className={student.isValid ? 'text-stone-900' : 'text-rose-600 line-through'}>
                        {student.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800">{student.name || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-center">
                      {student.isValid ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                          Valid
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1">
                          <FaInfoCircle className="text-xs" /> Invalid Email
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleRemoveRow(student.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Remove record"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload History Table */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-stone-200/80 bg-stone-50/50 flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-stone-900 tracking-tight">Past Uploads History</h4>
              <p className="text-xs text-stone-500 mt-0.5">Log of previously processed mass onboarding spreadsheets</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                  <th className="py-3.5 px-4">Upload Date & Time</th>
                  <th className="py-3.5 px-4 text-center">Total Records</th>
                  <th className="py-3.5 px-4 text-center">Sent</th>
                  <th className="py-3.5 px-4 text-center">Exists</th>
                  <th className="py-3.5 px-4 text-center">Failed</th>
                  <th className="py-3.5 px-4 text-center w-24">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                {history.map((record) => (
                  <tr key={record._id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {new Date(record.uploadDate).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-stone-800">{record.totalRecords}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{record.successful}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-600">{record.existing}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-rose-600">{record.failed}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => downloadResultExcel(record.records, `mass_upload_${new Date(record.uploadDate).toISOString().slice(0,10)}.xlsx`)}
                        className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-lg transition-all cursor-pointer shadow-xs"
                        title="Download Results Excel"
                      >
                        <FaFileDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassStudentUpload;
