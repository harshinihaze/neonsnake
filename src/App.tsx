import { MusicPlayer } from "./components/MusicPlayer";
import { SnakeGame } from "./components/SnakeGame";

export default function App() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Immersive background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ff007f] opacity-10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00f3ff] opacity-10 blur-[150px]"></div>
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-50 mix-blend-overlay"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-12 w-full max-w-5xl px-6 py-12">
        <header className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-2 relative inline-block">
            <span className="neon-text-blue">NEON </span>
            <span className="neon-text-pink text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#b026ff]">SNAKE</span>
          </h1>
          <p className="text-gray-400 font-mono tracking-widest uppercase text-sm mt-2">Synthwave Edition</p>
        </header>

        <main className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center justify-items-center relative">
          <div className="w-full flex justify-center lg:justify-end">
            <SnakeGame />
          </div>
          
          <div className="w-full flex justify-center lg:justify-start lg:mt-16">
            <MusicPlayer />
          </div>
        </main>
      </div>
    </div>
  );
}
