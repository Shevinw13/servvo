'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface StepTransitionProps {
  children: React.ReactNode;
  direction: 'forward' | 'backward';
  stepKey: string;
}

const variants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? -80 : 80,
    opacity: 0,
  }),
};

export function StepTransition({ children, direction, stepKey }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
