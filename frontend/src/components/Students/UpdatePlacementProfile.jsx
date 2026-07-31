import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaGraduationCap, 
  FaBookOpen, FaAward, FaFilePdf, FaSave, FaExclamationTriangle,
  FaCheckCircle, FaCheck, FaExclamationCircle
} from 'react-icons/fa';
import Toast from '../Toast';
import UploadResume from './UploadResume';
import SkeletonLoader from '../SkeletonLoader';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function UpdatePlacementProfile() {
  document.title = 'CPMS | Placement Profile';

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cgpa, setCgpa] = useState(0);

  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      setToastMessage("Failed to load user profile");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  useEffect(() => {
    if (userData?.studentProfile?.SGPA) {
      calcCGPA();
    }
  }, [userData]);

  const handleDataChangeForSGPA = (e) => {
    setUserData(prev => ({
      ...prev,
      studentProfile: {
        ...prev?.studentProfile,
        SGPA: {
          ...prev?.studentProfile?.SGPA,
          [e.target.name]: e.target.value
        }
      }
    }));
  };

  const calcCGPA = () => {
    let sum = 0, sem = 0;
    const sgpa = userData?.studentProfile?.SGPA || {};
    ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'].forEach(s => {
      const val = Number(sgpa[s]);
      if (val && val > 0) {
        sum += val;
        sem += 1;
      }
    });
    const calculated = sem > 0 ? (sum / sem).toFixed(2) : 0;
    setCgpa(calculated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const updatedUserData = {
        ...userData,
        studentProfile: {
          ...userData?.studentProfile,
          cgpa: parseFloat(cgpa) || 0
        }
      };

      const response = await axios.post(`${BASE_URL}/user/update-profile`,
        updatedUserData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);
      } else {
        setToastMessage("Profile updated successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setToastMessage(error.response?.data?.msg || "Failed to update profile");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  const studentProfile = userData?.studentProfile || {};

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* Header Title Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaUser className="text-xs" /> Placement Profile Ledger
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Student Placement Profile</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Keep your academic performance, semester SGPA, past qualifications, and resume updated for drive eligibility checks.
          </p>
        </div>
        {cgpa > 0 && (
          <div className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/20 text-center shrink-0">
            <span className="block text-2xl font-black text-white">{cgpa}</span>
            <span className="text-[11px] text-amber-100 font-bold uppercase tracking-wider">Calculated CGPA</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Student Profile Card & Resume Upload */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
              <FaUser />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Section 1: Student Profile & Resume</h3>
              <p className="text-xs text-slate-500">Personal details and resume document management</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Info Card */}
            <div className="lg:col-span-2 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-200/60 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-extrabold text-xl overflow-hidden border-2 border-amber-500">
                  {userData?.profile ? (
                    <img src={userData.profile} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{userData?.first_name?.charAt(0) || 'S'}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">
                    {userData?.first_name} {userData?.middle_name || ''} {userData?.last_name}
                  </h4>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {studentProfile.uin ? `UIN: ${studentProfile.uin}` : 'Student Account'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60">
                  <FaEnvelope className="text-amber-500 text-base" />
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Email Address</span>
                    <span className="font-bold text-slate-900">{userData?.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60">
                  <FaPhone className="text-amber-500 text-base" />
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Contact Number</span>
                    <span className="font-bold text-slate-900">{userData?.number || 'N/A'}</span>
                  </div>
                </div>

                {studentProfile.uin && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60 sm:col-span-2">
                    <FaIdCard className="text-amber-500 text-base" />
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">University Identification Number (UIN)</span>
                      <span className="font-mono font-bold text-slate-900">{studentProfile.uin}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Upload Box */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Resume Document</h4>
                <p className="text-xs text-slate-500">Upload your latest PDF/DOC resume for TPO evaluation</p>
              </div>

              <UploadResume fetchCurrentUserData={fetchCurrentUserData} />

              {studentProfile.resume && studentProfile.resume !== "undefined" && (
                <div className="pt-2 border-t border-slate-200/60">
                  <a
                    href={studentProfile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs no-underline transition-all"
                  >
                    <FaFilePdf className="text-amber-400" />
                    <span>View Current Resume</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic Information */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
              <FaGraduationCap />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Section 2: Academic Information & Semester SGPAs</h3>
              <p className="text-xs text-slate-500">Current year, graduation year, Live KT, NOC status, and semester grades</p>
            </div>
          </div>

          {/* Academic Selectors & Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Year */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Current Year</label>
              <select
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={studentProfile.year || "undefined"}
                onChange={(e) => setUserData({
                  ...userData,
                  studentProfile: { ...studentProfile, year: parseInt(e.target.value) || undefined }
                })}
              >
                <option disabled value="undefined">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Graduation Year */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Graduation Year</label>
              <select
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={studentProfile.graduationYear || "undefined"}
                onChange={(e) => setUserData({
                  ...userData,
                  studentProfile: { ...studentProfile, graduationYear: parseInt(e.target.value) || undefined }
                })}
              >
                <option disabled value="undefined">Select Year</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
              </select>
            </div>

            {/* Live KTs */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Live KT's</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={studentProfile.liveKT || 0}
                onChange={(e) => setUserData({
                  ...userData,
                  studentProfile: { ...studentProfile, liveKT: parseInt(e.target.value) || 0 }
                })}
              />
            </div>

            {/* Gap & NOC Switches */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3 flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  checked={studentProfile.gap === "true" || studentProfile.gap === true}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: { ...studentProfile, gap: e.target.checked }
                  })}
                />
                <span>Academic Gap Year</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  checked={studentProfile.hasNOC === "true" || studentProfile.hasNOC === true}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: { ...studentProfile, hasNOC: e.target.checked }
                  })}
                />
                <span>Taken NOC</span>
              </label>
            </div>
          </div>

          {studentProfile.hasNOC && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <FaExclamationTriangle className="text-rose-600 text-sm shrink-0" />
              <span>WARNING: Taking an NOC will make you ineligible to apply for placement drives.</span>
            </div>
          )}

          {/* 4x2 Semester SGPA Cards Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Semester SGPA Matrix (Sem 1 — Sem 8)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(semNum => {
                const fieldName = `sem${semNum}`;
                const val = studentProfile.SGPA?.[fieldName] || '';
                return (
                  <div key={semNum} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-1 hover:border-amber-400 transition-colors">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Semester {semNum}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="0.00"
                      name={fieldName}
                      value={val}
                      onChange={handleDataChangeForSGPA}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 3: Past Qualifications */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center text-lg">
              <FaAward />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Section 3: Past Educational Qualifications</h3>
              <p className="text-xs text-slate-500">Board details, percentages, and passing years for 10th (SSC), 12th (HSC), and Diploma</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SSC Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200/60 pb-2">SSC (10th Standard)</h4>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SSC Board</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.ssc?.board || "undefined"}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        ssc: { ...studentProfile.pastQualification?.ssc, board: e.target.value }
                      }
                    }
                  })}
                >
                  <option disabled value="undefined">Select Board</option>
                  <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">MSBSHSE</option>
                  <option value="Central Board of Secondary Education (CBSE)">CBSE</option>
                  <option value="Council for the Indian School Certificate Examinations (CISCE)">CISCE</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 85.5"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.ssc?.percentage || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        ssc: { ...studentProfile.pastQualification?.ssc, percentage: e.target.value }
                      }
                    }
                  })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Passing Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2021"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.ssc?.year || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        ssc: { ...studentProfile.pastQualification?.ssc, year: e.target.value }
                      }
                    }
                  })}
                />
              </div>
            </div>

            {/* HSC Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200/60 pb-2">HSC (12th Standard)</h4>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HSC Board</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.hsc?.board || "undefined"}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        hsc: { ...studentProfile.pastQualification?.hsc, board: e.target.value }
                      }
                    }
                  })}
                >
                  <option disabled value="undefined">Select Board</option>
                  <option value="Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)">MSBSHSE</option>
                  <option value="Central Board of Secondary Education (CBSE)">CBSE</option>
                  <option value="Council for the Indian School Certificate Examinations (CISCE)">CISCE</option>
                  <option value="NoHSC">No HSC</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 82.0"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.hsc?.percentage || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        hsc: { ...studentProfile.pastQualification?.hsc, percentage: e.target.value }
                      }
                    }
                  })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Passing Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2023"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.hsc?.year || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        hsc: { ...studentProfile.pastQualification?.hsc, year: e.target.value }
                      }
                    }
                  })}
                />
              </div>
            </div>

            {/* Diploma Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200/60 pb-2">Diploma</h4>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diploma Board / University</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.diploma?.board || "undefined"}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        diploma: { ...studentProfile.pastQualification?.diploma, board: e.target.value }
                      }
                    }
                  })}
                >
                  <option disabled value="undefined">Select Board</option>
                  <option value="Mumbai University">Mumbai University</option>
                  <option value="NoDiploma">No Diploma</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diploma CGPA / %</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 8.5"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.diploma?.percentage || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        diploma: { ...studentProfile.pastQualification?.diploma, percentage: e.target.value }
                      }
                    }
                  })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Passing Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2023"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={studentProfile.pastQualification?.diploma?.year || ''}
                  onChange={(e) => setUserData({
                    ...userData,
                    studentProfile: {
                      ...studentProfile,
                      pastQualification: {
                        ...studentProfile.pastQualification,
                        diploma: { ...studentProfile.pastQualification?.diploma, year: e.target.value }
                      }
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Submit Button */}
        <div className="flex justify-center items-center pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <FaSave className="text-base" />
            )}
            <span>{saving ? 'Saving Placement Profile...' : 'Save Placement Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePlacementProfile;
