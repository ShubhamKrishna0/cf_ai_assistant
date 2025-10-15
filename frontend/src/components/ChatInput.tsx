import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 bg-white border-t border-gray-200">
      <div className="flex gap-3 items-center bg-gray-50 rounded-full px-4 py-2 border-2 border-transparent focus-within:border-cf-orange focus-within:bg-white transition-all duration-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1 bg-transparent border-none outline-none px-2 py-2 text-gray-800 placeholder-gray-500"
          disabled={isLoading}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
            ${message.trim() && !isLoading
              ? 'bg-gradient-to-r from-cf-orange to-cf-blue text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Send size={16} />
          )}
        </motion.button>
      </div>
    </div>
  );
};