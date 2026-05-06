import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Fuel, Utensils, Camera, Pizza, Coffee, MapPin, Check, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWayfinder } from '../context/WayfinderContext';
import { ShimmerButton } from '../components/ui/ShimmerButton';

const ICONS = {
  gas: Fuel, gas_station: Fuel, fastfood: Pizza, tourist: Camera, tourist_attraction: Camera, coffee: Coffee, slowfood: Utensils, restaurant: Utensils,
};

const FALLBACK_STOPS = [
  { id: '1', type: 'gas', name: 'Shell Station', address: '1450 Main St' },
  { id: '2', type: 'coffee', name: 'Starbucks', address: 'Highway 1 Rest Stop' },
  { id: '3', type: 'tourist', name: 'Golden Gate Overlook', address: 'Merchant Rd' },
  { id: '4', type: 'fastfood', name: 'In-N-Out Burger', address: '2040 Redwood Hwy' },
  { id: '5', type: 'slowfood', name: 'Rustic Tavern', address: '12 Valley Dr' },
];

export default function CustomScreen() {
  const navigate = useNavigate();
  const { state, setStops: saveStopsToContext } = useWayfinder();
  const [stops, setLocalStops] = useState([]);

  useEffect(() => {
    if (state.routeData && state.routeData.stops && state.routeData.stops.length > 0) {
      setLocalStops(state.routeData.stops.map((s, i) => ({
        id: s.id || String(i + 1),
        type: s.type || 'tourist',
        name: s.name,
        address: s.address || s.description || '',
        description: s.description || '',
        rating: s.rating,
      })));
    } else {
      setLocalStops(FALLBACK_STOPS);
    }
  }, [state.routeData]);

  const removeStop = (id) => {
    setLocalStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleFinalize = () => {
    saveStopsToContext(stops);
    navigate('/final');
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }} className="page-container">
      
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 md:p-8 relative z-10 flex flex-col h-[85vh] md:h-auto md:max-h-[85vh]">
        
        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-all mb-4">
            <ChevronLeft size={20} />
          </button>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl font-extrabold text-foreground mb-2">Customize Route</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground text-[15px]">Review and approve the suggested stops for your trip.</motion.p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-3 custom-scrollbar min-h-[300px]">
          <AnimatePresence initial={false}>
            {stops.map((stop, index) => {
              const Icon = ICONS[stop.type] || MapPin;
              return (
                <motion.div
                  key={stop.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 40, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0 pr-4 border-r border-white/10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-foreground truncate">{stop.name}</span>
                      <span className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                        <MapPin size={10} /> {stop.address || stop.description || 'Along route'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pl-4 flex-shrink-0">
                    <button className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 flex items-center justify-center transition-transform hover:scale-110">
                      <Check size={16} />
                    </button>
                    <button onClick={() => removeStop(stop.id)} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center transition-transform hover:scale-110">
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {stops.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-40 text-center">
              <span className="text-4xl mb-3">🛣️</span>
              <p className="text-muted-foreground text-[15px]">All stops removed. Enjoy your direct drive!</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex-shrink-0 pt-6 mt-2 border-t border-white/10">
          <ShimmerButton className="w-full text-lg" onClick={handleFinalize}>
            <span>Finalize Trip</span>
            <ArrowRight size={20} />
          </ShimmerButton>
        </motion.div>

      </div>
    </motion.div>
  );
}
