
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Bell, Plus, BookOpen, Eye } from 'lucide-react';
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
    setSelectedDate(clickedDate);
    const entriesForDate = getDiaryEntriesForDate(clickedDate);
    setSelectedDateEntries(entriesForDate);
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Wellness Calendar
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track your mental health journey with scheduled activities, reminders, and diary entries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-card animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-foreground">{currentMonth}</CardTitle>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  <Button 
                    onClick={() => navigate('/diary')} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Open Diary
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
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
                            w-full h-full flex items-center justify-center text-sm rounded-lg cursor-pointer transition-smooth relative
                            ${isToday 
                              ? 'bg-primary text-primary-foreground font-semibold' 
                              : isSelected
                                ? 'bg-accent text-accent-foreground font-medium border-2 border-primary'
                                : 'hover:bg-accent text-foreground'
                            }
                          `}
                          onClick={() => handleDateClick(day)}
                        >
                          {day}
                          {hasEntries && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs text-primary-foreground font-bold">
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
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Has diary entries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent border border-border rounded"></div>
                    <span>Selected date</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                        onClick={() => navigate('/diary')} 
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
                              onClick={() => navigate('/diary')} 
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
                        onClick={() => navigate('/diary')} 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        View All Entries
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
