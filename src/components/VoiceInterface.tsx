import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from '@/utils/RealtimeAudio';

interface VoiceInterfaceProps {
  onSpeakingChange: (speaking: boolean) => void;
  onTranscriptChange: (transcript: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange, onTranscriptChange }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');

  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentTranscriptRef = useRef<string>('');

  const handleAudioData = useCallback((audioData: Float32Array) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !isMuted) {
      const encodedAudio = encodeAudioForAPI(audioData);
      wsRef.current.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: encodedAudio
      }));
    }
  }, [isMuted]);

  const startConversation = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Initialize audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      // Connect to our Supabase edge function
      const wsUrl = `wss://jqdjfmnmiyfczrgtyisp.functions.supabase.co/functions/v1/realtime-chat`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = async () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setIsConnected(true);
        
        // Start audio recording
        audioRecorderRef.current = new AudioRecorder(handleAudioData);
        await audioRecorderRef.current.start();
        setIsRecording(true);
        
        toast({
          title: "Voice chat started",
          description: "You can now speak with the AI assistant",
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data.type);

        switch (data.type) {
          case 'response.audio.delta':
            // Play audio from AI
            if (audioContextRef.current && data.delta) {
              const binaryString = atob(data.delta);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              await playAudioData(audioContextRef.current, bytes);
              setIsAISpeaking(true);
              onSpeakingChange(true);
            }
            break;

          case 'response.audio.done':
            setIsAISpeaking(false);
            onSpeakingChange(false);
            break;

          case 'response.audio_transcript.delta':
            // Handle text transcripts from AI
            if (data.delta) {
              currentTranscriptRef.current += data.delta;
              onTranscriptChange(currentTranscriptRef.current);
            }
            break;

          case 'response.audio_transcript.done':
            // Finalize transcript
            if (currentTranscriptRef.current) {
              onTranscriptChange(currentTranscriptRef.current);
              currentTranscriptRef.current = '';
            }
            break;

          case 'input_audio_buffer.speech_started':
            console.log('User started speaking');
            break;

          case 'input_audio_buffer.speech_stopped':
            console.log('User stopped speaking');
            break;

          case 'error':
            console.error('WebSocket error:', data.error);
            toast({
              title: "Connection Error",
              description: data.error,
              variant: "destructive",
            });
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setConnectionStatus('disconnected');
        setIsConnected(false);
        setIsRecording(false);
        setIsAISpeaking(false);
        onSpeakingChange(false);
      };

    } catch (error) {
      console.error('Error starting conversation:', error);
      setConnectionStatus('error');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start voice chat',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    // Stop audio recording
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear audio queue
    clearAudioQueue();

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setIsRecording(false);
    setIsAISpeaking(false);
    setConnectionStatus('disconnected');
    onSpeakingChange(false);
    
    toast({
      title: "Voice chat ended",
      description: "Connection closed successfully",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone unmuted" : "Microphone muted",
      description: isMuted ? "AI can hear you again" : "AI cannot hear you",
    });
  };

  useEffect(() => {
    return () => {
      endConversation();
    };
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-card rounded-xl shadow-card">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Voice Chat</h3>
        <p className={`text-sm ${getStatusColor()}`}>
          Status: {connectionStatus}
          {isAISpeaking && " • AI is speaking"}
          {isMuted && " • Muted"}
        </p>
      </div>

      <div className="flex gap-4">
        {!isConnected ? (
          <Button 
            onClick={startConversation}
            disabled={connectionStatus === 'connecting'}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
            size="lg"
          >
            {connectionStatus === 'connecting' ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Voice Chat
              </>
            )}
          </Button>
        ) : (
          <>
            <Button 
              onClick={toggleMute}
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
            >
              {isMuted ? (
                <>
                  <MicOff className="w-5 h-5 mr-2" />
                  Unmute
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Mute
                </>
              )}
            </Button>
            
            <Button 
              onClick={endConversation}
              variant="outline"
              size="lg"
            >
              End Chat
            </Button>
          </>
        )}
      </div>

      {isConnected && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording
            </div>
          )}
          {isAISpeaking && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              AI Speaking
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;