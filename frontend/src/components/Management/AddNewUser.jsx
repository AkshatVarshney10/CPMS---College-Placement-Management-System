import { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { useLocation } from 'react-router-dom';
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaKey } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AddNewUser() {
  useEffect(() => {
    document.title = 'CPMS | Add new user';
  }, []);

  const location = useLocation();
  // filter management or tpo or student to add
  const userToAdd = location.pathname
    .split('/')
    .filter(link => link !== '' && link !== 'admin' && link !== 'management')[0]
    .split('-')
    .filter(link => link !== 'add' && link !== 'admin')[0];

  const getFormTitle = () => {
    if (userToAdd === 'management') return 'Create New Management Admin';
    if (userToAdd === 'tpo') return 'Create New TPO Admin';
    if (userToAdd === 'student') return 'Create New Student';
    return `Create New ${userToAdd}`;
  };

  const [data, setData] = useState({
    first_name: "",
    email: "",
    number: ""
  });

  const [error, setError] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const handleDataChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleModalSubmit = (e) => {
    e.preventDefault();

    let newError = {};
    if (!data?.first_name) newError.first_name = 'Name is required';
    if (!data?.email) newError.email = 'Email is required';
    if (!data?.number) newError.number = 'Phone number is required';

    if (Object.keys(newError).length > 0) return setError(newError);

    setShowModal(true);
  };

  const handleSubmitManagement = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/add-management`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response?.data) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        setData({ first_name: "", email: "", number: "" });
      }
    } catch (error) {
      console.log("handleSubmit => AddManagement.jsx ==> ", error);
    }
    setShowModal(false);
  };

  const handleSubmitTPO = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/addtpo`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response?.data) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        setData({ first_name: "", email: "", number: "" });
      }
    } catch (error) {
      console.log("handleSubmit => AddTPO.jsx ==> ", error);
    }
    setShowModal(false);
  };

  const handleSubmitStudent = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/add-student`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response?.data) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
        setData({ first_name: "", email: "", number: "" });
      }
    } catch (error) {
      console.log("handleSubmit => AddStudent.jsx ==> ", error);
    }
    setShowModal(false);
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="top-center"
      />

      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-stone-900 text-white p-6 sm:p-8 border-b border-stone-800 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-700" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                <FaUserPlus />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">{getFormTitle()}</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Enter details to register new user and dispatch login credentials automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleModalSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Enter user's full name"
                    name="first_name"
                    value={data.first_name || ''}
                    onChange={handleDataChange}
                    className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                {error?.first_name && (
                  <p className="text-xs text-red-500 font-medium mt-1">{error.first_name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    name="email"
                    value={data.email || ''}
                    onChange={handleDataChange}
                    className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                {error?.email && (
                  <p className="text-xs text-red-500 font-medium mt-1">{error.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Phone Number <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
                  <input
                    type="number"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    name="number"
                    value={data.number || ''}
                    onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                    onChange={handleDataChange}
                    className="w-full pl-9 pr-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                {error?.number && (
                  <p className="text-xs text-red-500 font-medium mt-1">{error.number}</p>
                )}
              </div>
            </div>

            {/* Note alert */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
              <FaKey className="text-amber-600 text-base mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">System Notice: </span>
                A secure password will be automatically generated and emailed to the registered address upon account creation.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FaUserPlus className="text-sm" />
              <span>Create Account</span>
            </button>
          </form>
        </div>
      </div>

      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirm Account Creation"}
        body={`Do you want to create new ${userToAdd} account and dispatch login credentials to ${data?.email}?`}
        btn={"Create User"}
        confirmAction={
          userToAdd === 'management'
            ? handleSubmitManagement
            : userToAdd === 'tpo'
              ? handleSubmitTPO
              : userToAdd === 'student'
                ? handleSubmitStudent
                : () => {}
        }
      />
    </>
  );
}

export default AddNewUser;
