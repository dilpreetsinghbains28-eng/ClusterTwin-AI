import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your ClusterTwin AI Copilot. I can analyze production data, energy usage, predictive maintenance, and global logistics. How can I help optimize the network today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: res.data?.data?.reply ?? 'No reply received.' }]);
    } catch (error) {
      
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the neural core right now.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-surface rounded-full shadow-[0_0_20px_rgba(107,216,203,0.5)] flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>
          {isOpen ? 'close' : 'psychology'}
        </span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-surface-glass border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 relative">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface"></span>
          </div>
          <div>
            <h3 className="font-headline-md text-white text-sm">ClusterTwin Copilot</h3>
            <p className="font-label-mono text-[10px] text-primary">Neural Network Online</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 hide-scrollbar">
          {(messages || []).map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-surface rounded-br-none' 
                  : 'bg-surface-container border border-white/5 text-on-surface-variant rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface-container border border-white/5 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-white/5 bg-surface-container/50">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about production, energy, alerts..."
              className="w-full bg-surface-container-highest text-white text-sm rounded-xl py-3 pl-4 pr-12 outline-none border border-white/5 focus:border-primary/50 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary disabled:text-on-surface-variant hover:bg-white/5 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
