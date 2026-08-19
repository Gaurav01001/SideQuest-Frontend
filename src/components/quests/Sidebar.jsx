// Sidebar.jsx: Premium Collapsible Sidebar Component
//
// HOW IT WORKS:
// 1. Manages a collapsible state `isCollapsed` stored in `localStorage` to persist across navigations/reloads.
// 2. Toggles sidebar width between `w-64` (expanded) and `w-20` (collapsed) with smooth transition animations.
// 3. Renders a toggle button at the top header area to collapse/expand at the user's choice.
// 4. Dynamically hides/shows text labels, titles, and user profile metadata to fit the compact design when collapsed.
// 5. Centers the navigation icons and avatar cleanly for a premium, compact layout.

import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/auth.store'

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Read collapse state from localStorage to persist preference
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Toggle handlers for expanding and collapsing
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const nextValue = !prev;
      localStorage.setItem('sidebar-collapsed', JSON.stringify(nextValue));
      return nextValue;
    });
  };

  const sidebar_components = [
    {
      name: "My Applications",
      path: "/applications",
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FF6B47]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
        </svg>
      )
    },
    {
      name: "Create Quest",
      path: "/quests/create",
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FF6B47]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      )
    },
    {
      name: "Search Quests",
      path: "/quests/search",
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FF6B47]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
        </svg>
      )
    },
    {
      name: "Play chess against the admin(I'm average)",
      path: "/chess",
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FF6B47]' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2m4 0a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2m4 0v4m-4-4v4m-4 8h12m-6-4v4" />
        </svg>
      )
    }
  ];

  return (
    <aside 
      className={`h-[calc(100vh-60px)] sticky top-[60px] p-4 bg-white dark:bg-[#1E1E1B] border-r border-[#E8E6E1] dark:border-[#312F2C] hidden md:flex flex-col justify-between transition-all duration-300 ease-in-out select-none flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col gap-1">
        {/* Top Header Row with Expand/Collapse toggle */}
        <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!isCollapsed && (
            <span className="text-[10px] font-bold tracking-wider text-[#6B6860] dark:text-[#9E9B95] uppercase">
              Quest Hub
            </span>
          )}
          <button 
            onClick={toggleCollapse}
            className="p-1.5 rounded-[8px] text-gray-400 hover:text-[#FF6B47] hover:bg-[#FFF1EE] dark:hover:bg-[#FF7A5C]/10 dark:hover:text-[#FF7A5C] transition-all cursor-pointer outline-none"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              // Chevron Right (Expand)
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              // Chevron Left (Collapse)
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Navigation Items */}
        {sidebar_components.map((comp) => {
          const isActive = location.pathname === comp.path;
          return (
            <button
              key={comp.name}
              onClick={() => navigate(comp.path)}
              className={`flex items-center text-left w-full py-3 rounded-[12px] transition-all duration-150 cursor-pointer outline-none ${
                isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'
              } ${
                isActive
                  ? 'text-[#FF6B47] bg-[#FFF1EE] dark:bg-[#FF7A5C]/10 dark:text-[#FF7A5C]'
                  : 'text-[#6B6860] hover:text-[#1A1916] hover:bg-[#F5F4F1] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9] dark:hover:bg-[#272724]'
              }`}
              title={isCollapsed ? comp.name : undefined}
            >
              {comp.icon(isActive)}
              {!isCollapsed && <span className="text-sm font-semibold whitespace-normal leading-tight">{comp.name}</span>}
            </button>
          );
        })}
      </div>

      {/* User profile section */}
      {user && (
        <div className={`pt-4 border-t border-[#E8E6E1] dark:border-[#312F2C] flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <img 
            src={user?.profile?.avatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
            alt={user?.name || 'User'} 
            className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200 dark:border-gray-800"
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1A1916] dark:text-[#F0EEE9] truncate">{user?.name || user?.username}</p>
              <p className="text-[10px] text-[#6B6860] dark:text-[#9E9B95] truncate">@{user?.username}</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
