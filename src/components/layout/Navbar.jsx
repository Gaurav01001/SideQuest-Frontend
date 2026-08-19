import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/auth.store'
import Avatar from '../common/Avatar'
import Button from '../common/Button';
import CreatePostModal from '../feed/CreatePostModal'
import MobileNav from './MobileNav'

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const navItems = [
    { name: "Feed", path: "/feed" },
    { name: "Quests", path: "/quests" },
    { name: "Applications", path: "/applications" },
    { name: "Messages", path: "/messages" },
    { name: "Search", path: "/search" },
  ]

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };
  
  return (
    <>
      <nav className="sticky top-0 z-50 h-[60px] w-full border-b border-[#E8E6E1] bg-white dark:border-[#312F2C] dark:bg-[#141412]/85 dark:backdrop-blur-md transition-all duration-200">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Brand/Logo */}
          <div className="flex items-center">
            <h2 
              onClick={() => navigate("/feed")} 
              className="text-lg sm:text-xl font-extrabold tracking-tight text-[#FF6B47] cursor-pointer hover:opacity-90 active:scale-95 transition-all select-none font-sans"
            >
              Side Quest
            </h2>
          </div>

          {/* Navigation Items (Desktop / Tablet) */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-[10px] transition-all duration-150 ${
                    isActive 
                      ? 'text-[#FF6B47] bg-[#FFF1EE] dark:bg-[#FF7A5C]/10 dark:text-[#FF7A5C]' 
                      : 'text-[#6B6860] hover:text-[#1A1916] hover:bg-[#F5F4F1] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9] dark:hover:bg-[#272724]'
                  }`}
                >
                  {item.name}
                </Button>
              )
            })} 
          </div>

          {/* CTA and Profile */}
          <div className="flex items-center gap-3 relative">
            <Button
              onClick={() => setCreatePostOpen(true)}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-white bg-[#FF6B47] hover:bg-[#E85A38] rounded-[10px] shadow-xs transition-all hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
            >
              Create Post
            </Button>

            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="focus:outline-none flex items-center cursor-pointer hover:opacity-90 transition-opacity"
                aria-label="Toggle user menu"
              >
                <Avatar
                  src={user?.profile?.avatar}
                  username={user?.username}
                  size="sm"
                />
              </button>

              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-[12px] bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] shadow-md py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#E8E6E1] dark:border-[#312F2C]">
                      <p className="text-sm font-semibold text-[#1A1916] dark:text-[#F0EEE9] truncate">{user?.name || user?.username}</p>
                      <p className="text-xs text-[#6B6860] dark:text-[#9E9B95] truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/applications'); }}
                      className="w-full text-left px-4 py-2 text-sm text-[#1A1916] dark:text-[#F0EEE9] hover:bg-[#F5F4F1] dark:hover:bg-[#272724] transition-colors flex items-center gap-2 font-medium"
                    >
                      <svg className="w-4 h-4 text-[#FF6B47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                      </svg>
                      My Applications
                    </button>

                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/quests/create'); }}
                      className="w-full text-left px-4 py-2 text-sm text-[#1A1916] dark:text-[#F0EEE9] hover:bg-[#F5F4F1] dark:hover:bg-[#272724] transition-colors flex items-center gap-2 font-medium"
                    >
                      <svg className="w-4 h-4 text-[#FF6B47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                      </svg>
                      Create Quest
                    </button>

                    <div className="border-t border-[#E8E6E1] dark:border-[#312F2C] my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#F5F4F1] dark:hover:bg-[#272724] transition-colors flex items-center gap-2 font-medium"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={createPostOpen} 
        onClose={() => setCreatePostOpen(false)} 
      />

      {/* Bottom Navigation for Mobile */}
      <MobileNav />
    </>
  )
}

export default Navbar;
