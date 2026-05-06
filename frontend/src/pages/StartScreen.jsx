import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Flag, Navigation, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWayfinder } from '../context/WayfinderContext';
import { Meteors } from '../components/ui/Meteors';
import { ShimmerButton } from '../components/ui/ShimmerButton';

export default function StartScreen() {
  const navigate = useNavigate();
  const { state, setOrigin, setDestination, setStartTime } = useWayfinder();
  const [focusedField, setFocusedField] = useState(null);

  const canProceed = state.origin.trim() && state.destination.trim() && state.startTime.trim();

  const handleNext = () => {
    if (canProceed) {
      navigate('/preferences');
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }}
      className="page-container"
    >
      <div className="absolute inset-0 w-full h-full bg-background overflow-hidden -z-10">
        <Meteors number={30} />
      </div>

      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 relative z-10">
        {/* Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Navigation size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">WayFinder</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-2">
            Plan Your Drive
          </h1>
          <p className="text-muted-foreground text-base">
            Enter your details to generate optimal routes with AI-curated stops.
          </p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {/* Start Time */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1" htmlFor="start-time">Start Time</label>
            <div className={`flex items-center px-4 h-14 rounded-xl border transition-all duration-300 ${focusedField === 'time' ? 'border-primary ring-2 ring-primary/20 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              <Clock size={20} className="text-primary mr-3 flex-shrink-0" />
              <input
                id="start-time"
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="e.g., 8:00 AM"
                value={state.startTime}
                onChange={(e) => setStartTime(e.target.value)}
                onFocus={() => setFocusedField('time')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </motion.div>

          {/* Origin */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1" htmlFor="start-origin">Start Location</label>
            <div className={`flex items-center px-4 h-14 rounded-xl border transition-all duration-300 ${focusedField === 'origin' ? 'border-primary ring-2 ring-primary/20 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              <MapPin size={20} className="text-primary mr-3 flex-shrink-0" />
              <input
                id="start-origin"
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="Street, City"
                value={state.origin}
                onChange={(e) => setOrigin(e.target.value)}
                onFocus={() => setFocusedField('origin')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </motion.div>

          {/* Destination */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1" htmlFor="start-destination">Destination</label>
            <div className={`flex items-center px-4 h-14 rounded-xl border transition-all duration-300 ${focusedField === 'destination' ? 'border-primary ring-2 ring-primary/20 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              <Flag size={20} className="text-primary mr-3 flex-shrink-0" />
              <input
                id="start-destination"
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="Street, City"
                value={state.destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setFocusedField('destination')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8">
          <ShimmerButton 
            className="w-full text-lg" 
            onClick={handleNext} 
            disabled={!canProceed}
          >
            <span>Set Preferences</span>
            <ArrowRight size={20} />
          </ShimmerButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
