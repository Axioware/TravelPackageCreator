'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveRatesAction, type RateRow } from './actions';
import { cn } from '@/lib/utils';

const ZONES = [
  { id: 'walking_5',  label: 'Within 5-min walk',  sub: 'Right next to Haram — highest demand' },
  { id: 'walking_15', label: '10–15-min walk',      sub: 'Close & comfortable — most popular' },
  { id: 'shuttle',    label: 'Shuttle distance',    sub: '1–2 km, hotel bus included' },
  { id: 'bus',        label: 'Bus route',           sub: '2–4 km, public transport nearby' },
];

const COMFORT = [
  { id: 'basic',       label: 'Clean & Simple', sub: '2–3★' },
  { id: 'comfortable', label: 'Comfortable',    sub: '4★' },
  { id: 'premium',     label: 'Premium',        sub: '5★' },
  { id: 'luxury',      label: 'Luxury',         sub: '5★ Deluxe' },
];

const DURATIONS = [10, 14, 21, 30];

type RateMap = Record<string, Record<string, number>>;

function buildMap(rows: RateRow[]): RateMap {
  const m: RateMap = {};
  for (const r of rows) {
    if (!m[r.zone]) m[r.zone] = {};
    m[r.zone][r.comfort_level] = Number(r.price_per_person);
  }
  return m;
}

interface Props {
  initialRates: RateRow[];
  travelType: string;
  groupType: string;
  duration: number;
}

export function RatesEditor({ initialRates, travelType, groupType, duration }: Props) {
  const router = useRouter();
  const [rates, setRates] = useState<RateMap>(() => buildMap(initialRates));
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    setRates(buildMap(initialRates));
    setSaveStatus('idle');
  }, [initialRates]);

  function navigate(type: string, group: string, dur: number) {
    router.push(`/admin/rates?type=${type}&group=${group}&duration=${dur}`);
  }

  function setPrice(zone: string, comfort: string, value: string) {
    const num = value === '' ? 0 : parseFloat(value);
    setRates((prev) => ({
      ...prev,
      [zone]: { ...(prev[zone] ?? {}), [comfort]: num },
    }));
    setSaveStatus('idle');
  }

  async function handleSave() {
    setSaving(true);
    try {
      const rows: RateRow[] = ZONES.flatMap((z) =>
        COMFORT.map((c) => ({
          travel_type: travelType,
          zone: z.id,
          comfort_level: c.id,
          duration_days: duration,
          group_type: groupType,
          price_per_person: rates[z.id]?.[c.id] ?? 0,
        }))
      );
      await saveRatesAction(rows);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3500);
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  const btnBase = 'px-4 py-2 text-[13px] font-semibold transition-colors';
  const btnActive = 'bg-[#1C2B3A] text-white';
  const btnInactive = 'bg-white text-[#52697A] hover:bg-[#F3F0EA]';
  const btnGoldActive = 'text-[#1C2B3A]';

  return (
    <div className="space-y-6">

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Travel type */}
        <div className="flex rounded-xl overflow-hidden border border-[rgba(0,0,0,0.09)] bg-white shadow-sm">
          {['umrah', 'hajj'].map((t) => (
            <button
              key={t}
              onClick={() => navigate(t, groupType, duration)}
              className={cn(
                btnBase, 'capitalize',
                travelType === t
                  ? 'gradient-gold ' + btnGoldActive
                  : btnInactive
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Group / Private */}
        <div className="flex rounded-xl overflow-hidden border border-[rgba(0,0,0,0.09)] bg-white shadow-sm">
          {['group', 'private'].map((g) => (
            <button
              key={g}
              onClick={() => navigate(travelType, g, duration)}
              className={cn(btnBase, 'capitalize', groupType === g ? btnActive : btnInactive)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Duration */}
        <div className="flex rounded-xl overflow-hidden border border-[rgba(0,0,0,0.09)] bg-white shadow-sm">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => navigate(travelType, groupType, d)}
              className={cn(btnBase, duration === d ? btnActive : btnInactive)}
            >
              {d}d
            </button>
          ))}
        </div>

        <p className="text-[13px] text-[#8B9FAE] ml-auto">
          Last saved: {new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
        </p>
      </div>

      {/* Rate grid */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Header */}
        <div
          className="grid border-b border-[rgba(0,0,0,0.07)]"
          style={{ gridTemplateColumns: '1fr repeat(4, 1fr)' }}
        >
          <div className="px-5 py-4 text-[12px] font-bold uppercase tracking-widest text-[#8B9FAE]">
            Zone / Comfort
          </div>
          {COMFORT.map((c) => (
            <div key={c.id} className="px-4 py-4">
              <p className="text-[13px] font-bold text-[#1C2B3A]">{c.label}</p>
              <p className="text-[11px] text-[#8B9FAE]">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        {ZONES.map((zone, zi) => (
          <div
            key={zone.id}
            className={cn(
              'grid border-b border-[rgba(0,0,0,0.06)] last:border-0 hover:bg-[rgba(201,168,76,0.02)] transition-colors',
            )}
            style={{ gridTemplateColumns: '1fr repeat(4, 1fr)' }}
          >
            {/* Zone label */}
            <div className="px-5 py-4">
              <p className="text-[14px] font-semibold text-[#1C2B3A]">{zone.label}</p>
              <p className="text-[12px] text-[#8B9FAE] mt-0.5">{zone.sub}</p>
            </div>

            {/* Price inputs */}
            {COMFORT.map((c) => {
              const val = rates[zone.id]?.[c.id];
              return (
                <div key={c.id} className="px-3 py-3 flex items-center">
                  <div className="flex w-full rounded-lg border border-[rgba(0,0,0,0.10)] overflow-hidden focus-within:border-[#C9A84C] focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.12)] transition-all">
                    <span className="px-2.5 py-2.5 text-[12px] font-medium text-[#8B9FAE] bg-[#F8F5F0] border-r border-[rgba(0,0,0,0.08)] shrink-0 select-none">
                      PKR
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={val ?? ''}
                      onChange={(e) => setPrice(zone.id, c.id, e.target.value)}
                      placeholder="0"
                      className="flex-1 px-3 py-2.5 text-[14px] font-semibold text-[#1C2B3A] bg-white focus:outline-none w-0 min-w-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-[#8B9FAE]">
          <span className="font-semibold capitalize text-[#1C2B3A]">
            {travelType} · {groupType} · {duration} days
          </span>
          {' '}— {ZONES.length * COMFORT.length} price points
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <span className="text-[14px] font-semibold text-emerald-600">✓ Rates saved</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-[14px] font-semibold text-red-500">Save failed — retry</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-7 py-2.5 rounded-xl font-bold text-[14px] text-[#1C2B3A] disabled:opacity-50 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #E8C96A, #C9A84C)' }}
          >
            {saving ? 'Saving…' : 'Save Rates'}
          </button>
        </div>
      </div>
    </div>
  );
}
