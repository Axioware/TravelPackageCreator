'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Check, Utensils } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { HOTELS_BY_DESTINATION } from '@/data/destinations';
import { Hotel } from '@/types';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { formatPKR } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STAR_FILTERS = [
  { label: 'All', value: 0 },
  { label: '3 ★', value: 3 },
  { label: '4 ★', value: 4 },
  { label: '5 ★', value: 5 },
  { label: '7 ★', value: 7 },
];
const MEAL_FILTERS = ['All Meals', 'Breakfast Included', 'Half Board', 'All Inclusive', 'Full Board'];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-[var(--gold)] text-[var(--gold)]" />
      ))}
      {count > 5 && <span className="text-[var(--gold)] text-[11px] font-bold ml-0.5">+{count - 5}</span>}
    </div>
  );
}

export function Step07Hotels() {
  const { destination, selectedHotel, setSelectedHotel, nextStep, prevStep } = usePackageStore();
  const [starFilter, setStarFilter] = useState(0);
  const [mealFilter, setMealFilter] = useState('All Meals');

  const all: Hotel[] = destination && HOTELS_BY_DESTINATION[destination]
    ? HOTELS_BY_DESTINATION[destination]
    : Object.values(HOTELS_BY_DESTINATION).flat().slice(0, 6);

  const filtered = all.filter((h) => {
    const starOk = starFilter === 0 || h.stars === starFilter;
    const mealOk = mealFilter === 'All Meals' || h.mealPlan === mealFilter;
    return starOk && mealOk;
  });

  return (
    <div className="space-y-7">
      <StepHeader step={7} totalSteps={10} title="Pick your hotel" subtitle="Filter by star rating and meal plan to find the perfect home base." />

      {/* Filters */}
      <div className="space-y-2.5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {STAR_FILTERS.map(({ label, value }) => (
            <button key={label} onClick={() => setStarFilter(value)}
              className={cn('shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors duration-150',
                starFilter === value ? 'gradient-gold text-[var(--navy)]'
                  : 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]')}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {MEAL_FILTERS.map((m) => (
            <button key={m} onClick={() => setMealFilter(m)}
              className={cn('shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] transition-colors duration-150',
                mealFilter === m ? 'gradient-gold text-[var(--navy)] font-semibold'
                  : 'glass border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-gold)]')}>
              {m !== 'All Meals' && <Utensils className="w-3 h-3" />}{m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid — CSS hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-14">
            <p className="text-4xl mb-3">🏨</p>
            <p className="text-[var(--text-muted)]">No hotels match your filters.</p>
          </div>
        ) : filtered.map((hotel, i) => {
          const isSelected = selectedHotel?.id === hotel.id;
          return (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.2) }}
            >
              <button
                onClick={() => setSelectedHotel(isSelected ? null : hotel)}
                className={cn(
                  'hover-card relative text-left rounded-2xl overflow-hidden w-full shadow-card',
                  isSelected ? 'ring-2 ring-[var(--gold)] ring-offset-1 ring-offset-[var(--navy)]' : ''
                )}
              >
                <div className="relative overflow-hidden" style={{ height: '190px' }}>
                  <Image src={hotel.image} alt={hotel.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover" loading="lazy" quality={70} />
                  <div className="absolute inset-0 overlay-darker" />

                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full gradient-gold flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-[var(--navy)]" strokeWidth={3} />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <StarRow count={hotel.stars} />
                    <h3 className="text-[1.05rem] font-bold text-white leading-snug mt-1">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-[12px] text-white/50 mt-0.5">
                      <MapPin className="w-3 h-3" />{hotel.location}
                      {hotel.distanceFromHaram && <span className="ml-2 text-[var(--gold)]">🕋 {hotel.distanceFromHaram}</span>}
                    </div>
                  </div>
                </div>

                <div className={cn('p-4', isSelected ? 'bg-[rgba(201,168,76,0.08)]' : 'bg-[var(--navy-card)]')}>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hotel.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-[11px] px-2 py-0.5 rounded-full glass border border-[var(--border)] text-[var(--text-muted)]">{a}</span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full glass border border-[var(--border)] text-[var(--text-muted)]">
                        +{hotel.amenities.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[1.15rem] font-bold text-[var(--gold-light)]">{formatPKR(hotel.pricePerNight)}</span>
                      <span className="text-[12px] text-[var(--text-muted)] ml-1">/ night</span>
                    </div>
                    <span className="text-[11px] glass-gold rounded-full px-3 py-1 text-[var(--gold)] border border-[var(--border-gold)]">
                      {hotel.mealPlan}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={nextStep}>Skip</Button>
          <Button onClick={nextStep} size="md" disabled={!selectedHotel}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
