
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
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

interface ScheduleEntry {
  id: string;
  user_id: string;
  entry_date: string;
  time_slot: string;
  activity_title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const Calendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // Start with January 2025

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  useEffect(() => {
    if (user) {
      fetchDiaryEntries();
      fetchScheduleEntries();
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

  const fetchScheduleEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('entry_date', new Date().toISOString().split('T')[0])
        .order('entry_date', { ascending: true })
        .order('time_slot', { ascending: true })
        .limit(10);

      if (error) throw error;
      setScheduleEntries(data || []);
    } catch (error) {
      console.error('Error fetching schedule entries:', error);
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const upcoming = [];

    // Add upcoming diary entries (next 7 days)
    const upcomingDiary = diaryEntries
      .filter(entry => {
        const entryDate = new Date(entry.entry_date);
        return entryDate >= today;
      })
      .slice(0, 5)
      .map(entry => ({
        ...entry,
        type: 'diary' as const,
        time: null
      }));

    // Add upcoming schedule entries
    const upcomingSchedule = scheduleEntries
      .map(entry => ({
        ...entry,
        type: 'schedule' as const,
        time: entry.time_slot
      }));

    upcoming.push(...upcomingDiary, ...upcomingSchedule);

    // Sort by date and time
    return upcoming.sort((a, b) => {
      const dateA = new Date(a.entry_date);
      const dateB = new Date(b.entry_date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      // Same date, sort by time if available
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      
      return a.type === 'schedule' ? -1 : 1;
    });
  };

  const getDiaryEntriesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return diaryEntries.filter(entry => entry.entry_date === dateString);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = clickedDate.toISOString().split('T')[0];
    navigate(`/daily-plan?date=${dateString}`);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="h-20 bg-gray-50/50"></div>
      );
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const entriesForDay = getDiaryEntriesForDate(dayDate);
      const taskCount = entriesForDay.length;
      const isToday = dayDate.toDateString() === today.toDateString();
      const isPastMonth = year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth());
      const isPastDay = dayDate < today && !isToday;
      
      calendarDays.push(
        <Card 
          key={day} 
          className={`h-20 cursor-pointer transition-all duration-200 hover:shadow-md border ${
            isToday 
              ? 'bg-blue-50 border-blue-200 shadow-md' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => handleDateClick(day)}
        >
          <CardContent className="p-2 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className={`text-lg font-semibold ${
                isToday 
                  ? 'text-blue-600' 
                  : isPastDay 
                    ? 'text-gray-400' 
                    : 'text-gray-700'
              }`}>
                {day.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-xs">
              {taskCount > 0 ? (
                <span className={`${
                  taskCount > 0 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-400'
                }`}>
                  {taskCount} {taskCount === 1 ? 'entry' : 'entries'}
                </span>
              ) : (
                <span className="text-gray-400">0 entries</span>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return calendarDays;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-800 min-w-[200px]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-600">
            Track your wellness journey throughout 2025
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays()}
              </div>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Events
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getUpcomingEvents().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No upcoming events</p>
                    <p className="text-xs mt-1">Start by adding entries to your daily plan</p>
                  </div>
                ) : (
                  getUpcomingEvents().map((event, index) => (
                    <div 
                      key={`${event.type}-${event.id}-${index}`}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        const dateString = new Date(event.entry_date).toISOString().split('T')[0];
                        navigate(`/daily-plan?date=${dateString}`);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            event.type === 'diary' ? 'bg-purple-400' : 'bg-green-400'
                          }`}></div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {event.type === 'diary' ? 'Diary' : 'Schedule'}
                          </span>
                        </div>
                        {event.time && (
                          <span className="text-xs text-gray-400">
                            {event.time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                        {event.type === 'diary' 
                          ? (event.title || 'Diary Entry')
                          : event.activity_title
                        }
                      </h3>
                      
                      <p className="text-xs text-gray-600 mb-2">
                        {new Date(event.entry_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      
                      {((event.type === 'diary' && event.content) || 
                        (event.type === 'schedule' && event.description)) && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {event.type === 'diary' ? event.content : event.description}
                        </p>
                      )}
                      
                      {event.type === 'diary' && event.mood_rating && (
                        <div className="mt-2 flex items-center">
                          <span className="text-xs text-gray-400 mr-1">Mood:</span>
                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <span 
                                key={star}
                                className={`text-xs ${
                                  star <= event.mood_rating! ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {getUpcomingEvents().length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/daily-plan')}
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    View Daily Plan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => setCurrentDate(new Date(2025, 0, 1))}
            variant="outline"
            className="bg-white border-gray-300 hover:bg-gray-50"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            January 2025
          </Button>
          <Button
            onClick={() => setCurrentDate(new Date())}
            variant="outline"
            className="bg-white border-gray-300 hover:bg-gray-50"
          >
            Today
          </Button>
          <Button
            onClick={() => navigate('/daily-plan')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Open Daily Plan
          </Button>
        </div>

        {/* Calendar Legend */}
        <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded"></div>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
              <span className="text-gray-600">Available Days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-medium">Blue text</span>
              <span className="text-gray-600">- Days with diary entries</span>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calendar;
