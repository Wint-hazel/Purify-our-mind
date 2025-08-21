import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  albumArt: string;
  youtubeId: string;
  whyListen: string;
}

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playlist: MusicTrack[];
  currentIndex: number;
  volume: number;
  isMinimized: boolean;
}

interface MusicPlayerContextType {
  state: MusicPlayerState;
  playTrack: (track: MusicTrack, playlist?: MusicTrack[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMinimize: () => void;
  stopTrack: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({ children }) => {
  const [state, setState] = useState<MusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    playlist: [],
    currentIndex: -1,
    volume: 0.7,
    isMinimized: false,
  });

  const playTrack = useCallback((track: MusicTrack, playlist: MusicTrack[] = []) => {
    const newPlaylist = playlist.length > 0 ? playlist : [track];
    const trackIndex = newPlaylist.findIndex(t => t.id === track.id);
    
    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      playlist: newPlaylist,
      currentIndex: trackIndex,
      isMinimized: false,
    }));
  }, []);

  const pauseTrack = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resumeTrack = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const nextTrack = useCallback(() => {
    setState(prev => {
      if (prev.playlist.length === 0) return prev;
      
      const nextIndex = (prev.currentIndex + 1) % prev.playlist.length;
      const nextTrack = prev.playlist[nextIndex];
      
      return {
        ...prev,
        currentTrack: nextTrack,
        currentIndex: nextIndex,
        isPlaying: true,
      };
    });
  }, []);

  const previousTrack = useCallback(() => {
    setState(prev => {
      if (prev.playlist.length === 0) return prev;
      
      const prevIndex = prev.currentIndex === 0 ? prev.playlist.length - 1 : prev.currentIndex - 1;
      const prevTrack = prev.playlist[prevIndex];
      
      return {
        ...prev,
        currentTrack: prevTrack,
        currentIndex: prevIndex,
        isPlaying: true,
      };
    });
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const stopTrack = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTrack: null,
      isPlaying: false,
      isMinimized: false,
    }));
  }, []);

  const contextValue: MusicPlayerContextType = {
    state,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMinimize,
    stopTrack,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
};