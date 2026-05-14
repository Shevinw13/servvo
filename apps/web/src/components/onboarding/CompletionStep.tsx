'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConfettiCelebration } from '@/components/shared/ConfettiCelebration';

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <ConfettiCelebration trigger={showConfetti} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
      >
        <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h1 className="mb-3 text-3xl font-bold text-foreground">You&apos;re all set!</h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        Your branded customer experience is ready. Head to your dashboard to explore all the tools at your disposal.
      </p>

      <button
        onClick={onComplete}
        className="rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
