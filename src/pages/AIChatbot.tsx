import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, AlertTriangle, Heart, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  mode: 'text' | 'voice';
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI mental health companion. 🌟 I'm here to listen, support, and help you navigate through any challenges you're facing. How are you feeling today? You can type your thoughts or use voice chat.",
      type: 'assistant',
      timestamp: new Date(),
      mode: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState("text");
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // WebSocket and audio states
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  const addMessage = (type: 'user' | 'assistant', content: string, mode: 'text' | 'voice' = 'text') => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      mode
    };
    setMessages(prev => [...prev, message]);
  };

  const setupWebSocket = () => {
    // Use the Supabase functions URL with the current project
    const ws = new WebSocket(`wss://pbsqjumhlxbnhmzmemgk.supabase.co/functions/v1/realtime-chat`);
    
    ws.onopen = () => {
      console.log('Connected to AI');
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "AI is ready to chat",
      });
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message type:', data.type);

      switch (data.type) {
        case 'session.created':
          console.log('Session created');
          break;
          
        case 'session.updated':
          console.log('Session updated');
          break;

        case 'response.audio.delta':
          if (data.delta && activeTab === 'voice') {
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
            } catch (error) {
              console.error('Error playing audio:', error);
            }
          }
          break;

        case 'response.audio.done':
          console.log('Audio response completed');
          setIsSpeaking(false);
          break;

        case 'response.audio_transcript.delta':
          if (data.delta) {
            setCurrentTranscript(prev => prev + data.delta);
          }
          break;

        case 'response.audio_transcript.done':
          if (currentTranscript) {
            addMessage('assistant', currentTranscript, 'voice');
            setCurrentTranscript('');
          }
          setIsLoading(false);
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (data.transcript) {
            addMessage('user', data.transcript, 'voice');
          }
          break;

        case 'response.text.delta':
          // Handle text responses for typed messages
          if (data.delta && activeTab === 'text') {
            setCurrentTranscript(prev => prev + data.delta);
          }
          break;

        case 'response.text.done':
          if (currentTranscript && activeTab === 'text') {
            addMessage('assistant', currentTranscript, 'text');
            setCurrentTranscript('');
          }
          setIsLoading(false);
          break;

        case 'error':
          console.error('WebSocket error:', data.error);
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
          setIsLoading(false);
          break;

        default:
          console.log('Unhandled message type:', data.type);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setIsConnected(false);
      setIsRecording(false);
      setIsSpeaking(false);
      setIsLoading(false);
    };

    return ws;
  };

  const sendTextMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    // Add user message
    addMessage('user', textToSend, 'text');
    setInputMessage('');
    setIsLoading(true);

    try {
      // Try WebSocket first if connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: textToSend }]
          }
        }));
        
        wsRef.current.send(JSON.stringify({ type: 'response.create' }));
      } else {
        // Fallback to direct API call using Supabase function
        const { data, error } = await supabase.functions.invoke('chat-with-ai', {
          body: { message: textToSend }
        });

        if (error) {
          throw new Error(error.message || 'Failed to get response');
        }

        if (data && data.response) {
          addMessage('assistant', data.response, 'text');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('assistant', "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 'text');
      setIsLoading(false);
    }
  };

  const startVoiceChat = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        wsRef.current = setupWebSocket();
      }
      
      // Set up audio recorder
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
      
    } catch (error) {
      console.error('Error starting voice chat:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start voice chat',
        variant: "destructive",
      });
    }
  };

  const stopVoiceChat = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    setIsRecording(false);
    setIsSpeaking(false);
  };

  const connectToAI = () => {
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      wsRef.current = setupWebSocket();
    }
  };

  const disconnectFromAI = () => {
    stopVoiceChat();
    
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      disconnectFromAI();
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
              AI Mental Health Support
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect with our AI-powered mental health companion for personalized support, 
              coping strategies, and emotional guidance available 24/7.
            </p>
          </div>

          {/* Connection Status */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <Bot className="w-4 h-4" />
                {isConnected ? 'AI Connected' : 'AI Disconnected'}
              </div>
              
              {!isConnected ? (
                <Button onClick={connectToAI} size="sm">
                  Connect to AI
                </Button>
              ) : (
                <Button onClick={disconnectFromAI} variant="outline" size="sm">
                  Disconnect
                </Button>
              )}
            </div>
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

              {/* Shared Message History */}
              <Card className="h-[500px] flex flex-col mb-6">
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.type === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Heart className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            <span className="text-xs opacity-70 flex items-center gap-1">
                              {message.mode === 'voice' ? (
                                <Mic className="w-3 h-3" />
                              ) : (
                                <Bot className="w-3 h-3" />
                              )}
                              {message.mode}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Current transcript preview */}
                    {currentTranscript && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm text-blue-700">{currentTranscript}</p>
                          <span className="text-xs text-blue-500">AI is responding...</span>
                        </div>
                      </div>
                    )}
                    
                    {isLoading && !currentTranscript && (
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
              </Card>

              {/* Text Chat Tab */}
              <TabsContent value="text" className="space-y-6">
                {/* Text Input Area */}
                <Card>
                  <CardContent className="p-4">
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
                        onClick={() => sendTextMessage()}
                        disabled={!inputMessage.trim() || isLoading}
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
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
                        onClick={() => sendTextMessage(question)}
                        disabled={isLoading}
                        className="text-left justify-start h-auto p-3 whitespace-normal"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Voice Chat Tab */}
              <TabsContent value="voice" className="space-y-6">
                <Card>
                  <CardContent className="p-6 text-center space-y-4">
                    {!isRecording ? (
                      <Button 
                        onClick={startVoiceChat}
                        disabled={!isConnected}
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Start Voice Chat
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                            isRecording ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                            {isRecording ? 'Listening...' : 'Not Recording'}
                          </div>
                          
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                            isSpeaking ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            {isSpeaking ? 'AI Speaking...' : 'AI Silent'}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={stopVoiceChat}
                          variant="outline"
                          size="lg"
                        >
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Voice Chat
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                  <li>• Seamless text and voice conversation</li>
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