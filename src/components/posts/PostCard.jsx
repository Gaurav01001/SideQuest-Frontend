import React from 'react'

const PostCard = ({post}) => {
    const author = post.author || post.user || {};
    const avatar = author.avatar || author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username || 'user'}`;
    const name = author.name || 'Anonymous';
    const username = author.username || 'user';

    return(
        <div className="bg-white dark:bg-[#1E1E1B] border border-[#E8E6E1] dark:border-[#312F2C] rounded-[16px] p-5 shadow-xs transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm">
            {/* Header info */}
            <div className="flex items-center gap-3 mb-3">
                <img 
                    src={avatar} 
                    alt={name} 
                    className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-100 dark:border-gray-800"
                />
                <div>
                    <h4 className="text-sm font-bold text-[#1A1916] dark:text-[#F0EEE9]">{name}</h4>
                    <p className="text-xs text-[#6B6860] dark:text-[#9E9B95]">@{username}</p>
                </div>
            </div>

            {/* Post content */}
            <p className="text-sm leading-relaxed text-[#1A1916] dark:text-[#F0EEE9] whitespace-pre-wrap">
                {post.content}
            </p>
        </div>
    )
}

export default PostCard
