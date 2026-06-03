'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { TravelerType } from '@/types';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const TYPES = [
  {
    id: 'solo' as TravelerType,
    emoji: '🧳',
    label: 'Solo',
    sub: 'Just me',
    bg: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&q=70',
  },
  {
    id: 'couple' as TravelerType,
    emoji: '💑',
    label: 'Couple',
    sub: 'Two of us',
    bg: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=70',
  },
  {
    id: 'family' as TravelerType,
    emoji: '👨‍👩‍👧‍👦',
    label: 'Family',
    sub: 'Kids welcome',
    bg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=70',
  },
  {
    id: 'group' as TravelerType,
    emoji: '👥',
    label: 'Group',
    sub: 'Friends or colleagues',
    bg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=70',
  },
];

interface CounterProps {
  label: string;
  sub: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
}

function Counter({ label, sub, value, min = 0, onChange }: CounterProps) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-[16px] font-semibold text-[var(--text-primary)]">{label}</p>
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={cn(
            'w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-150',
            value <= min
              ? 'border-[var(--border)] text-[var(--text-muted)] opacity-30 cursor-not-allowed'
              : 'border-[var(--border-mid)] text-[var(--text-primary)] hover:border-[var(--border-gold)] hover:text-[var(--gold-light)] active:scale-95'
          )}
          style={{ transition: 'border-color 0.15s, color 0.15s, transform 0.1s' }}
        >
          <Minus className="w-4 h-4" />
        </button>

        <motion.span
          key={value}
          initial={{ scale: 1.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="text-[1.6rem] font-bold text-[var(--text-primary)] w-9 text-center tabular-nums"
        >
          {value}
        </motion.span>

        <button
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-[var(--navy)] hover:brightness-110 active:scale-95"
          style={{ transition: 'filter 0.15s, transform 0.1s' }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Step03Travelers() {
  const { travelerType, travelers, setTravelerType, setTravelers, nextStep, prevStep } = usePackageStore();

  function handleTypeSelect(type: TravelerType) {
    setTravelerType(type);
    if (type === 'solo')   setTravelers({ adults: 1, children: 0, infants: 0 });
    if (type === 'couple') setTravelers({ adults: 2, children: 0, infants: 0 });
  }

  const total = travelers.adults + travelers.children + travelers.infants;

  return (
    <div className="space-y-7">
      <StepHeader
        step={3}
        totalSteps={10}
        title="Who's traveling?"
        subtitle="Let us tailor the experience — rooms, activities, and pricing all depend on your group."
      />

      {/* Type cards — CSS hover, no whileHover */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TYPES.map((type, i) => {
          const isSelected = travelerType === type.id;
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                onClick={() => handleTypeSelect(type.id)}
                className={cn(
                  'hover-card relative overflow-hidden rounded-2xl w-full shadow-card',
                  isSelected ? 'ring-2 ring-[var(--gold)] ring-offset-1 ring-offset-[var(--navy)]' : ''
                )}
                style={{ height: '160px' }}
              >
                <Image
                  src={type.bg}
                  alt={type.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  quality={70}
                />
                <div className="absolute inset-0 overlay-darker" />
                {isSelected && (
                  <div className="absolute inset-0 bg-[rgba(201,168,76,0.15)]" />
                )}

                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{type.emoji}</span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center">
                        <Check className="w-3 h-3 text-[var(--navy)]" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white text-[15px]">{type.label}</p>
                    <p className="text-[12px] text-white/50 mt-0.5">{type.sub}</p>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Counter — animates in when type is chosen */}
      <AnimatePresence>
        {travelerType && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-2xl px-6 py-2"
          >
            <div className="flex items-center justify-between py-4 border-b border-[var(--border)]">
              <p className="font-semibold text-[var(--text-primary)]">Number of travelers</p>
              <motion.div
                key={total}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="glass-gold rounded-full px-3.5 py-1 text-[13px] font-bold text-[var(--gold)]"
              >
                {total} {total === 1 ? 'person' : 'people'}
              </motion.div>
            </div>
            <Counter label="Adults"   sub="Age 12+"   value={travelers.adults}   min={1} onChange={(v) => setTravelers({ ...travelers, adults: v })} />
            <Counter label="Children" sub="Ages 2–11" value={travelers.children}        onChange={(v) => setTravelers({ ...travelers, children: v })} />
            <Counter label="Infants"  sub="Under 2"   value={travelers.infants}         onChange={(v) => setTravelers({ ...travelers, infants: v })} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} size="md" disabled={!travelerType}>Continue →</Button>
      </div>
    </div>
  );
}
