import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, Bell, Plus } from 'lucide-react';

const Calendar = () => {
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
            Track your mental health journey with scheduled activities, reminders, and progress milestones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-card animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-foreground">{currentMonth}</CardTitle>
                <CalendarIcon className="w-6 h-6 text-primary" />
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
                  {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day && (
                        <div className={`
                          w-full h-full flex items-center justify-center text-sm rounded-lg cursor-pointer transition-smooth
                          ${day === today.getDate() 
                            ? 'bg-primary text-primary-foreground font-semibold' 
                            : 'hover:bg-accent text-foreground'
                          }
                        `}>
                          {day}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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

            {/* Upcoming Tasks */}
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
                    <div className="text-2xl font-bold text-primary-light">3</div>
                    <div className="text-sm text-muted-foreground">Wellness Goals Met</div>
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