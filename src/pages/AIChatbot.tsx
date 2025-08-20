import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, AlertTriangle, Heart, Mic, MicOff, Volume2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import VoiceInterface from '@/components/VoiceInterface';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: string;
  audioData?: string;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm MindCare, your AI mental health companion. 🌟 I'm here to listen, support, and help you navigate through any challenges you're facing. How are you feeling today? You can type your thoughts or use the voice chat option.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "How can I manage stress?",
    "I feel anxious all the time",
    "How can I improve my mood?",
    "I have trouble sleeping",
    "How can I boost my self-esteem?",
    "I feel lonely",
    "How can I stop overthinking?",
    "What are signs of depression?",
    "Can exercise help my mental health?"
  ];

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase().trim();
    
    // Greeting & Check-in responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello, I am here to listen and support you. How are you feeling today? You can say anything you feel, and it is safe here.";
    }

    // Sadness responses
    if (message.includes('sad') || message.includes('i am sad') || message.includes('feeling sad')) {
      return "I understand that you feel sad. It is okay to feel this way. Take a deep breath… in… and out. Would you like to try a short exercise to feel a little better?";
    }

    // Anxiety responses
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('i am anxious') || message.includes('nervous')) {
      return "Feeling anxious can be difficult. Let's take a moment together to breathe slowly. Breathe in… and breathe out… You are safe here.";
    }

    // Sleep issues
    if (message.includes('cannot sleep') || message.includes("can't sleep") || message.includes('trouble sleeping') || message.includes('insomnia')) {
      return "Not being able to sleep is stressful. Let's try a simple relaxation exercise. Close your eyes and think of a calm place. Take slow, deep breaths. You are safe, and it is okay to rest.";
    }

    // Overthinking about future
    if (message.includes('worry about tomorrow') || message.includes('worrying about what might happen') || message.includes('overthinking about future')) {
      return "It's natural to think ahead, but dwelling on 'what ifs' can increase anxiety. 🌅 Let's focus on what you can do today. Can we make a short plan together? What's one small thing you can accomplish right now?";
    }

    // Loneliness in crowds
    if (message.includes('lonely even when') || message.includes('lonely in a crowd') || message.includes('feel lonely around people')) {
      return "That paradoxical loneliness can feel really isolating. 💙 You're not alone in feeling this way. Let's explore one small way to connect meaningfully today - maybe start with one genuine conversation or reach out to someone you trust.";
    }

    // Exercise motivation
    if (message.includes("don't feel like exercising") || message.includes('unmotivated for exercise') || message.includes("don't want to exercise")) {
      return "That's completely normal! 🚶‍♀️ Remember, even a 5-minute walk counts as movement. Shall we start with a tiny step together? Sometimes just putting on workout clothes is enough to build momentum.";
    }

    // Self-criticism and failure
    if (message.includes('always feel like failing') || message.includes('feel like a failure') || message.includes('self-criticism')) {
      return "Self-criticism can be so harsh. 🌱 It's okay to make mistakes - that's how we learn and grow. Let's try this: write down 3 things you did well today, no matter how small. Your worth isn't defined by your mistakes.";
    }

    // Panic attacks
    if (message.includes('panic attack') || message.includes('panic')) {
      return "During a panic attack, focus on slow breathing - inhale for 4, hold for 4, exhale for 6. 🌬️ Try grounding exercises: name 5 things you see, 4 you can touch, 3 you can hear. Remember, it will pass. If panic attacks are frequent, please consider professional guidance.";
    }

    // Racing thoughts/overthinking
    if (message.includes('racing thoughts') || message.includes('overthinking') || message.includes('can\'t stop thinking')) {
      return "Racing thoughts can be exhausting. 🌊 Try writing them down to get them out of your head, practice mindfulness meditation, or set aside 10 minutes of 'worry time' each day. Focus on your breathing when thoughts spiral - it anchors you to the present moment.";
    }

    // Stress management
    if (message.includes('manage stress') || message.includes('stress management') || message.includes('how to handle stress')) {
      return "Great stress management techniques include deep breathing exercises, meditation, journaling your thoughts, taking short breaks throughout the day, regular exercise, and maintaining a healthy routine. 🌿 Pick one or two that resonate with you and practice them consistently.";
    }

    // Depression-related
    if (message.includes('depressed') || message.includes('depression') || message.includes('down') || message.includes('empty')) {
      return "I hear that you're going through a difficult time. Depression can make everything feel overwhelming. 💙 Remember, it is okay to feel your emotions. Talking about your feelings can help. You are not alone, and support is always available.";
    }

    // Self-esteem and confidence
    if (message.includes('self-esteem') || message.includes('confidence') || message.includes('self-worth') || message.includes('boost')) {
      return "Building self-esteem takes time and practice. 🌟 Celebrate small achievements, practice self-compassion, set achievable goals, and avoid comparing yourself to others. Remember, you are worthy just as you are.";
    }

    // Exercise and mental health
    if (message.includes('exercise') || message.includes('workout') || message.includes('physical activity')) {
      return "Exercise is fantastic for mental health! 💪 Regular physical activity releases endorphins (feel-good hormones), reduces stress, improves mood, and boosts energy and self-confidence. Even a 10-minute walk can make a difference.";
    }

    // Mindfulness practices
    if (message.includes('mindfulness') || message.includes('meditation') || message.includes('present moment')) {
      return "Mindfulness is a powerful tool for mental wellbeing. 🧘‍♀️ Try focusing on your breathing, paying attention to the present moment, observing thoughts without judgment, or using guided meditation apps. Even 5 minutes daily can help reduce stress and improve focus.";
    }

    // Crisis situations
    if (message.includes('hurt myself') || message.includes('kill myself') || message.includes('end it all') || message.includes('suicide')) {
      return "If you ever feel like you might harm yourself or others, please stop and reach out immediately to a trained professional or your local crisis hotline. You are not alone, and help is available right now. Crisis Hotline: 988 (Suicide & Crisis Lifeline)";
    }

    // General supportive response
    return "Remember, it is okay to feel your emotions. Talking about your feelings can help. You are not alone, and support is always available. If you want, I can suggest simple steps to feel better, like breathing exercises, journaling, or speaking to a counselor. Thank you for sharing your feelings with me. Remember, small steps can make a big difference. Take care of yourself today. You are important and you matter.";
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(textToSend);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. Remember, if this is an emergency, please contact emergency services or a crisis hotline immediately.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Mental Health Support
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect with our AI-powered mental health companion for personalized support, 
              coping strategies, and emotional guidance available 24/7.
            </p>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Text Chat
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Voice Chat
                </TabsTrigger>
              </TabsList>

              {/* Text Chat */}
              <TabsContent value="text" className="space-y-6">
                <Card className="h-[500px] flex flex-col">
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start gap-3 ${
                            message.sender === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-full ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Heart className="w-4 h-4" />
                            )}
                          </div>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                  
                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share your thoughts... I'm here to listen 💙"
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button 
                        onClick={() => sendMessage()}
                        disabled={!inputMessage.trim() || isLoading}
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Quick Questions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">Quick Questions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => sendMessage(question)}
                        disabled={isLoading}
                        className="text-left justify-start h-auto p-3 whitespace-normal"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Voice Chat */}
              <TabsContent value="voice" className="space-y-6">
                <VoiceInterface />
              </TabsContent>
            </Tabs>
          </div>

          {/* Support Information */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">What You Can Expect</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Compassionate listening and emotional validation</li>
                  <li>• Guided breathing and relaxation exercises</li>
                  <li>• Personalized coping strategies</li>
                  <li>• Crisis intervention resources when needed</li>
                  <li>• Safe space to express your feelings</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Important Notice
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  This AI companion provides supportive listening and guidance but is not a replacement 
                  for professional mental health care. If you're experiencing a mental health crisis 
                  or having thoughts of self-harm, please contact emergency services or a crisis hotline immediately.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Crisis Hotline: 988 (Suicide & Crisis Lifeline)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIChatbot;