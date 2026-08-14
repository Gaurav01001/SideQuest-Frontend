import React, { useEffect, useState } from 'react'
import api from '../../api/axios';
import MessageBubble from './MessageBubble';
import {getSocket} from '../../api/socket';

const ChatWindow = ({ selectedConvo, refreshKey }) => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    if (!selectedConvo) {
      return;
    }
    api.get(`/messages/${selectedConvo.id}`)
      .then(response => {
setMessages(response.data.data || 
  []);
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });
  }, [selectedConvo, refreshKey]);

       useEffect(()=>{
        const socket = getSocket();
        if (!socket) return;

        const handleReceiveMessage = (message) => {
          // Only append if message belongs to the current conversation
          if (message.senderId === selectedConvo?.id) {
            setMessages((prevMessages) => [
              ...prevMessages,
              message
            ]);
          }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
          socket.off("receive_message", handleReceiveMessage);
        };
      },[selectedConvo]);

      /*
   ChatInput
   ↓
POST /messages
   ↓
Database ✅
   ↓
socket.emit("send_message")
   ↓
server.js
   ↓
socket.emit("receive_message")
   ↓
ChatWindow listener
   ↓
setMessages(...)
   ↓
MessageBubble appears
   ↓
UI updates automatically*/
  if (!selectedConvo) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center my-auto">
        <div className="w-16 h-16 rounded-full bg-[#FF6B47]/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#FF6B47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#1A1916] dark:text-[#F0EEE9]">
          Select a Conversation
        </h3>
        <p className="text-xs text-[#6B6860] dark:text-[#9E9B95] mt-1 max-w-xs">
          Choose a conversation from the left menu to start messaging party members.
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center my-auto">
        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <svg className="w-7 h-7 text-[#6B6860] dark:text-[#9E9B95]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-[#1A1916] dark:text-[#F0EEE9]">
          No messages yet
        </h4>
        <p className="text-xs text-[#6B6860] dark:text-[#9E9B95] mt-1">
          Say hello to {selectedConvo.name}!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 flex flex-col justify-end min-h-full">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}
    </div>
  )
}

export default ChatWindow