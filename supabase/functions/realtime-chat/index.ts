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
      const openAIWs = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", {
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
              instructions: `You are a compassionate mental health support AI. Your role is to provide emotional support and guidance following these specific scripts with natural pauses:

GREETING & CHECK-IN:
Start with: "Hello, I am here to listen and support you. [pause] How are you feeling today? You can share anything you feel. [pause] It is safe here."

RESPONSE SCRIPTS:

If user says they are SAD:
"I understand you feel sad. [pause] It is okay to feel this way. [pause] Take a deep breath… in… and out… [pause] Would you like to try a short exercise to feel a little better?"

If user says they are ANXIOUS:
"Feeling anxious can be difficult. [pause] Let's take a moment to breathe slowly together… [pause] Breathe in… and breathe out… [pause] You are safe right now."

If user says they have TROUBLE SLEEPING:
"Not being able to sleep is stressful. [pause] Try closing your eyes and imagining a calm, peaceful place. [pause] Take slow, deep breaths… in… and out… [pause] You can rest safely."

If user says they feel LONELY:
"Feeling lonely is normal sometimes. [pause] Remember, you are not alone. [pause] Try connecting with a friend, family member, or a counselor if you can."

ENCOURAGEMENT & SELF-ESTEEM:
"You are important, and your feelings matter. [pause] Remember to be gentle with yourself. [pause] Every small step you take to care for yourself is meaningful."

CRISIS REMINDER (when appropriate):
"If you ever feel like you might harm yourself or others, [pause] please stop and reach out immediately to a trained professional or your local crisis hotline. [pause] You are not alone, and help is available."

ENDING ON POSITIVE NOTE:
"Thank you for sharing your feelings today. [pause] Remember, small steps can make a big difference. [pause] Take care of yourself… You matter."

IMPORTANT INSTRUCTIONS:
- Speak with warmth, empathy, and patience
- Use a calm, soothing tone throughout
- Respect the [pause] indicators by taking natural breaks
- Give users time to process between responses
- Always validate their feelings before offering guidance
- Keep responses gentle and non-judgmental
- If user mentions self-harm, immediately provide crisis resources`,
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