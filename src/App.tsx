import React, { useState, useEffect } from 'react';
import { ScreenIndex } from './types';
import { soundEngine } from './utils/audio';
import { birthdayConfig, cyberpunkTelemetryQuotes } from './birthdayData';
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

export default function App() {
  // Screen state 0–7 (state-driven single page application, linear story flow)
  const [currentScreen, setCurrentScreen] = useState<ScreenIndex>(ScreenIndex.BOOT);
  
  // Sound toggle defaults to ON in UI state (♫ AUDIO_SFX ON)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize sound engine state to true on mount and register first-interaction listener
  useEffect(() => {
    soundEngine.setEnabled(true);

    // Browser audio autoplay fallback: kick in sound on very first click/keypress anywhere
    const handleFirstInteraction = () => {
      if (soundEngine.getEnabled()) {
        soundEngine.setEnabled(true);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Cryptic cyberpunk quotes telemetry state (flashes every 30s)
  const [telemetryQuote, setTelemetryQuote] = useState<string>('SYSTEM_STABLE: 98%');
  const [quoteFlashKey, setQuoteFlashKey] = useState<number>(0);
  const [isQuoteFlashing, setIsQuoteFlashing] = useState<boolean>(false);

  // Audio Engine Hook: Play terminal chirp/glitch sound effect when navigating between screen states
  useEffect(() => {
    // Only play chirp if not on the very initial boot load (or play on all screen navigations)
    soundEngine.playTerminalChirp();
  }, [currentScreen]);

  // Periodic 30-second timer to flash a random cryptic cyberpunk telemetry quote
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      // Pick a random quote distinct from the current one
      const availableQuotes = cyberpunkTelemetryQuotes.filter(q => q !== telemetryQuote);
      const nextQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)] || cyberpunkTelemetryQuotes[0];
      
      setTelemetryQuote(nextQuote);
      setQuoteFlashKey(prev => prev + 1);
      setIsQuoteFlashing(true);

      // Reset flashing state after animation duration
      const timeout = setTimeout(() => {
        setIsQuoteFlashing(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }, 30000);

    return () => clearInterval(quoteInterval);
  }, [telemetryQuote]);

  // System Corruption Glitch Effect State
  const [isCorrupted, setIsCorrupted] = useState<boolean>(false);
  const [corruptionCount, setCorruptionCount] = useState<number>(0);

  // Secret Emergency Access Diagnostic Terminal Modal State (5-Click Logo Trigger)
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  const triggerCorruption = () => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setIsCorrupted(true);
    setCorruptionCount(prev => prev + 1);
    
    if (!prefersReducedMotion) {
      soundEngine.playGlitch();
    } else {
      soundEngine.playTone(320, 0.05, 'square', 0.04);
    }

    const duration = prefersReducedMotion ? 150 : 450;
    setTimeout(() => {
      setIsCorrupted(false);
    }, duration);
  };

  // Periodic System Corruption glitch timer (triggers every 35 to 45 seconds)
  useEffect(() => {
    const scheduleNextGlitch = () => {
      const delay = 35000 + Math.random() * 15000; // 35s - 50s
      return setTimeout(() => {
        triggerCorruption();
        timer = scheduleNextGlitch();
      }, delay);
    };

    let timer = scheduleNextGlitch();
    return () => clearTimeout(timer);
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEngine.setEnabled(nextState);
    if (nextState) {
      soundEngine.playCoin();
    }
  };

  const handleNavigate = (index: ScreenIndex) => {
    soundEngine.playTerminalChirp();
    setCurrentScreen(index);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case ScreenIndex.BOOT:
        return (
          <Screen00_BootSequence
            soundEnabled={soundEnabled}
            onComplete={() => setCurrentScreen(ScreenIndex.HERO)}
          />
        );

      case ScreenIndex.HERO:
        return (
          <Screen01_Hero
            onNavigate={handleNavigate}
          />
        );

      case ScreenIndex.STATS:
        return (
          <Screen02_Stats
            onNavigate={handleNavigate}
          />
        );

      case ScreenIndex.ANIME:
        return (
          <Screen03_Anime
            onNavigate={handleNavigate}
          />
        );

      case ScreenIndex.MEMORIES:
        return (
          <Screen04_Memories
            onNavigate={handleNavigate}
          />
        );

      case ScreenIndex.MINIGAME:
        return (
          <Screen05_MiniGame
            onNavigate={handleNavigate}
          />
        );

      case ScreenIndex.CAKE:
        return (
          <Screen06_Cake
            onNavigate={handleNavigate}
          />
        );

      case ScreenIndex.FINAL_MESSAGE:
        return (
          <Screen07_FinalMessage
            onNavigate={handleNavigate}
          />
        );

      default:
        return <Screen01_Hero onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`relative min-h-screen bg-[#080a08] text-[#4ade80] font-mono flex flex-col justify-between overflow-x-hidden selection:bg-[#4ade80] selection:text-black transition-all ${
      isCorrupted ? 'animate-system-corruption' : ''
    }`}>
      
      {/* 
        ========================================================================
        GLOBAL CRT & PIXEL-GRID LAYER (APPLIED ONCE AT ROOT LAYOUT)
        ========================================================================
      */}
      {/* 1. Global Radial Dot Grid */}
      <div className="fixed inset-0 pixel-grid-bg pointer-events-none z-0 opacity-15" />

      {/* 2. Global Aging CRT Monitor Layer with Screen-Flicker & Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-40 animate-crt-flicker">
        <div className="absolute inset-0 crt-scanlines opacity-70" />
        <div className="absolute inset-0 crt-vignette opacity-90" />
      </div>

      {/* 3. SYSTEM CORRUPTION FULL-SCREEN DISTORTION OVERLAY */}
      {isCorrupted && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed inset-0 pointer-events-none z-50 animate-corruption-tear bg-[#ef4444]/15 flex items-center justify-center backdrop-invert-[0.2]"
        >
          <div className="px-4 py-2 bg-black/90 border-2 border-[#ef4444] text-[#ef4444] font-mono font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_30px_#ef4444] animate-pulse">
            ⚠️ SYSTEM CORRUPTION DETECTED // GLITCH BURST #{corruptionCount}
          </div>
        </div>
      )}

      {/* Retro Status / Navigation Bar */}
      <HeaderStatusBar
        currentScreen={currentScreen}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onNavigateScreen={handleNavigate}
        onTriggerEmergencyAccess={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 py-4 overflow-hidden">
        {/* Subtle CRT Dust Particle Layer */}
        <CrtDustOverlay />
        
        {renderActiveScreen()}
      </main>

      {/* Secret Emergency Access Diagnostic Terminal Modal */}
      <EmergencyDiagnosticModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        currentScreen={currentScreen}
        soundEnabled={soundEnabled}
        corruptionCount={corruptionCount}
        isCorrupted={isCorrupted}
        onNavigateScreen={handleNavigate}
        onTriggerGlitch={triggerCorruption}
      />

      {/* Global Footer Terminal Bar */}
      <footer className="relative z-10 w-full border-t border-[#4ade80]/30 bg-[#080a08]/90 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] tracking-widest font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={triggerCorruption}
              className={`px-2 py-0.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                isCorrupted
                  ? 'bg-[#ef4444] text-white shadow-[0_0_10px_#ef4444]'
                  : 'bg-[#4ade80] text-black hover:bg-white'
              }`}
              title="Click to trigger momentary Cyberpunk System Corruption glitch"
            >
              <span>{isCorrupted ? 'SYS_GLITCH!' : 'SYS_OK'}</span>
            </button>

            <button
              type="button"
              onClick={triggerCorruption}
              className="px-2 py-0.5 border border-[#fbbf24]/60 text-[#fbbf24] hover:bg-[#fbbf24]/20 text-[9px] uppercase tracking-wider transition-all cursor-pointer hidden sm:inline-block"
              title="Test System Corruption Inversion & Distortion"
            >
              [⚡ TRIGGER GLITCH]
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playEmergencyAccess();
                setIsEmergencyModalOpen(true);
              }}
              className="px-2 py-0.5 border border-[#ef4444]/70 text-[#ef4444] hover:bg-[#ef4444]/20 text-[9px] uppercase tracking-wider transition-all cursor-pointer hidden md:inline-block"
              title="Emergency Diagnostic Terminal (or click header logo 5 times)"
            >
              [⚠️ EMERGENCY DIAG]
            </button>

            <div className="px-2 py-0.5 border border-[#4ade80] font-bold text-[#4ade80] shadow-[0_0_5px_#4ade80]">
              SCREEN_0{currentScreen}
            </div>
            <span className="opacity-60 hidden sm:inline ml-1 text-[#4ade80]">
              NEKO.EXE // V4.2
            </span>
          </div>

          {/* Cyberpunk Periodic Flashing Telemetry Quote (every 30s) */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#121412] border border-[#4ade80]/40 shadow-[0_0_12px_rgba(74,222,128,0.12)]">
            <span className="w-1.5 h-1.5 bg-[#fbbf24] inline-block animate-pulse shadow-[0_0_6px_#fbbf24]" />
            <span className="text-[#fbbf24] font-bold uppercase text-[9px] tracking-widest">
              [TELEMETRY]
            </span>
            <span
              key={quoteFlashKey}
              className={`text-[#4ade80] font-mono tracking-wider font-semibold ${
                isQuoteFlashing ? 'animate-quote-flash text-white font-bold' : 'opacity-90'
              }`}
            >
              {telemetryQuote}
            </span>
          </div>

          <div className="text-[10px] opacity-60 tracking-wider text-[#4ade80]">
            [ STATUS: {isCorrupted ? '⚠️ CORRUPTED' : 'STABLE'} ] — [ RECIPIENT: {birthdayConfig.recipientName} ] — [ AUDIO: {soundEnabled ? '♫ ON' : '♫ OFF'} ]
          </div>
        </div>
      </footer>

    </div>
  );
}

