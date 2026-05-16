'use client';

import { motion } from 'framer-motion';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <img src="/icon.png" alt="Servvo" className="h-20 w-20 rounded-2xl shadow-lg" />
      </motion.div>

      <h1 className="mb-3 text-3xl font-bold text-foreground">
        Better Service Starts at Home
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        Set up your white-label brand in minutes. Your customers will see your brand, your colors, your voice — powered by Servvo.
      </p>

      <button
        onClick={onNext}
        className="rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
      >
        Get Started
      </button>

      <p className="mt-4 text-sm text-muted-foreground">Takes about 3 minutes</p>
    </div>
  );
}
