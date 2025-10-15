import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Wifi } from 'lucide-react';
import { MessageBubble } from './components/MessageBubble.tsx';
import { TypingIndicator } from './components/TypingIndicator.tsx';
import { ChatInput } from './components/ChatInput.tsx';
import { useChat } from './hooks/useChat.ts';

const App: React.FC = () => {
  const { messages, isLoading, sessionId, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-cf-orange to-cf-blue text-white p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-2"
            >
              <Zap className="w-8 h-8" />
              <h1 className="text-3xl font-bold">CF AI Assistant</h1>
            </motion.div>
            <p className="text-white/90 text-lg">
              Powered by Llama 3.1 on Cloudflare Workers AI
            </p>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <div className="h-full overflow-y-auto px-6 py-6">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

        {/* Status Bar */}
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="px-6 py-3 bg-gray-100 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <Wifi size={14} />
            <span>Connected to Cloudflare AI</span>
          </div>
          <div className="font-mono text-xs">
            Session: {sessionId.slice(-6)}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default App;