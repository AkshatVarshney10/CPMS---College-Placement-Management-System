import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaGraduationCap,
  FaBriefcase,
  FaBuilding,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
} from 'react-icons/fa';
import Toast from '../components/Toast';
import isAuthenticated from '../utility/auth.utility';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function LoginPage({ initialRole: propRole }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine initial role from prop, query parameter, location state, or pathname
  const getInitialRole = () => {
    if (propRole) return propRole;
    const queryRole = searchParams.get('role');
    if (queryRole) {
      if (queryRole === 'tpo' || queryRole === 'cdc') return 'cdc';
      if (queryRole === 'admin' || queryRole === 'superuser') return 'superuser';
      if (queryRole === 'management') return 'management';
      if (queryRole === 'student') return 'student';
      return queryRole;
    }
    if (location.state?.role) {
      const stateRole = location.state.role;
      if (stateRole === 'tpo' || stateRole === 'cdc') return 'cdc';
      if (stateRole === 'admin' || stateRole === 'superuser') return 'superuser';
      if (stateRole === 'management') return 'management';
      if (stateRole === 'student') return 'student';
      return stateRole;
    }
    if (location.pathname.includes('/student/')) return 'student';
    if (location.pathname.includes('/tpo/')) return 'cdc';
    if (location.pathname.includes('/management/')) return 'management';
    if (location.pathname.includes('/admin')) return 'superuser';
    return 'student';
  };

  const [selectedRole, setSelectedRole] = useState(getInitialRole());

  useEffect(() => {
    const roleFromUrl = getInitialRole();
    if (roleFromUrl) {
      setSelectedRole(roleFromUrl);
    }
  }, [searchParams, location]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.title = 'CPMS | Login';
    if (isAuthenticated()) {
      // Redirect authenticated user based on existing token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          if (location.pathname.includes('/student')) navigate('/student/dashboard');
          else if (location.pathname.includes('/tpo')) navigate('/tpo/dashboard');
          else if (location.pathname.includes('/management')) navigate('/management/dashboard');
          else if (location.pathname.includes('/admin')) navigate('/admin/dashboard');
        } catch {
          // ignore error
        }
      }
    }

    // Prefill remembered email if stored
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrors({});
  };

  const handleForgotPassword = () => {
    setToastMessage('Please contact your system administrator or CDC office to reset your password.');
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email Address Required!';
    if (!formData.password) newErrors.password = 'Password Required!';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Save or clear remembered email
    if (rememberMe) {
      localStorage.setItem('savedEmail', formData.email.trim());
    } else {
      localStorage.removeItem('savedEmail');
    }

    let endpoint = '';
    let redirectPath = '';

    switch (selectedRole) {
      case 'student':
        endpoint = `${BASE_URL}/student/login`;
        redirectPath = '/student/dashboard';
        break;
      case 'cdc':
        endpoint = `${BASE_URL}/tpo/login`;
        redirectPath = '/tpo/dashboard';
        break;
      case 'management':
        endpoint = `${BASE_URL}/management/login`;
        redirectPath = '/management/dashboard';
        break;
      case 'superuser':
        endpoint = `${BASE_URL}/admin/login`;
        redirectPath = '/admin/dashboard';
        break;
      default:
        endpoint = `${BASE_URL}/student/login`;
        redirectPath = '/student/dashboard';
    }

    try {
      const response = await axios.post(endpoint, {
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        navigate(redirectPath);
      }
    } catch (error) {
      const msg = error?.response?.data?.msg || error?.message || 'Login failed. Please check your credentials.';
      setToastMessage(msg);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const rolesConfig = [
    { id: 'student', label: 'Student', subtitle: 'Student Access', icon: FaGraduationCap },
    { id: 'cdc', label: 'CDC', subtitle: 'Placement Cell', icon: FaBriefcase },
    { id: 'management', label: 'Management', subtitle: 'Executive Access', icon: FaBuilding },
    { id: 'superuser', label: 'Super Admin', subtitle: 'System Control', icon: FaUserShield },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-50 via-amber-50/50 via-orange-50/40 to-amber-100/60 flex flex-col items-center justify-center p-4 sm:p-6 relative font-sans text-stone-900 overflow-hidden">
      {/* Toast popup */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          duration={4000}
        />
      )}

      {/* Soft decorative background glow spots & radial patterns */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-300/25 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-200/15 blur-[160px] rounded-full pointer-events-none" />

      {/* Back to Home Button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-stone-700 hover:text-stone-900 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-stone-200/90 text-xs sm:text-sm font-semibold transition-all duration-200 hover:-translate-x-1 cursor-pointer shadow-sm hover:shadow-md z-20"
      >
        <FaArrowLeft className="text-xs text-amber-700" />
        <span>Back to Home</span>
      </button>

      {/* Main Login Card with high contrast and soft shadow */}
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl p-7 sm:p-10 shadow-2xl shadow-amber-950/10 flex flex-col items-center my-8 border border-stone-200/80 relative z-10">
        {/* Top Circular Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-600/30 mb-4">
          <FaGraduationCap />
        </div>

        {/* Header Titles */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-1 text-center tracking-tight">
          Please Log In
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mb-6 text-center font-medium">
          IIIT Placement Management System
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          {/* Role Selector Section */}
          <div className="w-full mb-6">
            <label className="block text-xs font-bold text-stone-700 text-left mb-2.5 uppercase tracking-wider">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3 w-full">
              {rolesConfig.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`relative group flex items-center gap-3 p-3.5 rounded-2xl text-left font-semibold transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-600 via-amber-650 to-amber-700 text-white border-transparent shadow-lg shadow-amber-600/30 scale-[1.02]'
                        : 'bg-white/90 text-stone-700 border-stone-200/90 hover:bg-white hover:border-amber-400/80 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100/80 text-amber-700 group-hover:bg-amber-600 group-hover:text-white'
                      }`}
                    >
                      <Icon />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-bold leading-snug truncate">{role.label}</span>
                      <span
                        className={`text-[10px] font-normal truncate ${
                          isSelected ? 'text-amber-100' : 'text-stone-400 group-hover:text-stone-500'
                        }`}
                      >
                        {role.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Field */}
          <div className="w-full mb-4">
            <label className="block text-xs font-bold text-stone-700 text-left mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative w-full">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`w-full bg-stone-50/60 border ${
                  errors.email ? 'border-red-500' : 'border-stone-200'
                } rounded-xl pl-11 pr-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200`}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1 text-left font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="w-full mb-4">
            <label className="block text-xs font-bold text-stone-700 text-left mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative w-full">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full bg-stone-50/60 border ${
                  errors.password ? 'border-red-500' : 'border-stone-200'
                } rounded-xl pl-11 pr-11 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm cursor-pointer p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1 text-left font-medium">{errors.password}</p>
            )}
          </div>

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between w-full text-xs text-stone-600 mb-6 px-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              Forgot Password?
            </button>
          </div>

          {/* Log In Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 via-amber-650 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Logging in...</span>
              </span>
            ) : (
              <>
                <span>Log In</span>
                <FaArrowRight className="text-xs sm:text-sm" />
              </>
            )}
          </button>
        </form>

        {/* Footer Text inside Card */}
        <p className="text-[11px] font-medium text-stone-400 mt-6 text-center">
          © IIIT Placement Management System 2026
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
