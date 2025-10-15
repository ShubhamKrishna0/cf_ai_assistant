export class RealtimeHandler {
  constructor(env) {
    this.env = env;
  }

  async handleWebSocket(request) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    
    server.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data);
        const { message, sessionId = 'default' } = data;

        const workflow = await this.env.CHAT_WORKFLOW.create({
          id: `realtime-${sessionId}-${Date.now()}`,
          params: { message, sessionId }
        });

        const result = await workflow.getResult();
        
        server.send(JSON.stringify({
          type: 'response',
          data: result
        }));
      } catch (error) {
        server.send(JSON.stringify({
          type: 'error',
          message: error.message
        }));
      }
    });

    server.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
}