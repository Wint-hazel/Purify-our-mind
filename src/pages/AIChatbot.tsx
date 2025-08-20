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
    
    // Stress & Anxiety responses
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('exam')) {
      return "It's natural to feel nervous before exams. Let's try a 2-minute breathing exercise together. Inhale slowly… now exhale. Would you like more tips to calm your mind?";
    }
    
    // Loneliness & Sadness responses
    if (message.includes('lonely') || message.includes('unmotivated') || message.includes('sad')) {
      return "I'm here for you. Sometimes talking about how you feel can help. Would you like me to suggest a simple activity to lift your mood today?";
    }
    
    // Daily Check-in responses
    if (message.includes('how are you feeling') || message.includes('feeling today') || message.includes('check in')) {
      return "Hi! How are you feeling today on a scale of 1-10? I can suggest an activity to improve your mood based on your answer.";
    }
    
    // Sleep & Relaxation responses
    if (message.includes('sleep') || message.includes("can't sleep") || message.includes('insomnia')) {
      return "A calming bedtime routine can help. Try reading a book, listening to soft music, or practicing 5 minutes of deep breathing before bed. Want me to guide you through it?";
    }
    
    // Motivation & Goals responses
    if (message.includes('lazy') || message.includes('unproductive') || message.includes('motivation')) {
      return "That's okay! Even small steps count. Let's break your tasks into tiny, achievable goals. What's one thing you can do right now?";
    }
    
    // Stress responses
    if (message.includes('stress') || message.includes('overwhelmed')) {
      return "I understand you're feeling stressed. Stress is very common, and there are ways to manage it. Would you like to try a quick breathing exercise, or would you prefer some practical stress-management tips?";
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