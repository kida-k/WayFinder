import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Fuel, Utensils, Camera, Pizza, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWayfinder } from '../context/WayfinderContext';
import { AnimatedGridPattern } from '../components/ui/AnimatedGridPattern';
import { ShimmerButton } from '../components/ui/ShimmerButton';

const STOP_OPTIONS = [
  { id: 'gas', title: 'Gas Stations', desc: 'Find fuel stops along the way', icon: Fuel, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'fastfood', title: 'Fast Food', desc: 'Quick bites & drive-throughs', icon: Pizza, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'tourist', title: 'Tourist Attractions', desc: 'Scenic spots & landmarks', icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'slowfood', title: 'Restaurants', desc: 'Sit-down dining experiences', icon: Utensils, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export default function PreferencesScreen() {
  const navigate = useNavigate();
  const { state, togglePreference } = useWayfinder();

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <motion.div 
      initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }}
      className="page-container"
    >
      <AnimatedGridPattern />
      
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-all mb-6"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Stop Options</h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Customize what types of stops you want along the way.
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {STOP_OPTIONS.map((option, i) => {
            const Icon = option.icon;
            const isActive = state.preferences[option.id];
            
            return (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={option.id}
                onClick={() => togglePreference(option.id)}
                className={`flex items-center justify-between p-4 w-full text-left rounded-2xl transition-all duration-300 border ${
                  isActive ? 'bg-white/10 border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isActive ? option.bg : 'bg-white/5'}`}>
                    <Icon size={22} className={isActive ? option.color : 'text-muted-foreground'} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-foreground">{option.title}</span>
                    <span className="text-[13px] text-muted-foreground">{option.desc}</span>
                  </div>
                </div>

                {/* Animated Toggle */}
                <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-primary' : 'bg-white/10'}`}>
                  <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className={`w-5 h-5 bg-white rounded-full shadow-sm ${isActive ? 'ml-auto' : ''}`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
          <ShimmerButton className="w-full text-lg" onClick={() => navigate('/routes')}>
            <span>Generate Routes</span>
            <ArrowRight size={20} />
          </ShimmerButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
