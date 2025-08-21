import React, { useState, useEffect } from 'react';
import { Search, Book, Music, Film, Star, ExternalLink, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface BookData {
  id: string;
  name: string;
  author: string;
  about: string;
  why_read: string;
  cover_url: string;
}

const music = [
  {
    id: 1,
    title: "Weightless",
    artist: "Marconi Union",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=250&h=250&fit=crop&crop=center",
    youtubeId: "UfcAVejslrU",
    whyListen: "Specifically composed to reduce anxiety, with a rhythm that slows the heart rate and reduces cortisol levels."
  },
  {
    id: 2,
    title: "Strawberry Swing",
    artist: "Coldplay",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=250&h=250&fit=crop&crop=center",
    youtubeId: "h3pJZSTQqIg",
    whyListen: "Gentle guitar melody and soothing vocals create a peaceful atmosphere that can ease tension and promote relaxation."
  },
  {
    id: 3,
    title: "Watermark",
    artist: "Enya",
    albumArt: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=250&fit=crop&crop=center",
    youtubeId: "LTrk4X9ACtw",
    whyListen: "Ethereal vocals and minimalist instrumentation create a meditative soundscape that helps quiet racing thoughts."
  },
  {
    id: 4,
    title: "Gymnopédie No. 1",
    artist: "Erik Satie",
    albumArt: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=250&h=250&fit=crop&crop=center",
    youtubeId: "S-Ead8rg3u0",
    whyListen: "This classical piano piece has a slow, meandering melody that helps slow breathing and calm the nervous system."
  },
  {
    id: 5,
    title: "Moonlight Sonata (1st Movement)",
    artist: "Ludwig van Beethoven",
    albumArt: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=250&h=250&fit=crop&crop=center",
    youtubeId: "4Tr0otuiQuU",
    whyListen: "The gentle, repetitive piano patterns create a hypnotic effect that can reduce stress and aid in sleep preparation."
  },
  {
    id: 6,
    title: "Clair de Lune",
    artist: "Claude Debussy",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=250&h=250&fit=crop&crop=center&seed=6",
    youtubeId: "CvFH_6DNRCY",
    whyListen: "Impressionistic piano melodies that evoke tranquility and help reduce anxiety through beautiful, flowing harmonies."
  },
  {
    id: 7,
    title: "Om Mani Padme Hum",
    artist: "Deva Premal",
    albumArt: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=250&h=250&fit=crop&crop=center",
    youtubeId: "hz931_bx4QM",
    whyListen: "Sacred chanting that promotes deep meditation and inner peace, reducing stress through spiritual connection."
  },
  {
    id: 8,
    title: "River",
    artist: "Max Richter",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=250&h=250&fit=crop&crop=center&seed=8",
    youtubeId: "g1uKOSuPZr0",
    whyListen: "Minimalist composition that creates a sense of flowing calm, perfect for stress relief and emotional regulation."
  }
];

const movies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop&crop=center",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. This story of hope and friendship in the bleakest of circumstances offers powerful lessons about resilience.",
    whyWatch: "A masterpiece about hope, friendship, and the human spirit's ability to overcome adversity.",
    rating: "9.3",
    genre: "Drama",
    imdbUrl: "https://www.imdb.com/title/tt0111161/"
  },
  {
    id: 2,
    title: "Inside Out",
    year: 2015,
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop&crop=center",
    description: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school. An excellent exploration of emotional health.",
    whyWatch: "Perfect for understanding emotional health and how our feelings work together.",
    rating: "8.1",
    genre: "Animation",
    imdbUrl: "https://www.imdb.com/title/tt2096673/"
  },
  {
    id: 3,
    title: "Good Will Hunting",
    year: 1997,
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop&crop=center",
    description: "Will Hunting, a janitor at M.I.T., has a gift for mathematics but needs help from a psychologist to find direction in his life. A moving story about overcoming trauma and finding self-worth.",
    whyWatch: "A powerful story about healing, therapy, and discovering your true potential.",
    rating: "8.3",
    genre: "Drama",
    imdbUrl: "https://www.imdb.com/title/tt0119217/"
  },
  {
    id: 4,
    title: "Peaceful Warrior",
    year: 2006,
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop&crop=center",
    description: "A chance encounter with a stranger changes the life of a college gymnast. Based on Dan Millman's book, this film explores mindfulness and being present in the moment.",
    whyWatch: "Teaches valuable lessons about mindfulness, presence, and finding inner peace.",
    rating: "7.3",
    genre: "Drama",
    imdbUrl: "https://www.imdb.com/title/tt0438315/"
  },
  {
    id: 5,
    title: "The Secret Life of Walter Mitty",
    year: 2013,
    poster: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=450&fit=crop&crop=center",
    description: "When his job along with that of his co-worker are threatened, Walter takes action in the real world embarking on a global journey that turns into an adventure more extraordinary than anything he could have ever imagined. Inspires courage and breaking from routine.",
    whyWatch: "Inspires courage to break from routine and pursue your dreams.",
    rating: "7.3",
    genre: "Comedy",
    imdbUrl: "https://www.imdb.com/title/tt0359950/"
  }
];

export default function Entertainment() {
  const [activeTab, setActiveTab] = useState("books");
  const [bookSearch, setBookSearch] = useState("");
  const [movieGenre, setMovieGenre] = useState("All");
  const [activeWellnessCategory, setActiveWellnessCategory] = useState("Calm Focus");
  const { state, playTrack } = useMusicPlayer();
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  // Wellness categories with their respective music
  const wellnessCategories = [
    { 
      name: 'Calm Focus', 
      icon: '🎯', 
      tracks: [1, 4, 5], // Weightless, Gymnopédie No. 1, Moonlight Sonata
      description: 'Enhance concentration and mental clarity'
    },
    { 
      name: 'Sleep Sounds', 
      icon: '🌙',
      tracks: [5, 6, 8], // Moonlight Sonata, Clair de Lune, River
      description: 'Drift into peaceful sleep'
    },
    { 
      name: 'Meditation', 
      icon: '🧘',
      tracks: [3, 7], // Watermark, Om Mani Padme Hum
      description: 'Deepen your mindfulness practice'
    },
    { 
      name: 'Anxiety Relief', 
      icon: '🌊',
      tracks: [1, 2, 3], // Weightless, Strawberry Swing, Watermark
      description: 'Calm anxious thoughts and feelings'
    },
    { 
      name: 'Nature Sounds', 
      icon: '🍃',
      tracks: [2, 8], // Strawberry Swing, River
      description: 'Connect with natural tranquility'
    },
    { 
      name: 'Binaural Beats', 
      icon: '🎵',
      tracks: [1, 8], // Weightless, River
      description: 'Synchronize brainwave patterns'
    },
    { 
      name: 'Guided Breathing', 
      icon: '💨',
      tracks: [4, 6], // Gymnopédie No. 1, Clair de Lune
      description: 'Breathe mindfully with soothing sounds'
    },
    { 
      name: 'Stress Relief', 
      icon: '☮️',
      tracks: [1, 2, 6, 8], // Weightless, Strawberry Swing, Clair de Lune, River
      description: 'Release tension and find inner peace'
    }
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching books:', error);
      } else {
        const books = data || [];
        // Update book covers with uploaded images
        if (books.length > 0) {
          books[0] = {
            ...books[0],
            cover_url: '/lovable-uploads/85bafac3-c27d-423b-9c7a-def66fcf85c3.png'
          };
        }
        if (books.length > 1) {
          books[1] = {
            ...books[1],
            cover_url: '/lovable-uploads/e687e4c6-b81d-45b9-ace2-953fd8a6ecac.png'
          };
        }
        if (books.length > 2) {
          books[2] = {
            ...books[2],
            cover_url: '/lovable-uploads/a32545a8-f7f9-482c-bc0b-c63d2e058edd.png'
          };
        }
        if (books.length > 3) {
          books[3] = {
            ...books[3],
            cover_url: '/lovable-uploads/12b382f6-9428-4572-80ac-4e9854f3d086.png'
          };
        }
        if (books.length > 4) {
          books[4] = {
            ...books[4],
            cover_url: '/lovable-uploads/1e32cfca-f494-4420-980c-5a0875424548.png'
          };
        }
        setBooks(books);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.name.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredMovies = movies.filter(movie => 
    movieGenre === "All" || movie.genre === movieGenre
  );

  const handlePlayMusic = (track: typeof music[0]) => {
    playTrack(track, music);
  };

  const getCurrentCategoryTracks = () => {
    const currentCategory = wellnessCategories.find(cat => cat.name === activeWellnessCategory);
    if (!currentCategory) return music;
    
    return music.filter(track => currentCategory.tracks.includes(track.id));
  };

  const playDeepFocusCollection = () => {
    const focusTrack = music.find(track => track.id === 1); // Weightless - the most calming
    if (focusTrack) {
      playTrack(focusTrack, getCurrentCategoryTracks());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Entertainment for Mental Wellness
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover carefully curated books, music, and movies designed to support your mental health journey. 
              Each recommendation is chosen for its positive impact on emotional well-being and personal growth.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="books" className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                Books
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Music
              </TabsTrigger>
              <TabsTrigger value="movies" className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                Movies
              </TabsTrigger>
            </TabsList>

            {/* Books Section */}
            <TabsContent value="books" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Mental Health Books</h2>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by title or author..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-[2/3] bg-muted animate-pulse" />
                      <CardHeader>
                        <div className="h-5 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  filteredBooks.map((book) => (
                    <Card key={book.id} className="hover-scale overflow-hidden">
                      <div className="aspect-[3/4] relative">
                        <img
                          src={book.cover_url}
                          alt={book.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log(`Image failed to load: ${book.cover_url}`);
                            // Try with the full domain first
                            if (!e.currentTarget.src.includes('://')) {
                              e.currentTarget.src = `${window.location.origin}${book.cover_url}`;
                            } else {
                              // Fallback to a default book cover
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center';
                            }
                          }}
                          onLoad={() => {
                            console.log(`Image loaded successfully: ${book.cover_url}`);
                          }}
                        />
                      </div>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-base line-clamp-2">{book.name}</CardTitle>
                        <CardDescription className="text-xs font-medium">{book.author}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">{book.about}</p>
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <p className="text-xs font-medium text-primary mb-1">Why Read:</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{book.why_read}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Music Section - Wellness Music Platform */}
            <TabsContent value="music" className="space-y-0">
              <div className="font-nunito" style={{ backgroundColor: 'hsl(var(--wellness-bg))' }}>
                {/* Music Platform Header */}
                <div className="mb-6 p-6 rounded-xl" style={{ backgroundColor: 'hsl(var(--wellness-bg-alt))' }}>
                  <h2 className="text-3xl font-semibold mb-2" style={{ color: 'hsl(var(--wellness-text))' }}>
                    Therapeutic Soundscapes
                  </h2>
                  <p className="text-lg" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                    Curated audio experiences designed to support your mental wellness journey
                  </p>
                </div>

                {/* Main Music Layout */}
                <div className="flex gap-6">
                  {/* Left Sidebar */}
                  <div className="w-64 flex-shrink-0">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'hsl(var(--wellness-card))' }}>
                      <h3 className="font-medium mb-4" style={{ color: 'hsl(var(--wellness-text))' }}>
                        Wellness Categories
                      </h3>
                       <nav className="space-y-2">
                        {wellnessCategories.map((category) => (
                          <button
                            key={category.name}
                            onClick={() => setActiveWellnessCategory(category.name)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover:bg-white/50 ${
                              activeWellnessCategory === category.name 
                                ? 'text-white font-medium' 
                                : ''
                            }`}
                            style={{
                              backgroundColor: activeWellnessCategory === category.name 
                                ? 'hsl(var(--wellness-blue))' 
                                : 'transparent',
                              color: activeWellnessCategory === category.name 
                                ? 'white' 
                                : 'hsl(var(--wellness-text-muted))'
                            }}
                          >
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm">{category.name}</span>
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Recently Played */}
                    <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'hsl(var(--wellness-card))' }}>
                      <h3 className="font-medium mb-3" style={{ color: 'hsl(var(--wellness-text))' }}>
                        Recently Played
                      </h3>
                      <div className="space-y-2">
                        {music.slice(0, 3).map((track) => (
                          <div key={track.id} className="flex items-center gap-2 p-2 rounded hover:bg-white/50 transition-colors cursor-pointer"
                               onClick={() => handlePlayMusic(track)}>
                            <img src={track.albumArt} alt="" className="w-8 h-8 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate" style={{ color: 'hsl(var(--wellness-text))' }}>
                                {track.title}
                              </p>
                              <p className="text-xs truncate" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                                {track.artist}
                              </p>
                            </div>
                            {state.currentTrack?.id === track.id && (
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1">
                    {/* Search Bar */}
                    <div className="mb-6">
                      <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--wellness-text-muted))' }} />
                        <input
                          type="text"
                          placeholder="Search sounds, moods, or techniques..."
                          className="w-full pl-10 pr-4 py-3 rounded-lg border-0 outline-none transition-all duration-200"
                          style={{ 
                            backgroundColor: 'hsl(var(--wellness-bg-alt))',
                            color: 'hsl(var(--wellness-text))',
                            boxShadow: `0 2px 8px hsl(var(--wellness-border) / 0.3)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Featured Collection */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-medium" style={{ color: 'hsl(var(--wellness-text))' }}>
                          Featured: {activeWellnessCategory} Collection
                        </h3>
                        <Button
                          onClick={playDeepFocusCollection}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play Collection
                        </Button>
                      </div>
                      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50" style={{ backgroundColor: 'hsl(var(--wellness-card-alt))' }}>
                        <div className="flex items-center gap-6">
                          <button
                            onClick={playDeepFocusCollection}
                            className="w-20 h-20 rounded-xl bg-gradient-to-br transition-all duration-200 hover:scale-105 flex items-center justify-center text-2xl text-white cursor-pointer" 
                            style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}
                          >
                            {wellnessCategories.find(cat => cat.name === activeWellnessCategory)?.icon}
                          </button>
                          <div className="flex-1">
                            <h4 className="text-lg font-medium mb-1" style={{ color: 'hsl(var(--wellness-text))' }}>
                              {activeWellnessCategory} Soundscapes
                            </h4>
                            <p className="text-sm mb-3" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                              {wellnessCategories.find(cat => cat.name === activeWellnessCategory)?.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-white/60 px-2 py-1 rounded">
                                {getCurrentCategoryTracks().length} tracks
                              </span>
                              <span className="text-xs bg-white/60 px-2 py-1 rounded">
                                Curated for wellness
                              </span>
                              {state.currentTrack && getCurrentCategoryTracks().some(t => t.id === state.currentTrack?.id) && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded animate-pulse">
                                  ● Now Playing
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sound Collections Grid */}
                    <div>
                      <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--wellness-text))' }}>
                        {activeWellnessCategory} Collection
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {getCurrentCategoryTracks().map((track) => (
                          <div key={track.id} className="group cursor-pointer" onClick={() => handlePlayMusic(track)}>
                            <div 
                              className="p-4 rounded-xl transition-all duration-200 hover:shadow-lg"
                              style={{ backgroundColor: 'hsl(var(--wellness-card))' }}
                            >
                              <div className="relative mb-3">
                                <img
                                  src={track.albumArt}
                                  alt={track.title}
                                  className="w-full aspect-square object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  {state.currentTrack?.id === track.id && state.isPlaying ? (
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}
                                    >
                                      <Pause className="w-5 h-5" />
                                    </div>
                                  ) : (
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}
                                    >
                                      <Play className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                {state.currentTrack?.id === track.id && (
                                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                )}
                              </div>
                              <h4 className="font-medium text-sm mb-1 line-clamp-1" style={{ color: 'hsl(var(--wellness-text))' }}>
                                {track.title}
                              </h4>
                              <p className="text-xs mb-2" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                                {track.artist}
                              </p>
                              
                              <div className="text-xs p-2 rounded" style={{ 
                                backgroundColor: 'hsl(var(--wellness-bg-alt))',
                                color: 'hsl(var(--wellness-text-muted))'
                              }}>
                                {track.whyListen}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Show message if category has fewer tracks */}
                      {getCurrentCategoryTracks().length < 4 && (
                        <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-gray-200">
                          <p className="text-center text-gray-500 text-sm">
                            Explore other categories for more {activeWellnessCategory.toLowerCase()} content
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Player removed - using GlobalMusicPlayer instead */}
              </div>
            </TabsContent>

            {/* Movies Section - Soft Calming Theme */}
            <TabsContent value="movies" className="space-y-0">
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl">
                {/* Hero Section */}
                <div className="relative h-80 sm:h-96 overflow-hidden rounded-2xl mb-8 shadow-lg">
                  <img
                    src={filteredMovies[0]?.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop&crop=center"}
                    alt="Featured Movie"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-purple-800/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                      {filteredMovies[0]?.title || "Featured Mental Wellness Film"} 
                      <span className="text-lg opacity-75 ml-2">({filteredMovies[0]?.year})</span>
                    </h1>
                    <p className="text-lg mb-4 leading-relaxed opacity-90">
                      {filteredMovies[0]?.description || "Discover inspiring stories that promote emotional well-being and personal growth through powerful storytelling."}
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        <span className="font-semibold">{filteredMovies[0]?.rating || "8.2"}</span>
                      </div>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {filteredMovies[0]?.genre || "Drama"}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        size="lg" 
                        className="bg-white/90 text-indigo-800 hover:bg-white transition-all duration-300 shadow-lg"
                        asChild
                      >
                        <a href={filteredMovies[0]?.imdbUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-5 h-5 mr-2" />
                          View Details
                        </a>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/10 transition-all duration-300"
                      >
                        + Add to Watchlist
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Filter Section */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-indigo-800">Mindful Cinema</h2>
                  <Select value={movieGenre} onValueChange={setMovieGenre}>
                    <SelectTrigger className="w-48 bg-white/70 border-indigo-200 text-indigo-800 shadow-sm">
                      <SelectValue placeholder="Filter by genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-indigo-200">
                      <SelectItem value="All" className="text-indigo-800 hover:bg-indigo-50">All Genres</SelectItem>
                      <SelectItem value="Drama" className="text-indigo-800 hover:bg-indigo-50">Drama</SelectItem>
                      <SelectItem value="Animation" className="text-indigo-800 hover:bg-indigo-50">Animation</SelectItem>
                      <SelectItem value="Documentary" className="text-indigo-800 hover:bg-indigo-50">Documentary</SelectItem>
                      <SelectItem value="Comedy" className="text-indigo-800 hover:bg-indigo-50">Comedy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Rows */}
                <div className="space-y-8">
                  {/* Featured Collection */}
                  <div>
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-6">Healing Through Stories</h3>
                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                      {filteredMovies.map((movie) => (
                        <div 
                          key={movie.id} 
                          className="flex-shrink-0 w-56 group cursor-pointer"
                        >
                          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Soft Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-purple-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                              <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-3">
                                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                  <span className="text-sm font-medium">{movie.rating}</span>
                                  <span className="text-xs opacity-75">IMDb</span>
                                </div>
                                <p className="text-sm mb-4 line-clamp-3 leading-relaxed">{movie.whyWatch}</p>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    className="bg-white/90 text-indigo-800 hover:bg-white transition-colors text-xs px-4 py-2 shadow-lg"
                                    asChild
                                  >
                                    <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Details
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center px-2">
                            <h4 className="text-lg font-semibold text-indigo-800 line-clamp-2 mb-2">{movie.title}</h4>
                            <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
                              <span className="bg-indigo-100 px-2 py-1 rounded-full text-xs">{movie.genre}</span>
                              <span className="text-xs opacity-75">({movie.year})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emotional Wellness */}
                  <div>
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-6">Emotional Wellness</h3>
                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                      {filteredMovies.filter(movie => ["Inside Out", "Good Will Hunting", "Peaceful Warrior"].includes(movie.title)).map((movie) => (
                        <div 
                          key={`emotional-${movie.id}`} 
                          className="flex-shrink-0 w-56 group cursor-pointer"
                        >
                          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-pink-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                              <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-3">
                                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                  <span className="text-sm font-medium">{movie.rating}</span>
                                </div>
                                <p className="text-sm mb-4 line-clamp-3">{movie.whyWatch}</p>
                                <Button 
                                  size="sm" 
                                  className="bg-white/90 text-purple-800 hover:bg-white transition-colors text-xs px-4 py-2"
                                  asChild
                                >
                                  <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Watch
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="text-center px-2">
                            <h4 className="text-lg font-semibold text-indigo-800 line-clamp-2 mb-2">{movie.title}</h4>
                            <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
                              <span className="bg-purple-100 px-2 py-1 rounded-full text-xs">{movie.genre}</span>
                              <span className="text-xs opacity-75">({movie.year})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inspirational Stories */}
                  <div>
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-6">Inspirational Stories</h3>
                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                      {filteredMovies.map((movie) => (
                        <div 
                          key={`inspirational-${movie.id}`} 
                          className="flex-shrink-0 w-56 group cursor-pointer"
                        >
                          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-teal-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                              <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-3">
                                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                  <span className="text-sm font-medium">{movie.rating}</span>
                                </div>
                                <p className="text-sm mb-4 line-clamp-3">{movie.description}</p>
                                <Button 
                                  size="sm" 
                                  className="bg-white/90 text-emerald-800 hover:bg-white transition-colors text-xs px-4 py-2"
                                  asChild
                                >
                                  <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Explore
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="text-center px-2">
                            <h4 className="text-lg font-semibold text-indigo-800 line-clamp-2 mb-2">{movie.title}</h4>
                            <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
                              <span className="bg-emerald-100 px-2 py-1 rounded-full text-xs">{movie.genre}</span>
                              <span className="text-xs opacity-75">({movie.year})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pb-8"></div> {/* Bottom spacing */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}