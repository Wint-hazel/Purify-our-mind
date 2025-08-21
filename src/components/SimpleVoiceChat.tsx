import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, MessageSquare } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SimpleVoiceChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Ready to listen.");
  const [lastAIResponse, setLastAIResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setStatus("Sorry, speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleConversation(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setStatus(`Error: ${event.error}. Try again.`);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    if (text.includes('stress') || text.includes('overwhelm') || text.includes('anxious')) {
      return "I hear that you're feeling stressed. That's really tough. Let's break things down. What's one tiny thing you can control right now? Even taking three deep breaths can help reset your nervous system. Would you like to try that?";
    }
    else if (text.includes('procrastinat') || text.includes('lazy') || text.includes('start')) {
      return "It's so common to struggle with starting tasks. The first step is often the hardest. How about you just commit to working on it for just five minutes? Often, starting is the only hurdle you need to overcome. What's the absolute smallest first step you can take?";
    }
    else if (text.includes('sad') || text.includes('upset') || text.includes('depress') || text.includes('lonely')) {
      return "I'm really sorry you're feeling this way. It takes courage to talk about it. Thank you for sharing that with me. Sometimes, naming the feeling out loud is a powerful first step. Can you tell me more about what's behind that feeling?";
    }
    else if (text.includes('angry') || text.includes('mad') || text.includes('frustrat')) {
      return "That sounds frustrating. It's okay to feel angry. What's triggering that reaction? Sometimes understanding the 'why' can help us manage the feeling.";
    }
    else if (text.includes('tired') || text.includes('exhaust') || text.includes('sleep')) {
      return "Being tired makes everything harder. Your body might be asking for a break. Is there a way you can give yourself permission to rest, even for 15 minutes? Hydration and a short walk can also work wonders sometimes.";
    }
    else if (text.includes('hello') || text.includes('hi ') || text.startsWith('hi')) {
      return "Hello! Thanks for talking with me. I'm here to listen and help you work through any problems. What's on your mind today?";
    }
    else {
      return "Thank you for telling me about that. It sounds like a challenging situation. Let's think it through together. What would be the most helpful way for me to support you with this right now?";
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus("Speaking...");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus("Ready to listen.");
    };

    synthesisRef.current.speak(utterance);
  };

  const handleConversation = (userSpeech: string) => {
    addMessage(userSpeech, 'user');
    
    const aiResponse = generateResponse(userSpeech);
    setLastAIResponse(aiResponse);
    addMessage(aiResponse, 'ai');
    
    speakText(aiResponse);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setStatus("I'm listening...");
    }
  };

  const repeatResponse = () => {
    if (lastAIResponse && !isSpeaking) {
      speakText(lastAIResponse);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Helper - Your Problem-Solving Chat
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your private, offline problem-solving chat. Talk to me about what's on your mind.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Box */}
        <div 
          ref={chatBoxRef}
          className="h-80 border border-border rounded-lg p-4 overflow-y-auto bg-card space-y-3"
        >
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground italic">
              Start a conversation by clicking "Start Listening"
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.sender === 'user'
                    ? 'text-right text-primary'
                    : 'text-left text-accent-foreground'
                } py-1`}
              >
                <strong>{message.sender === 'user' ? 'You: ' : 'Helper: '}</strong>
                {message.text}
              </div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center justify-center">
          <Button
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            {isListening ? 'Listening...' : 'Start Listening'}
          </Button>
          
          <Button
            onClick={repeatResponse}
            disabled={!lastAIResponse || isSpeaking}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Repeat Response
          </Button>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground italic">
          Status: {status}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleVoiceChat;