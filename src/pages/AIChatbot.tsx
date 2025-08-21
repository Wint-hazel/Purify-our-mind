import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, AlertTriangle, Mic, Wind } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello, I'm Serenity. I'm here to listen and offer support. Whatever you're feeling is valid. What would you like to talk about?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [status, setStatus] = useState('Ready to listen.');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setStatus("Sorry, speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    synthesisRef.current = window.speechSynthesis;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleUserMessage(transcript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (!isSpeaking) {
        setStatus("Ready to listen.");
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setStatus(`Error: ${event.error}. Try again.`);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current?.speaking) {
        synthesisRef.current.cancel();
      }
    };
  }, [isSpeaking]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

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
    if (!synthesisRef.current) return;
    
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    setIsSpeaking(true);
    setStatus("Speaking...");
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus("Ready to listen.");
    };
    
    synthesisRef.current.speak(utterance);
  };

  const handleUserMessage = (userText: string) => {
    // Add user message
    const userMessage: Message = {
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setStatus("Thinking...");

    // Generate AI response after a brief delay
    setTimeout(() => {
      const aiResponse = generateResponse(userText);
      const aiMessage: Message = {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      speakText(aiResponse);
    }, 1000);
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    recognitionRef.current.start();
    setStatus("Listening...");
    setIsListening(true);
  };

  const guideBreathing = () => {
    setStatus("Guiding breathing exercise...");
    setIsBreathing(true);
    
    const breathText = "Let's take a moment to breathe together. Please get comfortable. We'll do a simple four-part breath. Inhale slowly for four seconds... one... two... three... four. Now hold for four seconds... one... two... three... four. Now exhale slowly for four seconds... one... two... three... four. And hold the exhale for four... one... two... three... four. Let's do that one more time. Inhale... two... three... four. Hold... two... three... four. Exhale... two... three... four. Hold... two... three... four. Good job. Notice how your body feels. You can return to this anytime.";
    
    const breathMessage: Message = {
      text: breathText,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, breathMessage]);
    
    speakText(breathText);
    
    // Reset breathing state after the exercise
    setTimeout(() => {
      setIsBreathing(false);
    }, 45000); // Approximate duration of breathing exercise
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <span>Serenity</span>
              <span className="text-2xl">🍃</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto italic">
              A supportive space to talk about feelings and find coping strategies through voice conversation.
            </p>
          </div>

          {/* Voice Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Voice Chat Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Chat Messages */}
                <div 
                  ref={chatBoxRef}
                  className="h-96 border border-border p-4 mb-6 overflow-y-auto bg-card rounded-lg space-y-4"
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.sender === 'user'
                          ? 'ml-auto bg-primary/10 text-primary'
                          : 'mr-auto bg-secondary/50 text-secondary-foreground'
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">
                        {message.sender === 'ai' ? 'Serenity:' : 'You:'}
                      </div>
                      <div className="text-sm">{message.text}</div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Button
                    onClick={startListening}
                    disabled={isListening || isSpeaking || isBreathing}
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    <Mic className="w-4 h-4" />
                    {isListening ? 'Listening...' : 'Start Talking'}
                  </Button>
                  
                  <Button
                    onClick={guideBreathing}
                    disabled={isListening || isSpeaking || isBreathing}
                    variant="outline"
                    className="flex items-center gap-2"
                    size="lg"
                  >
                    <Wind className="w-4 h-4" />
                    Guide Me (Breathing)
                  </Button>
                </div>

                {/* Status */}
                <p className="text-center text-sm text-muted-foreground mt-4 italic">
                  Status: {status}
                </p>
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
                  <li>• Available 24/7 for supportive text conversations</li>
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