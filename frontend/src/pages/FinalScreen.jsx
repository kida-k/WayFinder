import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, CheckCircle2, Clock, Map as MapIcon, Calendar, Navigation, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useWayfinder } from '../context/WayfinderContext';

export default function FinalScreen() {
  const navigate = useNavigate();
  const { state, reset } = useWayfinder();
  const [showConfirm, setShowConfirm] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    const text = `Check out my road trip itinerary from ${state.origin} to ${state.destination}!`;
    if (navigator.share) {
      try { await navigator.share({ title: 'WayFinder Trip', text }); } catch (e) { }
    } else {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleStartNavigation = () => setShowConfirm(true);

  const confirmStart = () => {
    reset();
    navigate('/');
  };

  const routeData = state.routeData;
  const stops = routeData?.stops || state.stops || [];

  const pageVariants = { initial: { opacity: 0, y: 50 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, scale: 0.95 } };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5, type: "spring", damping: 25 }} className="min-h-screen bg-background flex justify-center py-10 px-4">
      
      <div className="w-full max-w-md">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-all relative">
            <Share2 size={18} />
          </button>
        </div>

        {/* The Ticket */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] overflow-hidden shadow-2xl relative">
          
          {/* Ticket Header */}
          <div className="bg-primary/20 p-8 border-b border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold mb-4 border border-white/20">
              <CheckCircle2 size={14} /> Trip Ready
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
              Boarding Pass
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-white/80 text-sm">
              From <span className="font-semibold text-white">{state.origin || 'Origin'}</span> to <span className="font-semibold text-white">{state.destination || 'Destination'}</span>
            </motion.p>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12}/> Time</span>
                <span className="text-foreground font-bold">{routeData?.estimatedDuration || '4h 15m'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><MapIcon size={12}/> Dist</span>
                <span className="text-foreground font-bold">{routeData?.totalDistance || '260 mi'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12}/> Date</span>
                <span className="text-foreground font-bold">{routeData?.date ? new Date(routeData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'}</span>
              </div>
            </motion.div>

            {/* Stops */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Itinerary ({stops.length} Stops)</div>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {stops.slice(0, 3).map((stop, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white/5 p-3 rounded-xl border border-white/10 ml-3 md:ml-0">
                      <div className="text-[13px] font-bold text-foreground truncate">{stop.name}</div>
                      {stop.description && <div className="text-[11px] text-muted-foreground truncate">{stop.description}</div>}
                    </div>
                  </div>
                ))}
                {stops.length > 3 && (
                  <div className="text-center text-xs text-muted-foreground italic mt-2">+ {stops.length - 3} more stops</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Ticket Footer / Tear line */}
          <div className="relative h-10 w-full flex items-center overflow-hidden">
            <div className="absolute w-full border-t-2 border-dashed border-white/20" />
            <div className="absolute left-0 w-6 h-6 bg-background rounded-full -translate-x-1/2" />
            <div className="absolute right-0 w-6 h-6 bg-background rounded-full translate-x-1/2" />
          </div>

          <div className="p-6 bg-white/5">
            <button onClick={handleStartNavigation} className="w-full h-14 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]">
              <Navigation size={18} />
              Start Navigation
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {shared && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 z-50">
            <CheckCircle2 size={18} className="text-emerald-500" /> Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Navigation size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Go?</h3>
              <p className="text-slate-400 text-sm mb-8">Your optimal route with {stops.length} curated stops is locked in. Let's hit the road.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 h-12 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors">Wait</button>
                <button onClick={confirmStart} className="flex-1 h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"><RotateCcw size={16} /> Let's Go!</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
