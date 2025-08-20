import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, AlertTriangle, Heart } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MindCare, your AI mental health companion. 🌟 I'm here to listen, support, and help you navigate through any challenges you're facing. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    "I'm feeling anxious about exams",
    "I feel lonely and unmotivated",
    "How are you feeling today?",
    "I can't sleep at night",
    "I feel lazy and unproductive",
    "Help me with stress"
  ];

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase().trim();
    
    // Anxiety-related responses
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || message.includes('nervous')) {
      const anxietyResponses = [
        "I understand that anxiety can feel overwhelming. 💙 Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This can help calm your nervous system.",
        "Anxiety is your body's natural response to stress, and it's okay to feel this way. 🌸 One helpful technique is grounding: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
        "When anxiety strikes, remember that this feeling is temporary. 🌟 Try progressive muscle relaxation: tense and then relax each muscle group, starting from your toes and working up to your head."
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }

    // Depression/sadness responses
    if (message.includes('sad') || message.includes('depressed') || message.includes('down') || message.includes('lonely') || message.includes('empty')) {
      const sadnessResponses = [
        "I hear that you're going through a difficult time, and I want you to know that your feelings are valid. 💝 Sometimes, taking small steps like going for a short walk or listening to music can help lift your mood slightly.",
        "Loneliness can be really painful. 🤗 Remember that you're not alone in feeling this way. Consider reaching out to a friend, family member, or mental health professional. Even small connections can make a difference.",
        "It's brave of you to share how you're feeling. 🌱 When we're feeling low, self-care becomes even more important. Try to do one small thing for yourself today, even if it's just drinking a glass of water or taking a warm shower."
      ];
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)];
    }

    // Sleep-related responses
    if (message.includes('sleep') || message.includes('insomnia') || message.includes("can't sleep") || message.includes('tired')) {
      const sleepResponses = [
        "Sleep troubles can be really frustrating. 😴 Try creating a bedtime routine: dim the lights 1 hour before bed, avoid screens, and try some gentle stretching or reading. Your brain needs time to wind down.",
        "Good sleep hygiene can make a big difference. 🌙 Keep your bedroom cool and dark, avoid caffeine after 2pm, and try the '4-7-8' breathing technique when you lie down to help relax your mind.",
        "If your mind is racing at bedtime, try keeping a journal by your bed. 📝 Write down your worries or tomorrow's tasks to 'park' them outside your head. This can help quiet racing thoughts."
      ];
      return sleepResponses[Math.floor(Math.random() * sleepResponses.length)];
    }

    // Stress-related responses
    if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure') || message.includes('exam')) {
      const stressResponses = [
        "Feeling stressed is a normal response to challenging situations. 🌟 Try breaking down overwhelming tasks into smaller, manageable steps. Focus on what you can control right now.",
        "When stress builds up, your body needs release. 💪 Physical activity, even just 10 minutes of walking, can help reduce stress hormones and clear your mind.",
        "Stress about exams is very common. 📚 Remember to take regular breaks while studying (try the Pomodoro technique: 25 minutes work, 5 minutes break), stay hydrated, and get enough sleep. Your mental health is just as important as academic success."
      ];
      return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }

    // Motivation/productivity responses
    if (message.includes('lazy') || message.includes('unmotivated') || message.includes('productive') || message.includes('energy')) {
      const motivationResponses = [
        "Low motivation is often a sign that you need rest or that you're being too hard on yourself. 🌱 Start with just one small task today. Progress isn't always about being productive - sometimes it's about being kind to yourself.",
        "Motivation often comes after starting, not before. ✨ Try the '2-minute rule': if something takes less than 2 minutes, do it now. This can help build momentum for bigger tasks.",
        "Remember that rest is not laziness - it's necessary for your wellbeing. 🌸 If you're feeling unmotivated, ask yourself: What do I need right now? Sometimes the most productive thing is to take a break."
      ];
      return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
    }

    // General mood/feelings responses
    if (message.includes('how are you') || message.includes('feeling') || message.includes('mood')) {
      const generalResponses = [
        "Thank you for asking! I'm here and ready to support you. 💙 How are you feeling today? I'm here to listen without judgment and help however I can.",
        "I'm doing well and I'm grateful you're here. 🌟 Mental health is a journey, and it's okay to have ups and downs. What's on your mind today?",
        "I'm here and focused on you. 🤗 Your feelings matter, and I want to understand how you're doing. What would be most helpful for you to talk about right now?"
      ];
      return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.length < 10) {
      const greetingResponses = [
        "Hello! 🌟 I'm MindCare, and I'm here to support your mental wellbeing. How are you feeling today? What's on your mind?",
        "Hi there! 💙 I'm glad you're here. Whether you're having a good day or a challenging one, I'm here to listen and support you. What would you like to talk about?",
        "Hey! 🌸 Welcome to a safe space where you can share whatever is on your heart and mind. I'm here to listen and help. How can I support you today?"
      ];
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }

    // Default supportive response
    const defaultResponses = [
      "Thank you for sharing that with me. 💙 I want you to know that whatever you're going through, your feelings are valid and you don't have to face this alone. Can you tell me more about what's been on your mind?",
      "I hear you, and I appreciate you opening up. 🌟 Sometimes just expressing our thoughts and feelings can be the first step toward feeling better. What's been the most challenging part of your day?",
      "It sounds like you have a lot on your mind. 🤗 I'm here to listen and support you through whatever you're experiencing. Would it help to talk about what's been weighing on you lately?",
      "Your wellbeing matters, and I'm glad you're taking the time to check in with yourself. 🌱 Mental health is just as important as physical health. What kind of support would be most helpful for you right now?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    const currentMessage = inputMessage;
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponseText = await getAIResponse(currentMessage);
      
      const botResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'bot' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
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
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-muted">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-muted text-foreground">
                      <p className="text-sm">Typing...</p>
                    </div>
                  </div>
                )}
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
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-primary text-primary-foreground hover-glow"
                    disabled={isLoading}
                  >
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