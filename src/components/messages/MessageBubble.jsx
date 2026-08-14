import React from 'react'
import useAuthStore from '../../store/auth.store';
const MessageBubble = ({ message }) => {
  const user = useAuthStore((state)=>state.user)
    const isMine = message.senderId == user?.id;
  // Safe extraction of message content and sender alignment
  // const isMine = message.isMine || message.senderId === 'me' || false;
  const messageText = typeof message === 'string' ? message : (message.content || message.text || '');

  return (
    <div className={`flex flex-col mb-3 ${isMine ? 'items-end' : 'items-start'}`}>
      <div 
        className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-[16px] text-sm leading-relaxed shadow-xs transition-all ${
          isMine
            ? 'bg-[#FF6B47] text-white rounded-br-[4px]'
            : 'bg-[#F5F4F1] dark:bg-[#272724] text-[#1A1916] dark:text-[#F0EEE9] rounded-bl-[4px] border border-[#E8E6E1] dark:border-[#312F2C]'
        }`}
      >
        {messageText}
      </div>
      {message.createdAt && (
        <span className="text-[10px] text-[#6B6860] dark:text-[#9E9B95] mt-1 px-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}

export default MessageBubble