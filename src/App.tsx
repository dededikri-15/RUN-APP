import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Flame, MapPin, Wind, Activity, CheckCircle2, Terminal, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Localization ---

type Lang = 'ID' | 'EN';

const TRANSLATIONS = {
  ID: {
    header: "Optimalkan 'meat-ware' Anda sementara agen AI mengoptimalkan kodenya.",
    selectTime: "Pilih Waktu Tunggu (Menit)",
    generateBtn: "Buat Rutinitas",
    taskCompleted: "TUGAS SELESAI!",
    backToTerminal: "Kembali ke Terminal",
    successMsg: "Tubuh Anda segar dan pikiran Anda tajam. Siap untuk kembali ke terminal.",
    intensity: "Intensitas",
    intensityLow: "Rendah",
    intensityMed: "Sedang",
    intensityHigh: "Tinggi",
    distance: "Jarak",
    pace: "Kecepatan",
    calories: "Estimasi Kalori",
    steps: "Langkah Rutinitas",
    start: "MULAI",
    pause: "JEDA",
    reset: "ULANG",
    done: "SELESAI",
    footer: "Dibuat untuk mereka yang melakukan refactor di pagi hari dan lari di sore hari.",
    system: "Sistem",
    running: "Berjalan",
    status: "Status",
    hydrated: "Terhidrasi",
    routines: {
      1: {
        title: "Pelepasan Cepat Leher Kaku",
        desc: "Kelegaan instan untuk leher dan bahu Anda setelah sesi coding yang lama.",
        steps: ["Putar bahu (10x)", "Miringkan leher (5x tiap sisi)", "Napas perut dalam"]
      },
      5: {
        title: "Jogging Santai & Pemanasan Pernapasan",
        desc: "Alirkan darah dan jernihkan pikiran untuk modul berikutnya.",
        steps: ["2 menit jalan cepat", "2 menit joging ringan", "1 menit pernapasan terkontrol"]
      },
      10: {
        title: "Lari Santai & Latihan Angkat Lutut",
        desc: "Dorongan kardio stabil untuk menghilangkan rasa lelah akibat duduk lama.",
        steps: ["3 menit lari stabil", "1 menit angkat lutut", "4 menit lari stabil", "2 menit pendinginan"]
      },
      15: {
        title: "Lari Stabil Developer",
        desc: "Cocok saat proses build multi-kontainer memakan waktu lama.",
        steps: ["2 menit pemanasan", "10 menit lari tempo", "3 menit jalan pendinginan"]
      },
      20: {
        title: "Lari Interval & Jalan Pemulihan",
        desc: "Ganti intensitas untuk meningkatkan hormon produktivitas Anda.",
        steps: ["5 menit joging", "3x (2 menit sprint / 1 menit jalan)", "6 menit lari santai"]
      },
      30: {
        title: "Jogging Ketahanan & Akhiran Sprint",
        desc: "Teman setia saat proses build yang lama. Selesaikan dengan kekuatan.",
        steps: ["5 menit pemanasan", "15 menit lari zona 2", "5 menit tempo", "2 menit sprint", "3 menit jalan"]
      }
    }
  },
  EN: {
    header: "Optimize your meat-ware while your AI agents optimize the code.",
    selectTime: "Select Wait Time (Minutes)",
    generateBtn: "Generate Routine",
    taskCompleted: "TASK COMPLETED!",
    backToTerminal: "Back to Terminal",
    successMsg: "Your body is refreshed and your mind is sharp. Ready to dive back into the terminal.",
    intensity: "Intensity",
    intensityLow: "Low",
    intensityMed: "Medium",
    intensityHigh: "High",
    distance: "Distance",
    pace: "Pace",
    calories: "Est. Calories",
    steps: "Routine Steps",
    start: "START",
    pause: "PAUSE",
    reset: "RESET",
    done: "DONE",
    footer: "Built for those who refactor in the morning and run in the afternoon.",
    system: "System",
    running: "Running",
    status: "Status",
    hydrated: "Hydrated",
    routines: {
      1: {
        title: "Quick Tech-Neck Release",
        desc: "Instant relief for your neck and shoulders after a long coding session.",
        steps: ["Shoulder rolls (10x)", "Neck tilts (5x each side)", "Deep belly breaths"]
      },
      5: {
        title: "Light Jog & Breathing Warmup",
        desc: "Get the blood flowing and clear your mind for the next module.",
        steps: ["2 min brisk walk", "2 min light jog", "1 min controlled breathing"]
      },
      10: {
        title: "Easy Pace Run & High Knees Drill",
        desc: "A steady cardio boost to shake off the 'sitting fatigue'.",
        steps: ["3 min steady run", "1 min high knees", "4 min steady run", "2 min cool down"]
      },
      15: {
        title: "Steady State Developer Run",
        desc: "Perfect for when that multi-container build is taking its sweet time.",
        steps: ["2 min warmup", "10 min tempo run", "3 min cooldown walk"]
      },
      20: {
        title: "Interval Run & Recovery Walk",
        desc: "Alternating intensity to spike your productivity hormones.",
        steps: ["5 min jog", "3x (2 min sprint / 1 min walk)", "6 min easy run"]
      },
      30: {
        title: "Endurance Jogging & Sprint Finish",
        desc: "The ultimate 'Long Build' companion. Finish with power.",
        steps: ["5 min warmup", "15 min zone 2 run", "5 min tempo", "2 min sprint", "3 min walk"]
      }
    }
  }
};

// --- Types & Data ---

interface RoutineStats {
  id: number;
  duration: number;
  distance: string;
  pace: string;
  calories: number;
  intensity: 'Low' | 'Medium' | 'High';
}

const ROUTINE_STATS: Record<number, RoutineStats> = {
  1: { id: 1, duration: 1, distance: "0.0 km", pace: "N/A", calories: 10, intensity: 'Low' },
  5: { id: 5, duration: 5, distance: "0.6 km", pace: "8:00 min/km", calories: 45, intensity: 'Low' },
  10: { id: 10, duration: 10, distance: "1.2 km", pace: "7:00 min/km", calories: 90, intensity: 'Medium' },
  15: { id: 15, duration: 15, distance: "2.1 km", pace: "6:30 min/km", calories: 140, intensity: 'Medium' },
  20: { id: 20, duration: 20, distance: "3.2 km", pace: "Mixed", calories: 210, intensity: 'High' },
  30: { id: 30, duration: 30, distance: "4.8 km", pace: "5:45 min/km", calories: 320, intensity: 'High' }
};

const DURATIONS = [1, 5, 10, 15, 20, 30];

// --- Main Component ---

export default function App() {
  const [lang, setLang] = useState<Lang>('ID');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [activeRoutineId, setActiveRoutineId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = TRANSLATIONS[lang];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerate = () => {
    if (selectedDuration) {
      setActiveRoutineId(selectedDuration);
      setTimeLeft(selectedDuration * 60);
      setIsActive(false);
      setShowSuccess(false);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (activeRoutineId) {
      setIsActive(false);
      setTimeLeft(activeRoutineId * 60);
      setShowSuccess(false);
    }
  };

  const markAsDone = () => {
    setIsActive(false);
    setShowSuccess(true);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setShowSuccess(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const activeStats = activeRoutineId ? ROUTINE_STATS[activeRoutineId] : null;
  const activeContent = activeRoutineId ? (t.routines as any)[activeRoutineId] : null;

  return (
    <div id="runcode-app" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-400 selection:text-slate-900 leading-relaxed">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(163,230,53,0.15)_1px,transparent_0)] bg-[size:32px_32px]"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        {/* Language Toggle - Moved to top flow for better spacing */}
        <div className="flex justify-end mb-8 pt-2">
            <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05, borderColor: 'rgb(163, 230, 53)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLang(lang === 'ID' ? 'EN' : 'ID')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 backdrop-blur-md border border-slate-800 text-[10px] font-black hover:text-lime-400 transition-all shadow-lg text-slate-500 tracking-widest cursor-pointer"
                id="lang-toggle"
            >
                <Languages className="w-3.5 h-3.5" />
                {lang === 'ID' ? 'BAHASA INDONESIA' : 'ENGLISH MODE'}
            </motion.button>
        </div>

        {/* Header */}
        <header className="mb-12 text-center" id="app-header">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-2 rounded-xl bg-lime-400/10 border border-lime-400/20 shadow-[0_0_15px_rgba(163,230,53,0.1)]">
              <Terminal className="w-8 h-8 text-lime-400" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-lime-400 drop-shadow-sm transition-all hover:scale-105" id="main-title">
              Run<span className="text-cyan-400">Code</span>
            </h1>
          </motion.div>
          <p className="text-slate-400 text-lg font-medium tracking-tight opacity-90 px-4" id="sub-title">
            {t.header}
          </p>
        </header>

        {/* Duration Selector */}
        <section className="mb-10" id="duration-selector">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center justify-center gap-2">
            <Timer className="w-4 h-4 text-cyan-400" /> {t.selectTime}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {DURATIONS.map((dur) => (
              <button
                key={dur}
                id={`duration-${dur}`}
                onClick={() => setSelectedDuration(dur)}
                className={`
                  py-4 rounded-xl font-black transition-all duration-300 border-2 text-lg
                  ${selectedDuration === dur 
                    ? 'bg-lime-400 border-lime-400 text-slate-950 shadow-[0_0_25px_rgba(163,230,53,0.4)] scale-105 z-10' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-200'}
                `}
              >
                {dur}
              </button>
            ))}
          </div>
          
          <motion.button
            id="generate-btn"
            onClick={handleGenerate}
            disabled={!selectedDuration}
            whileHover={selectedDuration ? { scale: 1.02, boxShadow: '0 0 30px rgba(163,230,53,0.3)' } : {}}
            whileTap={selectedDuration ? { scale: 0.98 } : {}}
            className={`
              w-full py-5 rounded-2xl font-black text-xl tracking-widest uppercase transition-all shadow-2xl relative overflow-hidden group
              ${selectedDuration 
                ? 'bg-gradient-to-r from-lime-400 via-cyan-400 to-lime-400 bg-[length:200%_auto] hover:bg-right text-slate-950 cursor-pointer animate-gradient' 
                : 'bg-slate-900 border-2 border-slate-800 text-slate-700 cursor-not-allowed'}
            `}
          >
            <span className="relative z-10">{t.generateBtn}</span>
            {selectedDuration && (
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
          </motion.button>
        </section>

        {/* Main Routine Display */}
        <AnimatePresence mode="wait">
          {activeStats && activeContent && (
            <motion.div
              key={activeStats.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-[2.5rem] p-10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              id="routine-display"
            >
              {showSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                  id="success-message"
                >
                  <motion.div 
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-lime-400/[0.15] text-lime-400 mb-8 border-2 border-lime-400/20"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h3 className="text-4xl font-black text-white mb-4 italic tracking-tighter leading-tight">{t.taskCompleted}</h3>
                  <p className="text-slate-400 max-w-sm mx-auto mb-10 text-lg leading-relaxed font-medium opacity-80">
                    {t.successMsg}
                  </p>
                  <button 
                    onClick={() => setActiveRoutineId(null)}
                    className="px-12 py-5 bg-slate-100 text-slate-950 hover:bg-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    {t.backToTerminal}
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 border-b border-white/5 pb-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`
                            px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border
                            ${activeStats.intensity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                            activeStats.intensity === 'Medium' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 
                            'bg-lime-400/20 text-lime-400 border-lime-400/30'}
                        `}>
                            {t.intensity} {activeStats.intensity === 'High' ? t.intensityHigh : activeStats.intensity === 'Medium' ? t.intensityMed : t.intensityLow}
                        </span>
                      </div>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-4" id="routine-title">
                        {activeContent.title}
                      </h3>
                      <p className="text-slate-400 text-lg leading-relaxed font-medium opacity-70 italic">{activeContent.desc}</p>
                    </div>
                    <div className="flex flex-col items-center lg:items-end">
                      <div className="text-7xl font-mono font-black text-lime-400 tabular-nums drop-shadow-[0_0_20px_rgba(163,230,53,0.5)] leading-none" id="timer-display">
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-5 mb-10">
                    <div className="bg-slate-950/60 rounded-3xl p-6 border border-white/5 flex flex-col items-center group transition-all hover:bg-slate-900">
                      <MapPin className="w-6 h-6 text-cyan-400 mb-3 transition-transform group-hover:scale-125" />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.distance}</span>
                      <span className="text-xl font-black text-white leading-none">{activeStats.distance}</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-3xl p-6 border border-white/5 flex flex-col items-center group transition-all hover:bg-slate-900">
                      <Wind className="w-6 h-6 text-lime-400 mb-3 transition-transform group-hover:scale-125" />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.pace}</span>
                      <span className="text-xl font-black text-white leading-none">{activeStats.pace}</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-3xl p-6 border border-white/5 flex flex-col items-center group transition-all hover:bg-slate-900">
                      <Flame className="w-6 h-6 text-orange-400 mb-3 transition-transform group-hover:scale-125" />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.calories}</span>
                      <span className="text-xl font-black text-white leading-none">{activeStats.calories} <span className="text-[10px] opacity-60">CAL</span></span>
                    </div>
                  </div>

                  {/* Execution Steps */}
                  <div className="mb-12 bg-slate-950/40 rounded-3xl p-8 border border-white/5 shadow-inner">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-6 flex items-center gap-3">
                      <Activity className="w-4 h-4 text-cyan-400" /> {t.steps}
                    </h4>
                    <ul className="space-y-6">
                      {activeContent.steps.map((step: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-6 group">
                          <span className="flex-none w-8 h-8 rounded-xl bg-slate-900 text-[11px] font-black flex items-center justify-center text-cyan-400 border border-white/5 shadow-lg group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300">
                            {idx + 1}
                          </span>
                          <span className="text-slate-200 font-bold tracking-wide text-lg py-0.5 group-hover:text-white transition-colors leading-snug">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <motion.button
                      id="timer-toggle-btn"
                      onClick={toggleTimer}
                      whileHover={{ scale: 1.05, boxShadow: isActive ? '0 0 30px rgba(251,191,36,0.4)' : '0 0 30px rgba(163,230,53,0.4)' }}
                      whileTap={{ scale: 0.94 }}
                      className={`
                        py-5 rounded-2xl font-black text-slate-950 flex items-center justify-center gap-3 transition-all shadow-xl
                        ${isActive 
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                          : 'bg-gradient-to-br from-lime-400 to-lime-500'}
                      `}
                    >
                      {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                      <span className="tracking-widest">{isActive ? t.pause : t.start}</span>
                    </motion.button>
                    
                    <motion.button
                      id="timer-reset-btn"
                      onClick={resetTimer}
                      whileHover={{ scale: 1.05, backgroundColor: '#1e293b' }}
                      whileTap={{ scale: 0.94 }}
                      className="py-5 rounded-2xl bg-slate-800 text-slate-100 font-black flex items-center justify-center gap-3 transition-all border border-slate-700 shadow-xl"
                    >
                      <RotateCcw className="w-5 h-5 text-slate-400" />
                      <span className="tracking-widest">{t.reset}</span>
                    </motion.button>

                    <motion.button
                      id="mark-done-btn"
                      onClick={markAsDone}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 211, 238, 1)', color: '#020617', boxShadow: '0 0 30px rgba(34,211,238,0.4)' }}
                      whileTap={{ scale: 0.94 }}
                      className="py-5 rounded-2xl border-2 border-cyan-400 text-cyan-400 font-black tracking-[0.2em] uppercase transition-all bg-transparent shadow-xl"
                    >
                      {t.done}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 py-10 border-t border-white/5 flex flex-col items-center justify-center gap-6 text-slate-600">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-white/[0.03]">
                <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_8px_rgba(132,204,22,0.8)]"></div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">{t.system}: {t.running}</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-white/[0.03]">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">{t.status}: {t.hydrated}</span>
             </div>
          </div>
          <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em] text-center leading-loose max-w-sm">
            {t.footer} <br/>
            <span className="text-lime-400/50">&copy; 2026 RUNCODE.IO // KERNEL_WORKOUT_STABLE</span>
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        #runcode-app {
          background-color: #020617; /* Slate 950 */
        }
        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
