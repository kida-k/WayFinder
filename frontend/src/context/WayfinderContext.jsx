import React, { createContext, useContext, useState } from 'react';

const initialState = {
  origin: '',
  destination: '',
  startTime: '',
  preferences: {
    gas: true,
    fastfood: false,
    tourist: true,
    slowfood: false,
  },
  selectedRouteId: null,
  stops: [],
  routeData: null,
};

const WayfinderContext = createContext(undefined);

export function WayfinderProvider({ children }) {
  const [state, setState] = useState(initialState);

  const setOrigin = (origin) => setState((prev) => ({ ...prev, origin }));
  const setDestination = (destination) => setState((prev) => ({ ...prev, destination }));
  const setStartTime = (startTime) => setState((prev) => ({ ...prev, startTime }));

  const togglePreference = (id) => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [id]: !prev.preferences[id] },
    }));
  };

  const setSelectedRouteId = (selectedRouteId) =>
    setState((prev) => ({ ...prev, selectedRouteId }));

  const setStops = (stops) => setState((prev) => ({ ...prev, stops }));
  
  const setRouteData = (routeData) => setState((prev) => ({ ...prev, routeData }));

  const reset = () => setState(initialState);

  return (
    <WayfinderContext.Provider
      value={{
        state,
        setOrigin,
        setDestination,
        setStartTime,
        togglePreference,
        setSelectedRouteId,
        setStops,
        setRouteData,
        reset,
      }}
    >
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
