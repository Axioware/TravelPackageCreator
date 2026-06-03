'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { DEPARTURE_CITIES, HARAM_DISTANCES, HAJJ_UMRAH_HOTELS } from '@/data/destinations';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { formatPKR } from '@/lib/utils';
import { cn } from '@/lib/utils';

const DURATIONS = [
  { days: 10, label: '10 Days' },
  { days: 14, label: '14 Days' },
  { days: 21, label: '21 Days' },
  { days: 30, label: '30 Days' },
];

export function StepHajjUmrah() {
  const {
    travelType,
    departureCity, setDepartureCity,
    hotelDistanceFromHaram, setHotelDistanceFromHaram,
    groupOrPrivate, setGroupOrPrivate,
    mealsIncluded, setMealsIncluded,
    elderlyAssistance, setElderlyAssistance,
    directFlightPreferred, setDirectFlightPreferred,
    hajjUmrahDuration, setHajjUmrahDuration,
    selectedHotel, setSelectedHotel,
    nextStep, prevStep,
  } = usePackageStore();

  const [phase, setPhase] = useState<'setup' | 'hotels'>('setup');
  const isUmrah = travelType === 'umrah';

  if (phase === 'hotels') {
    return (
      <div className="space-y-6">
        <StepHeader
          step={4}
          totalSteps={6}
          emoji="🏨"
          title="Choose Your Hotel"
          subtitle="Hotels near Masjid Al-Haram, carefully selected for comfort and proximity"
        />

        {/* Distance filter */}
        <div className="flex flex-wrap gap-2">
          {HARAM_DISTANCES.map((d) => (
            <button
              key={d.id}
              onClick={() => setHotelDistanceFromHaram(d.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                hotelDistanceFromHaram === d.id
                  ? 'gradient-gold text-[#0A1628]'
                  : 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]'
              )}
            >
              🕋 {d.label}
            </button>
          ))}
        </div>

        {/* Haram distance visualization */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--gold)]" />
            Distance from Masjid Al-Haram
          </p>
          <div className="relative flex items-end gap-2 h-16">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 glass-gold rounded-xl flex items-center justify-center text-2xl">🕋</div>
              <span className="text-xs text-[var(--text-muted)]">Haram</span>
            </div>
            {HARAM_DISTANCES.map((d, i) => (
              <div key={d.id} className="flex flex-col items-center gap-1">
                <div className={cn(
                  'rounded-lg flex items-center justify-center text-lg transition-all duration-300',
                  hotelDistanceFromHaram === d.id
                    ? 'gradient-gold w-10 h-10 shadow-lg'
                    : 'glass w-8 h-8 opacity-60',
                )} style={{ marginBottom: `${i * 2}px` }}>
                  🏨
                </div>
                <span className={cn('text-xs', hotelDistanceFromHaram === d.id ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]')}>
                  {d.label.split('–')[0].trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotel cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HAJJ_UMRAH_HOTELS.map((hotel, i) => {
            const isSelected = selectedHotel?.id === hotel.id;
            return (
              <motion.button
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedHotel(isSelected ? null : hotel)}
                className={cn(
                  'relative text-left rounded-2xl overflow-hidden border transition-all duration-300',
                  isSelected ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/25' : 'border-[var(--border)] hover:border-[var(--border-gold)]'
                )}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
                  <div className="absolute bottom-3 left-3 glass-gold rounded-full px-2.5 py-1 text-xs font-bold text-[var(--gold)]">
                    🕋 {hotel.distanceFromHaram}
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-7 h-7 rounded-full gradient-gold flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#0A1628]" />
                    </motion.div>
                  )}
                </div>
                <div className={cn('p-4', isSelected && 'bg-gradient-to-br from-[rgba(201,168,76,0.10)] to-transparent')}>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">{hotel.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hotel.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full glass text-[var(--text-muted)]">{a}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[var(--gold)]">{formatPKR(hotel.pricePerNight)}</span>
                      <span className="text-xs text-[var(--text-muted)]">/night</span>
                    </div>
                    <span className="text-xs glass-gold rounded-full px-2.5 py-1 text-[var(--gold)]">{hotel.mealPlan}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setPhase('setup')}>
            Back
          </Button>
          <Button onClick={nextStep} size="md">
            Continue →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepHeader
        step={2}
        totalSteps={6}
        emoji={isUmrah ? '🌙' : '☪️'}
        title={isUmrah ? 'Plan Your Umrah' : 'Plan Your Hajj'}
        subtitle="Every detail matters for this sacred journey — let's set it up perfectly"
      />

      {/* Departure city */}
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Departure City</p>
        <div className="flex flex-wrap gap-2">
          {DEPARTURE_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setDepartureCity(city)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                departureCity === city
                  ? 'gradient-gold text-[#0A1628]'
                  : 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]'
              )}
            >
              ✈️ {city}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Duration</p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.days}
              onClick={() => setHajjUmrahDuration(d.days)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                hajjUmrahDuration === d.days
                  ? 'gradient-gold text-[#0A1628]'
                  : 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Group or Private */}
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Package Type</p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { id: 'group', emoji: '👥', label: 'Group Package', desc: 'Travel with others, cost-effective' },
            { id: 'private', emoji: '🌟', label: 'Private Package', desc: 'Personalized, dedicated service' },
          ] as const).map((opt) => (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setGroupOrPrivate(opt.id)}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer glass',
                groupOrPrivate === opt.id ? 'card-selected' : 'border-[var(--border)] hover:border-[var(--border-gold)]'
              )}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <p className="font-semibold text-[var(--text-primary)]">{opt.label}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{opt.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="glass rounded-2xl p-5 space-y-4">
        {[
          { label: 'Direct Flights Preferred', desc: 'No layovers', value: directFlightPreferred, set: setDirectFlightPreferred, emoji: '✈️' },
          { label: 'Meals Included', desc: 'Full meal plan during stay', value: mealsIncluded, set: setMealsIncluded, emoji: '🍽️' },
          { label: 'Elderly Assistance', desc: 'Wheelchair & extra care support', value: elderlyAssistance, set: setElderlyAssistance, emoji: '🤲' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="font-medium text-[var(--text-primary)] text-sm">{item.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => item.set(!item.value)}
              className={cn(
                'relative w-12 h-6 rounded-full transition-all duration-300',
                item.value ? 'gradient-gold' : 'bg-[var(--surface-hover)]'
              )}
            >
              <motion.div
                animate={{ x: item.value ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Religious guidance info */}
      <div className="glass-gold rounded-xl p-4">
        <p className="text-sm font-semibold text-[var(--gold)] mb-2">📖 Included Religious Support</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
          {[
            '✓ Experienced religious guide',
            '✓ Pre-departure orientation',
            '✓ Miqat rituals assistance',
            '✓ Tawaf & Sa\'i guidance',
            isUmrah ? '✓ Flexible Umrah schedule' : '✓ Hajj rituals coordination',
            '✓ Ziyarat tours Madinah',
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>
          Back
        </Button>
        <Button onClick={() => setPhase('hotels')} size="md" disabled={!departureCity}>
          Choose Hotel →
        </Button>
      </div>
    </div>
  );
}
