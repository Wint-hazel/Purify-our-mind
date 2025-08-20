
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
            <div className="relative">
              {/* Decorative Scalloped Border */}
              <div className="absolute inset-0 bg-blue-300 dark:bg-blue-700 rounded-3xl"
                   style={{
                     clipPath: `polygon(
                       0% 8%, 4% 0%, 8% 8%, 12% 0%, 16% 8%, 20% 0%, 24% 8%, 28% 0%, 32% 8%, 36% 0%, 40% 8%, 44% 0%, 48% 8%, 52% 0%, 56% 8%, 60% 0%, 64% 8%, 68% 0%, 72% 8%, 76% 0%, 80% 8%, 84% 0%, 88% 8%, 92% 0%, 96% 8%, 100% 0%,
                       100% 92%, 96% 100%, 92% 92%, 88% 100%, 84% 92%, 80% 100%, 76% 92%, 72% 100%, 68% 92%, 64% 100%, 60% 92%, 56% 100%, 52% 92%, 48% 100%, 44% 92%, 40% 100%, 36% 92%, 32% 100%, 28% 92%, 24% 100%, 20% 92%, 16% 100%, 12% 92%, 8% 100%, 4% 92%, 0% 100%
                     )`
                   }}>
              </div>
              
              <Card className="relative bg-blue-100/80 dark:bg-blue-900/80 backdrop-blur-sm border-0 shadow-2xl m-4 animate-fade-in">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-6 mb-6">
                    {/* Wellness Icons */}
                    <div className="grid grid-cols-4 gap-3 text-blue-600 dark:text-blue-300">
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <Snowflake className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <Hand className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Meditation Figure */}
                    <div className="mx-8">
                      <div className="w-24 h-24 bg-blue-600 dark:bg-blue-400 rounded-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* Meditation silhouette using CSS shapes */}
                          <div className="relative">
                            {/* Head */}
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-1"></div>
                            {/* Body */}
                            <div className="w-4 h-8 bg-blue-100 dark:bg-blue-900 rounded-t-full mx-auto"></div>
                            {/* Arms */}
                            <div className="absolute top-6 -left-2 w-2 h-4 bg-blue-100 dark:bg-blue-900 rounded-full transform rotate-45"></div>
                            <div className="absolute top-6 -right-2 w-2 h-4 bg-blue-100 dark:bg-blue-900 rounded-full transform -rotate-45"></div>
                            {/* Legs in lotus position */}
                            <div className="absolute top-12 -left-1 w-3 h-2 bg-blue-100 dark:bg-blue-900 rounded-full"></div>
                            <div className="absolute top-12 -right-1 w-3 h-2 bg-blue-100 dark:bg-blue-900 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardTitle className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                    {currentMonth}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      onClick={() => navigate(`/daily-plan${selectedDate ? '?date=' + selectedDate.toISOString().split('T')[0] : ''}`)} 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2 bg-blue-50 dark:bg-blue-800 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-700"
                    >
                      <BookOpen className="w-4 h-4" />
                      Open Daily Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                      <div key={day + index} className="text-center text-lg font-bold text-blue-800 dark:text-blue-200 p-3">
                        {day}
                      </div>
                    ))}
                  </div>
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
                              w-full h-full flex items-center justify-center text-lg font-semibold rounded-xl cursor-pointer transition-all duration-300 relative
                              ${isToday 
                                ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                                : isSelected
                                  ? 'bg-blue-400 text-white shadow-md border-2 border-blue-700'
                                  : 'bg-white/70 dark:bg-blue-800/70 text-blue-900 dark:text-blue-100 hover:bg-white dark:hover:bg-blue-700 hover:shadow-md hover:scale-105'
                              }
                            `}
                            onClick={() => handleDateClick(day)}
                          >
                            {day}
                            {hasEntries && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
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
                  
                  {/* Legend */}
                  <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full shadow"></div>
                      <span>Has diary entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-400 border-2 border-blue-700 rounded-xl"></div>
                      <span>Selected date</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
