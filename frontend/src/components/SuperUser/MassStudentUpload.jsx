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
    // Map records to match desired format
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

  // Handle spreadsheet import parsing
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

        // Normalize data key matches
        const parsedStudents = jsonData.map((row, index) => {
          const srNoKey = Object.keys(row).find(k => k.toLowerCase().replace(/[\s\.]/g, '') === 'srno');
          const srNo = srNoKey ? row[srNoKey] : index + 1;

          const emailKey = Object.keys(row).find(k => k.toLowerCase() === 'email');
          const email = emailKey ? String(row[emailKey]).trim() : '';

          const nameKey = Object.keys(row).find(k => k.toLowerCase() === 'nameofstudent' || k.toLowerCase().replace(/\s/g, '') === 'nameofstudent' || k.toLowerCase() === 'name');
          const name = nameKey ? String(row[nameKey]).trim() : '';

          // Simple email validation pattern
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
    <div className="p-4 space-y-6">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={4000}
        position="bottom-end"
      />

      {/* Title Card */}
      <div className="bg-gradient-to-r from-violet-700 via-indigo-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <FaEnvelopeOpenText className="text-2xl" />
            <span>Mass Student Onboarding</span>
          </h2>
          <p className="text-violet-100 mt-1 text-sm sm:text-base">
            Pre-register students and automatically dispatch login credentials using a spreadsheet
          </p>
        </div>
        <button
          onClick={downloadSampleTemplate}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
        >
          <FaFileDownload />
          <span>Download Excel Template</span>
        </button>
      </div>

      {/* Alert details */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
          <FaTimesCircle className="text-xl mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Verification Notice</p>
            <p className="text-sm">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Success details */}
      {successResponse && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-2xl text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-lg">Mass Onboarding Completed Successfully</h4>
              <p className="text-sm mt-0.5">{successResponse.msg}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
              <span className="text-2xl font-black text-emerald-600">{successResponse.createdCount}</span>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Emailed & Registered</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
              <span className="text-2xl font-black text-amber-600">{successResponse.existingCount}</span>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Skipped (Already Existed)</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
              <span className="text-2xl font-black text-red-600">{successResponse.errorCount}</span>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">System Errors</p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
             <button
                onClick={() => downloadResultExcel(successResponse.records, "recent_mass_upload_result.xlsx")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition text-sm"
              >
                <FaFileDownload />
                <span>Download Result Excel</span>
             </button>
          </div>
        </div>
      )}

      {/* File Upload Area */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-md flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600"></div>
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
          <FaCloudUploadAlt className="text-4xl animate-bounce" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-gray-800">Upload Spreadsheet</h4>
          <p className="text-sm text-gray-500 max-w-md">
            Drag & drop or select your `.xlsx` or `.csv` onboarding file. Credentials will be sent immediately upon processing.
          </p>
        </div>
        <label className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer shadow-md hover:shadow-indigo-500/20 transition">
          Choose File
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Data Preview Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="text-lg font-bold text-gray-800">Parsed Spreadsheet Preview</h4>
              <p className="text-xs text-gray-500 mt-0.5">Please review the parsed rows before triggering credential distribution</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Dispatching Credentials...</span>
                </>
              ) : (
                <>
                  <FaEnvelopeOpenText />
                  <span>Onboard & Send credentials ({students.length})</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold text-xs tracking-wider uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">Sr. No.</th>
                  <th scope="col" className="px-6 py-3 text-left">Email Address</th>
                  <th scope="col" className="px-6 py-3 text-left">Name of Student</th>
                  <th scope="col" className="px-6 py-3 text-center">Status</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-indigo-50/10">
                    <td className="px-6 py-4 font-bold text-gray-500">{student.srNo}</td>
                    <td className="px-6 py-4 font-semibold">
                      <span className={student.isValid ? 'text-gray-800' : 'text-red-600 line-through'}>
                        {student.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.isValid ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                          Valid
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 justify-center">
                          <FaInfoCircle /> Invalid Email
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveRow(student.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Remove row"
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

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <h4 className="text-lg font-bold text-gray-800">Past Uploads History</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold text-xs tracking-wider uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">Upload Date</th>
                  <th scope="col" className="px-6 py-3 text-center">Total Records</th>
                  <th scope="col" className="px-6 py-3 text-center">Sent</th>
                  <th scope="col" className="px-6 py-3 text-center">Exists</th>
                  <th scope="col" className="px-6 py-3 text-center">Failed</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                {history.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {new Date(record.uploadDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">{record.totalRecords}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{record.successful}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-600">{record.existing}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-600">{record.failed}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => downloadResultExcel(record.records, `mass_upload_${new Date(record.uploadDate).toISOString().slice(0,10)}.xlsx`)}
                        className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition"
                        title="Download Results"
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
