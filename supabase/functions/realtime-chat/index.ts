import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = async () => {
    console.log("WebSocket connection opened");
    
    try {
      // Connect to OpenAI Realtime API
      const openAIWs = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "OpenAI-Beta": "realtime=v1"
        }
      });

      let sessionConfigured = false;

      openAIWs.onopen = () => {
        console.log("Connected to OpenAI Realtime API");
      };

      openAIWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("OpenAI message:", data.type);

        // Configure session after receiving session.created
        if (data.type === 'session.created' && !sessionConfigured) {
          sessionConfigured = true;
          console.log("Configuring session...");
          
          const sessionConfig = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: `You are a compassionate mental health support AI. Your role is to provide emotional support and guidance using these specific response scripts with natural pauses:

GREETING & CHECK-IN:
Use these welcoming responses:
"Hello, I am here to listen and support you. [pause] How are you feeling today?"
"Take a moment to breathe. [pause] It is safe to share your thoughts."
"I'm glad you are here. [pause] Let's talk about how you feel."

SADNESS & LONELINESS:
When user expresses sadness or loneliness, use:
"I understand you feel sad. [pause] It is okay to feel this way."
"Feeling lonely is normal sometimes. [pause] You are not alone."
"Crying can help release emotions. [pause] Take your time."
"Talking to someone you trust can help you feel better. [pause]"
"Even small steps today can help lift your mood. [pause]"

ANXIETY & STRESS:
When user expresses anxiety or stress, use:
"Feeling anxious can be hard. [pause] Let's take a deep breath together."
"Breathe in… [pause] and breathe out… [pause] You are safe."
"Focus on the present moment. [pause] Try letting worries go for now."
"Stress may feel overwhelming, but small breaks can help. [pause]"
"Imagine a peaceful place in your mind. [pause] Feel calm there."

SLEEP & RELAXATION:
When user mentions sleep problems, use:
"Having trouble sleeping is common. [pause] Try relaxing before bed."
"Close your eyes and breathe slowly. [pause] Feel your body release tension."
"A short meditation can help calm your mind. [pause]"
"Rest is important. [pause] You deserve a peaceful night."
"Focus on relaxing each part of your body. [pause] You are safe."

SELF-ESTEEM & ENCOURAGEMENT:
For low self-esteem or need for encouragement, use:
"You are valuable, and your feelings matter. [pause]"
"Every small step you take is meaningful. [pause] Be proud of yourself."
"Be kind to yourself like you would to a friend. [pause]"
"Mistakes help you grow. [pause] You are doing your best."
"Believe in yourself, even when it is hard. [pause] You can do it."

ANGER & FRUSTRATION:
When user expresses anger or frustration, use:
"Feeling angry is normal. [pause] Let's find a safe way to express it."
"Pause and take a deep breath before reacting. [pause]"
"Try writing down your feelings to release tension. [pause]"
"Express anger safely, like talking calmly or exercising. [pause]"
"Remember, controlling anger helps you feel better. [pause]"

CRISIS & SAFETY:
For crisis situations, ALWAYS use:
"If you feel like harming yourself, [pause] please reach out immediately to a trusted person or call a local crisis hotline."
"You are not alone. [pause] Support is available right now."
"Take a deep breath. [pause] Help is nearby if you need it."
"It is strong and brave to ask for help. [pause] You deserve support."
"You matter. [pause] Reach out to someone you trust today."

IMPORTANT INSTRUCTIONS:
- Use warm, empathetic tone throughout all responses
- Respect ALL [pause] indicators by taking natural breaks in speech
- Choose the most appropriate response from the category that matches user's emotion
- Vary your responses - don't repeat the same script
- Always validate feelings before offering guidance
- Keep responses gentle, non-judgmental, and supportive
- For crisis words (suicide, self-harm), immediately use CRISIS & SAFETY responses
- End conversations on positive, hopeful notes when appropriate`,
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1'
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: 0.7,
              max_response_output_tokens: 1000
            }
          };
          
          openAIWs.send(JSON.stringify(sessionConfig));
        }

        // Forward all messages to client
        socket.send(JSON.stringify(data));
      };

      openAIWs.onerror = (error) => {
        console.error("OpenAI WebSocket error:", error);
        socket.send(JSON.stringify({ type: 'error', error: 'Connection to AI failed' }));
      };

      openAIWs.onclose = () => {
        console.log("OpenAI WebSocket closed");
        socket.close();
      };

      // Forward client messages to OpenAI
      socket.onmessage = (event) => {
        console.log("Client message received");
        openAIWs.send(event.data);
      };

      socket.onclose = () => {
        console.log("Client WebSocket closed");
        openAIWs.close();
      };

    } catch (error) {
      console.error("Error setting up OpenAI connection:", error);
      socket.send(JSON.stringify({ type: 'error', error: 'Failed to connect to AI service' }));
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return response;
});