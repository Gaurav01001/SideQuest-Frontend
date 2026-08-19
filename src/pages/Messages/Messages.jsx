/*components/messages/
    ConversationList.jsx
    ChatWindow.jsx
    MessageBubble.jsx
    ChatInput.jsx

pages/Messages/
    Messages.jsx

services/
    message.service.js

store/
    message.store.js

backend/
    message.routes.js
    
    React
     ↓
Axios + Socket.io
     ↓
Express Backend
     ↓
Prisma
     ↓
PostgreSQL
    */

import React from 'react'
import { Navbar } from '../../components/layout/Navbar'
import Sidebar from '../../components/quests/Sidebar'
import ChatWindow from '../../components/messages/ChatWindow'
import ConversationList from '../../components/messages/ConversationList'
import ChatInput from '../../components/messages/ChatInput'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const Messages = () => {

  const[refreshKey, setRefreshKey] = useState(0);

  const handleMessageSent = (newMessage)=>{
    setRefreshKey(prev=>prev+1);
  };

  const[selectedConvos, setselectedConvos] = useState(null);
    const location = useLocation();
    const creator = location.state?.user;

useEffect(() => {
    if (creator) {
        setselectedConvos(creator);
    }
}, [creator]);
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#141412] text-[#1A1916] dark:text-[#F0EEE9] transition-colors duration-200 pb-16 md:pb-0">
      <Navbar />
      <div className="flex">
        <Sidebar />
        {/* Main Content Area */}
        <main className="flex-1 flex gap-4 h-[calc(100vh-68px)] p-2 sm:p-4 max-w-7xl mx-auto overflow-hidden">
          
          {/* Conversations Panel */}
          <div className={`${
            selectedConvos ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 flex-shrink-0 bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] p-4 flex-col shadow-xs overflow-hidden`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E6E1] dark:border-[#312F2C]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FF6B47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4z" />
                </svg>
                <h2 className="text-lg font-extrabold text-[#1A1916] dark:text-[#F0EEE9] tracking-tight">
                  Messages
                </h2>
              </div>
              <span className="text-xs font-bold text-[#FF6B47] bg-[#FF6B47]/10 px-2.5 py-0.5 rounded-full">
                Direct
              </span>
            </div>

            {/* Conversation List Container */}
            <div className="flex-1 overflow-y-auto pr-1">
              <ConversationList
                onSelectConversation={setselectedConvos}
                selectedId={selectedConvos?.id}
                refreshKey={refreshKey}
              />
            </div>
          </div>

          {/* Active Chat Window Panel */}
          <div className={`${
            !selectedConvos ? 'hidden md:flex' : 'flex'
          } flex-1 w-full bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] flex-col shadow-xs overflow-hidden`}>
            
            {/* Conversation Header */}
            <div className="border-b border-[#E8E6E1] dark:border-[#312F2C] p-3 sm:p-4 flex items-center gap-3 bg-white dark:bg-[#1E1E1B]">
              {selectedConvos ? (
                <>
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setselectedConvos(null)}
                    className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-[#FF6B47] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Back to conversations"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConvos.name}`} 
                      alt={selectedConvos.name} 
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 dark:bg-gray-800 object-cover border border-[#E8E6E1] dark:border-[#312F2C]"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1E1E1B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1A1916] dark:text-[#F0EEE9]">
                      {selectedConvos.name}
                    </h3>
                    <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                      Active Now
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-[#6B6860] dark:text-[#9E9B95] font-semibold">
                  <span>Select a conversation to start chatting</span>
                </div>
              )}
            </div>

            {/* Chat Body Window */}
            <div className="flex-1 overflow-y-auto bg-[#FAFAF8]/50 dark:bg-[#141412]/50">  
              <ChatWindow selectedConvo={selectedConvos} refreshKey={refreshKey} />
            </div>

            {/* Message Input Footer */}
            <div className="p-3 border-t border-[#E8E6E1] dark:border-[#312F2C] bg-white dark:bg-[#1E1E1B]">
              <ChatInput selectedConvo={selectedConvos} onMessageSent={handleMessageSent} />
            </div>

          </div> 

        </main>
      </div>
    </div>
  )
}
/* Messages.jsx

selectedConvo
        │
        ├───────────────┐
        ▼               ▼
ConversationList   ChatWindow
        │               │
        ▼               ▼
Click Alice      Load Alice's messages

                ChatInput
                     │
                     ▼
              Send message to Alice */
export default Messages