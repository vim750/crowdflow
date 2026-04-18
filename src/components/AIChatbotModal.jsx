import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...inputs) {
  return twMerge(clsx(inputs));
}

const AIChatbotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm CrowdFlow Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let reply = "I'm sorry, I couldn't understand that.";
      const lower = userMsg.text.toLowerCase();
      
      if (lower.includes("food") || lower.includes("eat") || lower.includes("biryani")) {
        reply = "The least crowded food stall right now is 'Chennai Bites' near Block C. Wait time is under 2 mins. Should I show you the way?";
      } else if (lower.includes("exit") || lower.includes("leave")) {
        reply = "Gate 2 is currently congested. I suggest using Gate 4 for a faster exit. It's only a 3-minute walk.";
      } else if (lower.includes("washroom") || lower.includes("toilet") || lower.includes("restroom")) {
        reply = "The nearest washroom is on level 2 behind Block A. It currently has low traffic.";
      } else if (lower.includes("seat")) {
        reply = "Please show me your ticket QR, or I can check your saved ticket to guide you!";
      } else {
        reply = "I'm monitoring the stadium real-time. Gate 4 is the fastest exit right now, and Block B food court is moderately crowded.";
      }

      setMessages(prev => [...prev, { id: Date.now(), text: reply, isBot: true }]);
    }, 1000);
  };

  return (
    <>
      <div className="absolute right-4 bottom-28 lg:bottom-10 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-accent text-slate-900 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105 transition-transform"
        >
          <Bot size={28} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-28 lg:bottom-10 right-4 left-4 lg:left-auto lg:w-[400px] z-50 glass-panel bg-slate-900/95 border-slate-700/80 p-4 h-[400px] flex flex-col rounded-3xl"
          >
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">CrowdFlow Assistant</h3>
                  <p className="text-[10px] text-accent">Real-time stadium AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 rounded-full p-1 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3 py-2 scroll-smooth">
              {messages.map(msg => (
                <div key={msg.id} className={cx("flex", msg.isBot ? "justify-start" : "justify-end")}>
                  <div className={cx(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    msg.isBot 
                      ? "bg-slate-800/80 text-slate-200 border border-slate-700/50" 
                      : "bg-accent text-slate-900 font-medium shadow-[0_4px_10px_rgba(34,211,238,0.2)]"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={endOfMessagesRef} />
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-accent/50 text-white transition-colors"
                autoFocus
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 rounded-full bg-accent text-slate-900 flex items-center justify-center flex-shrink-0 hover:bg-accent/90 transition-colors"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbotModal;
