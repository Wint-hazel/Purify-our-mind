
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Bell, Plus, BookOpen, Eye, Snowflake, TrendingUp, Settings, Hand, Heart, Leaf, Brain, Sun } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

const Calendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEntries, setSelectedDateEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const appointments = [
    {
      id: 1,
      title: 'Morning Meditation Session',
      time: '8:00 AM',
      date: 'Today',
      type: 'daily',
      color: 'bg-primary'
    },
    {
      id: 2,
      title: 'Therapy Session',
      time: '2:00 PM',
      date: 'Tomorrow',
      type: 'appointment',
      color: 'bg-success'
    },
    {
      id: 3,
      title: 'Mindfulness Check-in',
      time: '6:00 PM',
      date: 'Today',
      type: 'reminder',
      color: 'bg-primary-light'
    }
  ];

  const upcomingTasks = [
    'Complete daily gratitude journal',
    'Take a 10-minute mindful walk',
    'Practice breathing exercises',
    'Review weekly wellness goals',
    'Schedule next therapy session'
  ];

  useEffect(() => {
    if (user) {
      fetchDiaryEntries();
    }
  }, [user]);

  const fetchDiaryEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setDiaryEntries(data || []);
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

  const getDiaryEntriesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return diaryEntries.filter(entry => entry.entry_date === dateString);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(today.getFullYear(), today.getMonth(), day);
    const dateString = clickedDate.toISOString().split('T')[0];
    navigate(`/daily-plan?date=${dateString}`);
  };

  const getMoodOption = (rating: number | null) => {
    return moodOptions.find(m => m.value === rating);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Simple calendar grid for display
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading calendar...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100 mb-6">
            Wellness Calendar
          </h1>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto">
            Track your mental health journey with scheduled activities, reminders, and diary entries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar with Wellness Design */}
          <div className="lg:col-span-2">
            <div className="relative max-w-4xl mx-auto">
              {/* Decorative Scalloped Border */}
              <div 
                className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 animate-fade-in"
                style={{
                  clipPath: `polygon(
                    0% 6%, 3% 0%, 6% 6%, 9% 0%, 12% 6%, 15% 0%, 18% 6%, 21% 0%, 24% 6%, 27% 0%, 30% 6%, 33% 0%, 36% 6%, 39% 0%, 42% 6%, 45% 0%, 48% 6%, 51% 0%, 54% 6%, 57% 0%, 60% 6%, 63% 0%, 66% 6%, 69% 0%, 72% 6%, 75% 0%, 78% 6%, 81% 0%, 84% 6%, 87% 0%, 90% 6%, 93% 0%, 96% 6%, 99% 0%, 100% 6%,
                    100% 94%, 99% 100%, 96% 94%, 93% 100%, 90% 94%, 87% 100%, 84% 94%, 81% 100%, 78% 94%, 75% 100%, 72% 94%, 69% 100%, 66% 94%, 63% 100%, 60% 94%, 57% 100%, 54% 94%, 51% 100%, 48% 94%, 45% 100%, 42% 94%, 39% 100%, 36% 94%, 33% 100%, 30% 94%, 27% 100%, 24% 94%, 21% 100%, 18% 94%, 15% 100%, 12% 94%, 9% 100%, 6% 94%, 3% 100%, 0% 94%
                  )`
                }}
              >
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 relative">
                  {/* Top Section with Icons, Meditation Figure, and Month */}
                  <div className="flex items-start justify-between mb-8">
                    {/* Left: Wellness Icons arranged in circular pattern */}
                    <div className="flex flex-col items-center">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* Top row */}
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <Snowflake className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        {/* Middle row */}
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <Hand className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        {/* Bottom row */}
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <Brain className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Meditation Figure */}
                      <div className="w-20 h-24 relative">
                        <svg width="80" height="96" viewBox="0 0 80 96" className="text-blue-700">
                          {/* Meditation pose silhouette */}
                          <path
                            d="M40 8 C45 8, 48 12, 48 18 C48 24, 45 28, 40 28 C35 28, 32 24, 32 18 C32 12, 35 8, 40 8 Z
                               M40 28 L40 48 M32 38 L25 32 M48 38 L55 32 
                               M40 48 L32 60 L28 68 L24 72 M40 48 L48 60 L52 68 L56 72
                               M28 72 C26 74, 26 76, 28 78 C30 76, 30 74, 28 72
                               M56 72 C58 74, 58 76, 56 78 C54 76, 54 74, 56 72"
                            fill="currentColor"
                            stroke="none"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Center: Month and Year */}
                    <div className="text-center flex-1">
                      <h2 className="text-5xl font-bold text-blue-900 mb-2">October</h2>
                      <h3 className="text-4xl font-bold text-blue-900">2025</h3>
                    </div>
                    
                    {/* Right: Decorative Leaf */}
                    <div className="flex items-center">
                      <Leaf className="w-16 h-16 text-blue-600 transform rotate-12" />
                    </div>
                  </div>
                  
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                      <div key={day + index} className="text-center text-2xl font-bold text-blue-900 p-3">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-3">
                    {calendarDays.map((day, index) => {
                      if (!day) return <div key={index} className="aspect-square"></div>;
                      
                      const dayDate = new Date(today.getFullYear(), today.getMonth(), day);
                      const entriesForDay = getDiaryEntriesForDate(dayDate);
                      const hasEntries = entriesForDay.length > 0;
                      const isToday = day === today.getDate();
                      const isSelected = selectedDate && selectedDate.getDate() === day;

                      return (
                        <div key={index} className="aspect-square relative">
                          <div 
                            className={`
                              w-full h-full flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 relative
                              ${isToday 
                                ? 'bg-blue-600 text-white shadow-lg transform scale-105 rounded-lg' 
                                : isSelected
                                  ? 'bg-blue-400 text-white shadow-md border-2 border-blue-700 rounded-lg'
                                  : 'text-blue-900 hover:bg-blue-300/50 hover:scale-105 rounded-lg'
                              }
                            `}
                            onClick={() => handleDateClick(day)}
                          >
                            {day}
                            {hasEntries && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs font-bold">
                                  {entriesForDay.length}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Action Button */}
                  <div className="mt-8 text-center">
                    <Button 
                      onClick={() => navigate(`/daily-plan${selectedDate ? '?date=' + selectedDate.toISOString().split('T')[0] : ''}`)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Open Daily Plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Entries */}
            {selectedDate && (
              <Card className="bg-gradient-card shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                    <BookOpen className="w-5 h-5 text-primary mr-2" />
                    {formatDateForDisplay(selectedDate)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDateEntries.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-3">No diary entries for this date</p>
                      <Button 
                        onClick={() => navigate(`/daily-plan?date=${selectedDate.toISOString().split('T')[0]}`)} 
                        size="sm" 
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Write Entry
                      </Button>
                    </div>
                  ) : (
                    <>
                      {selectedDateEntries.map(entry => {
                        const moodOption = getMoodOption(entry.mood_rating);
                        return (
                          <div key={entry.id} className="p-3 bg-background rounded-lg border">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm text-foreground">
                                {entry.title || 'Diary Entry'}
                              </h4>
                              {moodOption && (
                                <Badge variant="secondary" className="text-xs">
                                  {moodOption.emoji}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {entry.content}
                            </p>
                            {entry.mood_tags && entry.mood_tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {entry.mood_tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {entry.mood_tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{entry.mood_tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <Button 
                              onClick={() => navigate(`/daily-plan?date=${selectedDate.toISOString().split('T')[0]}`)} 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              View Full Entry
                            </Button>
                          </div>
                        );
                      })}
                      <Button 
                        onClick={() => navigate(`/daily-plan?date=${selectedDate.toISOString().split('T')[0]}`)} 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        View Entries for This Date
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Today's Schedule */}
            <Card className="bg-gradient-card shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${appointment.color}`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{appointment.title}</p>
                      <p className="text-xs text-muted-foreground">{appointment.time}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center space-x-2 p-3 border border-dashed border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-smooth">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Event</span>
                </button>
              </CardContent>
            </Card>

            {/* Wellness Tasks */}
            <Card className="bg-gradient-card shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                  <Bell className="w-5 h-5 text-primary mr-2" />
                  Wellness Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{task}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-subtle shadow-card animate-fade-in">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-4">This Week</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-primary">5</div>
                    <div className="text-sm text-muted-foreground">Meditation Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">12</div>
                    <div className="text-sm text-muted-foreground">Completed Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-light">{diaryEntries.length}</div>
                    <div className="text-sm text-muted-foreground">Diary Entries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calendar;
