import { useState, useEffect } from 'react';

export const useChatSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeChat = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://algowhatsapp.algobrainai.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: '' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize chat');
      }

      const data = await response.json();
      setSessionToken(data.token);
      return data.message;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize chat';
      setError(errorMessage);
      console.error('Error initializing chat:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsActive(prev => !prev);
  };

  const closeChat = () => {
    setIsActive(false);
  };

  return {
    isActive,
    sessionToken,
    isLoading,
    error,
    toggleChat,
    closeChat,
    initializeChat
  };
}; 