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

  // Determine initial role from prop, query parameter, or default to 'student'
  const getInitialRole = () => {
    if (propRole) return propRole;
    const queryRole = searchParams.get('role');
    if (queryRole) {
      if (queryRole === 'tpo') return 'cdc';
      if (queryRole === 'admin') return 'superuser';
      return queryRole;
    }
    if (location.pathname.includes('/student/')) return 'student';
    if (location.pathname.includes('/tpo/')) return 'cdc';
    if (location.pathname.includes('/management/')) return 'management';
    if (location.pathname.includes('/admin')) return 'superuser';
    return 'student';
  };

  const [selectedRole, setSelectedRole] = useState(getInitialRole());
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
          const payload = JSON.parse(atob(token.split('.')[1]));
          // Handle dashboard redirection
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
    { id: 'student', label: 'Student', icon: FaGraduationCap },
    { id: 'cdc', label: 'CDC', icon: FaBriefcase },
    { id: 'management', label: 'Management', icon: FaBuilding },
    { id: 'superuser', label: 'Super Admin', icon: FaUserShield },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#8B3E00] via-[#A04400] to-[#5C2600] flex flex-col items-center justify-center p-4 relative font-sans text-stone-900">
      {/* Toast popup */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          duration={4000}
        />
      )}

      {/* Back to Home Button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white/90 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
      >
        <FaArrowLeft className="text-xs" />
        <span>Back to Home</span>
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#F9F6F0] rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center my-8 border border-white/20">
        {/* Top Circular Badge */}
        <div className="w-16 h-16 rounded-full bg-[#c2590e] flex items-center justify-center text-white text-2xl shadow-md mb-4">
          <FaGraduationCap />
        </div>

        {/* Header Titles */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2d1a0e] mb-1 text-center">
          Please Log In
        </h2>
        <p className="text-xs sm:text-sm text-[#7a6859] mb-6 text-center">
          IIIT Placement Management System
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          {/* Role Selector Section */}
          <div className="w-full mb-6">
            <label className="block text-xs font-semibold text-[#5a483a] uppercase tracking-wider text-left mb-2">
              Login As
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
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#b8540c] text-white border-transparent shadow-sm'
                        : 'bg-white text-[#4a3b2f] border-[#e0d6ca] hover:bg-[#f3ede4]'
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Field */}
          <div className="w-full mb-4">
            <label className="block text-xs font-semibold text-[#4a3b2f] text-left mb-1.5">
              Email Address
            </label>
            <div className="relative w-full">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8878] text-sm pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full bg-white border ${
                  errors.email ? 'border-red-500' : 'border-[#e0d6ca]'
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2d1a0e] placeholder-[#b0a090] focus:outline-none focus:border-[#b8540c] focus:ring-1 focus:ring-[#b8540c] transition-all`}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1 text-left">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="w-full mb-4">
            <label className="block text-xs font-semibold text-[#4a3b2f] text-left mb-1.5">
              Password
            </label>
            <div className="relative w-full">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8878] text-sm pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full bg-white border ${
                  errors.password ? 'border-red-500' : 'border-[#e0d6ca]'
                } rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#2d1a0e] placeholder-[#b0a090] focus:outline-none focus:border-[#b8540c] focus:ring-1 focus:ring-[#b8540c] transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a8878] hover:text-[#5a483a] text-sm cursor-pointer p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1 text-left">{errors.password}</p>
            )}
          </div>

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between w-full text-xs text-[#5a483a] mb-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#b8540c] focus:ring-[#b8540c] accent-[#b8540c] cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-semibold text-[#b8540c] hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              Forgot Password?
            </button>
          </div>

          {/* Log In Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#b8540c] hover:bg-[#a0480a] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70"
          >
            <span>{isLoading ? 'Logging in...' : 'Log In'}</span>
            <FaArrowRight className="text-xs" />
          </button>
        </form>

        {/* Footer Text inside Card */}
        <p className="text-[11px] text-[#9a8878] mt-6 text-center">
          © College Placement Management System 2026 - 27
        </p>
      </div>

      {/* Bottom Separate Container for Signup */}
      <div className="w-full max-w-md bg-[#F9F6F0] rounded-2xl p-4 text-center text-xs text-[#5a483a] shadow-md border border-white/20">
        <span>New to the portal? </span>
        <button
          type="button"
          onClick={() => navigate('/student/signup')}
          className="font-bold text-[#b8540c] hover:underline cursor-pointer bg-transparent border-0 p-0 ml-1"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
