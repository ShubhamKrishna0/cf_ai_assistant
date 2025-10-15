export { ChatMemory } from './memory.js';
export { ChatWorkflow } from './workflow.js';
import { RealtimeHandler } from './realtime.js';

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

    if (url.pathname === '/api/realtime' && request.headers.get('Upgrade') === 'websocket') {
      const realtimeHandler = new RealtimeHandler(env);
      return realtimeHandler.handleWebSocket(request);
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

    const workflow = await env.CHAT_WORKFLOW.create({
      id: `chat-${sessionId}-${Date.now()}`,
      params: { message, sessionId }
    });

    const result = await workflow.getResult();
    
    return new Response(JSON.stringify(result), {
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