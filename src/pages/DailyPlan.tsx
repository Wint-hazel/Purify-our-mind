import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Plus, BookOpen, Filter, Heart, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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
  { value: 1, label: 'Very Low', emoji: '😢', color: 'bg-red-100 text-red-800' },
  { value: 2, label: 'Low', emoji: '😔', color: 'bg-red-50 text-red-600' },
  { value: 3, label: 'Struggling', emoji: '😟', color: 'bg-orange-100 text-orange-800' },
  { value: 4, label: 'Below Average', emoji: '😕', color: 'bg-orange-50 text-orange-600' },
  { value: 5, label: 'Neutral', emoji: '😐', color: 'bg-gray-100 text-gray-800' },
  { value: 6, label: 'Okay', emoji: '🙂', color: 'bg-blue-100 text-blue-800' },
  { value: 7, label: 'Good', emoji: '😊', color: 'bg-green-100 text-green-800' },
  { value: 8, label: 'Very Good', emoji: '😄', color: 'bg-green-200 text-green-900' },
  { value: 9, label: 'Great', emoji: '😁', color: 'bg-emerald-100 text-emerald-800' },
  { value: 10, label: 'Excellent', emoji: '🤩', color: 'bg-emerald-200 text-emerald-900' },
];

const commonMoodTags = [
  'Anxious', 'Happy', 'Sad', 'Excited', 'Stressed', 'Calm', 'Angry', 'Grateful',
  'Lonely', 'Confident', 'Tired', 'Energetic', 'Hopeful', 'Worried', 'Peaceful', 'Frustrated'
];

const DailyPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<number | null>(null);

  // New entry form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMoodRating, setNewMoodRating] = useState<number | null>(null);
  const [newMoodTags, setNewMoodTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      setSearchQuery('');
      setSelectedMoodFilter(null);
    }
  }, [selectedDate]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load diary entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!newContent.trim()) {
      toast({
        title: "Error",
        description: "Please write something in your diary entry",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: user?.id,
          title: newTitle.trim() || null,
          content: newContent.trim(),
          mood_rating: newMoodRating,
          mood_tags: newMoodTags.length > 0 ? newMoodTags : null,
          entry_date: selectedDate || new Date().toISOString().split('T')[0],
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your diary entry has been saved",
      });

      // Reset form
      setNewTitle('');
      setNewContent('');
      setNewMoodRating(null);
      setNewMoodTags([]);
      setCustomTag('');
      setShowNewEntry(false);

      // Refresh entries
      fetchEntries();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save diary entry",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleMoodTag = (tag: string) => {
    setNewMoodTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !newMoodTags.includes(customTag.trim())) {
      setNewMoodTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const getMoodOption = (rating: number | null) => {
    return moodOptions.find(m => m.value === rating);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.mood_tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesMood = !selectedMoodFilter || entry.mood_rating === selectedMoodFilter;
    
    const matchesDate = !selectedDate || entry.entry_date === selectedDate;
    
    return matchesSearch && matchesMood && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your diary...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-12 h-12 text-primary" />
            Daily Plan
            {selectedDate && (
              <Badge variant="outline" className="ml-2 text-sm">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Badge>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {selectedDate 
              ? `📝 Viewing entries for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
              : '🔒 Your thoughts and emotions deserve a safe home where you can always return to them'
            }
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedMoodFilter || ''}
              onChange={(e) => setSelectedMoodFilter(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">All Moods</option>
              {moodOptions.map(mood => (
                <option key={mood.value} value={mood.value}>
                  {mood.emoji} {mood.label}
                </option>
              ))}
            </select>
            
            <Button onClick={() => setShowNewEntry(!showNewEntry)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </div>
        </div>

        {/* New Entry Form */}
        {showNewEntry && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Write Your Thoughts
              </CardTitle>
              <CardDescription>
                Express yourself freely - this is your safe space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Entry title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              
              <Textarea
                placeholder="How are you feeling today? What's on your mind?"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-32"
              />

              {/* Mood Rating */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  How do you feel today? (1-10)
                </label>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {moodOptions.map(mood => (
                    <Button
                      key={mood.value}
                      variant={newMoodRating === mood.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewMoodRating(mood.value)}
                      className="text-xs"
                    >
                      {mood.emoji} {mood.value}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mood Tags */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mood Tags (select any that apply)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonMoodTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={newMoodTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleMoodTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                  />
                  <Button onClick={addCustomTag} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEntry} disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : 'Save Entry'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entries List */}
        <div className="space-y-6">
          {filteredEntries.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {entries.length === 0 ? 'Start Your Journey' : 'No Matching Entries'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {entries.length === 0 
                    ? 'Your first diary entry is just a click away. Begin documenting your thoughts and emotions.'
                    : 'Try adjusting your search or mood filter to find other entries.'
                  }
                </p>
                {entries.length === 0 && (
                  <Button onClick={() => setShowNewEntry(true)}>
                    Write Your First Entry
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => {
              const moodOption = getMoodOption(entry.mood_rating);
              return (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {entry.title || `Entry from ${new Date(entry.entry_date).toLocaleDateString()}`}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(entry.entry_date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardDescription>
                      </div>
                      {moodOption && (
                        <Badge className={moodOption.color}>
                          {moodOption.emoji} {moodOption.label}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4 whitespace-pre-wrap">{entry.content}</p>
                    {entry.mood_tags && entry.mood_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.mood_tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyPlan;