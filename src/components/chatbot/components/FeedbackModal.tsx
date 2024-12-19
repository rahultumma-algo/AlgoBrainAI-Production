import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Textarea } from "@nextui-org/react";
import type { FeedbackModalRef, FeedbackModalProps } from '../types/feedback';

const FeedbackModal = forwardRef<FeedbackModalRef, FeedbackModalProps>((props, ref) => {
  const { onSubmit } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<string>('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const openFeedback = () => {
    setIsOpen(true);
  };

  const closeFeedback = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Log the feedback values to the console
    console.log('Feedback submitted:', {
      rating,
      comment,
      name,
      email
    });

    onSubmit({
      rating,
      comment,
      name,
      email
    });
    setRating('');
    setComment('');
    setName('');
    setEmail('');
    closeFeedback();
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    closeFeedback();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useImperativeHandle(ref, () => ({
    openFeedback
  }));

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200]"
            onClick={handleClose}
          />
          
          {/* Feedback Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-xl shadow-lg z-[201] max-h-[90vh] overflow-y-auto"
            onClick={handleModalClick}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 className="text-lg font-semibold text-white">Feedback</h3>
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white p-2"
                  type="button"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6" 
                onClick={handleModalClick}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {/* Star Rating */}
                <div className="rating-container flex flex-col items-center">
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <label 
                      className="text-white text-sm font-medium"
                      id="rating-label"
                    >
                      Rate your experience
                    </label>
                    <div 
                      className="star-rating flex justify-center gap-2"
                      role="radiogroup"
                      aria-labelledby="rating-label"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <React.Fragment key={value}>
                          <input
                            type="radio"
                            name="rating"
                            id={`star${value}`}
                            value={value}
                            checked={rating === value.toString()}
                            onChange={(e) => {
                              console.log('Rating changed:', e.target.value);
                              setRating(e.target.value);
                            }}
                            className="hidden"
                            aria-label={`${value} stars`}
                          />
                          <label 
                            htmlFor={`star${value}`}
                            className={`text-3xl cursor-pointer ${
                              rating >= value.toString() ? 'text-yellow-400' : 'text-gray-400'
                            } hover:text-yellow-300 transition-colors`}
                            onClick={() => setRating(value.toString())}
                          >
                            ★
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

        
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={name}
                  onValueChange={setName}
                  variant="bordered"
                  classNames={{
                    label: "text-white",
                    input: "text-white",
                    inputWrapper: "bg-gray-800 data-[hover=true]:bg-gray-800/80",
                  }}
                  required
                />

                <Input
                  type="email"
                  label="Email"
                  placeholder="Your email"
                  value={email}
                  onValueChange={setEmail}
                  variant="bordered"
                  classNames={{
                    label: "text-white",
                    input: "text-white",
                    inputWrapper: "bg-gray-800 data-[hover=true]:bg-gray-800/80",
                  }}
                  required
                />
        <Textarea
                  label="Your feedback"
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onValueChange={setComment}
                  variant="bordered"
                  classNames={{
                    label: "text-white",
                    input: "text-white",
                    inputWrapper: "bg-gray-800 data-[hover=true]:bg-gray-800/80",
                  }}
                  required
                />

                <div className="flex gap-2 justify-end pt-4">
                  <Button 
                    color="danger" 
                    variant="light" 
                    onClick={handleClose}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    color="primary" 
                    type="submit"
                  >
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

FeedbackModal.displayName = 'FeedbackModal';

export default FeedbackModal; 