import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Stop = {
  id: string;
  type: 'gas' | 'fastfood' | 'tourist' | 'coffee' | 'slowfood';
  name: string;
  address: string;
  distance: string;
};

export type RouteOption = {
  id: string;
  title: string;
  time: string;
  distance: string;
  tag?: string;
  color: string;
  icon: string;
};

interface WayfinderState {
  origin: string;
  destination: string;
  startTime: string;
  preferences: Record<string, boolean>;
  selectedRouteId: string | null;
  stops: Stop[];
}

interface WayfinderContextType {
  state: WayfinderState;
  setOrigin: (val: string) => void;
  setDestination: (val: string) => void;
  setStartTime: (val: string) => void;
  togglePreference: (id: string) => void;
  setSelectedRouteId: (id: string) => void;
  setStops: (stops: Stop[]) => void;
  reset: () => void;
}

const initialState: WayfinderState = {
  origin: '1 Infinite Loop, Cupertino',
  destination: 'Golden Gate Bridge, SF',
  startTime: '08:00 AM',
  preferences: {
    gas: true,
    fastfood: false,
    tourist: true,
    slowfood: false,
  },
  selectedRouteId: null,
  stops: [],
};

const WayfinderContext = createContext<WayfinderContextType | undefined>(undefined);

export function WayfinderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WayfinderState>(initialState);

  const setOrigin = (origin: string) => setState(prev => ({ ...prev, origin }));
  const setDestination = (destination: string) => setState(prev => ({ ...prev, destination }));
  const setStartTime = (startTime: string) => setState(prev => ({ ...prev, startTime }));
  
  const togglePreference = (id: string) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [id]: !prev.preferences[id] },
    }));
  };

  const setSelectedRouteId = (selectedRouteId: string) => setState(prev => ({ ...prev, selectedRouteId }));
  
  const setStops = (stops: Stop[]) => setState(prev => ({ ...prev, stops }));

  const reset = () => setState(initialState);

  return (
    <WayfinderContext.Provider value={{
      state,
      setOrigin,
      setDestination,
      setStartTime,
      togglePreference,
      setSelectedRouteId,
      setStops,
      reset
    }}>
      {children}
    </WayfinderContext.Provider>
  );
}

export function useWayfinder() {
  const context = useContext(WayfinderContext);
  if (context === undefined) {
    throw new Error('useWayfinder must be used within a WayfinderProvider');
  }
  return context;
}
