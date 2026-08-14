import React from 'react'
import { useState, useEffect } from 'react';
import api from '../../api/axios';


 
const ConversationList = ({ onSelectConversation, selectedId, refreshKey }) => {
   const [conversations, setConversations] = useState([]);

  useEffect(()=>{
    const fetconversation = async()=>{
    try {
      const response = await api.get("/messages/conversations")
      setConversations(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }
  fetconversation();
},[refreshKey]);
  return (
    <div className="space-y-2">
      {conversations.map((e) => {
        const isSelected = selectedId === e.id;
        return (
          <div 
            key={e.id}
            onClick={() => onSelectConversation(e)}
            className={`p-3 rounded-[12px] cursor-pointer transition-all duration-150 flex items-center gap-3 border ${
              isSelected 
                ? 'bg-[#FF6B47]/10 border-[#FF6B47] dark:border-[#FF6B47]' 
                : 'bg-white dark:bg-[#1E1E1B] border-[#E8E6E1] dark:border-[#312F2C] hover:bg-[#F5F4F1] dark:hover:bg-[#272724]'
            }`}
          >
            {/* User Avatar with Status Indicator */}
            <div className="relative flex-shrink-0">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${e.name}`} 
                alt={e.name}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 object-cover border border-[#E8E6E1] dark:border-[#312F2C]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1E1E1B]" />
            </div>

            {/* User Name & Last Message */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#1A1916] dark:text-[#F0EEE9] truncate">
                  {e.name}
                </h3>
              </div>
              <p className="text-xs text-[#6B6860] dark:text-[#9E9B95] truncate mt-0.5">
                {e.lastMessage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default ConversationList;