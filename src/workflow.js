import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

export class ChatWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const { message, sessionId } = event.payload;

    // Step 1: Get conversation history
    const history = await step.do('get-history', async () => {
      const memoryId = this.env.CHAT_MEMORY.idFromName(sessionId);
      const memory = this.env.CHAT_MEMORY.get(memoryId);
      const response = await memory.fetch(new Request('http://memory/history'));
      return await response.json();
    });

    // Step 2: Generate AI response
    const aiResponse = await step.do('generate-response', async () => {
      return await this.env.AI.run('@cf/meta/llama-3.1-70b-instruct', {
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          ...history.messages.slice(-5),
          { role: 'user', content: message }
        ]
      });
    });

    // Step 3: Save messages to memory
    await step.do('save-messages', async () => {
      const memoryId = this.env.CHAT_MEMORY.idFromName(sessionId);
      const memory = this.env.CHAT_MEMORY.get(memoryId);
      
      await memory.fetch(new Request('http://memory/add', {
        method: 'POST',
        body: JSON.stringify({ role: 'user', content: message })
      }));

      await memory.fetch(new Request('http://memory/add', {
        method: 'POST',
        body: JSON.stringify({ role: 'assistant', content: aiResponse.response })
      }));
    });

    return { response: aiResponse.response };
  }
}