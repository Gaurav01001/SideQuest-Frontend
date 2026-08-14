// ApplicationsDashboard.jsx — Host Control Panel to Manage Incoming Applications
//
// DESIGN KEY FEATURES:
// 1. Consistent App Background: Uses min-h-screen bg-[#FAFAF8] dark:bg-[#141412] matching Link Up design system.
// 2. Sleek Glassmorphism Card Deck: Standardized white/dark cards with rounded corners and border accents.
// 3. Clear Tabs Switcher: Filter incoming applications by status (Pending, Accepted, Rejected) with dynamic count badges.
// 4. Summary Metrics Cards: Visually maps counts at the top (Your Quests, Pending Reviews, Accepted, Rejected).
// 5. Action CTA Buttons: Host can Accept or Reject applications with direct visual feedback.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import Sidebar from '../../components/quests/Sidebar';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import useAuthStore from '../../store/auth.store';

const ApplicationsDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.user);

  // States
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("PENDING"); // PENDING, ACCEPTED, REJECTED
  const [processingId, setProcessingId] = useState(null);
  const [myQuestCount, setMyQuestCount] = useState(0);

  // Load aggregated dashboard data
  const fetchDashboardData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      setError("");

      // 1. Fetch all quests/roles
      const rolesRes = await api.get('/roles/my');
      if (rolesRes.data?.success) {
        const allRoles = rolesRes.data.data || [];
        
        // 2. Filter for quests created by the logged-in user
        // const myQuests = allRoles.filter(role => role.creatorId === currentUser.id);
        setMyQuestCount(allRoles.length);

        if (allRoles.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }

        // 3. Fetch applications for each of the creator's quests in parallel
        const allAppsPromises = myQuests.map(async (quest) => {
          try {
            const appsRes = await api.get(`/roles/${quest.id}/applications`);
            if (appsRes.data?.success) {
              return (appsRes.data.data || []).map(app => ({
                ...app,
                questTitle: quest.title,
                questId: quest.id
              }));
            }
            return [];
          } catch (err) {
            console.error(`Failed to fetch apps for quest ${quest.id}:`, err);
            return [];
          }
        });

        const resolvedApps = await Promise.all(allAppsPromises);
        const mergedApplications = resolvedApps.flat();

        // Sort by creation date (newest first)
        mergedApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setApplications(mergedApplications);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  // Handle application acceptance or rejection
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setProcessingId(appId);
      const res = await api.patch(`/applications/${appId}`, { status: newStatus });
      if (res.data?.success) {
        // Optimistically update status in local state
        setApplications(prev => prev.map(app => 
          app.id === appId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to process application.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter applications by selected tab status
  const filteredApps = applications.filter(app => app.status === activeTab);

  // Compute metrics
  const pendingCount = applications.filter(app => app.status === "PENDING").length;
  const acceptedCount = applications.filter(app => app.status === "ACCEPTED").length;
  const rejectedCount = applications.filter(app => app.status === "REJECTED").length;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#141412] text-[#1A1916] dark:text-[#F0EEE9] transition-colors duration-200">
      <Navbar />

      <div className="flex">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dashboard Main Content Container */}
        <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
          
          {/* Header Description */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1A1916] dark:text-[#F0EEE9] tracking-tight">
              Applications Dashboard
            </h1>
            <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] mt-1.5">
              Review and manage applicants rest of the features idk when ill make.
            </p>
          </div>

          {/* Aggregated Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#1E1E1B] p-4 rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs border-l-4 border-l-[#FF6B47]">
              <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                Your Quests
              </span>
              <span className="text-2xl font-black text-[#1A1916] dark:text-[#F0EEE9]">
                {myQuestCount}
              </span>
            </div>

            <div className="bg-white dark:bg-[#1E1E1B] p-4 rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs border-l-4 border-l-amber-500">
              <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                Pending Reviews
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-500">
                {pendingCount}
              </span>
            </div>

            <div className="bg-white dark:bg-[#1E1E1B] p-4 rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs border-l-4 border-l-emerald-500">
              <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                Accepted Members
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500">
                {acceptedCount}
              </span>
            </div>

            <div className="bg-white dark:bg-[#1E1E1B] p-4 rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs border-l-4 border-l-rose-500">
              <span className="block text-[10px] uppercase font-bold text-[#6B6860] dark:text-[#9E9B95] tracking-wider mb-1">
                Rejected Applications
              </span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-500">
                {rejectedCount}
              </span>
            </div>
          </div>

          {/* TAB SYSTEM NAVIGATION */}
          <div className="flex border-b border-[#E8E6E1] dark:border-[#312F2C] mb-6 gap-2">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all outline-none cursor-pointer flex items-center gap-2 ${
                activeTab === "PENDING"
                  ? "border-[#FF6B47] text-[#FF6B47]"
                  : "border-transparent text-[#6B6860] hover:text-[#1A1916] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9]"
              }`}
            >
              Pending Reviews
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "PENDING"
                  ? "bg-[#FF6B47]/10 text-[#FF6B47]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}>
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("ACCEPTED")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all outline-none cursor-pointer flex items-center gap-2 ${
                activeTab === "ACCEPTED"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-[#6B6860] hover:text-[#1A1916] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9]"
              }`}
            >
              Accepted
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "ACCEPTED"
                  ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}>
                {acceptedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("REJECTED")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all outline-none cursor-pointer flex items-center gap-2 ${
                activeTab === "REJECTED"
                  ? "border-rose-500 text-rose-600 dark:text-rose-400"
                  : "border-transparent text-[#6B6860] hover:text-[#1A1916] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9]"
              }`}
            >
              Rejected
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "REJECTED"
                  ? "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}>
                {rejectedCount}
              </span>
            </button>
          </div>

          {/* LIST DECK */}
          {error && (
            <div className="text-sm px-4 py-3 rounded-[12px] bg-red-500/10 text-[#EF4444] border border-red-500/20 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            /* Pulsing skeleton items */
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-5 animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredApps.length === 0 ? (
            /* Clean Empty State Layout */
            <div className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-12 text-center flex flex-col items-center justify-center">
              <div className="p-4 bg-[#F5F4F1] dark:bg-[#272724] rounded-full mb-4">
                <svg className="w-10 h-10 text-[#6B6860] dark:text-[#9E9B95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#1A1916] dark:text-[#F0EEE9]">
                No {activeTab.toLowerCase()} applications
              </h3>
              <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] mt-1 max-w-sm">
                {activeTab === "PENDING"
                  ? "There are no incoming applicant reviews. Once members apply for your open party slots, they will appear here!"
                  : `You have not ${activeTab.toLowerCase()} any applications yet.`}
              </p>
            </div>
          ) : (
            /* Cards List */
            <div className="space-y-4">
              {filteredApps.map((app) => {
                const username = app.applicant?.username || 'user';
                const name = app.applicant?.name || 'Adventurer';
                const bio = app.applicant?.bio || 'No bio provided.';
                const avatarUrl = app.applicant?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

                return (
                  <div 
                    key={app.id} 
                    className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-sm"
                  >
                    {/* Left side: user profile details */}
                    <div className="flex items-start gap-4 flex-1">
                      <img 
                        src={avatarUrl} 
                        alt={username} 
                        className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-100 dark:border-gray-800 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-base text-[#1A1916] dark:text-[#F0EEE9]">
                            {name}
                          </span>
                          <span className="text-xs text-[#6B6860] dark:text-[#9E9B95]">
                            @{username}
                          </span>
                        </div>
                        
                        <p className="text-xs text-[#6B6860] dark:text-[#9E9B95] leading-relaxed">
                          {bio}
                        </p>
                        
                        {/* Target Quest Info Badges */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className="text-[10px] font-bold text-[#FF6B47] bg-[#FF6B47]/10 px-2 py-0.5 rounded-[6px]">
                            Applied to: {app.questTitle || 'Quest'}
                          </span>
                          <span className="text-[10px] text-[#6B6860] dark:text-[#9E9B95]">
                            Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: status actions */}
                    <div className="flex items-center gap-2.5 sm:self-center">
                      {app.status === "PENDING" && (
                        <>
                          <Button
                            variant="primary"
                            color="#10B981"
                            disabled={processingId !== null}
                            onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                            className="text-white border-none rounded-[10px] font-semibold text-xs px-4 py-2 hover:opacity-90 shadow-sm cursor-pointer"
                          >
                            Accept
                          </Button>
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                            className="bg-transparent hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 dark:border-rose-500/10 rounded-[10px] font-semibold text-xs px-4 py-2 transition-all cursor-pointer outline-none"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === "ACCEPTED" && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1.5 rounded-[8px]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Accepted
                        </div>
                      )}

                      {app.status === "REJECTED" && (
                        <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs bg-rose-500/10 px-3 py-1.5 rounded-[8px]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rejected
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ApplicationsDashboard;
