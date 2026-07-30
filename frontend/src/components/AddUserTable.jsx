import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TablePlaceholder from './TablePlaceholder';
import { FaTrash, FaCheckCircle, FaSearch, FaUserPlus, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AddUserTable({
  users,
  loading,
  handleDeleteUser,
  formOpen,
  setFormOpen,
  data,
  handleDataChange,
  handleSubmit,
  userToAdd,
  handleApproveStudent
}) {
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
      });
  }, []);

  const filteredUsers = users?.filter(user => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.toLowerCase();
    const email = (user?.email || '').toLowerCase();
    const phone = (user?.number || '').toString();
    return fullName.includes(term) || email.includes(term) || phone.includes(term);
  }) || [];

  const getUserDetailPath = (userId) => {
    if (currentUser.role === 'superuser') return `/admin/user/${userId}`;
    if (currentUser.role === 'management_admin') return `/management/user/${userId}`;
    if (currentUser.role === 'tpo_admin') return `/tpo/user/${userId}`;
    return '#';
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
      {/* Header controls: Search & User count */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            {userToAdd === 'approve-student' ? 'Pending Student Approvals' : `${userToAdd} Directory`}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {filteredUsers.length} Users
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage user details, access permissions, and account statuses.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by name, email or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <TablePlaceholder />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                <th className="py-3.5 px-4 w-16 text-center">Sr. No.</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Date of Joining</th>
                <th className="py-3.5 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user?.email || index} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-stone-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <Link
                        to={getUserDetailPath(user?._id)}
                        className="text-amber-800 hover:text-amber-900 font-semibold no-underline hover:underline transition-colors"
                      >
                        {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'N/A'}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5 no-underline transition-colors"
                      >
                        <FaEnvelope className="text-stone-400 text-xs" />
                        <span>{user.email}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">
                      <span className="inline-flex items-center gap-1.5">
                        <FaPhone className="text-stone-400 text-xs" />
                        {user.number || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="text-stone-400 text-xs" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {userToAdd === 'approve-student' ? (
                          <>
                            <button
                              onClick={() => handleApproveStudent(user.email)}
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-xs cursor-pointer"
                              title="Approve Student"
                            >
                              <FaCheckCircle className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.email)}
                              className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer"
                              title="Reject Registration"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user.email)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer"
                            title="Delete User"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaSearch className="text-3xl text-stone-300" />
                      <p className="text-sm font-medium">No matching users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AddUserTable;