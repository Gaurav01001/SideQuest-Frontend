// QuestDetail.jsx — Dynamic Detailed View for a Single Quest connected to DB
//
// DESIGN KEY FEATURES:
// 1. Sleek Glassmorphism & Cards: Follows the premium Google Forms-inspired card deck layout with subtle dropshadows.
// 2. Creator Badge Details: Features verified user info, avatar, role, and dynamic post-creation age.
// 3. Information Grid: Visually maps Quest parameters (Category, Location, Reward, Party Spots, and Type) using tailored color accents.
// 4. Sticky Floating Action Bar: Keeps the 'Apply to Quest' CTA prominent, displaying clear validation messages based on quest status.
//
// API INTEGRATION DETAILS:
// 1. Fetches single Quest by ID parameter from url: GET /roles/:id
// 2. Fetches user applications list to determine if already applied: GET /applications/my
// 3. Authenticates creator ownership: disables application if current user created the quest.
// 4. Connects 'Apply to Quest' button to backend endpoint: POST /roles/:id/apply

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../../layout/Navbar'
import Sidebar from '../Sidebar'
import api from '../../../api/axios'
import useAuthStore from '../../../store/auth.store'

const QuestDetail = () => {
  // const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useAuthStore(state => state.user);

  // Core state definitions
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();


  // Fetch quest data and user's application status on component mount
  useEffect(() => {
    const fetchQuestDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch quest details
        const questRes = await api.get(`/roles/${id}`);
        if (questRes.data?.success) {
          setQuest(questRes.data.data);
        } else {
          setError("Quest details not found.");
        }

        // 2. Fetch user's applications to see if already applied
        if (currentUser) {
          const appsRes = await api.get('/applications/my');
          if (appsRes.data?.success) {
            const userApps = appsRes.data.data || [];
            const alreadyApplied = userApps.some(app => app.roleId === id);
            setHasApplied(alreadyApplied);
          }
        }
      } catch (err) {
        console.error("Failed to load quest details:", err);
        setError(err.response?.data?.message || "Could not retrieve quest details. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestDetails();
    }
  }, [id, currentUser]);

  // Handle application submission
  const handleApply = async () => {
    if (!currentUser) {
      alert("Please log in to apply for quests.");
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      const response = await api.post(`/roles/${id}/apply`);
      if (response.data?.success) {
        setHasApplied(true);
        // Refresh quest details to update applicant counts
        const questRes = await api.get(`/roles/${id}`);
        if (questRes.data?.success) {
          setQuest(questRes.data.data);
        }
      }
    } catch (err) {
      console.error("Application failed:", err);
      alert(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  // Helper to dynamically calculate reward pool details based on Category
  const getRewardText = (category) => {
    switch (category) {
      case "Paid":
        return "Financial Compensation (Paid Quest)";
      case "PartTime":
        return "Part-Time Compensated / Hourly Pay";
      case "Unpaid":
        return "Volunteer / Unpaid Community Contribution";
      default:
        return `${category} Experience & Skills badge`;
    }
  };

  // Helper to format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Computed state properties
  const isCreator = quest && currentUser && quest.creatorId === currentUser.id;
  const spotsLeft = quest ? Math.max(0, quest.spotsTotal - (quest.applications?.length || 0)) : 0;
  const applicantCount = quest ? (quest._count?.applications || 0) : 0;
  const isQuestClosed = quest && !quest.isActive;
  
  // Disable apply action if user is creator, already applied, quest is closed, or spots filled
  const isDisabled = hasApplied || isQuestClosed || spotsLeft === 0 || isCreator || applying;

  const getButtonText = () => {
    if (applying) return "Applying...";
    if (isCreator) return "You own this Quest";
    if (isQuestClosed) return "Quest Closed";
    if (spotsLeft === 0) return "Quest Full";
    if (hasApplied) return "Applied / Application Pending";
    return "Apply to Quest";
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#141412] text-[#1A1916] dark:text-[#F0EEE9] transition-colors duration-200">
      <Navbar />

      <div className="flex">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Quest Details Main Column */}
        <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
          
          {/* Navigation Back Button */}
          <button 
            onClick={() => navigate('/quests')} 
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6B47] hover:text-[#E85A38] transition-colors mb-6 outline-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quests
          </button>

          {loading ? (
            /* Pulsing quest details skeleton loader */
            <div className="space-y-6 animate-pulse">
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] p-6 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          ) : error ? (
            /* Error Information Panel */
            <div className="bg-white dark:bg-[#1E1E1B] border border-red-500/20 rounded-[16px] p-8 text-center flex flex-col items-center justify-center">
              <div className="p-3 bg-red-500/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#1A1916] dark:text-[#F0EEE9]">Quest Not Found</h3>
              <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] mt-1 max-w-md mx-auto">
                {error}
              </p>
              <button 
                onClick={() => navigate('/quests')}
                className="mt-6 px-5 py-2.5 bg-[#FF6B47] hover:bg-[#E85A38] text-white text-xs font-semibold rounded-[10px] shadow-sm transition-all outline-none cursor-pointer"
              >
                Back to Feed
              </button>
            </div>
          ) : (
            /* ACTIVE QUEST CONTAINER */
            <div className="space-y-6">
              
              {/* CARD 1: Title & Info Header */}
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs relative overflow-hidden">
                <div className="h-[10px] w-full bg-[#FF6B47]" />
                
                <div className="p-6">
                  
                  {/* Creator Header Section */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E8E6E1] dark:border-[#312F2C]">
                    <div className="flex items-center gap-3">
                      <img 
                        src={quest.creator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${quest.creator?.username || 'user'}`} 
                        alt={quest.creator?.username} 
                        className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-100 dark:border-gray-800"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#1A1916] dark:text-[#F0EEE9]">
                            {quest.creator?.name || quest.creator?.username || 'Quest Owner'}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B6860] dark:text-[#9E9B95]">
                          @{quest.creator?.username || 'username'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#6B6860] dark:text-[#9E9B95]">
                        Published {new Date(quest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Quest Title */}
                  <h1 className="text-2xl font-extrabold text-[#1A1916] dark:text-[#F0EEE9] leading-tight mb-4">
                    {quest.title}
                  </h1>

                  {/* Info Pills Matrix */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                    <div className="p-3 bg-[#F5F4F1] dark:bg-[#272724] rounded-[12px] border border-[#E8E6E1] dark:border-[#312F2C]">
                      <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                        Category
                      </span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {quest.category}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F5F4F1] dark:bg-[#272724] rounded-[12px] border border-[#E8E6E1] dark:border-[#312F2C]">
                      <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                        Reward Pool
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {getRewardText(quest.category)}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F5F4F1] dark:bg-[#272724] rounded-[12px] border border-[#E8E6E1] dark:border-[#312F2C] col-span-2 md:col-span-1">
                      <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                        Location
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 truncate block">
                        {quest.isOnline ? "Remote / Online" : (quest.location || "In-person")}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* CARD 2: Description & Tags */}
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] p-6 shadow-xs space-y-6">
                
                {/* Description section */}
                <div>
                  <h3 className="text-base font-bold text-[#1A1916] dark:text-[#F0EEE9] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#FF6B47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Quest Details
                  </h3>
                  <p className="text-sm leading-relaxed text-[#6B6860] dark:text-[#9E9B95] whitespace-pre-line">
                    {quest.description}
                  </p>
                </div>

                {/* Badges and Tags row */}
                {quest.tags && quest.tags.length > 0 && (
                  <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#312F2C]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B6860] dark:text-[#9E9B95] mb-2.5">
                      Tags & Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {quest.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs font-semibold text-[#FF6B47] bg-[#FF6B47]/10 px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* CARD 3: Target Dates & Deadlines */}
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                    Application Deadline
                  </span>
                  <span className="text-sm font-semibold text-red-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(quest.deadline)}
                  </span>
                </div>
                
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                    Kick-Off Event Date
                  </span>
                  <span className="text-sm font-semibold text-[#1A1916] dark:text-[#F0EEE9] flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#FF6B47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(quest.eventDate)}
                  </span>
                </div>
              </div>

              {/* STICKY BOTTOM BAR FOR APPLICATION ACTION */}
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] p-5 shadow-md sticky bottom-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200">
                
                {/* Left Details: Spots & Applicant count */}
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div className="text-center sm:text-left">
                    <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-0.5">
                      Available Spots
                    </span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {spotsLeft} / {quest.spotsTotal}
                    </span>
                  </div>
                  
                  <div className="h-8 w-px bg-[#E8E6E1] dark:bg-[#312F2C]" />

                  <div className="text-center sm:text-left">
                    <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-0.5">
                      Active Applicants
                    </span>
                    <span className="text-lg font-bold text-[#1A1916] dark:text-[#F0EEE9]">
                      {applicantCount}
                    </span>
                  </div>
                </div>
                
                <button
                onClick={()=>
                  navigate("/messages",{
                    state:{
                      user: quest.creator
                    }
                  })
                }
                className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer outline-none bg-blue-500 text-white hover:bg-blue-600 hover:translate-y-[-1px] hover:shadow-md">
                  message creator
                </button>
                {/* Right CTA Button */}
                <button
                  disabled={isDisabled}
                  onClick={handleApply}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-[12px] font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer outline-none ${
                    isDisabled
                      ? "bg-[#E8E6E1] dark:bg-[#272724] text-[#9E9B95] dark:text-[#6B6860] cursor-not-allowed"
                      : "bg-[#FF6B47] hover:bg-[#E85A38] text-white hover:translate-y-[-1px] hover:shadow-md"
                  }`}
                >
                  {getButtonText()}
                </button>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default QuestDetail