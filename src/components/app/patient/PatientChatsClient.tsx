'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, Send, ArrowLeft, Phone, MoreVertical, Paperclip, ImageIcon } from 'lucide-react';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const chats = [
  { name: "Dr. Ahmed Khalil", lastMsg: "Your x-ray results look great! See you tomorrow.", time: "2h", unread: 1, avatar: "AK", online: true },
  { name: "Dr. Reem Nasser", lastMsg: "I've scheduled your orthodontic review.", time: "1d", unread: 0, avatar: "RN", online: false },
  { name: "Dr. Omar Farid", lastMsg: "The procedure went well, how are you feeling?", time: "3d", unread: 0, avatar: "OF", online: true },
  { name: "Dentara Support", lastMsg: "Welcome to Dentara! How can we help?", time: "1w", unread: 0, avatar: "DS", online: true },
];

const mockMessages = [
  { id: 1, sender: "them", text: "Hi! I wanted to confirm our appointment tomorrow.", time: "10:12 AM" },
  { id: 2, sender: "me", text: "Yes, everything is confirmed! 10:30 AM at Clinic B, Room 204.", time: "10:14 AM" },
  { id: 3, sender: "them", text: "Perfect. Should I bring my previous x-rays?", time: "10:15 AM" },
  { id: 4, sender: "me", text: "That would be great, yes. We have your digital records but physical copies help too.", time: "10:18 AM" },
  { id: 5, sender: "them", text: "Your x-ray results look great! See you tomorrow. 😊", time: "10:22 AM" },
];

export default function PatientChatsClient() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  if (selectedChat !== null) {
    const chat = chats[selectedChat];
    return (
      <div className="flex flex-col h-[calc(100svh-11rem)] md:h-[calc(100vh-4rem)] animate-settle-in">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100/50">
          <button onClick={() => setSelectedChat(null)} className="p-1.5 rounded-xl hover:bg-gray-50/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-[#138b94]/10 flex items-center justify-center text-[#138b94] font-bold text-xs">
            {chat.avatar}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground text-sm">{chat.name}</h4>
            <p className="text-[10px] text-muted-foreground">{chat.online ? "Online" : "Last seen 2h ago"}</p>
          </div>
          <button className="p-2 rounded-xl hover:bg-gray-50/50 transition-colors">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-50/50 transition-colors">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === "me"
                  ? "bg-[#138b94] text-white rounded-br-lg"
                  : "bg-gray-100/50 text-foreground rounded-bl-lg"
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100/50">
          <button className="p-2.5 rounded-xl hover:bg-gray-50/50 transition-colors">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-gray-50/50 transition-colors">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 py-2.5 px-4 rounded-2xl bg-gray-100/30 border border-gray-100/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#138b94]/30 transition-all"
          />
          <button className="p-2.5 rounded-xl bg-[#138b94] text-white hover:bg-[#138b94]/90 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={ITEM} className="pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Messages</h2>
        <p className="text-muted-foreground text-sm mt-1">Chat with your clinicians</p>
      </motion.div>

      <motion.div variants={ITEM} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search conversations..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 border border-gray-100/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#138b94]/30 transition-all duration-200"
        />
      </motion.div>

      <motion.div variants={ITEM} className="glass-card-solid divide-y divide-gray-100/30 overflow-hidden">
        {chats.map((chat, i) => (
          <button
            key={i}
            onClick={() => setSelectedChat(i)}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50/30 transition-colors duration-200 text-left"
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-[#138b94]/10 flex items-center justify-center text-[#138b94] font-bold text-xs">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground text-sm">{chat.name}</h4>
                <span className="text-[10px] text-muted-foreground">{chat.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{chat.lastMsg}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-[#138b94] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{chat.unread}</span>
              </div>
            )}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
