import React, { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  AlertTriangle,
  MessageCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Headphones
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'voice';
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI mental health companion. I'm here to listen, provide support, and help you work through your feelings. How are you doing today?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  
  // Voice chat states
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice chat refs
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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
    
    return mentalHealthResponses.general[Math.floor(Math.random() * mentalHealthResponses.general.length)];
  };

  const addMessage = (content: string, sender: 'user' | 'assistant', type: 'text' | 'voice' = 'text') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendTextMessage = async (messageText?: string) => {
    const content = messageText || textInput.trim();
    if (!content) return;

    addMessage(content, 'user', 'text');
    setTextInput('');
    setIsLoading(true);

    try {
      // Try AI service first
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { message: content }
      });

      if (data && data.response) {
        addMessage(data.response, 'assistant', 'text');
      } else {
        // Fallback to local responses
        const response = getAIResponse(content);
        addMessage(response, 'assistant', 'text');
      }
    } catch (error) {
      console.error('Error:', error);
      // Use local response as fallback
      const response = getAIResponse(content);
      addMessage(response, 'assistant', 'text');
    } finally {
      setIsLoading(false);
    }
  };

  // Voice chat functions
  const connectVoiceChat = async () => {
    try {
      console.log('Attempting to connect to voice chat...');
      
      const ws = new WebSocket('wss://jqdjfmnmiyfczrgtyisp.supabase.co/functions/v1/realtime-chat');
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Voice chat is ready! Click 'Start Recording' to begin."
        });
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data.type);
          
          switch (data.type) {
            case 'session.created':
              console.log('OpenAI session created successfully');
              break;
              
            case 'session.updated':
              console.log('OpenAI session updated successfully');
              break;

            case 'response.audio.delta':
              if (data.delta) {
                try {
                  const binaryString = atob(data.delta);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  
                  if (!audioContextRef.current) {
                    audioContextRef.current = new AudioContext();
                  }
                  
                  await playAudioData(audioContextRef.current, bytes);
                  setIsSpeaking(true);
                } catch (audioError) {
                  console.error('Error playing audio:', audioError);
                }
              }
              break;

            case 'response.audio.done':
              console.log('AI finished speaking');
              setIsSpeaking(false);
              break;

            case 'response.audio_transcript.delta':
              if (data.delta) {
                setCurrentTranscript(prev => prev + data.delta);
              }
              break;

            case 'response.audio_transcript.done':
              if (currentTranscript) {
                addMessage(currentTranscript, 'assistant', 'voice');
                setCurrentTranscript('');
              }
              break;

            case 'conversation.item.input_audio_transcription.completed':
              if (data.transcript) {
                // Add crisis word detection
                const crisisWords = ['suicide', 'hurt myself', 'end my life', 'kill myself', 'want to die'];
                const userMessage = data.transcript.toLowerCase();
                const hasCrisisWords = crisisWords.some(word => userMessage.includes(word));
                
                if (hasCrisisWords) {
                  // Immediately send crisis response
                  const crisisResponse = "If you feel like harming yourself, please reach out immediately to a trusted person or call your local crisis hotline. You are not alone. Crisis Hotline: 988";
                  addMessage(data.transcript, 'user', 'voice');
                  addMessage(crisisResponse, 'assistant', 'voice');
                  
                  // Send crisis intervention via WebSocket
                  if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                      type: 'conversation.item.create',
                      item: {
                        type: 'message',
                        role: 'assistant',
                        content: [{ type: 'input_text', text: crisisResponse }]
                      }
                    }));
                    wsRef.current.send(JSON.stringify({ type: 'response.create' }));
                  }
                } else {
                  addMessage(data.transcript, 'user', 'voice');
                }
              }
              break;

            case 'input_audio_buffer.speech_started':
              console.log('User started speaking');
              break;

            case 'input_audio_buffer.speech_stopped':
              console.log('User stopped speaking - AI should respond');
              break;

            case 'response.created':
              console.log('AI response created');
              setIsLoading(true);
              break;

            case 'response.done':
              console.log('AI response completed');
              setIsLoading(false);
              break;

            case 'error':
              console.error('Voice chat error:', data.error);
              toast({
                title: "Voice Chat Error",
                description: data.error || 'Unknown error occurred',
                variant: "destructive"
              });
              break;

            default:
              console.log('Unhandled message type:', data.type, data);
          }
        } catch (parseError) {
          console.error('Error parsing WebSocket message:', parseError, event.data);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsRecording(false);
        setIsSpeaking(false);
        
        if (event.code !== 1000) { // Not a normal closure
          toast({
            title: "Connection Lost",
            description: "Voice chat connection was lost. You can try reconnecting.",
            variant: "destructive"
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error details:', error);
        toast({
          title: "Connection Error", 
          description: "Failed to connect to voice chat. Please check your internet connection and try again.",
          variant: "destructive"
        });
        setIsConnected(false);
      };

      wsRef.current = ws;
      
    } catch (error) {
      console.error('Error setting up voice chat:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize voice chat connection.",
        variant: "destructive"
      });
    }
  };

  const startVoiceRecording = async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: "Not Connected",
        description: "Please connect to voice chat first",
        variant: "destructive"
      });
      return;
    }

    try {
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await recorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak naturally - I'm listening!"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: error instanceof Error ? error.message : 'Failed to start recording',
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    setIsRecording(false);
  };

  const disconnectVoiceChat = () => {
    stopVoiceRecording();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsConnected(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      disconnectVoiceChat();
    };
  }, []);

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
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Text Chat
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Voice Chat
                </TabsTrigger>
              </TabsList>

              {/* Shared Messages Display */}
              <Card className="h-[500px] flex flex-col mb-6">
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
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            <div className="flex items-center gap-1 text-xs opacity-70">
                              {message.type === 'voice' ? (
                                <Mic className="w-3 h-3" />
                              ) : (
                                <MessageCircle className="w-3 h-3" />
                              )}
                              {message.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Current transcript preview */}
                    {currentTranscript && (
                      <div className="flex gap-3">
                        <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg max-w-[75%]">
                          <p className="text-sm text-blue-700">{currentTranscript}</p>
                          <span className="text-xs text-blue-500">AI is responding...</span>
                        </div>
                      </div>
                    )}
                    
                    {isLoading && !currentTranscript && (
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

              {/* Text Chat Tab */}
              <TabsContent value="text" className="space-y-6">
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
              </TabsContent>

              {/* Voice Chat Tab */}
              <TabsContent value="voice" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Voice Interaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    {!isConnected ? (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Connect to start voice conversations with your AI companion
                        </p>
                        <Button onClick={connectVoiceChat} size="lg">
                          <Headphones className="w-4 h-4 mr-2" />
                          Connect Voice Chat
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-blue-700 font-medium mb-2">
                            💡 How Voice Chat Works:
                          </p>
                          <ul className="text-sm text-blue-600 space-y-1">
                            <li>• Click "Start Recording" and speak naturally</li>
                            <li>• AI will automatically respond when you pause speaking</li>
                            <li>• No need to click stop - just speak and pause</li>
                            <li>• Your conversation appears as text below</li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-center gap-6">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                            isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <Volume2 className="w-4 h-4" />
                            Connected
                          </div>
                          
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                            isRecording ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                            {isRecording ? 'Listening...' : 'Ready'}
                          </div>

                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                            isSpeaking ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            {isSpeaking ? 'AI Speaking' : 'AI Silent'}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {!isRecording ? (
                            <Button onClick={startVoiceRecording} size="lg" className="bg-red-500 hover:bg-red-600">
                              <Mic className="w-4 h-4 mr-2" />
                              Start Recording
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                🎤 Speak now... I'll respond when you pause
                              </p>
                              <Button onClick={stopVoiceRecording} variant="outline" size="lg">
                                <MicOff className="w-4 h-4 mr-2" />
                                Stop Recording
                              </Button>
                            </div>
                          )}
                          
                          <Button onClick={disconnectVoiceChat} variant="secondary" size="sm">
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                  <li>• Available via text chat or voice conversation</li>
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