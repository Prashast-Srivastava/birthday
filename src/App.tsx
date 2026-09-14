import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenIndex } from './types';
import { soundEngine } from './utils/audio';
import { birthdayConfig } from './birthdayData';
import { ThemeProvider } from './context/ThemeContext';
import { HeaderStatusBar } from './components/common/HeaderStatusBar';
import { CrtDustOverlay } from './components/common/CrtDustOverlay';
import { Hearts } from './components/common/Hearts';
import { EmergencyDiagnosticModal } from './components/common/EmergencyDiagnosticModal';
import { Screen00_BootSequence } from './components/screens/Screen00_BootSequence';
import { Screen01_Hero } from './components/screens/Screen01_Hero';
import { Screen02_Stats } from './components/screens/Screen02_Stats';
import { Screen03_Anime } from './components/screens/Screen03_Anime';
import { Screen04_Memories } from './components/screens/Screen04_Memories';
import { Screen05_MiniGame } from './components/screens/Screen05_MiniGame';
import { Screen06_Cake } from './components/screens/Screen06_Cake';
import { Screen07_FinalMessage } from './components/screens/Screen07_FinalMessage';
import { Sparkles } from 'lucide-react';

const CELEBRATION_QUOTES = [
  "✨ Happy 22nd Birthday, Anushka! Here's to unforgettable adventures!",
  "💖 Friendship level: Infinity & Beyond!",
  "🍰 Don't forget to save room for extra birthday cake!",
  "🌸 Another year of fun, anime discussions, and great memories!",
  "🎉 Level 22 achieved — bonus joy unlocked!"
];

function PortalApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenIndex>(ScreenIndex.BOOT);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [corruptionCount, setCorruptionCount] = useState<number>(0);
  const [isCorrupted, setIsCorrupted] = useState<boolean>(false);
  const [activeCelebrationQuote, setActiveCelebrationQuote] = useState<string>('');

  const handleNavigateScreen = (screen: ScreenIndex) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentScreen(screen);
  };

  // Periodic celebratory quote ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.65) {
        const quote = CELEBRATION_QUOTES[Math.floor(Math.random() * CELEBRATION_QUOTES.length)];
        setActiveCelebrationQuote(quote);
        setTimeout(() => setActiveCelebrationQuote(''), 5000);
      }
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEngine.setEnabled(nextState);
    if (nextState) {
      soundEngine.playCoin();
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case ScreenIndex.BOOT:
        return (
          <Screen00_BootSequence
            onComplete={() => handleNavigateScreen(ScreenIndex.HERO)}
            soundEnabled={soundEnabled}
          />
        );
      case ScreenIndex.HERO:
        return (
          <Screen01_Hero
            onNavigate={handleNavigateScreen}
          />
        );
      case ScreenIndex.STATS:
        return (
          <Screen02_Stats
            onNavigate={handleNavigateScreen}
          />
        );
      case ScreenIndex.ANIME:
        return (
          <Screen03_Anime
            onNavigate={handleNavigateScreen}
          />
        );
      case ScreenIndex.MEMORIES:
        return (
          <Screen04_Memories
            onNavigate={handleNavigateScreen}
          />
        );
      case ScreenIndex.MINIGAME:
        return (
          <Screen05_MiniGame
            onNavigate={handleNavigateScreen}
          />
        );
      case ScreenIndex.CAKE:
        return (
          <Screen06_Cake
            onNavigate={handleNavigateScreen}
          />
        );
      case ScreenIndex.FINAL_MESSAGE:
        return (
          <Screen07_FinalMessage
            onNavigate={handleNavigateScreen}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbf5] via-[#fdf2f8] to-[#f3e8ff] text-slate-800 font-sans relative overflow-x-hidden selection:bg-pink-300/40 selection:text-pink-800">
      
      {/* Decorative Pastel Ambient Glows */}
      <div className="pastel-mesh-bg" aria-hidden="true" />

      {/* Floating Fairy Dust Sparkles */}
      <CrtDustOverlay />

      {/* Floaty Pastel Hearts Across Screen & Card Interaction Spawner */}
      <Hearts />

      {/* Celebratory Floating Ribbon / Notification Banner */}
      {activeCelebrationQuote && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-35 pointer-events-none w-[90%] max-w-md">
          <div className="bg-white/85 border border-white text-pink-700 px-4 py-2 text-xs font-bold rounded-full shadow-lg shadow-pink-200/50 backdrop-blur-xl flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span className="truncate">{activeCelebrationQuote}</span>
          </div>
        </div>
      )}

      {/* Soft Pastel Glassmorphic Header / Navigation Bar */}
      <HeaderStatusBar
        currentScreen={currentScreen}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onNavigateScreen={handleNavigateScreen}
        onTriggerEmergencyAccess={() => setIsDiagnosticOpen(true)}
      />

      {/* Main Screen Container with Gentle Framer Motion Route Transition */}
      <main className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-8 relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {renderActiveScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Emergency Diagnostic Modal */}
      <EmergencyDiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        currentScreen={currentScreen}
        soundEnabled={soundEnabled}
        corruptionCount={corruptionCount}
        isCorrupted={isCorrupted}
        onNavigateScreen={(screen) => {
          setCurrentScreen(screen);
          setIsDiagnosticOpen(false);
        }}
        onTriggerGlitch={() => {
          setIsCorrupted(true);
          setCorruptionCount((c) => c + 1);
          soundEngine.playGlitch();
          setTimeout(() => setIsCorrupted(false), 2000);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortalApp />
    </ThemeProvider>
  );
}
