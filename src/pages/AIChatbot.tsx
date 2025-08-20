import React, { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI mental health companion. I'm here to listen, provide support, and help you work through your feelings. How are you doing today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mentalHealthResponses = {
    greeting: [
      "Hello! I'm here to listen and support you. How are you feeling today?",
      "Hi there! It's good to connect with you. What's on your mind?",
      "Welcome! I'm here to provide a safe space for you to share. How can I help?"
    ],
    anxiety: [
      "I understand you're feeling anxious. Let's take this one step at a time. Try taking a slow, deep breath with me - in through your nose, and out through your mouth.",
      "Anxiety can feel overwhelming, but you're not alone. Let's ground ourselves - can you name 5 things you can see around you right now?",
      "When anxiety hits, remember that it's temporary. Your feelings are valid, and we can work through this together."
    ],
    sadness: [
      "I hear that you're feeling sad, and that's completely okay. Sadness is a natural emotion, and it's important to acknowledge it.",
      "It's brave of you to share how you're feeling. Would you like to talk about what's contributing to these feelings?",
      "Sadness can feel heavy, but please know that you don't have to carry it alone. I'm here to listen."
    ],
    stress: [
      "Stress can be really challenging. Let's think about some ways to manage it. Have you tried any breathing exercises or mindfulness techniques?",
      "When we're stressed, our bodies and minds need extra care. What usually helps you feel more relaxed?",
      "Stress is your body's way of responding to challenges. Let's explore some healthy coping strategies together."
    ],
    sleep: [
      "Sleep troubles can affect everything. Let's create a calming bedtime routine. Try avoiding screens an hour before bed and doing some gentle stretching.",
      "Good sleep is so important for mental health. Have you noticed any patterns in your sleep difficulties?",
      "Creating a peaceful sleep environment can really help. Consider dimming lights, keeping your room cool, and practicing relaxation techniques."
    ],
    loneliness: [
      "Feeling lonely is more common than you might think, and it's nothing to be ashamed of. You're reaching out, which shows real strength.",
      "Loneliness can feel isolating, but remember that connection is possible. Even small interactions can make a difference.",
      "You're not alone, even when it feels that way. Let's think about ways to build meaningful connections."
    ],
    anger: [
      "Feeling angry is normal. Let's find a safe way to express it.",
      "Pause and take a deep breath before reacting.",
      "Try writing down your feelings to release tension.",
      "Express anger safely, like talking calmly or exercising.",
      "Remember, controlling anger helps you feel better."
    ],
    general: [
      "Thank you for sharing with me. Your feelings are valid, and it's okay to not be okay sometimes.",
      "I'm here to listen without judgment. Would you like to explore these feelings a bit more?",
      "It takes courage to reach out. You're taking an important step by talking about how you're feeling."
    ]
  };

  const quickSuggestions = [
    "I'm feeling anxious",
    "I can't sleep",
    "I feel overwhelmed",
    "I'm feeling sad",
    "I feel lonely",
    "How to manage stress?",
    "I need motivation",
    "Breathing exercises"
  ];

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return mentalHealthResponses.greeting[Math.floor(Math.random() * mentalHealthResponses.greeting.length)];
    }
    
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || message.includes('nervous')) {
      return mentalHealthResponses.anxiety[Math.floor(Math.random() * mentalHealthResponses.anxiety.length)];
    }
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down') || message.includes('upset')) {
      return mentalHealthResponses.sadness[Math.floor(Math.random() * mentalHealthResponses.sadness.length)];
    }
    
    if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
      return mentalHealthResponses.stress[Math.floor(Math.random() * mentalHealthResponses.stress.length)];
    }
    
    if (message.includes('sleep') || message.includes('tired') || message.includes('insomnia')) {
      return mentalHealthResponses.sleep[Math.floor(Math.random() * mentalHealthResponses.sleep.length)];
    }
    
    if (message.includes('lonely') || message.includes('alone') || message.includes('isolated')) {
      return mentalHealthResponses.loneliness[Math.floor(Math.random() * mentalHealthResponses.loneliness.length)];
    }
    
    if (message.includes('angry') || message.includes('mad') || message.includes('frustrated')) {
      return mentalHealthResponses.anger[Math.floor(Math.random() * mentalHealthResponses.anger.length)];
    }
    
    return mentalHealthResponses.general[Math.floor(Math.random() * mentalHealthResponses.general.length)];
  };

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendTextMessage = async (messageText?: string) => {
    const content = messageText || textInput.trim();
    if (!content) return;

    addMessage(content, 'user');
    setTextInput('');
    setIsLoading(true);

    try {
      // Try AI service first
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { message: content }
      });

      if (data && data.response) {
        addMessage(data.response, 'assistant');
      } else {
        // Fallback to local responses
        const response = getAIResponse(content);
        addMessage(response, 'assistant');
      }
    } catch (error) {
      console.error('Error:', error);
      // Use local response as fallback
      const response = getAIResponse(content);
      addMessage(response, 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
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
              AI Mental Health Companion
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A safe space for mental health support. Chat with our compassionate AI companion 
              designed to listen, understand, and provide helpful guidance.
            </p>
          </div>

          {/* Main Chat Interface */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Messages Display */}
            <Card className="h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {message.sender === 'user' ? 
                          <User className="w-4 h-4" /> : 
                          <Bot className="w-4 h-4" />
                        }
                      </div>
                      <div className={`max-w-[75%] p-4 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
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
            </Card>

            {/* Text Input */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind... I'm here to listen 💙"
                    className="min-h-[80px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendTextMessage()}
                    disabled={!textInput.trim() || isLoading}
                    size="icon"
                    className="self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendTextMessage(suggestion)}
                      disabled={isLoading}
                      className="text-left justify-start h-auto p-3 whitespace-normal"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Information */}
          <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How I Can Help</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Listen without judgment to your concerns</li>
                  <li>• Provide coping strategies for anxiety and stress</li>
                  <li>• Guide you through breathing and relaxation exercises</li>
                  <li>• Offer support for mood and sleep issues</li>
                  <li>• Help you process difficult emotions</li>
                  <li>• Available 24/7 for text-based support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="w-5 h-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  I'm here to provide emotional support and guidance, but I'm not a replacement for 
                  professional mental health care. For serious concerns or crisis situations, 
                  please reach out to qualified professionals.
                </p>
                <div className="bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded-md">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    🆘 Crisis Hotline: 988 (Suicide & Crisis Lifeline)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIChatbot;