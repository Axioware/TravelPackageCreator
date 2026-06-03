'use client';

import { create } from 'zustand';
import { PackageState, PackageActions, TravelType, TravelerType, FlightClass, BudgetTier, TransportType, Hotel, Activity, Travelers, DateRange } from '@/types';

const BUDGET_BASE: Record<NonNullable<BudgetTier>, number> = {
  budget: 80000,
  standard: 150000,
  premium: 280000,
  luxury: 500000,
  ultra: 1000000,
};

const FLIGHT_MULTIPLIER: Record<NonNullable<FlightClass>, number> = {
  economy: 1,
  premium_economy: 1.4,
  business: 2.2,
  first: 3.5,
};

const TRANSPORT_MULTIPLIER: Record<NonNullable<TransportType>, number> = {
  shared: 1,
  private: 1.15,
  luxury: 1.35,
};

function computePrice(state: Partial<PackageState>): number {
  const base = state.budgetTier ? BUDGET_BASE[state.budgetTier] : 150000;
  const travelers = (state.travelers?.adults ?? 1) + (state.travelers?.children ?? 0) * 0.7;
  const flightMult = state.flightClass ? FLIGHT_MULTIPLIER[state.flightClass] : 1;
  const transportMult = state.transportType ? TRANSPORT_MULTIPLIER[state.transportType] : 1;
  const hotel = state.selectedHotel ? state.selectedHotel.pricePerNight * 5 : 0;
  const activities = state.selectedActivities?.reduce((sum, a) => sum + a.price, 0) ?? 0;
  const requirements = (state.specialRequirements?.length ?? 0) * 3000;

  return Math.round(
    (base + hotel + activities + requirements) * travelers * flightMult * transportMult
  );
}

function computeScore(state: Partial<PackageState>): number {
  let score = 40;
  if (state.destination) score += 10;
  if (state.travelerType) score += 5;
  if (state.dateRange?.from) score += 8;
  if (state.budgetTier) score += 7;
  if (state.flightClass) score += 8;
  if (state.selectedHotel) score += 10;
  if ((state.selectedActivities?.length ?? 0) > 0) score += 7;
  if (state.transportType) score += 5;
  return Math.min(score, 99);
}

const initialState: PackageState = {
  currentStep: 0,
  travelType: null,
  destination: null,
  travelerType: null,
  travelers: { adults: 2, children: 0, infants: 0 },
  dateRange: { from: null, to: null },
  budgetTier: null,
  budgetAmount: 150000,
  flightClass: null,
  selectedHotel: null,
  selectedActivities: [],
  transportType: null,
  specialRequirements: [],
  leadName: '',
  leadPhone: '',
  leadEmail: '',
  departureCity: null,
  hotelDistanceFromHaram: null,
  groupOrPrivate: null,
  mealsIncluded: true,
  elderlyAssistance: false,
  directFlightPreferred: false,
  hajjUmrahDuration: 14,
  estimatedPrice: 150000,
  packageScore: 40,
};

export const usePackageStore = create<PackageState & PackageActions>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),

  setTravelType: (travelType) =>
    set((s) => {
      const next = { ...s, travelType };
      return { travelType, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setDestination: (destination) =>
    set((s) => {
      const next = { ...s, destination };
      return { destination, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setTravelerType: (travelerType) =>
    set((s) => {
      const next = { ...s, travelerType };
      return { travelerType, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setTravelers: (travelers) =>
    set((s) => {
      const next = { ...s, travelers };
      return { travelers, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setDateRange: (dateRange) =>
    set((s) => {
      const next = { ...s, dateRange };
      return { dateRange, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setBudgetTier: (budgetTier) =>
    set((s) => {
      const amount = budgetTier ? BUDGET_BASE[budgetTier] : s.budgetAmount;
      const next = { ...s, budgetTier, budgetAmount: amount };
      return { budgetTier, budgetAmount: amount, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setBudgetAmount: (budgetAmount) =>
    set((s) => {
      const next = { ...s, budgetAmount };
      return { budgetAmount, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setFlightClass: (flightClass) =>
    set((s) => {
      const next = { ...s, flightClass };
      return { flightClass, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setSelectedHotel: (selectedHotel) =>
    set((s) => {
      const next = { ...s, selectedHotel };
      return { selectedHotel, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  toggleActivity: (activity) =>
    set((s) => {
      const exists = s.selectedActivities.find((a) => a.id === activity.id);
      const selectedActivities = exists
        ? s.selectedActivities.filter((a) => a.id !== activity.id)
        : [...s.selectedActivities, activity];
      const next = { ...s, selectedActivities };
      return { selectedActivities, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setTransportType: (transportType) =>
    set((s) => {
      const next = { ...s, transportType };
      return { transportType, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  toggleSpecialRequirement: (id) =>
    set((s) => {
      const exists = s.specialRequirements.includes(id);
      const specialRequirements = exists
        ? s.specialRequirements.filter((r) => r !== id)
        : [...s.specialRequirements, id];
      const next = { ...s, specialRequirements };
      return { specialRequirements, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
    }),

  setLeadInfo: (leadName, leadPhone, leadEmail) => set({ leadName, leadPhone, leadEmail }),

  setDepartureCity: (departureCity) => set({ departureCity }),
  setHotelDistanceFromHaram: (hotelDistanceFromHaram) => set({ hotelDistanceFromHaram }),
  setGroupOrPrivate: (groupOrPrivate) => set({ groupOrPrivate }),
  setMealsIncluded: (mealsIncluded) => set({ mealsIncluded }),
  setElderlyAssistance: (elderlyAssistance) => set({ elderlyAssistance }),
  setDirectFlightPreferred: (directFlightPreferred) => set({ directFlightPreferred }),
  setHajjUmrahDuration: (hajjUmrahDuration) => set({ hajjUmrahDuration }),

  reset: () => set(initialState),
}));
