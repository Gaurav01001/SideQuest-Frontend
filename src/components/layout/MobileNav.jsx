import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      name: 'Feed',
      path: '/feed',
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#FF6B47]' : 'text-gray-500 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      name: 'Quests',
      path: '/quests',
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#FF6B47]' : 'text-gray-500 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      name: 'Create',
      path: '/quests/create',
      isSpecial: true,
      icon: () => (
        <div className="w-11 h-11 rounded-full bg-[#FF6B47] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform -mt-5 border-2 border-white dark:border-[#1E1E1B]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )
    },
    {
      name: 'My Apps',
      path: '/applications',
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#FF6B47]' : 'text-gray-500 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: (isActive) => (
        <svg className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#FF6B47]' : 'text-gray-500 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141412]/95 backdrop-blur-md border-t border-[#E8E6E1] dark:border-[#312F2C] px-2 py-1.5 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path) && item.path !== '/quests/create');

          if (item.isSpecial) {
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center focus:outline-none cursor-pointer"
                aria-label="Create Quest"
              >
                {item.icon()}
                <span className="text-[10px] font-bold text-[#FF6B47] mt-0.5">
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center py-1 px-2.5 focus:outline-none transition-colors cursor-pointer"
            >
              {item.icon(isActive)}
              <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-[#FF6B47] font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
