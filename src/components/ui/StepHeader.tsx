'use client';

import { motion } from 'framer-motion';

interface StepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  emoji?: string;
  label?: string;
}

export function StepHeader({ step, totalSteps, title, subtitle, emoji, label }: StepHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      {/* Step label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="label-caps">{label ?? `Step ${step} of ${totalSteps}`}</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="label-caps">{Math.round((step / totalSteps) * 100)}%</span>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold leading-tight tracking-tight text-[var(--text-primary)]">
          {emoji && <span className="mr-3 inline-block">{emoji}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="text-[var(--text-secondary)] text-[15px] md:text-base leading-relaxed max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
