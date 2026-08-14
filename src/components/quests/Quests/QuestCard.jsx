import React from 'react'
import { useNavigate } from 'react-router-dom'

// QuestCard: Renders a single quest card dynamically from database props
const QuestCard = ({ quest }) => {
  const navigate = useNavigate();

  // Fallbacks for missing creator details
  const creatorUsername = quest.creator?.username || 'user';
  const creatorAvatar = quest.creator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorUsername}`;

  return (
    <div className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-5 shadow-xs transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm">
      
      {/* Header Info: User Profile Info */}
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={creatorAvatar} 
          alt={creatorUsername} 
          className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-100 dark:border-gray-800" 
        />
        <div>
          <p className="text-xs text-[#6B6860] dark:text-[#9E9B95]">
            Quest by @{creatorUsername}
          </p>
          <h3 className="font-bold text-base text-[#1A1916] dark:text-[#F0EEE9] mt-0.5">
            {quest.title}
          </h3>
        </div>
      </div>

      {/* Quest Metadata Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold">
        <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 rounded-[8px]">
          {quest.category}
        </span>
        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded-[8px]">
          {quest.isOnline ? "Online / Remote" : (quest.location || "In-Person")}
        </span>
        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-[8px]">
          {quest.spotsTotal} spot{quest.spotsTotal > 1 ? 's' : ''} available
        </span>
      </div>

      {/* Description text */}
      <p className="text-sm leading-relaxed text-[#6B6860] dark:text-[#9E9B95] mb-4 whitespace-pre-line">
        {quest.description}
      </p>

      {/* Tags row */}
      {quest.tags && quest.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {quest.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] font-bold text-[#6B6860] dark:text-[#9E9B95] bg-[#F5F4F1] dark:bg-[#272724] px-2 py-0.5 rounded-[6px]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <button
        onClick={() => navigate(`/quests/${quest.id}`)}
        className="px-4 py-2 bg-[#FF6B47] hover:bg-[#E85A38] text-white text-xs font-semibold rounded-[10px] shadow-sm hover:shadow transition-all cursor-pointer outline-none"
      >
        View Details
      </button>
      
    </div>
  )
}

export default QuestCard 