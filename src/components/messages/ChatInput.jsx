import React, { useEffect, useState } from 'react'
import api from '../../api/axios';
// import { useFetcher } from 'react-router-dom';
// import {getSocket} from '../../api/socket';
// import useAuthStore from '../../store/auth.store';
const ChatInput = ({ selectedConvo, onMessageSent }) => {
  const[message, setMessage] = useState(""); 
  const[placeholder , setPlaceholder] = useState("");
  // const user = useAuthStore((state)=>state.user);

  useEffect(()=>{
    let  index = 0;
    let del = false;
    let time ;
    const text = "Type a message...";

    const animate = ()=>{
      if(!del){
        setPlaceholder(text.slice(0, index+1));
        index++;
        if(index === text.length){
          time = setTimeout(()=>{
            del = true;
            animate();
          },1500);
          return;
      }

      time = setTimeout(animate, 100);

    }
    else{
      setPlaceholder(text.slice(0,index-1));
      index--;
      if(index === 0){
        time = setTimeout(()=>{
          del = false;
          animate()
        }, 1000);
        return;
      }
      time = setTimeout(animate,50);
    }

  };
  animate();
  return ()=> clearTimeout(time);
},[])

  const sendMessage = async () => {
    if (!selectedConvo) return;
    if (message.trim() === "") return;

    try {
const response = 
        await api.post("/messages", {
            receiverId: selectedConvo.id,
            content: message,
        });
// const socket = getSocket();
// socket.emit("send_message",{
//   senderId: user.id,
//   receiverId: selectedConvo.id,
//   content: message,
// })
        setMessage("");
        if(onMessageSent && response.data?.data){
          onMessageSent(response.data.data);
        }

    } catch (error) {

        console.error("Failed to send message", error);

    }
};

const handlekeydown = (e)=>{ // this is how you asign keys from keyboard 
  if(e.key === "Enter"){
    sendMessage();
  }
}
/*ConversationList
        │
        │ Click Alice
        ▼
Messages.jsx
        │
        ├──────────────┐
        ▼              ▼
ChatWindow       ChatInput
*/
  return (
    <div className="flex items-center gap-2 w-full">
      <input 
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)} 
        onKeyDown={handlekeydown}
        placeholder={message ? "" : placeholder}
        className="flex-1 outline-none bg-[#F5F4F1] dark:bg-[#272724] border border-[#E8E6E1] dark:border-[#312F2C] text-[#1A1916] dark:text-[#F0EEE9] text-sm px-4 py-2.5 rounded-[12px] focus:border-[#FF6B47] dark:focus:border-[#FF6B47] transition-all duration-150"
      />

      <button 
        onClick={sendMessage}
        disabled={!selectedConvo || !message.trim()}
        className="bg-[#FF6B47] hover:bg-[#E85A38] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
      >
        <span>Send</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  )
}

export default ChatInput