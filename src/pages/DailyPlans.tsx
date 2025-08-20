import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sun, Moon, Coffee, Heart } from 'lucide-react';

const DailyPlans = () => {
  const plans = [
    {
      id: 'morning',
      title: 'Morning Mindfulness',
      icon: Sun,
      time: '15 minutes',
      activities: [
        'Gentle stretching (3 minutes)',
        'Breathing meditation (5 minutes)',
        'Gratitude journaling (3 minutes)',
        'Intention setting (4 minutes)'
      ]
    },
    {
      id: 'midday',
      title: 'Midday Reset',
      icon: Coffee,
      time: '10 minutes',
      activities: [
        'Mindful walk outside (5 minutes)',
        'Progressive muscle relaxation (3 minutes)',
        'Positive affirmations (2 minutes)'
      ]
    },
    {
      id: 'evening',
      title: 'Evening Reflection',
      icon: Moon,
      time: '20 minutes',
      activities: [
        'Day review journaling (8 minutes)',
        'Calming meditation (7 minutes)',
        'Tomorrow preparation (3 minutes)',
        'Sleep hygiene routine (2 minutes)'
      ]
    }
  ];

  const weeklyGoals = [
    'Complete daily mindfulness practice',
    'Journal for at least 5 days',
    'Practice gratitude daily',
    'Maintain consistent sleep schedule',
    'Connect with nature 3 times',
    'Practice self-compassion',
    'Engage in one creative activity'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Daily Wellness Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Structured daily routines designed to support your mental health and create positive habits
          </p>
        </div>

        {/* Daily Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={plan.id} className="bg-gradient-card shadow-card hover-glow transition-gentle animate-fade-in">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-primary mx-auto" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{plan.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.time}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{activity}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-6 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover-glow transition-smooth">
                  Start {plan.title}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Goals Section */}
        <div className="bg-gradient-subtle rounded-2xl p-8 mb-16 animate-fade-in">
          <div className="flex items-center mb-6">
            <Heart className="w-6 h-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground">Weekly Wellness Goals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyGoals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-card rounded-lg">
                <input 
                  type="checkbox" 
                  id={`goal-${index}`}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                />
                <label htmlFor={`goal-${index}`} className="text-sm text-foreground cursor-pointer">
                  {goal}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Tracking */}
        <Card className="bg-gradient-card shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground">
              Your Progress This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">73%</div>
              <p className="text-muted-foreground mb-6">Completion Rate</p>
              <div className="w-full bg-muted rounded-full h-3 mb-8">
                <div className="bg-primary rounded-full h-3" style={{ width: '73%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Great job! You're building consistent healthy habits. Keep going!
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyPlans;