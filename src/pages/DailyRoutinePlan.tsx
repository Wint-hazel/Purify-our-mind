import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const DailyRoutinePlan = () => {
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const routines = [
    {
      id: 'morning-energy',
      title: 'Morning Energy Boost',
      duration: '20 minutes',
      description: 'Start your day with positive energy and mental clarity',
      steps: [
        { id: 1, title: 'Deep Breathing Exercise', duration: '3 min', description: 'Focus on slow, deep breaths to oxygenate your body' },
        { id: 2, title: 'Gentle Stretching', duration: '5 min', description: 'Wake up your muscles with light movement' },
        { id: 3, title: 'Gratitude Practice', duration: '4 min', description: 'Write down 3 things you\'re grateful for today' },
        { id: 4, title: 'Intention Setting', duration: '3 min', description: 'Set a positive intention for your day' },
        { id: 5, title: 'Mindful Hydration', duration: '2 min', description: 'Drink water mindfully, focusing on the sensation' },
        { id: 6, title: 'Affirmations', duration: '3 min', description: 'Repeat positive affirmations to yourself' }
      ]
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief Routine',
      duration: '15 minutes',
      description: 'Quick routine to reduce stress and anxiety during busy times',
      steps: [
        { id: 1, title: '4-7-8 Breathing', duration: '4 min', description: 'Inhale for 4, hold for 7, exhale for 8 counts' },
        { id: 2, title: 'Progressive Muscle Relaxation', duration: '6 min', description: 'Tense and release each muscle group' },
        { id: 3, title: 'Mindful Observation', duration: '3 min', description: 'Notice 5 things you can see, 4 you can hear, etc.' },
        { id: 4, title: 'Self-Compassion Moment', duration: '2 min', description: 'Speak to yourself with kindness and understanding' }
      ]
    },
    {
      id: 'evening-calm',
      title: 'Evening Wind-Down',
      duration: '25 minutes',
      description: 'Prepare your mind and body for restful sleep',
      steps: [
        { id: 1, title: 'Digital Detox', duration: '5 min', description: 'Put away all electronic devices' },
        { id: 2, title: 'Day Reflection', duration: '6 min', description: 'Journal about your day\'s experiences' },
        { id: 3, title: 'Calming Tea Ritual', duration: '4 min', description: 'Prepare and mindfully drink herbal tea' },
        { id: 4, title: 'Body Scan Meditation', duration: '7 min', description: 'Systematically relax each part of your body' },
        { id: 5, title: 'Tomorrow\'s Preparation', duration: '3 min', description: 'Set out clothes and plan for tomorrow gently' }
      ]
    }
  ];

  const toggleStepCompletion = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const currentRoutine = routines.find(r => r.id === activeRoutine);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Daily Routine Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow guided step-by-step routines designed to improve your mental well-being throughout the day
          </p>
        </div>

        {!activeRoutine ? (
          /* Routine Selection */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {routines.map((routine) => (
              <Card key={routine.id} className="bg-gradient-card shadow-card hover-glow transition-gentle animate-fade-in">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold text-foreground">{routine.title}</CardTitle>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{routine.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 text-center">{routine.description}</p>
                  <div className="space-y-2 mb-6">
                    {routine.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span>{step.title}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => setActiveRoutine(routine.id)}
                    className="w-full bg-primary text-primary-foreground hover-glow"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Routine
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Active Routine */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-card shadow-card animate-fade-in">
              <CardHeader className="text-center border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setActiveRoutine(null);
                      setCompletedSteps([]);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Back to Routines
                  </Button>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{currentRoutine?.duration}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">{currentRoutine?.title}</CardTitle>
                <p className="text-muted-foreground">{currentRoutine?.description}</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {currentRoutine?.steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`p-6 rounded-lg border transition-smooth ${
                        completedSteps.includes(step.id) 
                          ? 'bg-success/10 border-success/20' 
                          : 'bg-background border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => toggleStepCompletion(step.id)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-smooth ${
                            completedSteps.includes(step.id)
                              ? 'bg-success border-success text-success-foreground'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {completedSteps.includes(step.id) ? (
                            <CheckCircle className="w-5 h-5 text-success-foreground" />
                          ) : (
                            <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-semibold ${
                              completedSteps.includes(step.id) ? 'text-success' : 'text-foreground'
                            }`}>
                              {step.title}
                            </h3>
                            <span className="text-sm text-muted-foreground">{step.duration}</span>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="mt-8 p-6 bg-gradient-subtle rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      {completedSteps.length} of {currentRoutine?.steps.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary rounded-full h-3 transition-smooth" 
                      style={{ 
                        width: `${(completedSteps.length / (currentRoutine?.steps.length || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  {completedSteps.length === currentRoutine?.steps.length && (
                    <div className="text-center mt-6">
                      <h4 className="text-lg font-semibold text-success mb-2">Routine Complete!</h4>
                      <p className="text-muted-foreground mb-4">
                        Great job finishing your {currentRoutine.title.toLowerCase()}. How do you feel?
                      </p>
                      <Button 
                        onClick={() => {
                          setActiveRoutine(null);
                          setCompletedSteps([]);
                        }}
                        className="bg-success text-success-foreground hover-glow"
                      >
                        Choose Another Routine
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default DailyRoutinePlan;