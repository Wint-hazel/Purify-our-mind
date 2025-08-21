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

const music = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Calming Song ${i + 1}`,
  artist: `Artist ${i + 1}`,
  albumArt: `https://picsum.photos/250/250?random=${i + 21}`,
  youtubeId: "UfcAVejslrU", // Placeholder - Weightless by Marconi Union
  whyListen: "Scientifically designed to reduce anxiety and promote relaxation."
}));

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

            {/* Music Section */}
            <TabsContent value="music" className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Therapeutic Music</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {music.map((song) => (
                  <Card key={song.id} className="hover-scale overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={song.albumArt}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        onClick={() => handlePlayVideo(song.id)}
                        className="absolute inset-0 bg-black/50 hover:bg-black/60 text-white opacity-0 hover:opacity-100 transition-opacity"
                        variant="ghost"
                        size="lg"
                      >
                        {playingVideo === song.id ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8" />
                        )}
                      </Button>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{song.title}</CardTitle>
                      <CardDescription className="text-sm font-medium">{song.artist}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {playingVideo === song.id && (
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`}
                            title={song.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <p className="text-sm font-medium text-primary mb-1">Why Listen:</p>
                        <p className="text-sm text-muted-foreground">{song.whyListen}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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