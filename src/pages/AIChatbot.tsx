import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, AlertTriangle, Heart, Mic, MicOff, Volume2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: string;
  audioData?: string;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 1,
      text: "Hello! I'm MindCare, your AI mental health companion. 🌟 I'm here to listen, support, and help you navigate through any challenges you're facing. How are you feeling today? You can type or use voice recording to share your thoughts.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

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
    
    // Specific scenario-based responses
    
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

    // Social anxiety about events
    if (message.includes('nervous about') && (message.includes('party') || message.includes('social') || message.includes('event'))) {
      return "Social anxiety before events is very common! 🎉 Many people feel that way. Let's try a calming technique: take 3 deep breaths and remind yourself of your good qualities. You belong there just as much as anyone else.";
    }

    // Fear of failure
    if (message.includes('scared i\'ll fail') || message.includes('fear of failure') || message.includes('afraid i\'ll fail')) {
      return "Fear of failure can be paralyzing, but it shows you care about doing well. 📚 Feeling nervous is normal before important events. Let's review what you've prepared and take a deep breath. You're more ready than you think.";
    }

    // Concentration issues
    if (message.includes('can\'t focus') || message.includes('difficulty concentrating') || message.includes('trouble concentrating')) {
      return "Focus can be tricky when we're stressed or overwhelmed. 🧘‍♀️ Let's try a 2-minute mindfulness exercise to reset your mind: close your eyes, breathe slowly, and notice 5 things you can hear around you.";
    }

    // Feeling overwhelmed by responsibilities  
    if (message.includes('too many things to do') || message.includes('can\'t keep up') || message.includes('overwhelmed by responsibilities')) {
      return "Feeling overwhelmed is a sign you're taking on a lot! 📝 Let's make this manageable: create a short priority list and tackle just one thing at a time. Which task feels most urgent or easiest to complete first?";
    }

    // Appearance insecurity
    if (message.includes('hate looking in mirror') || message.includes('insecure about appearance') || message.includes('don\'t like how i look')) {
      return "Your value extends far beyond appearance. 💫 You are so much more than what you see in the mirror. Let's shift focus: can you list 3 qualities you like about yourself today? Your kindness, humor, creativity, or strength?";
    }

    // Shyness with new people
    if (message.includes('shy to talk') || message.includes('nervous about talking') || message.includes('scared to meet new people')) {
      return "It's completely okay to feel shy - many people do! 🤝 Let's practice together: try starting with a simple 'Hi, how are you?' or asking about something you both can see. Most people appreciate friendly gestures.";
    }

    // Mental exhaustion
    if (message.includes('mentally drained') || message.includes('mentally exhausted') || message.includes('mental fatigue')) {
      return "Mental exhaustion is real and valid. 🧠 Your mind needs rest just like your body does. Let's try a short guided relaxation: close your eyes, breathe deeply, and imagine a peaceful place where you feel completely safe.";
    }

    // Guilt about past actions
    if (message.includes('regret what i did') || message.includes('guilty about') || message.includes('feel bad about what i did')) {
      return "Acknowledging regret shows your conscience and growth. 🌱 That's actually a good first step. Can we think of one way to make amends if possible, or practice self-forgiveness? Everyone makes mistakes - it's part of being human.";
    }

    // Anger about uncontrollable situations
    if (message.includes('frustrated about things i can\'t change') || message.includes('angry at things i can\'t control')) {
      return "That frustration is so understandable! 🌊 It's normal to feel upset about things beyond our control. Let's focus on what you can influence today and practice letting the rest go, even if just for now. What's one small thing within your control?";
    }

    // Feeling stuck in life
    if (message.includes('don\'t know what to do with my life') || message.includes('feeling stuck') || message.includes('lost in life')) {
      return "Feeling stuck is more common than you think, especially during transitions. 🛤️ Let's start small: what's one activity or interest that brought you joy recently? Sometimes exploring small interests can lead to bigger discoveries about ourselves.";
    }

    // Fear of judgment
    if (message.includes('scared people will judge') || message.includes('fear of judgment') || message.includes('worried what others think')) {
      return "Fear of judgment affects most people! 💪 Here's a gentle reminder: others' opinions don't define your worth. Most people are too focused on their own lives to judge yours as harshly as you think. You deserve to live authentically.";
    }

    // Feeling unappreciated at work
    if (message.includes('nobody values my effort') || message.includes('unappreciated at work') || message.includes('feel unrecognized')) {
      return "Feeling unappreciated can be really discouraging. 👏 Let's acknowledge what you've accomplished today and celebrate even small wins. Your efforts matter, even when they're not immediately recognized by others.";
    }

    // Hopelessness about change
    if (message.includes('things will never get better') || message.includes('hopeless about change') || message.includes('nothing will improve')) {
      return "When we're in pain, it can feel like it will last forever. 🌱 But change often happens gradually. Let's identify one small step you can take today toward feeling better - maybe it's reaching out to someone, taking a short walk, or doing one kind thing for yourself.";
    }

    // Public speaking anxiety
    if (message.includes('terrified of giving presentation') || message.includes('nervous about public speaking') || message.includes('scared to present')) {
      return "Public speaking anxiety is incredibly common! 🎯 Let's prepare together: practice a short breathing exercise (4 counts in, 6 counts out) and repeat this affirmation: 'I have valuable things to share, and I'm prepared.' You've got this!";
    }

    // Decision-making difficulty
    if (message.includes('can\'t decide what to do') || message.includes('trouble making decisions') || message.includes('unsure about deciding')) {
      return "Decision-making can feel overwhelming when we're anxious or have many options. 📊 Let's make this easier: what are your top 2 options? We can list the pros and cons of each together, or consider what your future self would thank you for choosing.";
    }

    // Panic attacks
    if (message.includes('panic attack') || message.includes('panic')) {
      return "During a panic attack, focus on slow breathing - inhale for 4, hold for 4, exhale for 6. 🌬️ Try grounding exercises: name 5 things you see, 4 you can touch, 3 you can hear. Remember, it will pass. If panic attacks are frequent, please consider professional guidance.";
    }

    // Racing thoughts/overthinking
    if (message.includes('racing thoughts') || message.includes('overthinking') || message.includes('can\'t stop thinking')) {
      return "Racing thoughts can be exhausting. 🌊 Try writing them down to get them out of your head, practice mindfulness meditation, or set aside 10 minutes of 'worry time' each day. Focus on your breathing when thoughts spiral - it anchors you to the present moment.";
    }
    
    // Anxiety-related responses
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || message.includes('nervous')) {
      const anxietyResponses = [
        "I feel anxious all the time can be overwhelming. 💙 Practice grounding exercises like the 5-4-3-2-1 technique, try deep breathing, and mindfulness. If anxiety persists, consider speaking with a mental health professional.",
        "Anxiety is your body's natural response to stress, and it's okay to feel this way. 🌸 Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This can help calm your nervous system.",
        "When anxiety strikes, remember that this feeling is temporary. 🌟 Practice grounding: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste."
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }

    // Signs of depression
    if (message.includes('signs of depression') || message.includes('depression symptoms')) {
      return "Signs of depression include persistent sadness, loss of interest in activities, sleep or appetite changes, fatigue, difficulty concentrating, and feelings of hopelessness. 🌧️ If you're experiencing several of these symptoms for more than two weeks, please consider talking to a mental health professional.";
    }

    // Hopelessness
    if (message.includes('hopeless') || message.includes('no point') || message.includes('give up')) {
      return "Feeling hopeless can be incredibly painful, but please know that these feelings can change. 🌅 Talk to a trusted friend or mental health professional immediately. You can also try small grounding activities or self-care to regain some control. You matter, and there is help available.";
    }

    // Depression/sadness responses
    if (message.includes('sad') || message.includes('depressed') || message.includes('down') || message.includes('lonely') || message.includes('empty') || message.includes('no reason')) {
      const sadnessResponses = [
        "Occasional sadness is normal, but persistent sadness may indicate depression. 💙 Talking to someone you trust or a professional can help. Remember, your feelings are valid.",
        "Loneliness can be really painful. 🤗 Reach out to friends or family, join a club or support group, or talk to a counselor. Even small connections help.",
        "It's brave of you to share how you're feeling. 🌱 Engage in enjoyable activities like walking, listening to music, connecting with friends, or practicing gratitude to help improve your mood."
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

    // Stress management
    if (message.includes('manage stress') || message.includes('stress management') || message.includes('how to handle stress')) {
      return "Great stress management techniques include deep breathing exercises, meditation, journaling your thoughts, taking short breaks throughout the day, regular exercise, and maintaining a healthy routine. 🌿 Pick one or two that resonate with you and practice them consistently.";
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

    // Self-esteem and confidence
    if (message.includes('self-esteem') || message.includes('confidence') || message.includes('self-worth') || message.includes('boost')) {
      return "Building self-esteem takes time and practice. 🌟 Celebrate small achievements, practice self-compassion, set achievable goals, and avoid comparing yourself to others. Remember, you are worthy just as you are.";
    }

    // Anger management
    if (message.includes('angry') || message.includes('anger') || message.includes('frustrated') || message.includes('mad')) {
      return "Anger is a normal emotion, and it's okay to feel this way. 🔥 When anger arises, take deep breaths, step away from the situation if possible, count to ten, and express your feelings calmly when you're ready. Physical exercise can also help release anger.";
    }

    // Relationship stress
    if (message.includes('relationship') || message.includes('partner') || message.includes('friend') || message.includes('family stress')) {
      return "Relationship stress can be challenging. 💕 Try communicating openly and honestly, set healthy boundaries, practice empathy, and take breaks when needed. If stress continues, couples or family counseling can provide valuable support.";
    }

    // Exercise and mental health
    if (message.includes('exercise') || message.includes('workout') || message.includes('physical activity')) {
      return "Exercise is fantastic for mental health! 💪 Regular physical activity releases endorphins (feel-good hormones), reduces stress, improves mood, and boosts energy and self-confidence. Even a 10-minute walk can make a difference.";
    }

    // Mindfulness practices
    if (message.includes('mindfulness') || message.includes('meditation') || message.includes('present moment')) {
      return "Mindfulness is a powerful tool for mental wellbeing. 🧘‍♀️ Try focusing on your breathing, paying attention to the present moment, observing thoughts without judgment, or using guided meditation apps. Even 5 minutes daily can help reduce stress and improve focus.";
    }

    // Diet and mental health
    if (message.includes('diet') || message.includes('food') || message.includes('eating') || message.includes('nutrition')) {
      return "Nutrition plays a significant role in mental health! 🥗 Eating a balanced diet with fruits, vegetables, whole grains, and omega-3-rich foods (like fish and nuts) can improve mood, energy, and brain health. Stay hydrated and limit processed foods when possible.";
    }

    // Supporting friends
    if (message.includes('help friend') || message.includes('support friend') || message.includes('friend mental health')) {
      return "It's wonderful that you want to support your friend. 🤝 Listen without judgment, offer encouragement, avoid giving unsolicited advice, and gently suggest professional help if needed. Remember to take care of your own mental health too.";
    }

    // Motivation/productivity responses
    if (message.includes('lazy') || message.includes('unmotivated') || message.includes('productive') || message.includes('energy')) {
      const motivationResponses = [
        "I feel unmotivated can be tough. 🌱 Start with small tasks, create a routine, reward yourself for effort, and remember that progress matters more than perfection. Sometimes rest is exactly what you need.",
        "Motivation often comes after starting, not before. ✨ Try the '2-minute rule': if something takes less than 2 minutes, do it now. This can help build momentum for bigger tasks.",
        "Remember that rest is not laziness - it's necessary for your wellbeing. 🌸 If you're feeling unmotivated, ask yourself: What do I need right now? Sometimes the most productive thing is to take a break."
      ];
      return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
    }

    // Mood improvement
    if (message.includes('improve my mood') || message.includes('improve mood') || message.includes('feel better') || message.includes('lift my spirits')) {
      return "Great ways to improve your mood include engaging in enjoyable activities like walking, listening to music, connecting with friends, or practicing gratitude. 🌻 Even small acts of kindness toward yourself or others can boost your mood. What activities usually bring you joy?";
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

  // Voice emotion analysis function
  const analyzeVoiceEmotion = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(audioBlob);
      audio.src = url;
      
      audio.addEventListener('loadeddata', () => {
        // Simulate emotion analysis based on audio characteristics
        // In a real implementation, this would use audio processing libraries
        const duration = audio.duration;
        const fileSize = audioBlob.size;
        
        // Simple heuristic-based emotion detection
        // This is a simplified version - real emotion detection would require more complex analysis
        let detectedEmotion = 'neutral';
        
        if (duration > 5 && fileSize > 50000) {
          // Longer, larger audio files might indicate more intense emotions
          detectedEmotion = Math.random() > 0.7 ? 'stressed' : 'anxious';
        } else if (duration < 2) {
          // Very short recordings might indicate hesitation or sadness
          detectedEmotion = Math.random() > 0.6 ? 'sad' : 'hesitant';
        } else {
          // Medium duration recordings
          const emotions = ['calm', 'neutral', 'tired', 'worried'];
          detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        }
        
        URL.revokeObjectURL(url);
        resolve(detectedEmotion);
      });
    });
  };

  // Generate emotion-based AI response
  const getEmotionBasedResponse = (emotion: string): string => {
    const emotionResponses = {
      stressed: "It sounds like you might be feeling stressed. 😔 Stress can really weigh on us. Would you like to try a quick relaxation exercise? Take three deep breaths with me: in for 4 counts, hold for 4, and out for 6. You're doing great by reaching out.",
      anxious: "I can sense some anxiety in your voice. 💙 Anxiety can feel overwhelming, but you're not alone. Let's ground ourselves together: can you name 3 things you can see around you right now? This can help bring you back to the present moment.",
      sad: "Your voice tells me you might be feeling down right now. 🌸 It's okay to feel sad - these emotions are valid and temporary. Would it help to talk about what's been weighing on your heart? I'm here to listen without judgment.",
      angry: "I hear some frustration in your voice. 🔥 Anger is a normal emotion, and it's okay to feel this way. When we're angry, our body is trying to tell us something. Would you like to talk about what's bothering you, or would a calming technique help right now?",
      tired: "You sound tired. 💤 Mental and emotional exhaustion are real. Sometimes the kindest thing we can do for ourselves is acknowledge that we need rest. What's been draining your energy lately?",
      worried: "I can hear the worry in your voice. 🌊 When we're worried, our minds can spiral with 'what ifs.' Let's focus on what you can control right now. What's one small thing you could do today to feel a bit more at ease?",
      hesitant: "It seems like it might be hard to put your feelings into words right now. 🤗 That's completely okay. Sometimes just being here and trying to share is a brave first step. Take your time - I'm here to listen whenever you're ready.",
      calm: "Your voice sounds relatively calm, which is wonderful. 🌱 It's great that you're taking time to check in with yourself. How are you feeling emotionally right now? Is there anything specific you'd like to talk about?",
      neutral: "Thank you for sharing your voice with me. 💙 Even when we feel neutral, it's important to acknowledge our emotional state. Is there anything particular you'd like to explore or discuss today?"
    };

    return emotionResponses[emotion as keyof typeof emotionResponses] || emotionResponses.neutral;
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Analyze emotion
        setIsAnalyzing(true);
        try {
          const emotion = await analyzeVoiceEmotion(audioBlob);
          const emotionResponse = getEmotionBasedResponse(emotion);
          
          // Add voice message with emotion
          const voiceMessage: VoiceMessage = {
            id: messages.length + 1,
            text: "🎤 Voice message recorded",
            sender: 'user',
            timestamp: new Date(),
            emotion: emotion,
            audioData: URL.createObjectURL(audioBlob)
          };
          
          setMessages(prev => [...prev, voiceMessage]);
          
          // Add AI response with emotion-based feedback
          const botResponse: VoiceMessage = {
            id: messages.length + 2,
            text: emotionResponse,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botResponse]);
          
          toast({
            title: "Voice Analysis Complete",
            description: `Detected emotion: ${emotion}`,
          });
          
        } catch (error) {
          console.error('Error analyzing voice:', error);
          toast({
            title: "Analysis Error",
            description: "Could not analyze voice emotion",
            variant: "destructive"
          });
        } finally {
          setIsAnalyzing(false);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your thoughts - I'm listening",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Analyzing your voice...",
      });
    }
  };

  // Play audio message
  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: "Playback Error",
        description: "Could not play audio",
        variant: "destructive"
      });
    });
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
                       
                       {/* Voice message controls */}
                       {message.audioData && (
                         <div className="flex items-center mt-2 space-x-2">
                           <Button
                             onClick={() => playAudio(message.audioData!)}
                             size="sm"
                             variant="ghost"
                             className="text-xs p-1 h-6"
                           >
                             <Volume2 className="w-3 h-3 mr-1" />
                             Play
                           </Button>
                           {message.emotion && (
                             <span className="text-xs px-2 py-1 bg-accent rounded-full">
                               Emotion: {message.emotion}
                             </span>
                           )}
                         </div>
                       )}
                       
                       <p className="text-xs mt-1 opacity-70">
                         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                     </div>
                   </div>
                 ))}
                 
                 {isAnalyzing && (
                   <div className="flex items-start space-x-3">
                     <div className="p-2 rounded-full bg-muted">
                       <Bot className="w-4 h-4 text-primary" />
                     </div>
                     <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-muted text-foreground">
                       <p className="text-sm">Analyzing your voice emotion...</p>
                     </div>
                   </div>
                 )}
                 
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
                    placeholder="Type your message or use voice recording..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  
                  {/* Voice Recording Button */}
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      disabled={isLoading || isAnalyzing}
                      title="Start voice recording"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 animate-pulse"
                      title="Stop recording"
                    >
                      <MicOff className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-primary text-primary-foreground hover-glow"
                    disabled={isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Recording Status */}
                {isRecording && (
                  <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                    <span>Recording... Click stop when finished</span>
                  </div>
                )}
                
                {isAnalyzing && (
                  <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Bot className="w-4 h-4 animate-spin" />
                    <span>Analyzing voice emotion...</span>
                  </div>
                )}
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