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
import { PixelHeart } from './components/common/PixelHeart';

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
    <div className={`relative min-h-screen bg-[#ff5e97] text-[#16192e] font-mono flex flex-col justify-between overflow-x-hidden selection:bg-[#ffd000] selection:text-[#16192e] transition-all ${
      isCorrupted ? 'animate-system-corruption' : ''
    }`}>
      
      {/* 
        ========================================================================
        RETRO PIXEL-ART LAYER: SKY DOT-GRID & AMBIENT PIXEL CLOUDS
        ========================================================================
      */}
      {/* 1. Global Pixel Sky Dot Grid */}
      <div className="fixed inset-0 pixel-sky-grid pointer-events-none z-0 opacity-25" />

      {/* 2. Ambient Retro Pixel Clouds & Pixel Hearts Floating in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Slow drifting cloud 1 */}
        <div className="absolute top-12 left-[-150px] animate-cloud-drift-slow opacity-85">
          <svg width="120" height="48" viewBox="0 0 120 48" className="pixel-art drop-shadow-[4px_4px_0_#16192e]">
            {/* 8-bit Chunky Pixel Cloud */}
            <rect x="24" y="8" width="72" height="32" fill="#fffdf0" />
            <rect x="12" y="16" width="96" height="24" fill="#fffdf0" />
            <rect x="40" y="0" width="40" height="40" fill="#fffdf0" />
            <rect x="0" y="24" width="120" height="16" fill="#fffdf0" />
            {/* Outline highlights */}
            <rect x="36" y="4" width="48" height="4" fill="#ffffff" />
            <rect x="16" y="20" width="16" height="4" fill="#ffffff" />
          </svg>
        </div>

        {/* Medium drifting cloud 2 */}
        <div className="absolute top-36 left-[-200px] animate-cloud-drift-fast opacity-75" style={{ animationDelay: '14s' }}>
          <svg width="90" height="36" viewBox="0 0 90 36" className="pixel-art drop-shadow-[3px_3px_0_#16192e]">
            <rect x="18" y="6" width="54" height="24" fill="#fffdf0" />
            <rect x="9" y="12" width="72" height="18" fill="#fffdf0" />
            <rect x="30" y="0" width="30" height="30" fill="#fffdf0" />
            <rect x="0" y="18" width="90" height="12" fill="#fffdf0" />
          </svg>
        </div>

        {/* Decorative 16x16 Pixel Hearts in Background */}
        {/* Top-right heart near status bar */}
        <div className="absolute top-[80px] right-[40px] opacity-90 animate-pixel-cat-bob" style={{ animationDelay: '0.2s' }}>
          <PixelHeart size={16} color="#f43f5e" className="drop-shadow-[2px_2px_0_#16192e]" />
        </div>

        {/* Upper-left heart drifting below top cloud */}
        <div className="absolute top-[130px] left-[50px] opacity-80 animate-pixel-cat-bob" style={{ animationDelay: '0.7s' }}>
          <PixelHeart size={16} color="#ffd000" className="drop-shadow-[2px_2px_0_#16192e]" />
        </div>

        {/* Mid-screen right heart */}
        <div className="absolute top-[260px] right-[12%] hidden sm:block opacity-75 animate-pixel-cat-bob" style={{ animationDelay: '1.2s' }}>
          <PixelHeart size={16} color="#00f0ff" className="drop-shadow-[2px_2px_0_#16192e]" />
        </div>

        {/* Mid-left heart */}
        <div className="absolute top-[380px] left-[8%] hidden md:block opacity-70 animate-pixel-cat-bob" style={{ animationDelay: '0.4s' }}>
          <PixelHeart size={16} color="#fffdf0" className="drop-shadow-[2px_2px_0_#16192e]" />
        </div>

        {/* Lower-left heart above ground strip */}
        <div className="absolute bottom-[100px] left-[32px] opacity-90 animate-pixel-cat-bob" style={{ animationDelay: '0.9s' }}>
          <PixelHeart size={16} color="#f43f5e" className="drop-shadow-[2px_2px_0_#16192e]" />
        </div>

        {/* Lower-right heart near platform */}
        <div className="absolute bottom-[90px] right-[60px] opacity-85 animate-pixel-cat-bob" style={{ animationDelay: '0.3s' }}>
          <PixelHeart size={16} color="#ff5e97" className="drop-shadow-[2px_2px_0_#16192e]" />
        </div>
      </div>

      {/* 3. SYSTEM CORRUPTION FULL-SCREEN BRUTALIST ALERT OVERLAY */}
      {isCorrupted && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4 bg-[#16192e]/40"
        >
          <div className="px-6 py-4 bg-[#ffd000] border-4 border-[#16192e] brutal-shadow-lg text-[#16192e] font-pixel text-xs sm:text-sm tracking-wider uppercase flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>SYSTEM CORRUPTION DETECTED // GLITCH BURST #{corruptionCount}</span>
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
      <main className="relative z-10 flex-1 flex flex-col justify-center px-3 sm:px-6 py-4 overflow-hidden">
        {/* Subtle Pixel Sparkle Dust Layer */}
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

      {/* Global Footer with Authentic 8-bit Platform Brick Ground Strip */}
      <footer className="relative z-20 w-full pixel-brick-strip py-3 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-pixel">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={triggerCorruption}
              className={`px-3 py-1 font-pixel font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 border-2 border-[#16192e] brutal-btn-sm ${
                isCorrupted
                  ? 'bg-[#f43f5e] text-white'
                  : 'bg-[#22c55e] text-[#16192e] hover:bg-white'
              }`}
              title="Click to trigger momentary Cyberpunk System Corruption glitch"
            >
              <span>{isCorrupted ? 'SYS_GLITCH!' : 'SYS_OK'}</span>
            </button>

            <button
              type="button"
              onClick={triggerCorruption}
              className="px-2.5 py-1 bg-[#ffd000] border-2 border-[#16192e] text-[#16192e] font-pixel text-[9px] uppercase tracking-wider brutal-btn-sm cursor-pointer hidden sm:inline-block"
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
              className="px-2.5 py-1 bg-[#fffdf0] border-2 border-[#16192e] text-[#f43f5e] font-pixel text-[9px] uppercase tracking-wider brutal-btn-sm cursor-pointer hidden md:inline-block"
              title="Emergency Diagnostic Terminal (or click header logo 5 times)"
            >
              [⚠️ EMERGENCY DIAG]
            </button>

            <div className="px-2 py-0.5 bg-[#fffdf0] border-2 border-[#16192e] font-pixel font-bold text-[#16192e] brutal-shadow-sm">
              SCREEN_0{currentScreen}
            </div>
            <span className="text-[#fffdf0] hidden sm:inline ml-1 drop-shadow-[1px_1px_0_#16192e]">
              NEKO.EXE // V4.2
            </span>
          </div>

          {/* Periodic Telemetry Quote Box */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#fffdf0] border-2 border-[#16192e] brutal-shadow-sm max-w-full overflow-hidden">
            <span className="w-2 h-2 bg-[#ffd000] border border-[#16192e] inline-block animate-pulse" />
            <span className="text-[#16192e] font-pixel font-bold uppercase text-[8px] tracking-wider shrink-0">
              [TELEMETRY]
            </span>
            <span
              key={quoteFlashKey}
              className={`text-[#16192e] font-mono text-[10px] font-bold truncate ${
                isQuoteFlashing ? 'bg-[#ffd000] px-1' : ''
              }`}
            >
              {telemetryQuote}
            </span>
          </div>

          <div className="text-[9px] font-pixel text-[#fffdf0] drop-shadow-[1px_1px_0_#16192e]">
            [ RECIPIENT: {birthdayConfig.recipientName} ] — [ {soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'} ]
          </div>
        </div>
      </footer>

    </div>
  );
}

