import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Heart, 
  BookOpen, 
  Filter,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

interface DiaryEntry {
  id: string;
  title: string | null;
  content: string;
  mood_rating: number | null;
  mood_tags: string[] | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

const moodOptions = [
  { value: 1, label: '😢 Very Sad', color: 'bg-red-100 text-red-800' },
  { value: 2, label: '😔 Sad', color: 'bg-red-50 text-red-700' },
  { value: 3, label: '😕 Down', color: 'bg-orange-100 text-orange-800' },
  { value: 4, label: '😐 Neutral', color: 'bg-gray-100 text-gray-800' },
  { value: 5, label: '🙂 Okay', color: 'bg-yellow-100 text-yellow-800' },
  { value: 6, label: '😊 Good', color: 'bg-green-100 text-green-800' },
  { value: 7, label: '😄 Happy', color: 'bg-green-200 text-green-900' },
  { value: 8, label: '😁 Very Happy', color: 'bg-blue-100 text-blue-800' },
  { value: 9, label: '🤗 Joyful', color: 'bg-purple-100 text-purple-800' },
  { value: 10, label: '🌟 Amazing', color: 'bg-pink-100 text-pink-800' }
];

const commonMoodTags = [
  'Grateful', 'Anxious', 'Peaceful', 'Stressed', 'Hopeful', 'Overwhelmed',
  'Confident', 'Lonely', 'Energetic', 'Tired', 'Proud', 'Worried'
];

const Diary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [moodFilter, setMoodFilter] = useState<string>('');
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  
  // New entry form state
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood_rating: '',
    mood_tags: [] as string[],
    entry_date: new Date()
  });

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, selectedDate, moodFilter]);

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load diary entries",
          variant: "destructive",
        });
      } else {
        setEntries(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchQuery) {
      filtered = filtered.filter(entry => 
        entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.mood_tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(entry => entry.entry_date === dateStr);
    }

    if (moodFilter) {
      filtered = filtered.filter(entry => entry.mood_rating?.toString() === moodFilter);
    }

    setFilteredEntries(filtered);
  };

  const createEntry = async () => {
    if (!user || !newEntry.content.trim()) return;

    try {
      const { error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: user.id,
          title: newEntry.title || null,
          content: newEntry.content,
          mood_rating: newEntry.mood_rating ? parseInt(newEntry.mood_rating) : null,
          mood_tags: newEntry.mood_tags.length > 0 ? newEntry.mood_tags : null,
          entry_date: format(newEntry.entry_date, 'yyyy-MM-dd')
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create diary entry",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Diary entry created successfully",
        });
        setShowNewEntryDialog(false);
        setNewEntry({
          title: '',
          content: '',
          mood_rating: '',
          mood_tags: [],
          entry_date: new Date()
        });
        fetchEntries();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const toggleMoodTag = (tag: string) => {
    setNewEntry(prev => ({
      ...prev,
      mood_tags: prev.mood_tags.includes(tag)
        ? prev.mood_tags.filter(t => t !== tag)
        : [...prev.mood_tags, tag]
    }));
  };

  const getMoodInfo = (rating: number | null) => {
    if (!rating) return null;
    return moodOptions.find(option => option.value === rating);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDate(undefined);
    setMoodFilter('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your diary...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10" />
            Digital Diary
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your thoughts and emotions deserve a safe home where you can always return to them
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search entries by content, title, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Filter by date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Mood Filter */}
          <Select value={moodFilter} onValueChange={setMoodFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by mood" />
            </SelectTrigger>
            <SelectContent>
              {moodOptions.map((mood) => (
                <SelectItem key={mood.value} value={mood.value.toString()}>
                  {mood.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(searchQuery || selectedDate || moodFilter) && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}

          {/* New Entry Button */}
          <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Diary Entry</DialogTitle>
                <DialogDescription>
                  Record your thoughts, feelings, and reflections
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your entry a title..."
                  />
                </div>

                <div>
                  <Label htmlFor="content">Your Thoughts *</Label>
                  <Textarea
                    id="content"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="How are you feeling today? What's on your mind?"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label>Mood Rating</Label>
                  <Select 
                    value={newEntry.mood_rating} 
                    onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood_rating: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How are you feeling? (1-10)" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((mood) => (
                        <SelectItem key={mood.value} value={mood.value.toString()}>
                          {mood.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Mood Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonMoodTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={newEntry.mood_tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleMoodTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Entry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {format(newEntry.entry_date, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEntry.entry_date}
                        onSelect={(date) => date && setNewEntry(prev => ({ ...prev, entry_date: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={createEntry} disabled={!newEntry.content.trim()}>
                    Save Entry
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewEntryDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
          </p>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your journey by creating your first diary entry
            </p>
            <Button onClick={() => setShowNewEntryDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Entry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => {
              const moodInfo = getMoodInfo(entry.mood_rating);
              return (
                <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {entry.title || 'Untitled Entry'}
                        </CardTitle>
                        <CardDescription>
                          {format(new Date(entry.entry_date), 'MMMM dd, yyyy')}
                        </CardDescription>
                      </div>
                      {moodInfo && (
                        <Badge className={moodInfo.color}>
                          {moodInfo.label.split(' ')[0]}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {entry.content}
                    </p>
                    
                    {entry.mood_tags && entry.mood_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {entry.mood_tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Diary;