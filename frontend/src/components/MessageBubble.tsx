import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { Message } from '../types/index.ts';

interface MessageBubbleProps {
  message: Message;
}

const formatMessage = (content: string): string => {
  return content
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-cf-orange">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-600">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/gm, '<p class="mb-3 last:mb-0">$1</p>');
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser 
          ? 'bg-gradient-to-r from-cf-orange to-cf-blue text-white' 
          : 'bg-cf-dark text-white'
        }
      `}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      
      <div className={`
        max-w-[75%] px-4 py-3 rounded-2xl
        ${isUser 
          ? 'bg-gradient-to-r from-cf-orange to-cf-blue text-white rounded-br-md' 
          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
        }
      `}>
        <div 
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: isUser ? message.content : formatMessage(message.content) 
          }}
        />
      </div>
    </motion.div>
  );
};