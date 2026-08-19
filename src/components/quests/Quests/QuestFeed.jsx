import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { Navbar } from '../../layout/Navbar'
import QuestCard from './QuestCard'
import api from '../../../api/axios'

const QuestFeed = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all active quests from the backend when the component loads
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await api.get('/roles');
        if (response.data?.success) {
          setQuests(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch quests:", err);
        setError("Could not load quests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#141412] text-[#1A1916] dark:text-[#F0EEE9] transition-colors duration-200">
      <Navbar />
      
      <div className="flex">
        <Sidebar />

        <main className="flex-1 max-w-2xl mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-[#1A1916] dark:text-[#F0EEE9] font-sans">
              Quest Feed
            </h2>
            <p className="text-sm text-[#6B6860] dark:text-[#9E9B95]">
              Discover active quests available in the community.
            </p>
          </div>

          {error && (
            <div className="mb-6 text-sm px-4 py-3 rounded-[12px] bg-red-500/10 text-[#EF4444] border border-red-500/20">
              {error}
            </div>
          )}

          {loading ? (
            /* Pulsing quest card skeleton loaders */
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-5 animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-[8px]" />
                </div>
              ))}
            </div>
          ) : quests.length === 0 ? (
            /* No Quests State */
            <div className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-8 text-center flex flex-col items-center justify-center">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#1A1916] dark:text-[#F0EEE9]">No Active Quests</h3>
              <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] mt-1">
                There are no open quests at the moment. Why not create one yourself?
              </p>
            </div>
          ) : (
            /* Active Quests List */
            <div className="space-y-4">
              {quests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default QuestFeed;