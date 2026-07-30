import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UploadResume = ({ fetchCurrentUserData }) => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: '', role: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${BASE_URL}/user/detail`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCurrentUser({ id: res.data.id, role: res.data.role });
      })
      .catch(err => {
        console.error("UploadResume.jsx => ", err);
      });
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadStatus('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading resume...');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', currentUser.id);

    try {
      await axios.post(`${BASE_URL}/student/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (fetchCurrentUserData) fetchCurrentUserData();
      setUploadStatus('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading the resume:', error);
      setUploadStatus('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="relative border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group text-center space-y-2">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
          {uploading ? (
            <div className="w-6 h-6 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
          ) : (
            <FaCloudUploadAlt />
          )}
        </div>
        <div>
          <span className="font-bold text-slate-900 text-sm block">Click or Drag & Drop Resume</span>
          <span className="text-xs text-slate-500">Supports PDF, DOC, DOCX (Max 5MB)</span>
        </div>
      </label>

      {uploadStatus && (
        <div className={`mt-3 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
          uploadStatus.includes('success') 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
            : uploadStatus.includes('Failed') || uploadStatus.includes('Error')
            ? 'bg-rose-100 text-rose-800 border border-rose-200'
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        }`}>
          {uploadStatus.includes('success') ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{uploadStatus}</span>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
