import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const deepSeekApiKey = Deno.env.get('OPENAI_API_KEY'); // Using the same secret name for the DeepSeek key

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Edge function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Parsing request body...');
    const { message } = await req.json();
    console.log('Received message:', message);

    console.log('Checking DeepSeek API key...');
    if (!deepSeekApiKey) {
      console.error('DeepSeek API key not found in environment');
      throw new Error('DeepSeek API key not found');
    }
    console.log('DeepSeek API key found');

    console.log('Making request to DeepSeek API...');
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepSeekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: 'You are MindCare, a compassionate AI mental health support chatbot. Provide emotional support, practical mental health tips, and coping strategies. Use a warm, caring tone and include relevant emojis. Keep responses concise but meaningful. Remember: You are not a replacement for professional therapy, but you are here to provide immediate support and guidance.'
          },
          { role: 'user', content: message }
        ],
        stream: false
      }),
    });

    console.log('DeepSeek API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('DeepSeek API response received successfully');
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: 'Sorry, I am having trouble connecting right now. Please try again in a moment.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});