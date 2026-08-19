import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import SearchBar from '../../components/search/SearchBar'
import api from '../../api/axios'

const Search = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/search?q=${encodeURIComponent(search)}`);
        if (response.data?.success) {
          setResults(response.data.data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleClear = () => {
    setSearch("");
    setResults([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#141412] text-[#1A1916] dark:text-[#F0EEE9] transition-colors duration-200">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#1A1916] dark:text-[#F0EEE9] font-sans">
            Search Users
          </h2>
          <p className="text-sm text-[#6B6860] dark:text-[#9E9B95]">
            Find and connect with other adventurers on their quests.
          </p>
        </div>

        <div className="mb-6 bg-white dark:bg-[#1E1E1B] p-4 rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs">
          <SearchBar 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={handleClear}
          />
        </div>

        {error && (
          <div className="mb-6 text-sm px-4 py-3 rounded-[12px] bg-red-500/10 text-[#EF4444] border border-red-500/20">
            {error}
          </div>
        )}

        {/* Search results container */}
        <div className="space-y-4">
          {loading ? (
            /* Pulsing skeleton loaders */
            Array.from({ length: 3 }).map((_, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-5 animate-pulse flex items-center justify-between"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
                <div className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded-[10px]" />
              </div>
            ))
          ) : !search.trim() ? (
            /* Initial State */
            <div className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-8 text-center flex flex-col items-center justify-center">
              <div className="p-3 bg-[#FFF1EE] dark:bg-[#FF7A5C]/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-[#FF6B47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#1A1916] dark:text-[#F0EEE9]">Find Your Party</h3>
              <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] max-w-sm mt-1">
                Type in the search bar above to look up users by their name or username.
              </p>
            </div>
          ) : results.length === 0 ? (
            /* No Results State */
            <div className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-8 text-center flex flex-col items-center justify-center">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#1A1916] dark:text-[#F0EEE9]">No Adventurers Found</h3>
              <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] mt-1">
                We couldn't find anyone matching "{search}". Double check spelling or try a different term.
              </p>
            </div>
          ) : (
            /* Results List */
            <div className="flex flex-col gap-4">
              {results.map((user) => {
                const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'user'}`;
                return (
                  <div 
                    key={user.id} 
                    className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                      <img 
                        src={avatarUrl} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-100 dark:border-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#1A1916] dark:text-[#F0EEE9] truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-[#6B6860] dark:text-[#9E9B95]">
                          @{user.username}
                        </p>
                        {user.bio && (
                          <p className="text-xs text-[#6B6860] dark:text-[#9E9B95] mt-1 truncate">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/profile/${user.username}`)}
                      className="px-4 py-2 text-xs font-semibold text-[#FF6B47] hover:text-[#E85A38] border border-[#FF6B47]/20 hover:border-[#FF6B47]/45 hover:bg-[#FFF1EE] dark:hover:bg-[#FF7A5C]/10 rounded-[10px] transition-all cursor-pointer whitespace-nowrap outline-none"
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Search