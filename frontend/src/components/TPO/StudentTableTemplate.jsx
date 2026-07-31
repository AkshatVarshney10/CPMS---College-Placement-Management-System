import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaUserGraduate, FaExternalLinkAlt, FaInbox } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const StudentTable = ({ branchName, studentData }) => {
  const [currentUser, setCurrentUser] = useState({ role: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`${BASE_URL}/user/detail`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCurrentUser({ role: res.data.role });
      })
      .catch(err => {
        console.error("StudentTable.jsx => ", err);
      });
  }, []);

  const sortedData = studentData?.slice().sort((a, b) => {
    const rollA = parseInt(a?.studentProfile?.rollNumber || 0);
    const rollB = parseInt(b?.studentProfile?.rollNumber || 0);
    return rollA - rollB;
  }) || [];

  return (
    <Accordion.Item eventKey={branchName} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <Accordion.Header className="px-4 py-2 text-sm font-bold text-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="font-extrabold text-slate-900 text-sm">{branchName} Engineering</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {sortedData.length} Students
          </span>
        </div>
      </Accordion.Header>
      <Accordion.Body className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800 sticky top-0">
                <th className="py-3.5 px-4 w-16 text-center">Roll No.</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">UIN</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4 text-center">Resume</th>
                <th className="py-3.5 px-4 text-center">No. of Internships</th>
                <th className="py-3.5 px-4 text-center">No. of Applied Jobs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-slate-700 bg-white">
              {sortedData.length > 0 ? (
                sortedData.map((student, index) => {
                  const studentLink = `/${currentUser.role === 'tpo_admin' ? 'tpo' : 'management'}/user/${student?._id}`;
                  const fullName = `${student?.first_name || ''} ${student?.middle_name || ''} ${student?.last_name || ''}`.trim();

                  return (
                    <tr key={index} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                        {student?.studentProfile?.rollNumber || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {(currentUser.role === 'tpo_admin' || currentUser.role === 'management_admin') ? (
                          <Link to={studentLink} className="text-slate-900 hover:text-amber-600 no-underline font-extrabold text-xs flex items-center gap-1.5">
                            <span>{fullName || 'Student'}</span>
                          </Link>
                        ) : (
                          <span>{fullName || 'Student'}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                        {student?.studentProfile?.UIN || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {student?.email ? (
                          <a
                            href={`mailto:${student.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-700 no-underline font-medium"
                          >
                            {student.email}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                        {student?.number || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {student?.studentProfile?.resume ? (
                          <a
                            href={student.studentProfile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 rounded-xl font-bold text-xs no-underline transition-all shadow-2xs"
                          >
                            <FaFilePdf className="text-amber-600 text-xs" />
                            <span>View Resume</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">Not Uploaded</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                          {student?.studentProfile?.internships?.length || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                          {student?.studentProfile?.appliedJobs?.length || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-10 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-base">
                        <FaInbox />
                      </div>
                      <p className="text-xs font-semibold text-slate-500">
                        No students available in this branch.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default StudentTable;