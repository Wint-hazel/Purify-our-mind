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

    // 1. CRISIS & URGENT SUPPORT (Top Priority)
    if (/(kill myself|hurt myself|suicide|end it all|want to die|not worth it)/.test(text)) {
        return "[CRISIS RESPONSE] I hear the immense pain in your words, and I am so sorry you're feeling this. Please, right now, reach out to a trained professional who can help. You can call or text the 988 Suicide & Crisis Lifeline. They are available 24/7 and it's confidential. Your life is precious. Please, will you reach out?";
    }

    // 2. ANXIETY & PANIC
    if (/(anxious|anxiety|panic|nervous|overwhelm|overwhelmed|freaking out)/.test(text)) {
        const strategies = [
            "It sounds like your nervous system is in overdrive. That's really tough. Let's try to ground ourselves. Name five things you can see around you right now.",
            "Anxiety makes everything feel so big and immediate. Remember, this feeling is a wave—it will peak and then pass. You have ridden this wave before. Can you focus on taking one slow breath in, and an even slower breath out?",
            "Your body might be reacting to a perceived threat. You are safe in this moment. Let's try the 5-4-3-2-1 method: Find 5 things you can see, 4 things you can feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste."
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 3. DEPRESSION & LOW MOOD
    if (/(sad|depress|hopeless|numb|empty|dread|can't get up|why bother|nothing matters)/.test(text)) {
        const strategies = [
            "Thank you for sharing that with me. Depression can make everything feel heavy and colorless. You are not lazy or broken; you are managing a very difficult state. What is one tiny, kind thing you could do for yourself today? Even just drinking a glass of water is a victory.",
            "I hear you. When motivation is gone, we have to rely on tiny steps. Don't think about the whole day. Is there one small action, like opening a window for fresh air, that feels possible right now?",
            "It sounds incredibly draining. Be gentle with yourself. The fact that you're talking about it is a brave step. Would it help to just sit with this feeling together for a moment, without any pressure to fix it?"
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 4. STRESS & BURNOUT
    if (/(stress|burnout|exhaust|too much|pressure|weighing on me|drowning)/.test(text)) {
        const strategies = [
            "It sounds like you're carrying a very heavy load. Chronic stress is exhausting. What is one thing, no matter how small, that you could put down or delegate? Your well-being is a priority.",
            "Burnout is your body and mind asking for a different way. Can you give yourself permission to take a real break, even for 10 minutes, without guilt? You cannot pour from an empty cup.",
            "Let's break the 'too much' down. What is the single most pressing task? Often, tackling one small piece of it can reduce the feeling of being overwhelmed."
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 5. ANGER & FRUSTRATION
    if (/(angry|frustrat|pissed|rage|irritat|annoy|so mad|seeing red)/.test(text)) {
        const strategies = [
            "Anger is a powerful signal that a boundary has been crossed or a need isn't being met. Can you identify what need is underneath the anger?",
            "That frustration is completely valid. It's okay to feel this. Sometimes physically releasing the energy—like squeezing a stress ball or shaking out your hands—can help the feeling move through you.",
            "It sounds like that situation was really unfair. What is a healthy way you can express or honor this feeling? Sometimes writing it all down without filter can help."
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 6. LONELINESS & ISOLATION
    if (/(lonely|isolat|alone|no one|no friend|nobody cares|no one gets it)/.test(text)) {
        const strategies = [
            "Loneliness is an incredibly painful feeling. Thank you for reaching out here. You are connecting right now. Remember, many people feel this way, even if it's not visible. What is a low-pressure way you could connect with someone today? Even a small comment to a cashier counts.",
            "I hear how isolated you feel. That is so hard. Sometimes joining an online community focused on a hobby can be a easier first step to feeling connected than in-person meetings.",
            "You are not a burden. Your desire for connection is human and valid. Is there a pet, a community garden, or a library you could visit to be around life, even without direct conversation?"
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 7. PROCRASTINATION & MOTIVATION
    if (/(procrastinat|lazy|can't start|avoiding|unmotivat|putting off)/.test(text)) {
        const strategies = [
            "It's so common to struggle with starting. The first step is often the hardest. How about you just commit to working on it for just five minutes? Often, starting is the only hurdle.",
            "Procrastination is often about emotion, not laziness. What feeling are you avoiding by putting this off? Boredom? Fear of failure? Just naming it can reduce its power.",
            "Let's make the step smaller. What is the absolute smallest, easiest first action? Not 'write report,' but 'open document and write one sentence.' Could you do that?"
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 8. SELF-CRITICISM & LOW SELF-ESTEEM
    if (/(I'm stupid|I'm a failure|hate myself|not good enough|worthless|useless)/.test(text)) {
        const strategies = [
            "I hear that critical voice in your head, and I want you to know I disagree. You are struggling, and that is human, not failure. What would you say to a friend who felt this way? Can you try offering yourself that same compassion?",
            "That inner critic can be so loud. Thank you for sharing those thoughts with me. Let's challenge one of them. What is one small piece of evidence that contradicts that harsh judgment?",
            "You are so much more than your perceived flaws or mistakes. Those thoughts are feelings, not facts. Can you try to observe them without believing them, like watching clouds pass in the sky?"
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 9. GRIEF & LOSS
    if (/(grief|loss|passed away|died|miss them|mourning)/.test(text)) {
        const strategies = [
            "Grief is one of the hardest things we face. There is no right way to do it. Be patient and gentle with yourself. It's okay to feel exactly how you feel, whether it's sad, angry, or numb.",
            "Thank you for telling me about your loss. It's a testament to your love for them. Would it feel right to take a moment to remember something good about them? Or is it too painful right now?",
            "Grief comes in waves. Sometimes you just have to let it wash over you. You don't have to 'get over it' or 'be strong.' Just breathe and get through this moment. I'm here with you."
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 10. SLEEP PROBLEMS
    if (/(can't sleep|insomnia|tired but awake|racing thoughts|wired|wide awake)/.test(text)) {
        const strategies = [
            "Racing thoughts at night are so common. Instead of fighting them, try giving them a notepad. Tell yourself you can worry about it tomorrow, and write it down to get it out of your head.",
            "Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale slowly for 8. This can calm your nervous system and signal sleep.",
            "Your brain might need help winding down. Could you try a guided sleep meditation or just listening to calm, boring music? The goal is rest, not necessarily sleep."
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 11. RELATIONSHIP & SOCIAL STRESS
    if (/(fight with|argument|my partner|my friend|my family|drama)/.test(text)) {
        const strategies = [
            "Conflict in relationships is so tough. It can make you feel awful. What do you need most right now? Space to cool down, or a way to express how you feel?",
            "It sounds like that was really hurtful. Your feelings are valid. Sometimes the first step is to calm your own nervous system before trying to resolve things with the other person.",
            "Would it help to think about what your part was in the situation, and what was theirs? Understanding that can sometimes help us not take everything onto ourselves."
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 12. GENERAL SELF-CARE & WELLNESS
    if (/(tired|exhaust|self care|run down|need a break|worn out)/.test(text)) {
        const strategies = [
            "It's okay to rest. Rest is productive. It is part of the work, not the opposite of it. What does your body need most right now? A glass of water? A stretch?",
            "Be kind to your future self. What is one small thing you can do now that they will thank you for later? Maybe just washing one dish or charging your phone.",
            "You're signaling that your resources are low. That's important information. What is one tiny way you can replenish yourself, even just a little, right now?"
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // 13. GREETING / INITIATION
    if (/(hello|hi|hey|what's up|good morning|good afternoon)/.test(text)) {
        return "Hello. It's good to hear from you. How are you really feeling today?";
    }

    // 14. GRATITUDE & POSITIVE MOMENT (Reinforce this!)
    if (/(good day|happy|grateful|thankful|proud|achievement)/.test(text)) {
        const positiveResponses = [
            "That's wonderful to hear! Thank you for sharing that good news with me. Savor that feeling. What was the best part about it?",
            "I'm so glad you're having a good moment. It's important to celebrate these, big or small. What helped make today better?",
            "That's fantastic! Acknowledging these positive moments is a great practice for your well-being. Keep noticing what feels good."
        ];
        return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }

    // 15. DEFAULT EMPATHETIC RESPONSE (For anything else)
    return "Thank you for telling me about that. It sounds like a complex and difficult situation. I'm here with you. What do you think is the next smallest step you could take to care for yourself in this moment?";
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