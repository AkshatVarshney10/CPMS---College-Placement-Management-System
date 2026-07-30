import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaChevronUp, FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import Logo from '../assets/CPMS.png';
import SubMenu from './Submenu';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Sidebar = ({ isSidebarVisible }) => {
  const [sidebar, setSidebar] = useState(isSidebarVisible);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebar(isSidebarVisible);
  }, [isSidebarVisible]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (loadData.role === 'student') navigate('/');
    else if (loadData.role === 'tpo_admin') navigate('/');
    else if (loadData.role === 'management_admin') navigate('/');
    else if (loadData.role === 'superuser') navigate('/');
  };

  const [loadData, setLoadData] = useState({
    name: 'Loading...',
    email: '',
    profile: '',
    role: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setLoadData({
          name: `${res.data?.first_name || ''} ${res.data?.middle_name || ''} ${res.data?.last_name || ''}`.trim() || 'User',
          email: res.data?.email || '',
          profile: res.data?.profile || '',
          role: res.data?.role || '',
        });
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          const dataToPass = {
            showToastPass: true,
            toastMessagePass: err.response.data.msg,
          };
          navigate('../', { state: dataToPass });
        }
      });
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SidebarData, setSidebarData] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const fetchSidebarData = async () => {
    if (loadData.role === 'superuser') {
      const { SidebarData } = await import('./SuperUser/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'management_admin') {
      const { SidebarData } = await import('./Management/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'tpo_admin') {
      const { SidebarData } = await import('./TPO/SidebarData');
      setSidebarData(SidebarData);
    } else if (loadData.role === 'student') {
      const { SidebarData } = await import('./Students/SidebarData');
      setSidebarData(SidebarData);
    }
  };

  useEffect(() => {
    if (loadData.role) {
      fetchSidebarData();
    }
  }, [loadData.role]);

  const getDashboardPath = () => {
    if (loadData.role === 'superuser') return '/admin/dashboard';
    if (loadData.role === 'management_admin') return '/management/dashboard';
    if (loadData.role === 'tpo_admin') return '/tpo/dashboard';
    if (loadData.role === 'student') return '/student/dashboard';
    return '/';
  };

  const getRoleLabel = () => {
    if (loadData.role === 'superuser') return 'Super Admin';
    if (loadData.role === 'management_admin') return 'Management';
    if (loadData.role === 'tpo_admin') return 'CDC / TPO';
    if (loadData.role === 'student') return 'Student';
    return 'User';
  };

  return (
    <>
      <nav className={`bg-stone-900 text-stone-300 w-[260px] min-h-screen h-full z-30 flex flex-col fixed top-0 left-0 transition-transform duration-300 ${sidebar ? 'translate-x-0' : '-translate-x-full'} shadow-2xl border-r border-stone-800 navbar-container`}>
        {/* Top Header Logo */}
        <div className="flex items-center px-6 py-5 gap-3 border-b border-stone-800/80 bg-stone-950/40">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 p-0.5 shadow-md shadow-amber-600/20 flex items-center justify-center">
            <img className="rounded-lg w-full h-full object-cover" src={Logo} alt="CPMS Logo" />
          </div>
          <div>
            <Link to={getDashboardPath()} className="no-underline">
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                CPMS
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30">
                  {getRoleLabel()}
                </span>
              </h1>
            </Link>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex-grow overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin scrollbar-thumb-stone-800 pb-28">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-4 mb-2">
            Navigation Menu
          </div>
          {SidebarData.length > 0 ? (
            SidebarData.map((item, index) => (
              <SubMenu item={item} key={index} currentPath={location.pathname} />
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-stone-500 flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
              <span>Loading navigation...</span>
            </div>
          )}
        </div>

        {/* User Profile & Logout Bottom Card */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-stone-900/95 border-t border-stone-800 backdrop-blur-md">
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="mb-2 rounded-xl bg-stone-800 border border-stone-700 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              {loadData.role === 'student' && (
                <Link to="../student/account" className="flex items-center gap-3 text-stone-300 text-sm px-4 py-3 hover:bg-stone-700/60 no-underline transition-colors">
                  <FaCog className="text-amber-500 text-base" />
                  <span>Account Settings</span>
                </Link>
              )}
              {loadData.role === 'tpo_admin' && (
                <Link to="../tpo/account" className="flex items-center gap-3 text-stone-300 text-sm px-4 py-3 hover:bg-stone-700/60 no-underline transition-colors">
                  <FaCog className="text-amber-500 text-base" />
                  <span>Account Settings</span>
                </Link>
              )}
              {loadData.role === 'management_admin' && (
                <Link to="../management/account" className="flex items-center gap-3 text-stone-300 text-sm px-4 py-3 hover:bg-stone-700/60 no-underline transition-colors">
                  <FaCog className="text-amber-500 text-base" />
                  <span>Account Settings</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-red-400 font-medium text-sm px-4 py-3 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
              >
                <FaSignOutAlt className="text-base" />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* Trigger Card */}
          <div
            onClick={toggleDropdown}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/50 hover:bg-stone-800 cursor-pointer transition-all group"
          >
            {loadData.profile ? (
              <img
                src={loadData.profile}
                alt={loadData.name}
                className="w-10 h-10 rounded-xl object-cover border border-amber-600/30 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {loadData.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white truncate leading-tight group-hover:text-amber-400 transition-colors">
                {loadData.name}
              </h4>
              <p className="text-[11px] text-stone-400 truncate leading-tight mt-0.5">
                {loadData.email}
              </p>
            </div>
            <FaChevronUp
              className={`text-xs text-stone-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-0 text-amber-400' : 'rotate-180'
              }`}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
