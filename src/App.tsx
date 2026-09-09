import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenIndex } from './types';
import { soundEngine } from './utils/audio';
import { birthdayConfig, cyberpunkTelemetryQuotes } from './birthdayData';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { HeaderStatusBar } from './components/common/HeaderStatusBar';
import { CrtDustOverlay } from './components/common/CrtDustOverlay';
import { EmergencyDiagnosticModal } from './components/common/EmergencyDiagnosticModal';
import { Screen00_BootSequence } from './components/screens/Screen00_BootSequence';
import { Screen01_Hero } from './components/screens/Screen01_Hero';
import { Screen02_Stats } from './components/screens/Screen02_Stats';
import { Screen03_Anime } from './components/screens/Screen03_Anime';
import { Screen04_Memories } from './components/screens/Screen04_Memories';
import { Screen05_MiniGame } from './components/screens/Screen05_MiniGame';
import { Screen06_Cake } from './components/screens/Screen06_Cake';
import { Screen07_FinalMessage } from './components/screens/Screen07_FinalMessage';

function PortalApp() {
  const {
    theme,
    isHackerMode,
    toggleTheme,
    exitHackerMode,
    hackerNotification,
    clearHackerNotification
  } = useTheme();

  // Screen state 0–7 (state-driven single page application, linear story flow)
  const [currentScreen, setCurrentScreen] = useState<ScreenIndex>(ScreenIndex.BOOT);

  // Sound toggle defaults to ON in UI state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [corruptionCount, setCorruptionCount] = useState<number>(0);
  const [isCorrupted, setIsCorrupted] = useState<boolean>(false);
  const [activeTelemetryQuote, setActiveTelemetryQuote] = useState<string>('');

  const handleNavigateScreen = (screen: ScreenIndex) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentScreen(screen);
  };

  // Periodic subtle cyberpunk telemetry quote ticker
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.65) {
        const quote = cyberpunkTelemetryQuotes[Math.floor(Math.random() * cyberpunkTelemetryQuotes.length)];
        setActiveTelemetryQuote(quote);
        setTimeout(() => setActiveTelemetryQuote(''), 4500);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEngine.setEnabled(nextState);
    if (nextState) {
      soundEngine.playTerminalChirp();
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
    <div
      className={`min-h-screen ${
        theme === 'hacker'
          ? 'theme-hacker bg-[#020502] text-[#4ade80]'
          : theme === 'light'
          ? 'theme-light bg-[#f8fafc] text-[#090d16]'
          : 'theme-dark bg-[#0a0e17] text-[#f5f5f7]'
      } font-sans relative overflow-x-hidden dot-grid-bg transition-colors duration-200 ${
        isCorrupted ? 'animate-system-corruption' : ''
      }`}
    >
      {/* 1. Subtle Atmospheric Particles */}
      <CrtDustOverlay />

      {/* 2. Hacker Mode Notification Banner */}
      {hackerNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-md w-[92%] px-2">
          <div className="bg-[#020502]/95 border border-[#22c55e] text-[#4ade80] px-4 py-2.5 text-xs font-mono rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.5)] backdrop-blur-md flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
              <span className="font-semibold">{hackerNotification}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Hacker Mode Active Floating HUD */}
      {isHackerMode && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-[#050f05]/95 border border-[#22c55e]/60 text-[#4ade80] px-3 py-1.5 text-xs font-mono rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.35)] backdrop-blur-md flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="hidden sm:inline font-medium">HACKER_OS // PHOSPHOR GREEN</span>
            <span className="sm:hidden font-medium">MATRIX</span>
            <button
              type="button"
              onClick={exitHackerMode}
              className="px-2 py-0.5 rounded bg-[#22c55e]/20 hover:bg-[#22c55e]/35 text-[#86efac] border border-[#22c55e]/50 text-[10px] cursor-pointer transition-colors font-mono"
              title="Exit Hacker Mode (ESC)"
            >
              EXIT (ESC)
            </button>
          </div>
        </div>
      )}

      {/* 4. Dev Telemetry Quote Banner (if active) */}
      {activeTelemetryQuote && !hackerNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-35 pointer-events-none">
          <div className="bg-[#121723]/90 border border-[#ffffff1a] text-[#f5a524] px-3.5 py-1.5 text-xs font-mono rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 animate-pulse">
            <span className="inline-block w-2 h-2 bg-[#f5a524] rounded-full" />
            <span>{activeTelemetryQuote}</span>
          </div>
        </div>
      )}

      {/* Retro Status / Navigation Bar with Theme and Audio Controls */}
      <HeaderStatusBar
        currentScreen={currentScreen}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateScreen={handleNavigateScreen}
        onTriggerEmergencyAccess={() => setIsDiagnosticOpen(true)}
      />

      {/* Main Screen Container with Graceful Framer Motion Route Transition */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
