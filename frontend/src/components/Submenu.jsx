import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SidebarLink = ({ to, onClick, active, children, hasSubnav }) => (
  <Link
    to={to || '#'}
    onClick={onClick}
    className={`flex items-center justify-between w-full px-4 py-3 my-1 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer no-underline ${
      active
        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/20'
        : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

const SidebarLabel = ({ children }) => (
  <span className="ml-3 tracking-wide">{children}</span>
);

const DropdownLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`flex items-center w-full pl-10 pr-4 py-2.5 my-0.5 rounded-lg text-xs font-medium transition-all duration-200 no-underline ${
      active
        ? 'bg-amber-600/20 text-amber-400 font-semibold border-l-2 border-amber-500'
        : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
    }`}
  >
    {children}
  </Link>
);

const SubMenu = ({ item, currentPath }) => {
  const [subnav, setSubnav] = useState(false);

  useEffect(() => {
    if (item.subNav && item.subNav.some(subItem => currentPath.includes(subItem.path))) {
      setSubnav(true);
    } else {
      setSubnav(false);
    }
  }, [currentPath, item.subNav]);

  const showSubnav = (e) => {
    if (item.subNav) {
      setSubnav(!subnav);
    }
  };

  return (
    <div className="w-full px-2">
      <SidebarLink
        to={item.subNav ? undefined : item.path}
        onClick={showSubnav}
        active={currentPath === item.path || (item.subNav && item.subNav.some(s => s.path === currentPath))}
        hasSubnav={!!item.subNav}
      >
        <div className="flex items-center text-base">
          <span className="text-lg opacity-90">{item.icon}</span>
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && (
            <span className="text-xs transition-transform duration-200 opacity-70">
              {subnav ? item.iconOpened : item.iconClosed}
            </span>
          )}
        </div>
      </SidebarLink>

      {subnav && item.subNav && (
        <div className="flex flex-col pl-2 my-1 space-y-0.5 border-l border-stone-800 ml-5">
          {item.subNav.map((subItem, index) => (
            <DropdownLink
              to={subItem.path}
              key={index}
              active={currentPath === subItem.path}
            >
              <span className="text-sm mr-2 opacity-80">{subItem.icon}</span>
              <span>{subItem.title}</span>
            </DropdownLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubMenu;
