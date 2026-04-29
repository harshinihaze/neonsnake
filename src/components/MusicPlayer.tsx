import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drift',
    artist: 'AI Generator Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: 'var(--color-neon-pink)'
  },
  {
    id: 2,
    title: 'Cyber Pulse',
    artist: 'AI Generator Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: 'var(--color-neon-blue)'
  },
  {
    id: 3,
    title: 'Synthwave Dreams',
    artist: 'AI Generator Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: 'var(--color-neon-purple)'
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = 0;
    } else {
      audio.volume = 0.5;
    }
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-sm bg-black/60 backdrop-blur-md rounded-2xl p-6 neon-border-blue flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xl neon-text-blue tracking-wide">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400 font-mono mt-1">{currentTrack.artist}</p>
        </div>
        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[var(--color-neon-blue)] opacity-80 flex items-center justify-center bg-gray-900 shadow-[0_0_10px_var(--color-neon-blue)]">
            {isPlaying ? (
                <div className="flex gap-1 h-4 items-end">
                    <div className="w-1 bg-[#00f3ff] h-2 animate-bounce flex-shrink-0"></div>
                    <div className="w-1 bg-[#00f3ff] h-4 animate-bounce flex-shrink-0" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 bg-[#00f3ff] h-3 animate-bounce flex-shrink-0" style={{ animationDelay: '0.2s' }}></div>
                </div>
            ) : (
                <div className="w-4 h-4 bg-[#00f3ff] rounded-full opacity-50 blur-[2px]"></div>
            )}
        </div>
      </div>

      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-2 relative">
        <div 
          className="h-full bg-[var(--color-neon-blue)] transition-all duration-100 ease-linear shadow-[0_0_5px_var(--color-neon-blue)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button onClick={prevTrack} className="text-[#00f3ff] hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-12 h-12 flex items-center justify-center bg-[#00f3ff]/20 rounded-full text-[#00f3ff] hover:bg-[#00f3ff]/40 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          
          <button onClick={nextTrack} className="text-[#00f3ff] hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="w-5" /> {/* Spacer for alignment */}
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
    </div>
  );
}
