export { ChatMemory } from './memory.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env, corsHeaders);
    }

    if (url.pathname === '/api/history' && request.method === 'GET') {
      return handleHistory(request, env, corsHeaders);
    }

    return new Response('AI Assistant API', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
};

async function handleChat(request, env, corsHeaders) {
  try {
    const { message, sessionId = 'default' } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const memoryId = env.CHAT_MEMORY.idFromName(sessionId);
    const memory = env.CHAT_MEMORY.get(memoryId);

    const historyResponse = await memory.fetch(new Request('http://memory/history'));
    const history = await historyResponse.json();

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-70b-instruct', {
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        ...history.messages.slice(-5),
        { role: 'user', content: message }
      ]
    });

    const assistantMessage = aiResponse.response;

    await memory.fetch(new Request('http://memory/add', {
      method: 'POST',
      body: JSON.stringify({ role: 'user', content: message })
    }));

    await memory.fetch(new Request('http://memory/add', {
      method: 'POST',
      body: JSON.stringify({ role: 'assistant', content: assistantMessage })
    }));

    return new Response(JSON.stringify({ response: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleHistory(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId') || 'default';
    
    const memoryId = env.CHAT_MEMORY.idFromName(sessionId);
    const memory = env.CHAT_MEMORY.get(memoryId);
    
    const response = await memory.fetch(new Request('http://memory/history'));
    const history = await response.json();
    
    return new Response(JSON.stringify(history), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}