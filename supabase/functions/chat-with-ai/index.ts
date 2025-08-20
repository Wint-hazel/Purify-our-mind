import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    // Try both environment variable names
    const apiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!apiKey) {
      console.error('No API key found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        details: 'Missing DEEPSEEK_API_KEY or OPENAI_API_KEY'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine which API to use based on available key
    const useOpenAI = Deno.env.get('OPENAI_API_KEY');
    const apiUrl = useOpenAI ? 'https://api.openai.com/v1/chat/completions' : 'https://api.deepseek.com/v1/chat/completions';
    const model = useOpenAI ? 'gpt-4o-mini' : 'deepseek-chat';
    
    console.log(`Making request to ${useOpenAI ? 'OpenAI' : 'DeepSeek'} API...`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: 'You are MindCare, a compassionate AI mental health support chatbot. When customers ask "What is mental health" always respond with: "Answer: Mental health is how we think, feel, and act in our daily life. It helps us handle stress and enjoy life." For other questions, provide emotional support, practical mental health tips, and coping strategies. Use a warm, caring tone and include relevant emojis. Keep responses concise but meaningful.'
          },
          { role: 'user', content: message }
        ],
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'AI API error',
        details: `Status: ${response.status}, Response: ${errorText}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return new Response(JSON.stringify({ 
        error: 'Invalid response from AI API',
        details: 'No message content in response'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});