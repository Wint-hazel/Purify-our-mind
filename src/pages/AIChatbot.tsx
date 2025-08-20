import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, AlertTriangle, Heart } from 'lucide-react';
import { useState } from 'react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to provide mental health support and guidance. How are you feeling today on a scale of 1-10? I can suggest activities to improve your mood based on your answer.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = [
    "I'm feeling anxious about exams",
    "I feel lonely and unmotivated",
    "How are you feeling today?",
    "I can't sleep at night",
    "I feel lazy and unproductive",
    "Help me with stress"
  ];

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Overthinking responses
    if (message.includes('thinking about') || message.includes('mistakes') || message.includes('overthinking') || message.includes("can't stop thinking")) {
      return "It's normal to replay events in your mind. Let's try focusing on the present moment. Can we do a 3-step grounding exercise together?";
    }
    
    // Feeling Overwhelmed responses
    if (message.includes('too many tasks') || message.includes('crushed') || message.includes('overwhelmed')) {
      return "Let's break them down into small steps. Which task can you start with right now?";
    }
    
    // Lack of Motivation responses
    if (message.includes("don't feel like") || message.includes('unmotivated') || message.includes('no motivation')) {
      return "Even resting counts as productivity. How about starting with one tiny task to ease into your day?";
    }
    
    // Low Self-Esteem responses
    if (message.includes('not good enough') || message.includes('low self-esteem') || message.includes('worthless')) {
      return "You are unique and valuable. Let's list 3 things you like about yourself today.";
    }
    
    // Feeling Lonely responses
    if (message.includes('lonely') || message.includes('so alone') || message.includes('feel alone')) {
      return "You're not alone right now—I'm here to talk. Want to share what's on your mind?";
    }
    
    // Anger Management responses
    if (message.includes('angry') || message.includes('mad at') || message.includes('furious')) {
      return "It's okay to feel angry. Let's take a moment to breathe deeply and calm down before responding.";
    }
    
    // Grief & Loss responses
    if (message.includes('miss') || message.includes('loved one') || message.includes('grief') || message.includes('loss')) {
      return "It's natural to feel this way. Would you like to try a gentle reflection exercise to honor their memory?";
    }
    
    // Procrastination responses
    if (message.includes('putting off') || message.includes('procrastinating') || message.includes('keep delaying')) {
      return "Starting small helps. Can we set a 5-minute timer to begin one task?";
    }
    
    // Fear & Anxiety responses
    if (message.includes('scared') || message.includes('anxious') || message.includes('anxiety') || message.includes('fear')) {
      return "Fear is part of change. Let's focus on what you can control today.";
    }
    
    // Feeling Empty / Numb responses
    if (message.includes("don't feel anything") || message.includes('empty') || message.includes('numb')) {
      return "That can feel unsettling. Let's try a simple sensory exercise: notice what you can see, hear, and touch right now.";
    }
    
    // Relationship Issues responses
    if (message.includes('argued') || message.includes('fight') || message.includes('relationship') || message.includes('partner')) {
      return "Conflicts happen. Can we explore how you feel and think about a calm approach to resolve it?";
    }
    
    // Body Image / Self-Acceptance responses
    if (message.includes('hate how i look') || message.includes('body image') || message.includes('appearance')) {
      return "Your worth isn't defined by appearance. Let's list 3 things your body does for you that you appreciate.";
    }
    
    // Exam / Work Pressure responses
    if (message.includes('deadlines') || message.includes('work pressure') || message.includes('exam stress')) {
      return "Breaking your work into small chunks can reduce stress. Want me to help you plan a schedule?";
    }
    
    // Feeling Stuck / Life Purpose responses
    if (message.includes("don't know what i want") || message.includes('stuck') || message.includes('life purpose')) {
      return "Exploring interests step by step helps. Let's think about 1 activity that excites you.";
    }
    
    // Sleep Problems responses
    if (message.includes('sleep') || message.includes("can't sleep") || message.includes('insomnia')) {
      return "Let's do a 5-minute relaxation technique or a guided breathing exercise to help you drift off.";
    }
    
    // Impulsive Emotions responses
    if (message.includes('mood swings') || message.includes("can't control") || message.includes('impulsive')) {
      return "It's okay; emotions are temporary. Let's try labeling your feelings and see if we can calm them together.";
    }
    
    // Overworking / Burnout responses
    if (message.includes('exhausted') || message.includes('burnout') || message.includes('overworking')) {
      return "Your health matters. Taking a short break or a walk can recharge your energy. Shall we try it?";
    }
    
    // Social Anxiety responses
    if (message.includes('nervous talking') || message.includes('social anxiety') || message.includes('talking to people')) {
      return "Many feel this way. Let's practice a small social interaction step you can try today.";
    }
    
    // Feeling Guilty responses
    if (message.includes('guilty') || message.includes('guilt') || message.includes('feel bad about')) {
      return "Acknowledging it is a step forward. Can we think of a constructive way to make amends or forgive yourself?";
    }
    
    // Positive Mindset & Gratitude responses
    if (message.includes('negative about everything') || message.includes('pessimistic') || message.includes('bad thoughts')) {
      return "Let's try a gratitude exercise: name 3 small things today that made you feel good, even slightly.";
    }
    
    // Stress responses (general)
    if (message.includes('stress') || message.includes('stressed')) {
      return "I understand you're feeling stressed. Stress is very common, and there are ways to manage it. Would you like to try a quick breathing exercise, or would you prefer some practical stress-management tips?";
    }
    
    // Daily Check-in responses
    if (message.includes('how are you feeling') || message.includes('feeling today') || message.includes('check in')) {
      return "Hi! How are you feeling today on a scale of 1-10? I can suggest an activity to improve your mood based on your answer.";
    }
    
    // Default supportive response
    return "Thank you for sharing that with me. I understand this can be challenging. Let me help you work through this step by step. Would you like to try a brief breathing exercise, or would you prefer to talk more about what you're experiencing?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');

    // Simulate AI response with context-aware replies
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getAIResponse(currentMessage),
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Mental Health Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Get immediate, compassionate support from our AI trained in evidence-based mental health practices
          </p>
        </div>

        {/* Crisis Notice */}
        <Card className="mb-6 bg-destructive/10 border-destructive/20 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">Crisis Support</h3>
                <p className="text-sm text-muted-foreground">
                  If you're experiencing a mental health crisis or having thoughts of self-harm, please contact emergency services (911) 
                  or the National Suicide Prevention Lifeline (988) immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card shadow-card animate-fade-in h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">MindPure AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">Always here to listen and support</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="bg-primary text-primary-foreground hover-glow">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="bg-gradient-card shadow-card animate-fade-in">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Quick Start</h3>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-smooth"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-gradient-subtle shadow-card animate-fade-in">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4">What I Can Help With</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Stress & Anxiety management</li>
                  <li>• Loneliness & Sadness support</li>
                  <li>• Daily mood check-ins</li>
                  <li>• Sleep & Relaxation guidance</li>
                  <li>• Motivation & Goal setting</li>
                  <li>• Breathing exercises</li>
                  <li>• Coping strategies</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy Note */}
            <Card className="bg-card shadow-card animate-fade-in">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Your Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Your conversations are confidential and encrypted. We never store personal information 
                  or share your discussions with third parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIChatbot;