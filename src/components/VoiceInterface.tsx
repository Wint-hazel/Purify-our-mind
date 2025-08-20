import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`wss://jqdjfmnmiyfczrgtyisp.functions.supabase.co/functions/v1/realtime-chat`);
    
    ws.onopen = () => {
      console.log('Connected to voice AI');
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Voice AI is ready to listen",
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
              onSpeakingChange?.(true);
            } catch (error) {
              console.error('Error playing audio:', error);
            }
          }
          break;

        case 'response.audio.done':
          console.log('Audio response completed');
          setIsSpeaking(false);
          onSpeakingChange?.(false);
          break;

        case 'response.audio_transcript.delta':
          if (data.delta) {
            setCurrentTranscript(prev => prev + data.delta);
          }
          break;

        case 'response.audio_transcript.done':
          if (currentTranscript) {
            addMessage('assistant', currentTranscript);
            setCurrentTranscript('');
          }
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (data.transcript) {
            addMessage('user', data.transcript);
          }
          break;

        case 'error':
          console.error('WebSocket error:', data.error);
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
          break;

        default:
          console.log('Unhandled message type:', data.type);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to voice AI",
        variant: "destructive",
      });
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setIsConnected(false);
      setIsRecording(false);
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };

    return ws;
  };

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      wsRef.current = setupWebSocket();
      
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
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsConnected(false);
    setIsRecording(false);
    setIsSpeaking(false);
    onSpeakingChange?.(false);
  };

  useEffect(() => {
    return () => {
      endConversation();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Mental Health Support Voice AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {!isConnected ? (
              <Button 
                onClick={startConversation}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Voice Conversation
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
                  onClick={endConversation}
                  variant="outline"
                  size="lg"
                >
                  End Conversation
                </Button>
              </div>
            )}
          </div>

          {currentTranscript && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>AI is saying:</strong> {currentTranscript}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-50 ml-8'
                      : 'bg-green-50 mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {message.type === 'user' ? 'You' : 'AI Support'}
                      </p>
                      <p className="text-sm mt-1">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceInterface;