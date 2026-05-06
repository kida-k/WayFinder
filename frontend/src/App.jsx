import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { WayfinderProvider } from './context/WayfinderContext';
import StartScreen from './pages/StartScreen';
import PreferencesScreen from './pages/PreferencesScreen';
import RouteSelectionScreen from './pages/RouteSelectionScreen';
import CustomScreen from './pages/CustomScreen';
import FinalScreen from './pages/FinalScreen';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<StartScreen />} />
        <Route path="/preferences" element={<PreferencesScreen />} />
        <Route path="/routes" element={<RouteSelectionScreen />} />
        <Route path="/custom" element={<CustomScreen />} />
        <Route path="/final" element={<FinalScreen />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <WayfinderProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </WayfinderProvider>
  );
}
