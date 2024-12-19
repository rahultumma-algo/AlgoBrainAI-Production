import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const characterVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.03, // Adjust speed by changing this value
    },
  }),
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={characterVariants}
          custom={index}
          initial="hidden"
          animate="visible"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default AnimatedText; 