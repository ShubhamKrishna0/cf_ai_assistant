export class ChatMemory {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/history') {
      return this.getHistory();
    }
    
    if (url.pathname === '/add' && request.method === 'POST') {
      return this.addMessage(request);
    }
    
    if (url.pathname === '/clear' && request.method === 'POST') {
      return this.clearHistory();
    }
    
    return new Response('Not found', { status: 404 });
  }

  async getHistory() {
    const messages = await this.state.storage.get('messages') || [];
    return new Response(JSON.stringify({ messages }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async addMessage(request) {
    const message = await request.json();
    const messages = await this.state.storage.get('messages') || [];
    
    messages.push({
      ...message,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 messages to prevent storage overflow
    if (messages.length > 50) {
      messages.splice(0, messages.length - 50);
    }

    await this.state.storage.put('messages', messages);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async clearHistory() {
    await this.state.storage.delete('messages');
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}