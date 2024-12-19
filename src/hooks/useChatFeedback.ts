import { useState } from 'react';

export const useChatFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openFeedback = () => {
    console.log("Opening feedback");
    setIsOpen(true);
  };

  const closeFeedback = () => {
    console.log("Closing feedback");
    setIsOpen(false);
  };

  const submitFeedback = async (data: {
    rating: string;
    comment: string;
    name: string;
    email: string;
  }) => {
    console.log("Submitting feedback:1", data);
    // Add your feedback submission logic here
    setIsOpen(false);
  };

  return {
    isOpen,
    openFeedback,
    closeFeedback,
    submitFeedback
  };
}; 