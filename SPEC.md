# NEKO.EXE — Technical & Design Specification

## §1 Screen Overview (0–7)
- **Screen 00: Boot Sequence** — BIOS boot terminal, diagnostic memory checks, sound synth initialization, fast-boot toggle, and system start.
- **Screen 01: Hero Screen** — Cyberpunk glitch title, birthday recipient HUD (Alex / Level 24), animated Pixel Cat companion with meow reactions, and quest navigation.
- **Screen 02: Friendship Stats** — Stat bars (Chaos sync, co-op hours, anime debates, loyalty HP) animated on screen enter with radar/bar indicators.
- **Screen 03: Anime Archive** — Curated retro cards with quotes, genres, and ratings.
- **Screen 04: Memory Database** — 8-card photo gallery (fixed 4:3 aspect ratio) with modal viewer, hover glitch, and missing asset placeholder fallback (`#111111`, dashed border, `[ ASSET MISSING ]`).
- **Screen 05: Mini Game (Save the Birthday Cat)** — Canvas arcade game catching cakes, stars, hearts while avoiding obstacles, unlocking the cake ceremony upon completion.
- **Screen 06: Birthday Cake & Candles** — Pixel cake, blow candle interaction, hand-rolled canvas pixel confetti burst.
- **Screen 07: Final Message** — Personal birthday letter with typewriter effect, credits, and replay option.

## §2 Architecture Rules
1. **Screen Transitions**: State-driven single page application (`currentScreen: 0-7`).
2. **Global CRT & Scanlines**: Applied once at root layout (`App.tsx`), never duplicated inside screens.
3. **Audio**: Web Audio API chiptune synthesizer, defaults to `♫ OFF` (no autoplay).
4. **Missing Assets**: Standardized fallback placeholder component with dashed borders and `[ ASSET MISSING ]` text.
