import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import React from "react";

interface TextGenerateEffectProps {
  words: string | React.ReactNode;
  className?: string;
  filter?: boolean;
  duration?: number;
  onComplete?: () => void;
  children?: React.ReactNode;
}

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  className = "",
  filter = true,
  duration = 0.5,
  onComplete,
  children
}) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const elements = scope.current?.querySelectorAll('.animate-text');
    if (elements?.length) {
      animate(
        elements,
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: 0.8,
          delay: stagger(0.08),
          ease: "easeOut",
          onComplete: () => onComplete?.()
        }
      );
    } else {
      // If no elements to animate, still call onComplete
      onComplete?.();
    }
  }, [animate, filter, duration, onComplete]);

  // If children are provided, render them with animation
  if (children) {
    return (
      <motion.div ref={scope} className={className}>
        <motion.span
          className="animate-text dark:text-white text-black opacity-0"
          initial={{ 
            opacity: 0,
            filter: filter ? "blur(8px)" : "none",
          }}
        >
          {children}
        </motion.span>
      </motion.div>
    );
  }

  // If words is a React element, render it with animation
  if (React.isValidElement(words)) {
    return (
      <motion.div ref={scope} className={className}>
        <motion.span
          className="animate-text dark:text-white text-black opacity-0"
          initial={{ 
            opacity: 0,
            filter: filter ? "blur(8px)" : "none",
          }}
        >
          {words}
        </motion.span>
      </motion.div>
    );
  }

  // If words is a string, split and animate each word
  const wordsArray = typeof words === 'string' ? words.split(" ") : [];
  
  return (
    <motion.div ref={scope} className={className}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="animate-text dark:text-white text-black opacity-0"
          initial={{ 
            opacity: 0,
            filter: filter ? "blur(8px)" : "none",
          }}
          style={{
            display: "inline-block",
            marginRight: "0.2em",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}; 