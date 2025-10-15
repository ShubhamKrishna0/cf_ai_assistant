import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types/index.ts';

const API_BASE = 'https://cf-ai-assistant.krishnashubham09.workers.dev';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: 'Hello! I\'m your AI assistant powered by Cloudflare\'s cutting-edge infrastructure. I\'m here to help you with any questions or tasks. What would you like to know?',
        role: 'assistant',
        timestamp: new Date()
      }
    ],
    isLoading: false,
    sessionId: `session_${Math.random().toString(36).substr(2, 9)}`
  });

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content, 
          sessionId: state.sessionId 
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.error ? `❌ Error: ${data.error}` : data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        role: 'assistant',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }));
    }
  }, [state.sessionId]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    sessionId: state.sessionId,
    sendMessage
  };
};