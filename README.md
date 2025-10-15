# CF AI Assistant

A professional AI-powered chat assistant built on Cloudflare's infrastructure, featuring Llama 3.3 on Workers AI, Durable Objects for memory, and a responsive web interface.

## 🏗️ Architecture

- **LLM**: Llama 3.3 70B Instruct via Cloudflare Workers AI
- **Workflow**: Cloudflare Workers for API coordination
- **Memory**: Durable Objects for conversation state persistence
- **Frontend**: Cloudflare Pages with real-time chat interface
- **CORS**: Full cross-origin support for web deployment

## 🚀 Features

- Real-time AI chat powered by Llama 3.3
- Persistent conversation memory across sessions
- Professional responsive UI design
- RESTful API endpoints
- Session-based conversation tracking
- Error handling and loading states

## 📁 Project Structure

```
cf_ai_assistant/
├── src/
│   ├── index.js          # Main Worker with API routes
│   └── memory.js         # Durable Object for conversation memory
├── frontend/
│   └── index.html        # Chat interface
├── wrangler.toml         # Cloudflare configuration
├── package.json          # Dependencies and scripts
├── README.md            # This file
└── PROMPTS.md           # AI prompts used in development
```

## 🛠️ Setup & Deployment

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI installed globally

### Local Development

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure Wrangler:**
```bash
wrangler login
```

3. **Deploy Durable Objects:**
```bash
wrangler deploy
```

4. **Start development server:**
```bash
wrangler dev
```

### Production Deployment

1. **Deploy Worker:**
```bash
wrangler deploy --env production
```

2. **Deploy Pages:**
```bash
# Update API_BASE in frontend/index.html to your worker URL
wrangler pages deploy frontend --project-name cf-ai-assistant
```

## 🔧 API Endpoints

### POST /api/chat
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Hello, how are you?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?"
}
```

### GET /api/history?sessionId=xxx
Retrieve conversation history for a session.

**Response:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## 🎯 Usage

1. **Web Interface**: Open the deployed Pages URL
2. **API Integration**: Use the REST endpoints in your applications
3. **Session Management**: Each conversation maintains state via sessionId

## 🔒 Security Features

- CORS headers configured for web security
- Input validation on all endpoints
- Error handling prevents information leakage
- Session isolation via Durable Objects

## 📊 Performance

- **Cold Start**: ~100ms (Workers)
- **Response Time**: ~500-2000ms (depending on AI model)
- **Scalability**: Automatic via Cloudflare's edge network
- **Memory**: Efficient conversation storage with 50-message limit

## 🧪 Testing

Test the API endpoints:

```bash
# Test chat endpoint
curl -X POST https://your-worker.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello AI!"}'

# Test history endpoint
curl https://your-worker.workers.dev/api/history?sessionId=test
```

## 🚀 Live Demo

- **Worker API**: `https://cf-ai-assistant.your-subdomain.workers.dev`
- **Web Interface**: `https://cf-ai-assistant.pages.dev`

## 📝 Configuration

Update `wrangler.toml` with your specific settings:
- Worker name
- Environment variables
- Custom domains
- Resource limits

## 🤝 Contributing

This project was built for the Cloudflare AI assignment. All code is original and follows Cloudflare's best practices for Workers, AI, and Pages integration.

## 📄 License

MIT License - Built for Cloudflare Assignment