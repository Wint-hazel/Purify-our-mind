
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Planner Layout */}
        <div className="bg-gradient-to-br from-stone-100 via-stone-50 to-orange-50 rounded-3xl p-8 shadow-xl border border-stone-200">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8">
            {/* Daily Planner Title */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-stone-800" style={{ fontFamily: 'cursive' }}>
                  Daily Planner
                </h1>
                <p className="text-stone-600 text-sm">@wellness.app</p>
              </div>
            </div>
            
            {/* Mini Calendar */}
            <div className="bg-stone-200 rounded-xl p-4 min-w-[200px]">
              <div className="text-center mb-2">
                <span className="text-sm font-medium text-stone-700">Date:</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="text-stone-600 font-medium">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6;
                  const isToday = day === today.getDate();
                  return (
                    <div 
                      key={i} 
                      className={`h-6 flex items-center justify-center rounded ${
                        day > 0 && day <= daysInMonth 
                          ? isToday 
                            ? 'bg-orange-300 text-stone-800 font-bold' 
                            : 'text-stone-700 hover:bg-stone-300 cursor-pointer'
                          : ''
                      }`}
                      onClick={() => day > 0 && day <= daysInMonth && handleDateClick(day)}
                    >
                      {day > 0 && day <= daysInMonth ? day : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Schedule */}
            <div>
              <h2 className="text-2xl font-semibold text-stone-800 mb-6 flex items-center">
                Schedule
                <div className="ml-3 w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">🍵</span>
                </div>
              </h2>
              
              <div className="space-y-3">
                {Array.from({ length: 19 }, (_, i) => {
                  const hour = i + 5;
                  const time = `${hour.toString().padStart(2, '0')}:00`;
                  const hasActivity = appointments.some(apt => apt.time.includes(hour.toString()));
                  
                  return (
                    <div key={hour} className="flex items-center space-x-4">
                      <span className="text-stone-600 text-sm w-12">{time}</span>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        hasActivity ? 'bg-green-200 border-green-400' : 'border-stone-300'
                      }`}></div>
                      {hasActivity && hour === 8 && (
                        <span className="text-sm text-stone-700">Morning Meditation</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - To Do List & Other Sections */}
            <div className="space-y-6">
              {/* To Do List */}
              <div>
                <h2 className="text-2xl font-semibold text-stone-800 mb-4 flex items-center">
                  To Do List 
                  <span className="ml-2 text-2xl">🥕</span>
                </h2>
                <div className="space-y-2">
                  {upcomingTasks.slice(0, 5).map((task, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded border-2 border-stone-400"></div>
                      <span className="text-stone-700 text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Mood */}
              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">My mood</h3>
                <div className="flex space-x-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center cursor-pointer hover:bg-stone-300">
                      <span className="text-lg">😊</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Goals */}
              <div className="bg-stone-200 rounded-xl p-4">
                <h3 className="text-xl font-semibold text-stone-800 mb-2">My goals</h3>
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">😸☕</div>
                    <p className="text-sm text-stone-600">Stay positive & hydrated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Water Tracker */}
            <div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">Water</h3>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="w-12 h-16 bg-stone-200 rounded-lg border-2 border-stone-300 flex items-center justify-center">
                    <span className="text-xs">💧</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4 flex items-center justify-between">
                Notes
                <span className="text-2xl">🍃</span>
              </h3>
              <div className="bg-stone-50 rounded-xl p-6 min-h-[120px] border border-stone-200">
                <p className="text-stone-600 text-sm italic">Click to add your thoughts for today...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calendar;
