import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
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

const DailyPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date');
  const today = new Date();
  const displayDate = selectedDate ? new Date(selectedDate) : today;
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [waterCount, setWaterCount] = useState(0);
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete daily gratitude journal', completed: false },
    { id: 2, text: 'Take a 10-minute mindful walk', completed: false },
    { id: 3, text: 'Practice breathing exercises', completed: false },
    { id: 4, text: 'Review weekly wellness goals', completed: false },
    { id: 5, text: 'Schedule next therapy session', completed: false }
  ]);

  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = i + 5;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, selectedDate]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user?.id)
        .eq('entry_date', selectedDate || today.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
      
      if (data && data.length > 0) {
        setNotes(data[0].content || '');
      }
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

  const saveNotes = async () => {
    if (!user || !notes.trim()) return;

    try {
      const entryDate = selectedDate || today.toISOString().split('T')[0];
      
      if (entries.length > 0) {
        // Update existing entry
        const { error } = await supabase
          .from('diary_entries')
          .update({ content: notes })
          .eq('id', entries[0].id);
        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            user_id: user.id,
            content: notes,
            entry_date: entryDate,
            mood_rating: selectedMood
          });
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Notes saved successfully",
      });
      fetchEntries();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = selectedDate ? new Date(selectedDate) : today;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    const dateString = newDate.toISOString().split('T')[0];
    navigate(`/daily-plan?date=${dateString}`);
  };

  // Generate mini calendar
  const generateMiniCalendar = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayDate = today.getDate();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    const days = [];
    
    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-5"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === todayDate;
      const isSelected = displayDate.getDate() === day;
      
      days.push(
        <div 
          key={day}
          className={`h-5 flex items-center justify-center text-xs cursor-pointer rounded ${
            isSelected ? 'bg-orange-300 text-stone-800 font-bold' :
            isToday ? 'bg-stone-300 text-stone-800' : 
            'text-stone-600 hover:bg-stone-200'
          }`}
          onClick={() => {
            const newDate = new Date(year, month, day);
            const dateString = newDate.toISOString().split('T')[0];
            navigate(`/daily-plan?date=${dateString}`);
          }}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

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
            
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
                className="bg-stone-200 border-stone-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-stone-800">
                  {displayDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
                className="bg-stone-200 border-stone-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mini Calendar */}
            <div className="bg-stone-200 rounded-xl p-4 min-w-[200px]">
              <div className="text-center mb-2">
                <span className="text-sm font-medium text-stone-700">
                  {displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="text-stone-600 font-medium h-5 flex items-center justify-center">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {generateMiniCalendar()}
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
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {timeSlots.map((time, index) => {
                  const hour = parseInt(time.split(':')[0]);
                  const hasActivity = hour === 8; // Morning meditation
                  
                  return (
                    <div key={time} className="flex items-center space-x-4">
                      <span className="text-stone-600 text-sm w-12">{time}</span>
                      <div className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-colors ${
                        hasActivity ? 'bg-green-200 border-green-400' : 'border-stone-300 hover:border-stone-400'
                      }`}></div>
                      {hasActivity && (
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
                  {todos.map((todo) => (
                    <div key={todo.id} className="flex items-center space-x-3">
                      <div 
                        className={`w-4 h-4 rounded border-2 cursor-pointer transition-colors ${
                          todo.completed 
                            ? 'bg-green-300 border-green-400' 
                            : 'border-stone-400 hover:border-stone-500'
                        }`}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.completed && (
                          <span className="text-green-700 text-xs">✓</span>
                        )}
                      </div>
                      <span className={`text-stone-700 text-sm ${
                        todo.completed ? 'line-through opacity-60' : ''
                      }`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Mood */}
              <div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">My mood</h3>
                <div className="flex space-x-2">
                  {moodEmojis.map((emoji, index) => (
                    <div 
                      key={index} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        selectedMood === index + 1 
                          ? 'bg-orange-200 border-2 border-orange-400' 
                          : 'bg-stone-200 hover:bg-stone-300'
                      }`}
                      onClick={() => setSelectedMood(selectedMood === index + 1 ? null : index + 1)}
                    >
                      <span className="text-lg">{emoji}</span>
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
                  <div 
                    key={i} 
                    className={`w-12 h-16 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      i < waterCount 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'bg-stone-200 border-stone-300 hover:bg-stone-300'
                    }`}
                    onClick={() => setWaterCount(i < waterCount ? i : i + 1)}
                  >
                    <span className="text-xs">{i < waterCount ? '💧' : '💧'}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-stone-600 mt-2">{waterCount}/8 glasses today</p>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-xl font-semibold text-stone-800 mb-4 flex items-center justify-between">
                Notes
                <span className="text-2xl">🍃</span>
              </h3>
              <div className="bg-stone-50 rounded-xl border border-stone-200">
                <Textarea
                  placeholder="Write your thoughts for today..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] border-0 bg-transparent resize-none focus:ring-0"
                />
                <div className="p-3 border-t border-stone-200">
                  <Button 
                    onClick={saveNotes}
                    className="bg-stone-600 hover:bg-stone-700 text-white"
                    size="sm"
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyPlan;