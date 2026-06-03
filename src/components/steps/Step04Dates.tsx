'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import { usePackageStore } from '@/store/usePackageStore';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const QUICK = [
  { label: 'Next weekend', days: 3, offset: 5 },
  { label: '1 week', days: 7, offset: 14 },
  { label: '10 days', days: 10, offset: 21 },
  { label: '2 weeks', days: 14, offset: 30 },
  { label: '3 weeks', days: 21, offset: 45 },
];

const MONTHS = [
  { m: 'Jan', icon: '❄️', type: 'peak' },
  { m: 'Feb', icon: '❄️', type: 'peak' },
  { m: 'Mar', icon: '🌸', type: 'shoulder' },
  { m: 'Apr', icon: '🌸', type: 'shoulder' },
  { m: 'May', icon: '🌤️', type: 'value' },
  { m: 'Jun', icon: '☀️', type: 'hot' },
  { m: 'Jul', icon: '🔥', type: 'hot' },
  { m: 'Aug', icon: '⛅', type: 'value' },
  { m: 'Sep', icon: '🍂', type: 'shoulder' },
  { m: 'Oct', icon: '🍁', type: 'peak' },
  { m: 'Nov', icon: '⭐', type: 'peak' },
  { m: 'Dec', icon: '🎄', type: 'peak' },
];

const TYPE_STYLE: Record<string, string> = {
  peak: 'bg-[rgba(201,168,76,0.12)] text-[var(--gold)]',
  shoulder: 'bg-[rgba(16,185,129,0.10)] text-emerald-400',
  value: 'bg-[rgba(99,102,241,0.10)] text-indigo-400',
  hot: 'bg-[rgba(239,68,68,0.10)] text-red-400',
};

export function Step04Dates() {
  const { dateRange, setDateRange, nextStep, prevStep } = usePackageStore();

  const fromDate = dateRange.from ?? undefined;
  const toDate = dateRange.to ?? undefined;
  const today = new Date();

  const nights = fromDate && toDate ? differenceInDays(toDate, fromDate) : null;

  function applyQuick(offset: number, days: number) {
    const from = addDays(today, offset);
    setDateRange({ from, to: addDays(from, days) });
  }

  function handleSelect(range: { from?: Date; to?: Date } | undefined) {
    setDateRange({ from: range?.from ?? null, to: range?.to ?? null });
  }

  return (
    <div className="space-y-7">
      <StepHeader
        step={4}
        totalSteps={10}
        title="When are you traveling?"
        subtitle="Select your travel window — we'll highlight the best deals and weather for your destination."
      />

      {/* Quick select */}
      <div>
        <p className="label-caps mb-3">Quick select</p>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => {
            const active = fromDate && toDate && differenceInDays(toDate, fromDate) === q.days;
            return (
              <button
                key={q.label}
                onClick={() => applyQuick(q.offset, q.days)}
                className={cn(
                  'px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200',
                  active
                    ? 'gradient-gold text-[var(--navy)]'
                    : 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]'
                )}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-5 overflow-x-auto"
      >
        <DayPicker
          mode="range"
          selected={{ from: fromDate, to: toDate }}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={{ before: today }}
          className="mx-auto"
          classNames={{
            root: 'text-[var(--text-primary)] !font-[inherit]',
            months: 'flex flex-wrap gap-8 justify-center',
            month: 'space-y-3',
            month_caption: 'flex items-center justify-between px-1 mb-1',
            caption_label: 'text-[15px] font-semibold text-[var(--text-primary)]',
            nav: 'flex items-center gap-1',
            button_previous: 'p-1.5 rounded-lg glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)] transition-all',
            button_next: 'p-1.5 rounded-lg glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)] transition-all',
            weeks: 'mt-2',
            week: 'flex',
            weekdays: 'flex',
            weekday: 'text-[var(--text-muted)] text-[11px] font-semibold w-9 text-center pb-2 uppercase',
            day: 'p-0',
            day_button: 'w-9 h-9 text-[13px] rounded-xl transition-all duration-150',
            outside: 'opacity-20',
            disabled: 'opacity-15 cursor-not-allowed',
            today: '[&>button]:ring-1 [&>button]:ring-[var(--border-gold)]',
            selected: '',
            range_start: '',
            range_end: '',
            range_middle: '[&>button]:rounded-none [&>button]:bg-[rgba(201,168,76,0.08)]',
          }}
        />
      </motion.div>

      {/* Summary strip */}
      {fromDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 glass-gold rounded-xl"
        >
          <Calendar className="w-5 h-5 text-[var(--gold)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">
              {format(fromDate, 'MMM d, yyyy')}
              {toDate ? ` → ${format(toDate, 'MMM d, yyyy')}` : ' → Choose return date'}
            </p>
            {nights && nights > 0 && (
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{nights} nights · {nights + 1} days</p>
            )}
          </div>
          {nights && (
            <div className="glass-gold rounded-full px-3.5 py-1.5 text-[13px] font-bold text-[var(--gold)] shrink-0">
              {nights}N
            </div>
          )}
        </motion.div>
      )}

      {/* Season guide */}
      <div>
        <p className="label-caps mb-3">Seasonal guide</p>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
          {MONTHS.map((m) => (
            <div
              key={m.m}
              className={cn('p-1.5 rounded-lg text-center text-[11px] cursor-default', TYPE_STYLE[m.type])}
            >
              <div className="text-[13px] mb-0.5">{m.icon}</div>
              <div className="font-semibold">{m.m}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2.5 text-[11px] text-[var(--text-muted)]">
          {[
            { color: 'bg-[var(--gold)]', label: 'Peak' },
            { color: 'bg-emerald-400', label: 'Shoulder' },
            { color: 'bg-indigo-400', label: 'Best Value' },
            { color: 'bg-red-400', label: 'Hot Season' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={nextStep}>Skip</Button>
          <Button onClick={nextStep} size="md" disabled={!fromDate}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
