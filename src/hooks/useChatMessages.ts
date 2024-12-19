import { useState, useCallback } from 'react';

interface Message {
  text: string;
  type: 'user' | 'bot';
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((text: string, type: 'user' | 'bot') => {
    setMessages(prev => [...prev, { text, type }]);
  }, []);

  const sendMessage = useCallback(async (message: string, sessionToken: string | null) => {
    try {
      const response = await fetch('https://algowhatsapp.algobrainai.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          token: sessionToken
        })
      });
      const data = await response.json();
      console.log("MESSAGE", data.message);
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, []);

  return {
    messages,
    addMessage,
    sendMessage
  };
}; 