// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatFeedback } from '@/hooks/useChatFeedback';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import FeedbackModal from './components/FeedbackModal';
import type { FeedbackModalRef } from './types/feedback';
import type { Message } from './types/message';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

const ChatBot: React.FC = () => {
  const { isActive, sessionToken, toggleChat, closeChat, initializeChat } = useChatSession();
  const { messages, sendMessage, addMessage } = useChatMessages();
  const { 
    isOpen: isFeedbackOpen,
    openFeedback,
    closeFeedback,
    submitFeedback 
  } = useChatFeedback();

  const [isLoading, setIsLoading] = useState(false);
  const feedbackRef = useRef<FeedbackModalRef>(null);
  const [showWelcomePopover, setShowWelcomePopover] = useState(false);

  // Initialize chat when opened
  useEffect(() => {
    if (isActive && !sessionToken) {
      const initialize = async () => {
        setIsLoading(true);
        try {
          const initialMessage = await initializeChat();
          if (initialMessage) {
            addMessage(initialMessage, 'bot');
          }
        } finally {
          setIsLoading(false);
        }
      };
      initialize();
    }
  }, [isActive, sessionToken]);

  // Show popover after a short delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopover(true);
      console.log("Showing welcome popover");
    }, 1000);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowWelcomePopover(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    addMessage(message, 'user');
    setIsLoading(true);
    try {
      const response = await sendMessage(message, sessionToken);
      if (response) {
        addMessage(response, 'bot');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackRequest = () => {
    feedbackRef.current?.openFeedback();
  };

  const handleFeedbackSubmit = async (data: {
    rating: string;
    comment: string;
    name: string;
    email: string;
  }) => {
    const response = await fetch('https://algowhatsapp.algobrainai.com/api/send-facebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value1: data.rating || '0',
        value2: data.name,
        value3: data.email,
        value4: data.comment
      })
    });
    console.log("Submitting feedback:", data);
    
    // Add a thank you message based on the rating
    let responseMessage = "";
    const ratingNum = Number.parseInt(data.rating);
    
    if (ratingNum >= 4) {
      responseMessage = "Thank you for the great rating! We're thrilled you had a positive experience! 🌟";
    } else if (ratingNum >= 3) {
      responseMessage = "Thanks for your feedback! We appreciate your balanced perspective. 👍";
    } else if (ratingNum > 0) {
      responseMessage = "Thank you for your honest feedback. We'll work hard to improve our service. 🙏";
    } else {
      responseMessage = "Thank you for your honest feedback. We'll work hard to improve our service.";
    }
    
    // Add the response message to the chat
    addMessage(responseMessage, 'bot');
  };

  return (
    <div className={`chatbot-container w-full ${isActive ? 'active' : ''}`}>
      <Popover 
        isOpen={showWelcomePopover} 
        onOpenChange={setShowWelcomePopover}
        placement="top"
        offset={10}
        showArrow={true}
      >
        <PopoverTrigger>
          <div className="fixed bottom-20 right-24 w-1 h-1" />
        </PopoverTrigger>
        <PopoverContent className="max-w-[300px]">
          <div className="px-4 py-3">
            <h4 className="text-lg font-semibold mb-1">👋 Welcome!</h4>
            <p className="text-sm text-default-500">
              Need help? I'm your AI assistant, ready to answer your questions. Click the chat button to get started!
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <button 
        type="button"
        className="chat-button" 
        aria-label="Open chat"
        onClick={toggleChat}
      >
        {isActive ? (
          <svg className="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <title>Close chat</title>
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <title>Open chat</title>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        )}
      </button>

      <div className={`chat-window ${isActive ? 'active' : ''}`}>
        <ChatHeader onClose={closeChat} />
        <ChatMessages 
          messages={messages} 
          onSendMessage={handleSendMessage}
          onFeedbackRequest={handleFeedbackRequest}
          isLoading={isLoading}
        />
        <ChatInput onSendMessage={handleSendMessage} />
        
        <FeedbackModal 
          ref={feedbackRef}
          onSubmit={handleFeedbackSubmit}
        />
      </div>
    </div>
  );
};

export default ChatBot; 