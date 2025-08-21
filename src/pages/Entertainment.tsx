import React, { useState, useEffect } from 'react';
import { Search, Book, Music, Film, Star, ExternalLink, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
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

const movies = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `Inspiring Movie ${i + 1}`,
  poster: `https://picsum.photos/200/300?random=${i + 41}`,
  description: "A heartwarming story about overcoming challenges and finding inner strength through life's difficulties.",
  whyWatch: "Offers valuable insights into emotional growth and mental health awareness.",
  rating: (7.0 + Math.random() * 2.5).toFixed(1),
  genre: ["Drama", "Animation", "Documentary", "Comedy"][i % 4],
  imdbUrl: `https://www.imdb.com/title/placeholder${i + 1}`
}));

export default function Entertainment() {
  const [activeTab, setActiveTab] = useState("books");
  const [bookSearch, setBookSearch] = useState("");
  const [movieGenre, setMovieGenre] = useState("All");
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handlePlayVideo = (videoId: number) => {
    setPlayingVideo(playingVideo === videoId ? null : videoId);
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
                        {[
                          { name: 'Calm Focus', icon: '🎯', active: true },
                          { name: 'Sleep Sounds', icon: '🌙' },
                          { name: 'Meditation', icon: '🧘' },
                          { name: 'Anxiety Relief', icon: '🌊' },
                          { name: 'Nature Sounds', icon: '🍃' },
                          { name: 'Binaural Beats', icon: '🎵' },
                          { name: 'Guided Breathing', icon: '💨' },
                          { name: 'Stress Relief', icon: '☮️' }
                        ].map((category) => (
                          <button
                            key={category.name}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                              category.active 
                                ? 'text-white font-medium' 
                                : 'hover:bg-white/50'
                            }`}
                            style={{
                              backgroundColor: category.active 
                                ? 'hsl(var(--wellness-blue))' 
                                : 'transparent',
                              color: category.active 
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
                          <div key={track.id} className="flex items-center gap-2 p-2 rounded hover:bg-white/50 transition-colors cursor-pointer">
                            <img src={track.albumArt} alt="" className="w-8 h-8 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate" style={{ color: 'hsl(var(--wellness-text))' }}>
                                {track.title}
                              </p>
                              <p className="text-xs truncate" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                                {track.artist}
                              </p>
                            </div>
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
                      <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--wellness-text))' }}>
                        Featured: Calm Focus Collection
                      </h3>
                      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50" style={{ backgroundColor: 'hsl(var(--wellness-card-alt))' }}>
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br" style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}>
                            <div className="w-full h-full flex items-center justify-center text-2xl text-white rounded-xl">
                              🎯
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-medium mb-1" style={{ color: 'hsl(var(--wellness-text))' }}>
                              Deep Focus Soundscapes
                            </h4>
                            <p className="mb-3" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                              Scientifically designed audio to enhance concentration and reduce distractions
                            </p>
                            <button 
                              className="px-6 py-2 rounded-full text-white font-medium transition-all duration-200 hover:shadow-lg"
                              style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}
                            >
                              ▶ Start Focus Session
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sound Collections Grid */}
                    <div>
                      <h3 className="text-xl font-medium mb-4" style={{ color: 'hsl(var(--wellness-text))' }}>
                        Recommended for You
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {music.slice(0, 8).map((track) => (
                          <div key={track.id} className="group cursor-pointer">
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
                                <button
                                  onClick={() => handlePlayVideo(track.id)}
                                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center"
                                >
                                  {playingVideo === track.id ? (
                                    <Pause className="w-6 h-6" />
                                  ) : (
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}
                                    >
                                      <Play className="w-5 h-5" />
                                    </div>
                                  )}
                                </button>
                              </div>
                              <h4 className="font-medium text-sm mb-1 line-clamp-1" style={{ color: 'hsl(var(--wellness-text))' }}>
                                {track.title}
                              </h4>
                              <p className="text-xs mb-2" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                                {track.artist}
                              </p>
                              
                              {playingVideo === track.id && (
                                <div className="mt-3">
                                  <div className="aspect-video mb-3">
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://www.youtube.com/embed/${track.youtubeId}?autoplay=1`}
                                      title={track.title}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="rounded-lg"
                                    />
                                  </div>
                                </div>
                              )}
                              
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
                    </div>
                  </div>
                </div>

                {/* Bottom Player (Fixed) */}
                {playingVideo && (
                  <div className="fixed bottom-0 left-0 right-0 p-4 border-t transition-all duration-300" style={{ 
                    backgroundColor: 'hsl(var(--wellness-bg-alt))',
                    borderColor: 'hsl(var(--wellness-border))'
                  }}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={music.find(m => m.id === playingVideo)?.albumArt} 
                          alt="" 
                          className="w-12 h-12 rounded-lg object-cover" 
                        />
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'hsl(var(--wellness-text))' }}>
                            {music.find(m => m.id === playingVideo)?.title}
                          </p>
                          <p className="text-xs" style={{ color: 'hsl(var(--wellness-text-muted))' }}>
                            {music.find(m => m.id === playingVideo)?.artist}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setPlayingVideo(null)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200"
                          style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                        <div className="w-48 h-1 rounded-full" style={{ backgroundColor: 'hsl(var(--wellness-border))' }}>
                          <div className="w-1/3 h-full rounded-full" style={{ backgroundColor: 'hsl(var(--wellness-blue))' }}></div>
                        </div>
                        <span className="text-xs" style={{ color: 'hsl(var(--wellness-text-muted))' }}>2:34 / 8:42</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Movies Section */}
            <TabsContent value="movies" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Uplifting Movies</h2>
                <Select value={movieGenre} onValueChange={setMovieGenre}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Genres</SelectItem>
                    <SelectItem value="Drama">Drama</SelectItem>
                    <SelectItem value="Animation">Animation</SelectItem>
                    <SelectItem value="Documentary">Documentary</SelectItem>
                    <SelectItem value="Comedy">Comedy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <Card key={movie.id} className="hover-scale overflow-hidden">
                    <div className="aspect-[2/3] relative">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">{movie.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="bg-primary/20 px-2 py-1 rounded text-xs font-medium">
                          {movie.genre}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">{movie.description}</p>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <p className="text-sm font-medium text-primary mb-1">Why Watch:</p>
                        <p className="text-sm text-muted-foreground">{movie.whyWatch}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={movie.imdbUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" />
                          View on IMDB
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}