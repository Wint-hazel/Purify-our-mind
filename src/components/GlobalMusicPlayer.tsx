import React, { useState, useRef, useEffect } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const GlobalMusicPlayer: React.FC = () => {
  const { state, pauseTrack, resumeTrack, nextTrack, previousTrack, setVolume, toggleMinimize, stopTrack } = useMusicPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(state.volume);
  
  if (!state.currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(state.volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
      state.isMinimized ? 'translate-y-full' : 'translate-y-0'
    }`}>
      {/* Minimize handle */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMinimize}
          className="bg-primary/90 text-white hover:bg-primary rounded-t-lg rounded-b-none px-4 py-1 h-6"
        >
          {state.isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
        </Button>
      </div>
      
      <Card className="rounded-none border-x-0 border-b-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl">
        <div className="px-6 py-4">
          {/* Progress bar */}
          <div className="w-full bg-white/20 h-1 rounded-full mb-4 cursor-pointer overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-100 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="relative group">
                <img
                  src={state.currentTrack.albumArt}
                  alt={state.currentTrack.title}
                  className="w-14 h-14 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-black ml-0.5" />
                  </div>
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white text-sm truncate">
                  {state.currentTrack.title}
                </h3>
                <p className="text-white/70 text-xs truncate">
                  {state.currentTrack.artist}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-white/50">{formatTime(currentTime)}</span>
                  <span className="text-xs text-white/30">/</span>
                  <span className="text-xs text-white/50">{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2 mx-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousTrack}
                className="text-white hover:text-white hover:bg-white/10 h-9 w-9 p-0 rounded-full"
                disabled={state.playlist.length <= 1}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={state.isPlaying ? pauseTrack : resumeTrack}
                className="text-white hover:text-white hover:bg-white/10 h-12 w-12 p-0 rounded-full bg-white/10 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {state.isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                className="text-white hover:text-white hover:bg-white/10 h-9 w-9 p-0 rounded-full"
                disabled={state.playlist.length <= 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume & Close */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className="text-white hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
                >
                  {isMuted || state.volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                
                {showVolumeSlider && (
                  <div 
                    className="w-20 animate-fade-in"
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <Slider
                      value={[isMuted ? 0 : state.volume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={stopTrack}
                className="text-white hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Hidden YouTube Player for Audio */}
          {state.currentTrack && (
            <div className="hidden">
              <iframe
                width="0"
                height="0"
                src={`https://www.youtube.com/embed/${state.currentTrack.youtubeId}?autoplay=${state.isPlaying ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
                title={state.currentTrack.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GlobalMusicPlayer;