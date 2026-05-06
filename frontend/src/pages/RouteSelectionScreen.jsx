import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, DollarSign, Coffee, Sliders, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWayfinder } from '../context/WayfinderContext';

const API_URL = 'http://localhost:3001';

const ROUTES = [
  { id: 'fastest', title: 'Fastest Route', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'cheapest', title: 'Cheapest', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', sub: 'Saves $20' },
  { id: 'relaxed', title: 'Most Breaks', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', sub: 'Relaxed Pace' },
];

export default function RouteSelectionScreen() {
  const navigate = useNavigate();
  const { state, setSelectedRouteId, setRouteData } = useWayfinder();
  const [loading, setLoading] = useState(true);
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoute() {
      try {
        setLoading(true);
        setError(null);
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`${API_URL}/api/suggest-route`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: state.origin, destination: state.destination, date: today }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch route');
        }

        const data = await res.json();
        setRouteInfo(data);
        setRouteData(data);
      } catch (err) {
        console.error('Route fetch error, using mock data fallback:', err);
        const mockData = {
          totalDistance: '260 mi',
          estimatedDuration: '4h 15m',
          stops: [
            { id: '1', type: 'gas', name: 'Shell Station', description: 'Quick fuel stop' },
            { id: '2', type: 'fastfood', name: 'In-N-Out', description: 'Classic burger break' },
            { id: '3', type: 'tourist', name: 'Scenic Overlook', description: 'Great photo spot' }
          ]
        };
        setRouteInfo(mockData);
        setRouteData(mockData);
      } finally {
        setLoading(false);
      }
    }

    if (state.origin && state.destination) {
      fetchRoute();
    } else {
      setLoading(false);
    }
  }, [state.origin, state.destination]);

  const handleSelect = (id) => {
    setSelectedRouteId(id);
    navigate(id === 'custom' ? '/custom' : '/final');
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  return (
    <motion.div 
      initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col md:flex-row bg-background"
    >
      {/* Map Section */}
      <div className="relative h-[45vh] md:h-screen md:w-1/2 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b md:border-b-0 md:border-r border-white/10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d="M60,240 C120,220 140,100 200,120 S320,40 350,60"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="3"
            strokeDasharray="8 4"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Waypoints */}
          <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} cx="60" cy="240" r="6" fill="#3B82F6" className="shadow-[0_0_15px_#3B82F6]" />
          <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} cx="200" cy="120" r="4" fill="#10B981" />
          <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} cx="350" cy="60" r="6" fill="#8B5CF6" className="shadow-[0_0_15px_#8B5CF6]" />
        </svg>

        {/* Labels */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="absolute bottom-[20%] left-[10%] flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white">
          <MapPin size={12} /> <span className="truncate max-w-[100px]">{state.origin || 'Origin'}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} className="absolute top-[10%] right-[10%] flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white">
          <MapPin size={12} /> <span className="truncate max-w-[100px]">{state.destination || 'Destination'}</span>
        </motion.div>

        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Selection Panel */}
      <div className="flex-1 bg-background relative z-10 p-6 md:p-12 md:flex md:flex-col md:justify-center overflow-y-auto">
        <div className="w-10 h-1.5 bg-white/10 rounded-full mx-auto mb-6 md:hidden" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-lg font-semibold text-foreground">Generating optimal routes...</p>
            <p className="text-sm text-muted-foreground mt-1">Analyzing AI-curated stops along your path</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">⚠️ {error}</p>
            <button className="px-6 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 font-semibold transition-colors" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className="max-w-md mx-auto w-full">
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-foreground mb-6">Select Route</motion.h2>

            {routeInfo && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">{routeInfo.totalDistance}</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">{routeInfo.estimatedDuration}</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">{routeInfo.stops?.length || 0} stops</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              {ROUTES.map((route, i) => {
                const Icon = route.icon;
                return (
                  <motion.button
                    key={route.id}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + 2) * 0.1 }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(route.id)}
                    className={`flex items-center p-4 w-full text-left rounded-2xl transition-all duration-300 bg-white/5 border border-white/5 hover:bg-white/10 ${route.border}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${route.bg}`}>
                      <Icon size={24} className={route.color} />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-[16px] font-semibold text-foreground mb-0.5">{route.title}</span>
                      <span className="text-[13px] text-muted-foreground">
                        {routeInfo ? `${routeInfo.estimatedDuration} • ${routeInfo.totalDistance}` : 'Calculating...'}
                        {route.sub && <span className={`font-semibold ml-1 ${route.color}`}>• {route.sub}</span>}
                      </span>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </motion.button>
                );
              })}

              {/* Custom Option */}
              <motion.button
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }} whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('custom')}
                className="flex items-center p-4 w-full text-left rounded-2xl bg-gradient-to-r from-primary to-blue-600 shadow-lg mt-2"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mr-4">
                  <Sliders size={24} className="text-white" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[16px] font-bold text-white mb-0.5">Custom Itinerary</span>
                  <span className="text-[13px] text-blue-100">Manage all stops & preferences</span>
                </div>
                <ChevronRight size={20} className="text-white/50" />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
