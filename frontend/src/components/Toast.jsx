import React, { useEffect } from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const CustomToast = ({ show, onClose, message, delay = 3500, type = 'info' }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay, onClose]);

  if (!show || !message) return null;

  const isError = message?.toLowerCase().includes('error') || message?.toLowerCase().includes('failed') || message?.toLowerCase().includes('required');
  const isSuccess = message?.toLowerCase().includes('success') || message?.toLowerCase().includes('updated') || message?.toLowerCase().includes('uploaded');

  let icon = <FaInfoCircle className="text-amber-500 text-base shrink-0" />;
  let badgeColor = 'border-amber-200 bg-white text-slate-900 shadow-xl shadow-amber-500/10';

  if (isSuccess) {
    icon = <FaCheckCircle className="text-emerald-500 text-base shrink-0" />;
    badgeColor = 'border-emerald-200 bg-white text-slate-900 shadow-xl shadow-emerald-500/10';
  } else if (isError) {
    icon = <FaExclamationCircle className="text-rose-500 text-base shrink-0" />;
    badgeColor = 'border-rose-200 bg-white text-slate-900 shadow-xl shadow-rose-500/10';
  }

  return (
    <div className="fixed top-6 right-6 z-50 transition-all duration-300 transform translate-y-0 animate-bounce-short">
      <div className={`flex items-center gap-3 max-w-md px-5 py-3.5 rounded-2xl border ${badgeColor}`}>
        {icon}
        <span className="text-xs font-bold leading-snug">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
