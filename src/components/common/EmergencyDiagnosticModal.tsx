import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check, X, ShieldAlert, Cpu, Activity, Play, Trash2, RefreshCw } from 'lucide-react';
import { ScreenIndex } from '../../types';
import { birthdayConfig } from '../../birthdayData';
import { soundEngine } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'SYS' | 'INFO' | 'WARN' | 'DEBUG' | 'AUTH';
  message: string;
  source: string;
}

interface EmergencyDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenIndex;
  soundEnabled: boolean;
  corruptionCount: number;
  isCorrupted: boolean;
  onNavigateScreen: (index: ScreenIndex) => void;
  onTriggerGlitch: () => void;
}

export const EmergencyDiagnosticModal: React.FC<EmergencyDiagnosticModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  soundEnabled,
  corruptionCount,
  isCorrupted,
  onNavigateScreen,
  onTriggerGlitch,
}) => {
  const { toggleHackerMode, isHackerMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'logs' | 'state' | 'hardware' | 'console'>('logs');
  const [commandInput, setCommandInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [sessionUptime, setSessionUptime] = useState<number>(0);
  const [clientDimensions, setClientDimensions] = useState({ width: 0, height: 0 });
  const [memoryMetric, setMemoryMetric] = useState({ heapLimit: '2048 MB', usedHeap: '42.8 MB', fps: 60 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const logEndRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Track session uptime
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSessionUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Read hardware metrics on mount / resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateDim = () => {
        setClientDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      updateDim();
      window.addEventListener('resize', updateDim);
      return () => window.removeEventListener('resize', updateDim);
    }
  }, []);

  // Initialize raw logs stream
  useEffect(() => {
    if (!isOpen) return;

    const initialLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 60000).toISOString().substring(11, 23),
        level: 'SYS',
        source: 'BOOT_LOADER',
        message: 'NEKO.EXE Kernel loaded into memory @ 0x7FFF0042. Quantum entropy synced.',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 50000).toISOString().substring(11, 23),
        level: 'AUTH',
        source: 'SECURITY_DAEMON',
        message: `Recipient authenticated: ${birthdayConfig.recipientName} // Level ${birthdayConfig.age || 22} Celebration Matrix active.`,
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 40000).toISOString().substring(11, 23),
        level: 'INFO',
        source: 'AUDIO_SYNTH',
        message: `WebAudioContext status: ${soundEnabled ? 'ACTIVE (Master Gain: 0.85)' : 'MUTED'}`,
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 30000).toISOString().substring(11, 23),
        level: 'DEBUG',
        source: 'RENDER_ENGINE',
        message: `Active Screen Pointer: ScreenIndex[${currentScreen}] // CRT shader pipeline nominal.`,
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 15000).toISOString().substring(11, 23),
        level: 'SYS',
        source: 'GLITCH_WATCHDOG',
        message: `Corruption monitor active. Glitch burst count: ${corruptionCount}. Status: ${isCorrupted ? 'CORRUPTING' : 'NOMINAL'}.`,
      },
      {
        id: '6',
        timestamp: new Date().toISOString().substring(11, 23),
        level: 'AUTH',
        source: 'OVERRIDE_HANDLER',
        message: '*** EMERGENCY ACCESS SEQUENCE GRANTED: 5-TAP LOGO OVERRIDE TRIGGERED ***',
      },
    ];

    setLogs(initialLogs);

    // Stream new simulated diagnostic log ticks periodically
    const logInterval = setInterval(() => {
      const sources = ['KERNEL', 'MEM_ARCHIVE', 'AUDIO_SYNTH', 'MINIGAME_CORE', 'CAKE_PHYSICS', 'TELEMETRY'];
      const levels: Array<'SYS' | 'INFO' | 'WARN' | 'DEBUG'> = ['SYS', 'INFO', 'WARN', 'DEBUG'];
      const messages = [
        'VRAM texture cache synchronized (60.0 FPS).',
        `Screen 0${currentScreen} state heartbeat acknowledged.`,
        'Audio buffer frame written to destination node.',
        'CRT phosphor persistence decay within nominal thresholds.',
        'Quantum cake candle thermo-simulation tick OK.',
        'Mini-game laser collision matrix refreshed.',
        'Cat purr audio synthesizer ready on /assets/audio/purr.mp3.',
      ];

      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString().substring(11, 23),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs((prev) => [...prev.slice(-40), newLog]);
    }, 4500);

    return () => clearInterval(logInterval);
  }, [isOpen, currentScreen, soundEnabled, corruptionCount, isCorrupted]);

  // Auto-scroll logs
  useEffect(() => {
    if (activeTab === 'logs' && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  // Handle ESC key to exit
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playKeyClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rawAppState = {
    system: {
      os: 'NEKO.EXE // Cyberpunk OS',
      version: '22.0.0-PROD',
      kernel: 'Linux 5.15-antigravity / WebAssembly VM',
      emergencyOverride: true,
      diagnosticTimestamp: new Date().toISOString(),
      uptimeSeconds: sessionUptime,
    },
    screenState: {
      currentIndex: currentScreen,
      screenName: [
        'BOOT_SEQUENCE',
        'HERO_PORTAL',
        'STATS_OVERVIEW',
        'ANIME_THEATER',
        'MEMORY_VAULT',
        'MINIGAME_ARCADE',
        'CAKE_CEREMONY',
        'FINAL_TRANSMISSION'
      ][currentScreen] || 'UNKNOWN',
    },
    audioEngine: {
      enabled: soundEnabled,
      sampleRate: '44100 Hz',
      sfxModules: ['tone', 'terminalChirp', 'glitch', 'fanfare', 'bootChime', 'alarm', 'meow'],
    },
    corruptionWatchdog: {
      isCorrupted,
      totalGlitchBursts: corruptionCount,
      intervalWindow: '35s - 50s',
    },
    recipientPayload: birthdayConfig,
    runtimeEnv: {
      viewport: `${clientDimensions.width}x${clientDimensions.height}`,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Mock',
      memory: memoryMetric,
    }
  };

  const handleCopyState = () => {
    soundEngine.playCoin();
    navigator.clipboard.writeText(JSON.stringify(rawAppState, null, 2));
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    soundEngine.playTerminalChirp();
    const newEntry = `> ${commandInput}`;
    let result = '';

    if (cmd === 'help') {
      result = 'AVAILABLE COMMANDS:\n  help          - Show this command manual\n  status        - Print raw system diagnostic health\n  hacker        - Toggle classic green-on-black terminal matrix theme (Konami code)\n  glitch        - Force trigger a system corruption burst\n  jump <0-7>    - Warp directly to screen index (0 to 7)\n  sound on/off  - Toggle audio synthesizer state\n  cake          - Quick jump to cake celebration\n  clear         - Clear command history\n  dump          - Output JSON state snapshot\n  reboot        - Restart boot sequence (Screen 00)\n  exit          - Close emergency diagnostic terminal';
    } else if (cmd === 'status') {
      result = `[SYS STATUS: NOMINAL] Screen: 0${currentScreen} | Audio: ${soundEnabled ? 'ON' : 'OFF'} | Glitches: ${corruptionCount} | Uptime: ${sessionUptime}s | Mode: ${isHackerMode ? 'HACKER (GREEN)' : 'STANDARD'}`;
    } else if (cmd === 'hacker' || cmd === 'konami' || cmd === 'matrix') {
      toggleHackerMode();
      result = '>>> 🔓 KONAMI PROTOCOL: Hacker Mode toggled (Classic green-on-black terminal theme).';
    } else if (cmd === 'glitch') {
      onTriggerGlitch();
      result = '>>> Glitch command issued: System corruption burst triggered.';
    } else if (cmd.startsWith('jump ')) {
      const idx = parseInt(cmd.replace('jump ', ''), 10);
      if (!isNaN(idx) && idx >= 0 && idx <= 7) {
        onNavigateScreen(idx as ScreenIndex);
        result = `>>> Screen warp confirmed: Navigated to Screen 0${idx}.`;
      } else {
        result = 'ERROR: Screen index must be between 0 and 7.';
      }
    } else if (cmd === 'cake') {
      onNavigateScreen(ScreenIndex.CAKE);
      result = '>>> Warp to Screen 06 (Cake Ceremony) executed.';
    } else if (cmd === 'reboot') {
      onNavigateScreen(ScreenIndex.BOOT);
      result = '>>> System reboot sequence initialized.';
    } else if (cmd === 'clear') {
      setCommandHistory([]);
      setCommandInput('');
      return;
    } else if (cmd === 'dump') {
      result = JSON.stringify(rawAppState, null, 2);
    } else if (cmd === 'exit' || cmd === 'quit') {
      onClose();
      return;
    } else {
      result = `bash: command not found: "${cmd}". Type "help" for a list of diagnostic commands.`;
    }

    setCommandHistory((prev) => [...prev, newEntry, result]);
    setCommandInput('');
  };

  const filteredLogs = logs.filter((log) => filterLevel === 'ALL' || log.level === filterLevel);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-md animate-fadeIn select-text"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#121723] border border-[#ffffff1a] text-[#f5f5f7] font-mono flex flex-col rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Emergency Access Banner */}
        <div className="bg-[#1a1f2e] text-[#f5f5f7] px-4 py-3 flex items-center justify-between border-b border-[#ffffff1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#f5a524]/15 border border-[#f5a524]/30 flex items-center justify-center text-[#f5a524]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span id="emergency-modal-title" className="font-sans font-semibold text-sm text-[#f5f5f7]">
              System Diagnostic & Telemetry Inspector
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-[#f5a524]/10 text-[#f5a524] border border-[#f5a524]/30 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
              AUTH: ROOT
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playKeyClick();
                onClose();
              }}
              className="bg-[#121723] hover:bg-[#222838] text-[#9ca3af] hover:text-[#f5f5f7] border border-[#ffffff1a] px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-mono text-xs"
              title="Close Inspector (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span>ESC</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Subheader Info */}
        <div className="bg-[#0e131d] border-b border-[#ffffff1a] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9ca3af]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#f5a524]">
              <span className="w-2 h-2 rounded-full bg-[#f5a524] animate-ping" />
              <strong className="font-semibold">INSPECTOR ACTIVE</strong>
            </span>
            <span>UPTIME: <span className="text-[#f5f5f7]">{sessionUptime}s</span></span>
            <span>SCREEN: <span className="text-[#f5f5f7]">0{currentScreen}</span></span>
            <span>AUDIO: <span className={soundEnabled ? 'text-[#4ade80]' : 'text-[#f43f5e]'}>{soundEnabled ? 'ACTIVE' : 'MUTED'}</span></span>
            <span>BURSTS: <span className="text-[#f5f5f7]">{corruptionCount}</span></span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSelect();
                onTriggerGlitch();
              }}
              className="px-2.5 py-1 bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-[#f43f5e] hover:bg-[#f43f5e]/20 text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <Activity className="w-3 h-3" />
              <span>TRIGGER GLITCH</span>
            </button>

            <button
              type="button"
              onClick={handleCopyState}
              className="px-2.5 py-1 bg-[#1a1f2e] border border-[#ffffff1a] text-[#f5f5f7] hover:bg-[#222838] text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              {copiedState ? <Check className="w-3 h-3 text-[#4ade80]" /> : <Copy className="w-3 h-3 text-[#9ca3af]" />}
              <span>{copiedState ? 'COPIED!' : 'COPY STATE JSON'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ffffff1a] bg-[#0a0e17] px-4 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              soundEngine.playKeyClick();
              setActiveTab('logs');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'logs'
                ? 'bg-[#121723] border-[#ffffff1a] text-[#f5a524]'
                : 'border-transparent text-[#9ca3af] hover:text-[#f5f5f7]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CONSOLE LOGS ({logs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playKeyClick();
              setActiveTab('state');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'state'
                ? 'bg-[#121723] border-[#ffffff1a] text-[#f5a524]'
                : 'border-transparent text-[#9ca3af] hover:text-[#f5f5f7]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>STATE TREE (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playKeyClick();
              setActiveTab('hardware');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'hardware'
                ? 'bg-[#121723] border-[#ffffff1a] text-[#f5a524]'
                : 'border-transparent text-[#9ca3af] hover:text-[#f5f5f7]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>TELEMETRY & HARDWARE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playKeyClick();
              setActiveTab('console');
              setTimeout(() => commandInputRef.current?.focus(), 50);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'console'
                ? 'bg-[#121723] border-[#ffffff1a] text-[#f5a524]'
                : 'border-transparent text-[#9ca3af] hover:text-[#f5f5f7]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>INTERACTIVE CLI</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#0a0e17] font-mono text-xs">
          
          {/* TAB 1: RAW CONSOLE LOGS */}
          {activeTab === 'logs' && (
            <div className="flex flex-col h-full gap-3">
              {/* Log Level Filters */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#ffffff1a] flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#9ca3af]">FILTER:</span>
                  {['ALL', 'SYS', 'AUTH', 'INFO', 'WARN', 'DEBUG'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        soundEngine.playKeyClick();
                        setFilterLevel(lvl);
                      }}
                      className={`px-2 py-0.5 text-[10px] uppercase font-mono rounded transition-all cursor-pointer ${
                        filterLevel === lvl
                          ? 'bg-[#f5a524] text-[#0a0e17] font-bold'
                          : 'border border-[#ffffff1a] text-[#9ca3af] hover:text-[#f5f5f7]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playKeyClick();
                      setLogs([]);
                    }}
                    className="text-[11px] text-[#9ca3af] hover:text-[#f43f5e] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Log Stream Terminal */}
              <div className="flex-1 bg-[#121723] border border-[#ffffff1a] p-3.5 rounded-xl overflow-y-auto space-y-1.5 select-text font-mono text-[11px] leading-relaxed">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8 text-[#9ca3af]/50">No logs found matching filter [{filterLevel}].</div>
                ) : (
                  filteredLogs.map((log) => {
                    const levelColors: Record<string, string> = {
                      SYS: 'text-[#f5a524] bg-[#f5a524]/10 border-[#f5a524]/30',
                      AUTH: 'text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/30',
                      INFO: 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/30',
                      WARN: 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/30',
                      DEBUG: 'text-[#c084fc] bg-[#c084fc]/10 border-[#c084fc]/30',
                    };
                    return (
                      <div key={log.id} className="flex items-start gap-2 hover:bg-white/5 px-2 py-1 rounded-md transition-colors">
                        <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                        <span className={`px-1.5 py-0.2 text-[9px] uppercase border rounded shrink-0 select-none ${levelColors[log.level]}`}>
                          {log.level}
                        </span>
                        <span className="text-[#f5a524] shrink-0 font-medium select-none">&lt;{log.source}&gt;</span>
                        <span className="text-[#f5f5f7] break-all">{log.message}</span>
                      </div>
                    );
                  })
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          )}

          {/* TAB 2: RAW STATE TREE (JSON) */}
          {activeTab === 'state' && (
            <div className="flex flex-col h-full gap-2">
              <div className="flex items-center justify-between text-[11px] text-[#9ca3af] pb-1">
                <span>APPLICATION HEAP SNAPSHOT</span>
                <span>SCHEMA: PROTOCOL_CELEBRATION_V22</span>
              </div>
              <pre className="flex-1 bg-[#121723] border border-[#ffffff1a] p-4 rounded-xl text-[11px] text-[#4ade80] overflow-auto select-all leading-relaxed">
                {JSON.stringify(rawAppState, null, 2)}
              </pre>
            </div>
          )}

          {/* TAB 3: HARDWARE & TELEMETRY */}
          {activeTab === 'hardware' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#121723] border border-[#ffffff1a] p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold border-b border-[#ffffff1a] pb-2 text-[#f5f5f7]">
                  <Cpu className="w-4 h-4 text-[#f5a524]" />
                  <span>Core Runtime & Performance</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">TARGET_RECIPIENT:</span>
                    <span className="font-semibold text-white">{birthdayConfig.recipientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">UNLOCKED_LEVEL:</span>
                    <span className="font-semibold text-[#f5a524]">LEVEL {birthdayConfig.age || 22}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">CLIENT_VIEWPORT:</span>
                    <span className="font-medium text-[#f5f5f7]">{clientDimensions.width} x {clientDimensions.height} px</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">DEVICE_PIXEL_RATIO:</span>
                    <span className="font-medium text-[#f5f5f7]">{typeof window !== 'undefined' ? window.devicePixelRatio : 1}x</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">HEAP_MEMORY_USAGE:</span>
                    <span className="font-medium text-[#38bdf8]">{memoryMetric.usedHeap} / {memoryMetric.heapLimit}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">TARGET_REFRESH_RATE:</span>
                    <span className="font-medium text-[#4ade80]">60.0 FPS</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#121723] border border-[#ffffff1a] p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold border-b border-[#ffffff1a] pb-2 text-[#f5f5f7]">
                  <Activity className="w-4 h-4 text-[#f5a524]" />
                  <span>Synthesizer & Peripherals</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">WEB_AUDIO_ENGINE:</span>
                    <span className={`font-semibold ${soundEnabled ? 'text-[#4ade80]' : 'text-[#f43f5e]'}`}>
                      {soundEnabled ? 'ONLINE // 44.1 kHz' : 'OFFLINE // MUTED'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">CORRUPTION_BURSTS:</span>
                    <span className="font-semibold text-[#f43f5e]">{corruptionCount} triggers logged</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">THEME_ENGINE:</span>
                    <span className="font-medium text-[#f5a524]">DEV-TOOL DARK (AMBER)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">PHOTO_ARCHIVE:</span>
                    <span className="font-medium text-[#f5f5f7]">{birthdayConfig.totalMemoriesCount} ENTRIES LOADED</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[#9ca3af]">USER_AGENT:</span>
                    <span className="font-mono text-[10px] break-all text-[#9ca3af]">{typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 45) : 'Antigravity'}...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE CLI COMMAND RUNNER */}
          {activeTab === 'console' && (
            <div className="flex flex-col h-full gap-3">
              <div className="flex-1 bg-[#121723] border border-[#ffffff1a] p-4 rounded-xl font-mono text-xs overflow-y-auto space-y-2">
                <div className="text-[#38bdf8]">
                  NEKO.EXE DevTools Shell v22.0.0 [x86_64]<br />
                  Type <span className="text-[#f5a524] font-bold">help</span> to view available system commands.
                </div>
                {commandHistory.map((line, idx) => (
                  <div key={idx} className={`whitespace-pre-wrap ${line.startsWith('>') ? 'text-[#f5a524] font-bold' : 'text-[#f5f5f7]'}`}>
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleExecuteCommand} className="flex gap-2">
                <div className="flex-1 flex items-center bg-[#121723] border border-[#ffffff1a] focus-within:border-[#f5a524] px-3.5 py-2.5 rounded-xl text-xs transition-colors">
                  <span className="text-[#f5a524] font-mono font-semibold mr-2 select-none">root@neko-dev:~#</span>
                  <input
                    ref={commandInputRef}
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Enter command (e.g. status, glitch, jump 6, help)..."
                    className="flex-1 bg-transparent text-[#f5f5f7] focus:outline-hidden font-mono text-xs"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#f5a524] hover:bg-[#fbbf24] text-[#0a0e17] font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  EXECUTE
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Terminal Footer */}
        <div className="bg-[#1a1f2e] border-t border-[#ffffff1a] px-4 py-2.5 flex items-center justify-between text-[11px] text-[#9ca3af]">
          <span>PRESS [ESC] OR CLICK CLOSE TO RETURN</span>
          <span>SECURITY LEVEL: 0 // READ-WRITE DEVTOOLS</span>
        </div>

      </div>
    </div>
  );
};
